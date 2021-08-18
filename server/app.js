/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    au = require("ansi_up"),
    {spawnSync} = require("child_process"),
    fs = require("fs")

const PORT = process.env.EDUWRENCH_NODE_PORT || 3000
const cors = require("cors")
const db = require("./data/db-config")
// WRENCH produces output to the terminal using ansi colors, ansi_up will apply those colors to <span> html elements
const ansiUp = new au.default();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

/* CORS */
let whitelist = ["https://eduwrench.ics.hawaii.edu", "http://localhost:8000"]
let corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }
}
app.use(cors(corsOptions))

// main route that will show login/logout and available activities
app.get("/", function (req, res) {
    res.send("eduWRENCH Pedagogic Modules")
})

// execute networking fundamentals simulation route
app.post("/run/networking_fundamentals", function (req, res) {
    const PATH_PREFIX = getPathPrefix("networking_fundamentals")
    const SIMULATOR = "networking_fundamentals_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const FILE_SIZES = req.body.file_sizes
        .replace(/,/g, " ")
        .replace(/ +/g, " ")
        .split(" ")

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'",
    ];
    const SIMULATION_ARGS = FILE_SIZES.concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS, true)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "networking_fundamentals",
            params: {
                simulator: SIMULATOR,
                file_sizes: FILE_SIZES
            }
        })

        res.json({
            simulation_output: simulation_output.replace(/[\n\r]/g, "<br>\n")
        })
    }
});

// execute workflow execution fundamentals simulation route
app.post("/run/workflow_execution_fundamentals", function (req, res) {
    const PATH_PREFIX = getPathPrefix("workflow_execution_fundamentals")
    const SIMULATOR = "workflow_execution_fundamentals_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const COMPUTE_SPEED = req.body.compute_speed

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'",
    ];

    const SIMULATION_ARGS = [COMPUTE_SPEED].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "workflow_execution_fundamentals",
            params: {
                simulator: SIMULATOR,
                compute_speed: COMPUTE_SPEED
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        });
    }
});

// execute activity 1 simulation route
app.post("/run/workflow_execution_data_locality", function (req, res) {
    const PATH_PREFIX = getPathPrefix("workflow_execution_data_locality")
    const SIMULATOR = "workflow_execution_data_locality_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const LINK_BANDWIDTH = req.body.link_bandwidth
    const STORAGE_OPTION = req.body.simulator_number === 1 ? "remote" : "local"

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'",
    ];

    const SIMULATION_ARGS = [LINK_BANDWIDTH, STORAGE_OPTION].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "workflow_execution_data_locality",
            params: {
                simulator: SIMULATOR,
                link_bandwidth: LINK_BANDWIDTH
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        })
    }
});

// execute Workflow Execution and Parallelism simulation route
app.post("/run/workflow_execution_parallelism", function (req, res) {
    const PATH_PREFIX = getPathPrefix("workflow_execution_parallelism")
    const SIMULATOR = "workflow_execution_parallelism_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const NUM_NODES = req.body.num_nodes
    const NUM_CORES_PER_NODE = req.body.num_cores_per_node
    const NUM_TASKS_TO_JOIN = 20
    const FILE_SIZE = 2000000000
    const RAM_REQUIRED = req.body.ram_required === 1 ? "RAM_REQUIRED" : "RAM_NOT_REQUIRED"

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'",
    ];

    const SIMULATION_ARGS = [
        NUM_NODES,
        NUM_CORES_PER_NODE,
        NUM_TASKS_TO_JOIN,
        FILE_SIZE,
        RAM_REQUIRED,
    ].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "workflow_execution_parallelism",
            params: {
                num_nodes: NUM_NODES,
                num_cores_per_node: NUM_CORES_PER_NODE,
                num_tasks_to_join: NUM_TASKS_TO_JOIN,
                file_size: FILE_SIZE,
                ram_required: RAM_REQUIRED
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        })
    }
});

// execute activity multi core dependent tasks simulation route
app.post("/run/multi_core_dependent_tasks", function (req, res) {
    const PATH_PREFIX = getPathPrefix("multi_core_computing_dependent_tasks")
    const SIMULATOR = "multi_core_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const NUM_CORES = req.body.num_cores
    const ANALYZE_WORK = req.body.analyze_work
    const SCHEDULING_SCHEME = req.body.scheduling_scheme

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'",
    ];

    const SIMULATION_ARGS = [NUM_CORES, ANALYZE_WORK, SCHEDULING_SCHEME].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "multi_core_dependent_tasks",
            params: {
                num_cores: NUM_CORES,
                analyze_work: ANALYZE_WORK,
                scheduling_scheme: SCHEDULING_SCHEME
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        })
    }
});

