import React from "react"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { Segment, Tab } from "semantic-ui-react"
import "katex/dist/katex.min.css"
import "./pedagogic_modules.css"
import { useState } from "react"
import LocalComputing from "./include_thrustd_cloud/local_computing"
import CloudComputing from "./include_thrustd_cloud/cloud_computing"
import axios from 'axios';

const WfFormat = {
  name: "Yeji", // none empty *
  description: "whatever", // none empty
  createdAt: Date().toISOString, // none empty time-format-iso
  schemaVersion: "", // "1.0","1.1","1.2","1.3" *
  wms: {
    name: "wms name", // none empty *
    version: "", // none empty *
    url: "" // none empty uri
  },
  author: {
    name: "", // none empty *
    email: "", // none empty email *
    institution: "", // none empty
    country: "" // none empty
  },
  workflow: { // *
    makespan: 0, // *
    executedAt: "", // none empty *
    machines: [ // none empty
      {
        system: "", // "linux","macos","windows"
        architecture: "", // none empty
        nodeName: "", // none empty hostname *
        release: "", // none empty
        memory: 0, //none 0
        cpu: {
          count: 0, // none 0
          speed: 0, // none 0
          vendor: "", // none empty
        }
      }
    ],
    tasks: [ // none empty *
      {
        name: "", // none empty *
        id: "", // none empty
        category: "", // none empty
        type: "", //"compute","transfer","auxiliary" *
        command: {
          program: "", // none empty
          arguments: [] // none empty
        },
        parents: [], // none empty ^[0-9a-zA-Z-_.]*$
        files: [
          {
            name: "", // *
            size: 0, // *
            link: "" // "input", "output" *
          }
        ],
        runtime: 0,
        cores: 0, // min 1
        avgCPU: 0,
        bytesRead: 0,
        bytesWritten: 0,
        memory: 0,
        energy: 0,
        avgPower: 0,
        priority: 0,
        machine: "" // none empty
      }
    ]
  }
}

function buildWms(){
    const name = "wms name" // none empty *
    const version= "1.3" // none empty *
    const url= "https://wfcommons.org/format" // none empty uri

    return {name, version, url}
}

function buildAuthor(){
  const name= "author name" // none empty *
  const email= "author@email.org" // none empty email *
  const institution= "UH Manoa" // none empty
  const country= "US" // none empty

  return {name, email, institution, country}
}

function buildWorkflow(){
  const makespan= 0 // *
  const executedAt= new Date().toISOString() // none empty string *
  const machines= [ // none empty
    {
      system: "window", // "linux","macos","windows"
      architecture: "desktop", // none empty
      nodeName: "localhost", // none empty hostname *
      release: "", // none empty
      memory: 0, //none 0
      cpu: {
        count: 0, // none 0
        speed: 0, // none 0
        vendor: "", // none empty
      }
    }
  ]
  const tasks= [ // none empty *
    {
      name: "task name", // none empty *
      id: "123", // none empty
      category: "hi", // none empty
      type: "compute", //"compute","transfer","auxiliary" *
      command: {
        program: "node", // none empty
        arguments: [ "run"] // none empty
      },
      parents: ["1aZ.0_"], // none empty ^[0-9a-zA-Z-_.]*$
      files: [
        {
          name: "file name", // *
          size: 100, // *
          link: "input" // "input", "output" *
        }
      ],
      runtime: 0,
      cores: 10, // min 1
      avgCPU: 0,
      bytesRead: 0,
      bytesWritten: 0,
      memory: 0,
      energy: 0,
      avgPower: 0,
      priority: 0,
      machine: "windows" // none empty
    }
  ]

  return { makespan, executedAt, machines, tasks }
}

