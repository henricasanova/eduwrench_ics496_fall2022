/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React from "react"
import { Divider, Header } from "semantic-ui-react"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import CIStorageServicesSimulation from "./ci_storage_services_simulation"
import PracticeQuestions from "../../../components/practice_questions"

import CISimpleStorage from "../../../images/vector_graphs/ci_service_concepts/simple_storage.svg"
import CIStorageNetworkProximitySimulation from "./ci_storage_network_proximity_simulation"

const CIStorageServices = ({ module, tab }) => {
  return (
    <>
      <LearningObjectives module={module} tab={tab} />

      <h2>Data Services</h2>

      <p>
        In CI, the most common type of service provided by a data service is permanent,
        reliable, and efficient data storage. In addition to storing data in a remote server,
        data services may also provide a number of different capabilities, e.g.
        support for registering metadata for data description, backups, search mechanisms,
        data integrity checks, etc.
      </p>
      <p>
        A data service is basically composed of the following elements: storage devices
        (e.g, HDD, SSD, RAM, etc.), a file system, and databases (e.g., for keeping track of
        file locations and recording metadata). While a data service can be fully set up into
        a single machine, typical CI deployments follow a distributed approach – i.e.,
        multiple data servers or <i>data nodes</i>, dedicated nodes for processing query requests,
        etc.; in which services are part of the same local network (LAN) or are distributed
        into physical remote sites (connected via WAN). The figure below shows an example of
        a data service with a single data node and a file registry, each configured to run on
        different machines, but all part of the same local network.
      </p>

      <CISimpleStorage />
      <div className="caption"><strong>Figure 1:</strong> Example of a simple CI data service deployment.</div>

      <p>
        In the figure above, the simply fact of storing a file into the data service involves
        interaction with two services: the storage service, and the file registry service.
        The sequence diagram shown on the right side of Figure 1, depicts the sequence of
        operations and time elapsed to store the file in the storage service, and registering
        the file location in the file registry. Note that several overheads are incurred
        in this operation:
      </p>
      <ol>
        <li><i>Client Disk Overhead</i>: Time to read the file from the client disk into memory
          - defined by the client's disk read bandwidth.
        </li>
        <li><i>Transfer Overhead</i>: Time to transfer the file from the client to the storage
          service - defined by the network bandwidth and latency between the client and
          the storage service.
        </li>
        <li><i>Writing Overhead</i>: Time to write the file contents to the storage server disk
          - defined by the storage service's disk write bandwidth.
        </li>
        <li><i>Registration Overhead</i>: Time to perform a registration operation in the File
          Registry Service - defined by the network bandwidth and latency between the
          Storage Service and File Registry Service, and any overhead to process the
          registration operation on the File Registry Service.
        </li>
      </ol>
      <p>
        The steps for retrieving the file from the data service are similar to the above
        ones but in the reverse order - instead of an overhead for registering the file
        in the file registry, now the overhead would be to resolve the query for finding the
        location(s) of the stored file, and then transmit it through the network.
      </p>

      <Header as="h3" block>
        Simulating a Data Service
      </Header>

      <p>
        The simulation app below simulates the execution of the simple data service scenario shown in Figure 1. For this
        simulation, the File Registry Service has an <i>overhead</i> value represented as the time (in seconds) for
        performing an insert operation (i.e., registering a file), and storing a file in the data service involves the
        steps shown in the sequence diagram (Figure 1 right side). If you run the simulation using the default values,
        you will notice that the registration overhead nearly doubles the time to perform the storing operation in the
        data service.
      </p>

      <SimulationActivity panelKey="ci-storage-services-simulation" content={<CIStorageServicesSimulation />} />

      <Divider />

      <h2>Network Proximity</h2>

      <p>
        In the <a href="/pedagogic_modules/networking_fundamentals">network fundamentals module</a>, we have discussed
        the concepts of latency and bandwidth, and experienced how network topologies and congestion could impact
        data transfer times. In a CI deployment, it is common to have copies of data files (or <i>replicas</i>) stored
        on (geographically) distributed storage services. For example, an image captured with the Daniel K. Inouye
        Solar Telescope in Haleakalā, Maui, will certainly have a copy of the file on a local storage service, but
        could also distribute replicas of it to storage services worldwide. The goal of creating distributed replicas
        is to reduce the latency when accessing resources over the wide-area network (e.g., Internet), as well as
        to reduce potential network contention when having multiple users accessing a single resource.
      </p>

      <p>
        In order to overcome the above issues, CI deployments typically use <strong>Network Proximity</strong> services
        to identify the "nearest" resource that could provide the service efficiently. By nearest, we do not merely
        mean the geographical distance, instead we define it as the lowest time-to-response (TTR).
      </p>

      <Header as="h3" block>
        Simulating Data Retrieval with Network Proximity
      </Header>

      <SimulationActivity panelKey="ci-storage-network-proximity" content={<CIStorageNetworkProximitySimulation />} />

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

    </>
  )
}

export default CIStorageServices