// execute activity multi core simulation route
app.post("/run/multi_core_independent_tasks", function (req, res) {
    const PATH_PREFIX = getPathPrefix("multi_core_computing_independent_tasks")
    const SIMULATOR = "multi_core_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const NUM_CORES = req.body.num_cores
    const NUM_TASKS = req.body.num_tasks
    const TASK_GFLOP = req.body.task_gflop
    const TASK_RAM = req.body.task_ram

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'",
    ];

    const SIMULATION_ARGS = [NUM_CORES, NUM_TASKS, TASK_GFLOP, TASK_RAM].concat(
        LOGGING
    );

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "multi_core_independent_tasks",
            params: {
                num_cores: NUM_CORES,
                num_tasks: NUM_TASKS,
                task_gflop: TASK_GFLOP,
                task_ram: TASK_RAM
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        })
    }
});

// execute activity multi core simulation route
app.post("/run/multi_core_independent_tasks_io", function (req, res) {
    const PATH_PREFIX = getPathPrefix("multi_core_computing_two_tasks_with_io")
    const SIMULATOR = "multi_core_io_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const TASK1_INPUT_SIZE = req.body.task1_input_size
    const TASK1_OUTPUT_SIZE = req.body.task1_output_size
    const TASK1_WORK = req.body.task1_work
    const TASK2_INPUT_SIZE = req.body.task2_input_size
    const TASK2_OUTPUT_SIZE = req.body.task2_output_size
    const TASK2_WORK = req.body.task2_work
    const TASK1_BEFORE_TASK2 = req.body.first_task === 1

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'",
    ];

    const SIMULATION_ARGS = [
        TASK1_INPUT_SIZE,
        TASK1_OUTPUT_SIZE,
        TASK1_WORK,
        TASK2_INPUT_SIZE,
        TASK2_OUTPUT_SIZE,
        TASK2_WORK,
        TASK1_BEFORE_TASK2,
    ].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "multi_core_computing_two_tasks_with_io",
            params: {
                task1_input_ize: TASK1_INPUT_SIZE,
                task1_output_ize: TASK1_OUTPUT_SIZE,
                task1_work: TASK1_WORK,
                task1_before_task2: TASK1_BEFORE_TASK2
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        })
    }
});

// execute activity multi core simulation route
app.post("/run/multi_core_data_parallelism", function (req, res) {
    const PATH_PREFIX = getPathPrefix("multi_core_computing_data_parallelism")
    const SIMULATOR = "multi_core_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const NUM_CORES = req.body.num_cores
    const OIL_RADIUS = req.body.oil_radius

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'",
    ];

    const SIMULATION_ARGS = [NUM_CORES, OIL_RADIUS].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "multi_core_computing_data_parallelism",
            params: {
                num_cores: NUM_CORES,
                oil_radius: OIL_RADIUS
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        })
    }
});

// execute activity multi core simulation route
app.post("/run/multi_core_independent_tasks_ram", function (req, res) {
    const PATH_PREFIX = getPathPrefix("multi_core_computing_independent_tasks")
    const SIMULATOR = "multi_core_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const NUM_CORES = req.body.num_cores
    const NUM_TASKS = req.body.num_tasks
    const TASK_GFLOP = req.body.task_gflop
    const TASK_RAM = req.body.task_ram

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'",
    ];

    const SIMULATION_ARGS = [NUM_CORES, NUM_TASKS, TASK_GFLOP, TASK_RAM].concat(
        LOGGING
    );

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "multi_core_independent_tasks_ram",
            params: {
                num_cores: NUM_CORES,
                num_tasks: NUM_TASKS,
                task_gflop: TASK_GFLOP,
                task_ram: TASK_RAM
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        })
    }
});