function buildWfJson(){
  const name = "Yeji"// none empty *
  const description = "wfformat description" // none empty
  const createAt = "2020-03-20T15:19:28-08:00"//new Date().toISOString()// none empty time format iso
  const schemaVersion = "1.3" // "1.0","1.1","1.2","1.3" *

  return { name, description, createAt, schemaVersion, wms: buildWms(), author: buildAuthor(), workflow: buildWorkflow()}

  // const tempElapse = ((5 * 60) + 30) * 1000

  // const start = new Date()
  // const end = new Date(new Date().getDate() + tempElapse)

  // const date = {
  //   second: 1000,
  //   minute: 60 * 1000,
  //   hour: 60 * 60 * 1000
  // }

  // const elapse = end.getDate() - start.getDate()

  // const elapseDate = new Date(elapse)

  // const duration = end - start
  // console.log(elapse , elapse < date.hour, elapse < date.minute, elapse < date.second )
  // const iso8601string = `${start.getFullYear()}-${start.getMonth().toString().padStart(2,"0")}-${start.getDay().toString().padStart(2,"0")}T${start.getHours().toString().padStart(2,"0")}:${start.getMinutes().toString().padStart(2,"0")}:${start.getSeconds().toString().padStart(2,"0")}-${elapse < date.hour ? "" : ":" + end.getHours.toString().padStart(2,"0")()}${elapse < date.minute ? "" : ":" + end.getMinutes().toString().padStart(2,"0")}${elapse < date.second ? "" : ":" + end.getSeconds().toString().padStart(2,"0")}`

  // console.log(iso8601string)
}

function countFileName(data) {
  const temp = data.workflow.tasks
  let temp2 = []
  for (let element of temp) {
    const temp3 = {
      name: element.name,
      children: element.children,
      parents: element.parents,
      files: element.files,
    }
    temp2.push(temp3)
  }
 return temp2
}

const Workflow_co2 = () => {

    const module = "D.1"

    const [file, setFile] = useState([]);
    const [isTrue, setIsTrue] = useState(false)
    const [render, setRender] = useState();

    React.useState(() => {
    },[render])

    function onChange(event) {
      let reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.onload = event => {
        const obj = JSON.parse(event.target.result)
        console.log("event.target.result", obj);
        setFile(obj);
        setIsTrue(true)
      }
    }

    function rerender(){
      //console.log(JSON.stringify(buildWfJson()))
      axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/jsonSchemaValidate", file).then(
          response => {
            console.log(response.data)
            setRender(response.data)
          },
          error => {
            console.log(error)
            setRender(error)
          }
      )
    }
    console.log('counter')
    if (isTrue) {
    const temp4 = countFileName(file)
    console.log(temp4)
    }
    return (
        <Layout>
            <Seo title="D.1. Case Study: Energy-Aware Workflow Execution" />
            <h2 style={{
                marginBottom: `30px`,
                marginTop: `50px`,
                color: "#525252"
            }}><br />D.1. Case Study: Energy-Aware Workflow Execution</h2>

            <Segment style={{ marginBottom: "2em" }}>
                The goal of this module is to have you go through a case-study for a real-world workflow application that must be executed
                while paying attention both to  performance and carbon footprint.  You first execute the app on a local cluster that you
                can configure in various ways to trade-off performance for electrical power efficiency. You then execute it by using the local cluster
                in a low-power configuration as well as a remote cloud whose power source is green(er).
                <br /><br />
                Go through the two tabs below in sequence…
            </Segment>

            <div>
              <h1>Json File Upload</h1>
              <input type="file" onChange={onChange}/>
              <button onClick={() => rerender()}>Upload</button>
            </div>
            {" ------------------------ file content ------------------------ "}
            <div><pre>{JSON.stringify(render, null, 2)}</pre></div>

            <Tab className="tab-panes" renderActiveOnly={true} panes={[
                {
                    menuItem: {
                        key: "local_computing",
                        content: "Local cluster"
                    },
                    render: () => <Tab.Pane><LocalComputing module={module} tab={"local_computing"}/></Tab.Pane>
                },
                {
                    menuItem: {
                        key: "cloud_computing",
                        content: "Local cluster and remote cloud"
                    },
                    render: () => <Tab.Pane><CloudComputing module={module} tab={"cloud_computing"}/></Tab.Pane>
                }
            ]}
            />
        </Layout>
    )
}

export default Workflow_co2
