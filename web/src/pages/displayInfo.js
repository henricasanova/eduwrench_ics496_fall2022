import React from 'react';
import Layout from '../components/layout';
import PageHeader from '../components/page_header';
import { Container, Segment, Table } from 'semantic-ui-react';
import { useState } from "react"
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

function buildWms() {
  const name = "wms name" // none empty *
  const version = "1.3" // none empty *
  const url = "https://wfcommons.org/format" // none empty uri

  return { name, version, url }
}

function buildAuthor() {
  const name = "author name" // none empty *
  const email = "author@email.org" // none empty email *
  const institution = "UH Manoa" // none empty
  const country = "US" // none empty

  return { name, email, institution, country }
}

function buildWorkflow() {
  const makespan = 0 // *
  const executedAt = new Date().toISOString() // none empty string *
  const machines = [ // none empty
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
  const tasks = [ // none empty *
    {
      name: "task name", // none empty *
      id: "123", // none empty
      category: "hi", // none empty
      type: "compute", //"compute","transfer","auxiliary" *
      command: {
        program: "node", // none empty
        arguments: ["run"] // none empty
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

function buildWfJson() {
  const name = "Yeji"// none empty *
  const description = "wfformat description" // none empty
  const createAt = "2020-03-20T15:19:28-08:00"//new Date().toISOString()// none empty time format iso
  const schemaVersion = "1.3" // "1.0","1.1","1.2","1.3" *

  return { name, description, createAt, schemaVersion, wms: buildWms(), author: buildAuthor(), workflow: buildWorkflow() }

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
      children: element.children.length,
      parents: element.parents.length,
      files: element.files.length,
    }
    temp2.push(temp3)
  }
  return temp2
}

const DisplayInfo = () => {
  const [file, setFile] = useState([]);
  const [isTrue, setIsTrue] = useState(false)
  const [render, setRender] = useState()

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

  let temp4 = []
  if (isTrue) {
    temp4 = countFileName(file)
  }
  console.log(temp4)
  return (
    <Layout>
      <PageHeader title="Display"/>
      <Container>
        <Segment textAlign={'center'}>
          <div>
            <h1>Json File Upload</h1>
            <input type="file" onChange={onChange}/>
          </div>
          {"--------------------------- file content ---------------------------"}
          <div>Total Task: {temp4.length}</div>
        </Segment>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Children</Table.HeaderCell>
              <Table.HeaderCell>Parents</Table.HeaderCell>
              <Table.HeaderCell>Files</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {temp4.length > 0 ? <Table.Body>
            <>
            {temp4.map(t => <Table.Row key={t.name}>
              <Table.Cell>{t.name}</Table.Cell>
              <Table.Cell>{t.children}</Table.Cell>
              <Table.Cell>{t.parents}</Table.Cell>
              <Table.Cell>{t.files}</Table.Cell>
            </Table.Row>)}
            </>
          </Table.Body> : null}
        </Table>
      </Container>
    </Layout>
  )
}

export default DisplayInfo