// execute activity io operations simulation route
app.post("/run/io_operations", function (req, res) {
    const PATH_PREFIX = getPathPrefix("io_operations")
    const SIMULATOR = "io_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const NUM_TASKS = req.body.num_tasks
    const TASK_GFLOP = req.body.task_gflop
    const TASK_INPUT = req.body.task_input
    const TASK_OUTPUT = req.body.task_output
    const IO_OVERLAP = req.body.io_overlap

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'",
    ];

    const SIMULATION_ARGS = [
        TASK_INPUT,
        TASK_OUTPUT,
        NUM_TASKS,
        TASK_GFLOP,
        IO_OVERLAP,
    ].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "io_operations",
            params: {
                task_input: TASK_INPUT,
                task_output: TASK_OUTPUT,
                num_tasks: NUM_TASKS,
                task_gflop: TASK_GFLOP,
                io_overlap: IO_OVERLAP
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        })
    }
});

// SIMPLIFIED (NO DISK) CLIENT SERVER SIMULATOR
app.post("/run/client_server", function (req, res) {
    const PATH_PREFIX = getPathPrefix("client_server")
    const SIMULATOR = "client_server_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const SERVER_1_LINK_BANDWIDTH = req.body.server_1_link_bandwidth
    const HOST_SELECT = req.body.host_select
    const FILE_SIZE = req.body.file_size

    //Not included in this usage of the simulator
    const SERVER_1_LINK_LATENCY = 10
    const SERVER_2_LINK_BANDWIDTH = 100
    const BUFFER_SIZE = 1000000000
    const DISK_TOGGLE = 0
    const DISK_SPEED = 50

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=maestro.thresh:critical",
        "--log=wms.thresh:info",
        "--log=simple_wms.thresh:info",
        "--log=simple_wms_scheduler.thresh:info",
        "--log='root.fmt:[%.2d][%h]%e%m%n'",
    ];

    const SIMULATION_ARGS = [
        SERVER_1_LINK_LATENCY,
        SERVER_1_LINK_BANDWIDTH,
        SERVER_2_LINK_BANDWIDTH,
        BUFFER_SIZE,
        HOST_SELECT,
        DISK_TOGGLE,
        DISK_SPEED,
        FILE_SIZE,
    ].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "client_server",
            params: {
                server_1_link_latency: SERVER_1_LINK_LATENCY,
                server_1_link_bandwidth: SERVER_1_LINK_BANDWIDTH,
                server_2_link_bandwidth: SERVER_2_LINK_BANDWIDTH,
                buffer_size: BUFFER_SIZE,
                host_select: HOST_SELECT,
                disk_toggle: DISK_TOGGLE,
                disk_speed: DISK_SPEED,
                file_size: FILE_SIZE
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        })
    }
});

// FULL CLIENT SERVER (NOT SIMPLIFIED)
app.post("/run/client_server_disk", function (req, res) {
    const PATH_PREFIX = getPathPrefix("client_server")
    const SIMULATOR = "client_server_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const SERVER_1_LINK_LATENCY = req.body.server_1_link_latency
    const SERVER_1_LINK_BANDWIDTH = req.body.server_1_link_bandwidth
    const SERVER_2_LINK_BANDWIDTH = req.body.server_2_link_bandwidth
    const BUFFER_SIZE = req.body.buffer_size
    const HOST_SELECT = req.body.host_select
    const DISK_TOGGLE = 1
    const DISK_SPEED = req.body.disk_speed
    const FILE_SIZE = req.body.file_size

    //Not included in this usage of the simulator

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=maestro.thresh:critical",
        "--log=wms.thresh:info",
        "--log=simple_wms.thresh:info",
        "--log=simple_wms_scheduler.thresh:info",
        // "--log=wrench_core_file_transfer_thread.thresh:info",
        "--log='root.fmt:[%.2d][%h]%e%m%n'",
    ];

    const SIMULATION_ARGS = [
        SERVER_1_LINK_LATENCY,
        SERVER_1_LINK_BANDWIDTH,
        SERVER_2_LINK_BANDWIDTH,
        BUFFER_SIZE,
        HOST_SELECT,
        DISK_TOGGLE,
        DISK_SPEED,
        FILE_SIZE,
    ].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "client_server_disk",
            params: {
                server_1_latency: SERVER_1_LINK_LATENCY,
                server_1_link: SERVER_1_LINK_BANDWIDTH,
                server_2_link: SERVER_2_LINK_BANDWIDTH,
                buffer_size: BUFFER_SIZE,
                host_select: HOST_SELECT,
                disk_toggle: DISK_TOGGLE,
                disk_speed: DISK_SPEED,
                file_size: FILE_SIZE
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        })
    }
});

// execute activity client server simulation route
app.post("/run/coordinator_worker", function (req, res) {
    const PATH_PREFIX = getPathPrefix("master_worker")
    const SIMULATOR = "master_worker_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const HOST_SPECS = req.body.host_specs.replace(/,/g, " ").replace(/ +/g, " ").split(" ")
    const TASK_SPECS = req.body.task_specs.replace(/,/g, " ").replace(/ +/g, " ").split(" ")
    const TASK_SCHEDULING_SELECT = req.body.task_scheduling_select
    const COMPUTE_SCHEDULING_SELECT = req.body.compute_scheduling_select
    const NUM_INVOCATION = req.body.num_invocation
    const NUM_WORKERS = req.body.num_workers
    const MIN_FLOPS = req.body.min_worker_flops
    const MAX_FLOPS = req.body.max_worker_flops
    const MIN_BAND = req.body.min_worker_band
    const MAX_BAND = req.body.max_worker_band
    const NUM_TASKS = req.body.num_tasks
    const MIN_INPUT = req.body.min_task_input
    const MAX_INPUT = req.body.max_task_input
    const MIN_FLOP = req.body.min_task_flop
    const MAX_FLOP = req.body.max_task_flop
    const MIN_OUTPUT = req.body.min_task_output
    const MAX_OUTPUT = req.body.max_task_output
    const SEED = req.body.seed

    const INDIVIDUAL = ["individual"]
    const SEED_STATE = ["--seed", SEED]
    const GENERATION = [
        "--generate",
        NUM_WORKERS,
        MIN_FLOPS,
        MAX_FLOPS,
        MIN_BAND,
        MAX_BAND,
        NUM_TASKS,
        MIN_INPUT,
        MAX_INPUT,
        MIN_FLOP,
        MAX_FLOP,
        MIN_OUTPUT,
        MAX_OUTPUT,
    ]
    const TASK_SCHED_SELECT = ["--ts", TASK_SCHEDULING_SELECT];
    const COMPUTE_SCHED_SELECT = ["--cs", COMPUTE_SCHEDULING_SELECT];
    const NUM_INV = ["--inv", NUM_INVOCATION];
    let WORKERS = [];
    let iterator = 0;
    while (iterator + 1 < HOST_SPECS.length) {
        WORKERS.push("--worker");
        WORKERS.push("Worker #" + (1 + Math.floor(iterator / 2)));
        WORKERS.push(HOST_SPECS[iterator]);
        WORKERS.push(HOST_SPECS[iterator + 1]);
        iterator += 2;
    }

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=maestro.thresh:critical",
        "--log=wms.thresh:debug",
        // "--log=wrench_core_workunit_executor.thresh:info",
        "--log=simple_wms.thresh:info",
        "--log=simple_wms_scheduler.thresh:info",
        "--log='root.fmt:[%.2d][%h]%e%m%n'",
    ];

    const ABBREV_LOGGING = ["--log='root.fmt:[%d][%h:%t]%e%m%n'"];

    let SIMULATION_ARGS;
    if (NUM_INVOCATION === 1) {
        SIMULATION_ARGS = INDIVIDUAL.concat(TASK_SPECS)
            .concat(WORKERS)
            .concat(TASK_SCHED_SELECT)
            .concat(COMPUTE_SCHED_SELECT)
            .concat(SEED_STATE)
            .concat(LOGGING);
    } else {
        SIMULATION_ARGS = GENERATION.concat(TASK_SCHED_SELECT)
            .concat(COMPUTE_SCHED_SELECT)
            .concat(NUM_INV)
            .concat(SEED_STATE)
            .concat(ABBREV_LOGGING);
    }

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS, NUM_INVOCATION !== 1)

    if (simulation_output !== null) {

        let WORKERS_STRIPPED = [];
        for (let i = 0; i < WORKERS.length; i++) {
            if (!(WORKERS[i] === "--worker")) {
                WORKERS_STRIPPED.push(WORKERS[i]);
            }
        }

        if (NUM_INVOCATION === 1) {
            logData({
                user: USERNAME,
                email: EMAIL,
                activity: "coordinator_worker",
                params: {
                    tasks: TASK_SPECS,
                    workers: WORKERS_STRIPPED,
                    task_scheduling_selection: TASK_SCHED_SELECT,
                    compute_scheduling_selection: COMPUTE_SCHED_SELECT,
                    num_invocation: NUM_INVOCATION,
                    seed: SEED
                }
            })
            res.json({
                simulation_output: ansiUpSimulationOutput(simulation_output),
                task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
            })

        } else {
            logData({
                user: USERNAME,
                email: EMAIL,
                activity: "coordinator_worker_many_test_cases",
                params: {
                    task_scheduling_selection: TASK_SCHED_SELECT,
                    compute_scheduling_selection: COMPUTE_SCHED_SELECT,
                    num_invocation: NUM_INVOCATION,
                    seed: SEED,
                    generated: true,
                    num_workers: NUM_WORKERS,
                    min_worker_flops: MIN_FLOPS,
                    max_worker_flops: MAX_FLOPS,
                    min_worker_band: MIN_BAND,
                    max_worker_band: MAX_BAND,
                    num_tasks: NUM_TASKS,
                    min_task_input: MIN_INPUT,
                    max_task_input: MAX_INPUT,
                    min_task_flop: MIN_FLOP,
                    max_task_flop: MAX_FLOP,
                    min_task_output: MIN_OUTPUT,
                    max_task_output: MAX_OUTPUT
                }
            })
            res.json({
                simulation_output:
                    "<h5>" + simulation_output.replace(/[\n\r]/g, "<br>\n") + "</h5>",
            })
        }
    }
});

// execute activity multi core simulation route
app.post("/run/workflow_fundamentals", function (req, res) {
    const PATH_PREFIX = getPathPrefix("workflow_fundamentals")
    const SIMULATOR = "workflow_fundamentals_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const NUM_CORES = req.body.num_cores
    const DISK_BANDWIDTH = req.body.disk_bandwidth

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'",
    ];

    const SIMULATION_ARGS = [NUM_CORES, DISK_BANDWIDTH].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "workflow_fundamentals",
            params: {
                num_cores: NUM_CORES,
                disk_bandwidth: DISK_BANDWIDTH
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        })
    }
});

// execute activity multi core simulation route
app.post("/run/workflow_distributed", function (req, res) {
    const PATH_PREFIX = getPathPrefix("workflow_distributed")
    const SIMULATOR = "workflow_distributed_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const NUM_HOSTS = req.body.num_hosts
    const NUM_CORES = req.body.num_cores
    const LINK_BANDWIDTH = req.body.link_bandwidth
    const USE_LOCAL_STORAGE = req.body.use_local_storage

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'",
        "--cfg=network/TCP-gamma:20000000000", // TCP Congestion Window Size!
    ];

    const SIMULATION_ARGS = [
        NUM_HOSTS,
        NUM_CORES,
        LINK_BANDWIDTH,
        USE_LOCAL_STORAGE,
    ].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "workflow_distributed",
            params: {
                num_hosts: NUM_HOSTS,
                num_cores: NUM_CORES,
                link_bandwidth: LINK_BANDWIDTH,
                use_local_storage: USE_LOCAL_STORAGE
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        })
    }
});

// execute activity multi core simulation route
app.post("/run/workflow_task_data_parallelism", function (req, res) {
    const PATH_PREFIX = getPathPrefix("workflow_task_data_parallelism")
    const SIMULATOR = "workflow_task_data_parallelism_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const NUM_CORES_BLUE = req.body.num_cores_blue
    const NUM_CORES_YELLOW = req.body.num_cores_yellow
    const NUM_CORES_PURPLE = req.body.num_cores_purple

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d]%e%m%n'",
        "--cfg=network/TCP-gamma:20000000000", // TCP Congestion Window Size!
    ];

    const SIMULATION_ARGS = [
        NUM_CORES_BLUE,
        NUM_CORES_YELLOW,
        NUM_CORES_PURPLE,
    ].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "workflow_task_data_parallelism",
            params: {
                num_cores_blue: NUM_CORES_BLUE,
                num_cores_yellow: NUM_CORES_YELLOW,
                num_cores_purple: NUM_CORES_PURPLE
            }
        })

        res.json({
            simulation_output: ansiUpSimulationOutput(simulation_output),
            task_data: JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        })
    }
});

// SIMPLIFIED (NO DISK) CLIENT SERVER SIMULATOR
app.post("/run/ci_overhead", function (req, res) {
    const PATH_PREFIX = getPathPrefix("ci_overhead")
    const SIMULATOR = "ci_overhead_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR
    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const SERVER_1_LINK_BANDWIDTH = req.body.server_1_link_bandwidth
    const HOST_SELECT = req.body.host_select
    const FILE_SIZE = req.body.file_size
    const COMPUTE_1_STARTUP = req.body.compute_1_startup
    const COMPUTE_2_STARTUP = req.body.compute_2_startup
    const TASK_WORK = req.body.task_work

    //Not included in this usage of the simulator
    const SERVER_1_LINK_LATENCY = 10
    const SERVER_2_LINK_BANDWIDTH = 100
    const BUFFER_SIZE = 1000000000
    const DISK_TOGGLE = 0
    const DISK_SPEED = 50

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=maestro.thresh:critical",
        "--log=wms.thresh:info",
        "--log=simple_wms.thresh:info",
        "--log=simple_wms_scheduler.thresh:info",
        "--log='root.fmt:[%.2d][%h]%e%m%n'"
    ];

    const SIMULATION_ARGS = [SERVER_1_LINK_LATENCY, SERVER_1_LINK_BANDWIDTH, SERVER_2_LINK_BANDWIDTH, BUFFER_SIZE, HOST_SELECT, DISK_TOGGLE, DISK_SPEED, FILE_SIZE, COMPUTE_1_STARTUP, COMPUTE_2_STARTUP, TASK_WORK].concat(LOGGING);

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "activity": "ci_overhead",
            params: {
                "server_1_link_latency": SERVER_1_LINK_LATENCY,
                "server_1_link_bandwidth": SERVER_1_LINK_BANDWIDTH,
                "server_2_link_bandwidth": SERVER_2_LINK_BANDWIDTH,
                "buffer_size": BUFFER_SIZE,
                "host_select": HOST_SELECT,
                "disk_toggle": DISK_TOGGLE,
                "disk_speed": DISK_SPEED,
                "file_size": FILE_SIZE,
                "server_1_startup_overhead": COMPUTE_1_STARTUP,
                "server_2_startup_overhead": COMPUTE_2_STARTUP,
                "task_work": TASK_WORK
            }
        })

        res.json({
            "simulation_output": ansiUpSimulationOutput(simulation_output),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        })
    }
});

// execute thrust d simulator
app.post("/run/thrustd", function (req, res) {
  const PATH_PREFIX = __dirname.replace(
      "server",
      "simulators/thrustd/build/"
  );

  const SIMULATOR = "thrustd";
  const EXECUTABLE = PATH_PREFIX + SIMULATOR;

  const USERNAME = req.body.userName;
  const EMAIL = req.body.email;
  const NUM_HOSTS = req.body.num_hosts;
  const PSTATE = req.body.pstate;

  // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
  const LOGGING = [
    "--log=root.thresh:critical",
    "--log=wms.thresh:debug",
    "--log=simple_wms.thresh:debug",
    "--log=simple_wms_scheduler.thresh:debug",
    "--log='root.fmt:[%.2d]%e%m%n'",
  ];

  const json_data = {
    "workflow_file": PATH_PREFIX + "../workflows/bigger-montage-workflow.json",
    "num_hosts": parseInt(NUM_HOSTS),
    "cores": 8,
    "min_cores_per_task": 4,
    "max_cores_per_task": 4,
    "pstate": parseInt(PSTATE),
    "speed": "0.5217f, 0.6087f, 0.6957f, 0.7826f, 0.8696f, 0.9565f, 1f",
    "value": "98:120, 98:130, 98:140, 98:150, 98:160, 98:170, 98:190",
    "energy_cost_per_mwh": 1000,
    "energy_co2_per_mwh": 1000,
    "use_cloud": false,
    "num_cloud_hosts": 0,
    "cloud_cores": 0,
    "cloud_bandwidth": "0",
    "cloud_pstate": 0,
    "cloud_speed": "",
    "cloud_value": "",
    "cloud_cost_per_mwh": 0,
    "num_vm_instances": 0,
    "vm_usage_duration": 0,
    "cloud_tasks": ""
  }
  // https://stackoverflow.com/questions/25590486/creating-json-file-and-storing-data-in-it-with-javascript
  let args_json = JSON.stringify(json_data);
  console.log(args_json);
  const fs = require('fs');
  
  fs.writeFileSync("/tmp/args.json", JSON.stringify(json_data, null, 2).concat("\n"), (err) => {
    if(err) console.log('error', err);
  });

  const SIMULATION_ARGS = [
    "/tmp/args.json"
  ].concat(LOGGING);

  var simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS);

  if (simulation_output !== null) {
      /**
       * Log the user running this simulation along with the
       * simulation parameters to the data server.
       */
      logData({
          user: USERNAME,
          email: EMAIL,
          time: Math.round(new Date().getTime() / 1000), // unix timestamp
          activity: "thrustd",
          num_hosts: NUM_HOSTS,
          pstate: PSTATE
      });

      res.json({
          "simulation_output": ansiUpSimulationOutput(simulation_output),
          "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
      })
  }
});

// execute activity storage service simulation route
app.post("/run/storage_service", function (req, res) {
    const PATH_PREFIX = getPathPrefix("storage_interaction_data_movement")
    const SIMULATOR = "storage_simulator"
    const EXECUTABLE = PATH_PREFIX + SIMULATOR

    const USERNAME = req.body.user_name
    const EMAIL = req.body.email
    const BANDWIDTH = req.body.bandwidth
    const FILE_SIZE = req.body.fileSize
    const REGISTRATION_OVERHEAD = req.body.registrationOverhead

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:info",
        "--log=simple_wms.thresh:info",
        "--log=wrench_core_simple_storage_service.thresh:info",
        "--log=wrench_core_file_registry_service.thresh:info",
        "--log='root.fmt:[%.5d][%h]%e%m%n'"
    ]

    const SIMULATION_ARGS = [BANDWIDTH, FILE_SIZE, REGISTRATION_OVERHEAD].concat(LOGGING)

    let simulation_output = launchSimulation(EXECUTABLE, SIMULATION_ARGS)

    if (simulation_output !== null) {
        logData({
            user: USERNAME,
            email: EMAIL,
            activity: "ci_storage_service",
            params: {
                "bandwidth": BANDWIDTH,
                "file_size": FILE_SIZE
            }
        })

        res.json({
            "simulation_output": ansiUpSimulationOutput(simulation_output),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        })
    }
})

/**
 *
 * @param simulatorFolder
 * @returns {string}
 */
function getPathPrefix(simulatorFolder) {
    return __dirname.replace("server", "simulators/" + simulatorFolder + "/");
}

/**
 *
 * @param executable
 * @param args
 * @param stdout
 */
function launchSimulation(executable, args, stdout = false) {
    const simulationCommand = [executable].concat(args).join(" ")
    console.log("\nRunning Simulation")
    console.log("===================")
    console.log("Executing command: " + simulationCommand)
    let simulation_process = spawnSync(executable, args)

    if (simulation_process.status !== 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.")
        console.log(simulation_process.stderr.toString())
        return null
    }

    let simulation_output = stdout ? simulation_process.stdout.toString() : simulation_process.stderr.toString()
    console.log(simulation_output)
    return simulation_output
}

/**
 * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
 * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
 * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
 * each line of output renders on a separate line in the browser.
 *
 * @param simulationOutput
 * @returns {string}
 */
function ansiUpSimulationOutput(simulationOutput) {
    let find = "</span>"
    let re = new RegExp(find, "g")
    return ansiUp.ansi_to_html(simulationOutput).replace(re, "<br>" + find)
}

/**
 * Log the user running this simulation along with the
 * simulation parameters to the data server.
 *
 * @param data
 * @returns {boolean}
 */
function logData(data) {
    db.registerUser(data.email, data.user).then((userID => {
        let time = Math.round(new Date().getTime() / 1000)  // unix timestamp
        db.addSimulationRun(userID, time, data.activity, data.params).then((simID => {
            return true

        })).catch((error => {
            console.log("[ERROR]: " + error)
            return false
        }))
    })).catch((error => {
        console.log("[ERROR]: " + error)
        return false
    }))
}

// Enable SSL server connection
if (process.env.EDUWRENCH_ENABLE_SSL === "true") {
    const https = require("https")
    const fs = require("fs")
    const options = {
        key: fs.readFileSync("./ssl/" + process.env.EDUWRENCH_SSL_PRIVATE_KEY),
        cert: fs.readFileSync("./ssl/" + process.env.EDUWRENCH_SSL_CERTIFICATE),
    }
    https.createServer(options, app).listen(PORT, function () {
        console.log(
            "eduWRENCH backend server is running on port " + PORT + " with SSL-enabled mode"
        )
    })
} else {
    app.listen(PORT, function () {
        console.log("eduWRENCH backend server is running on port " + PORT)
    })
}
