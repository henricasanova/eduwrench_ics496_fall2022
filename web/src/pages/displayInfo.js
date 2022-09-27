import React from "react"
import Layout from "../components/layout"
import PageHeader from "../components/page_header"
import { Container, Segment, Table } from "semantic-ui-react"
import { useState } from "react"
import axios from "axios"
import { number } from "prop-types"

// not use, but maybe later if we need to sort them first
function partitionJson(array, start, end) {
  let value = array[end]
  let index = start - 1
  for (let j = index; j < end; j++) {
    if (array[j].children <= value.children) {
      index = index + 1
      let temp = array[j]
      array[j] = array[index]
      array[index] = temp
    }
  }
  let temp2 = array[value]
  array[value] = array[end]
  array[end] = temp2
  return index + 1
}

// same
function sortJson(array, start, end) {
  if (start < end) {
    let q = partitionJson(array, start, end)
    sortJson(array, start, q - 1)
    sortJson(array, q + 1, end)
  }
}

// type Node = {
//   parents: Array<Node>;
//   children: Array<Node>;
//   topLevel: number;
//   runTime: number;
//   value: number;
// };
//
// type Level = Array<Node>

const DisplayInfo = () => {
  const [file, setFile] = useState(false)
  const [result, setResult] = useState([])
  const [isLevelSort, setIsLevelSort] = useState(false)

  const dictionary = []
  function max(q) {}

  const node = {
    parents: [],
    children: [],
    topLevel: 0,
    runtime: 1,
    value: 0, // temporary 3, 5, 67, 34
  }
  var startTime = performance.now()
  const sortLevel = field => {
    const LEVELS = addNodesInLevelsDictionary(file)
    LEVELS.forEach(level => sortNodesOnSameLevel(level, field))
    console.log(LEVELS)
    setResult(LEVELS)
    setIsLevelSort(true)
  }

  const sortNodesOnSameLevel = (level, sortField) =>
    level.sort((x, y) => x[sortField] - y[sortField])

  const addNodesInLevelsDictionary = nodes => {
    return nodes.reduce((dictionary, node) => {
      if (!dictionary[node.topLevel]) dictionary[node.topLevel] = []
      dictionary[node.topLevel].push(node)
      console.log(dictionary)
      return dictionary
    }, [])
  }

  function myParentsAvgRuntime(currentNode) {
    return currentNode.parents.reduce((prev, curr) => {
      prev += curr.value
      return prev / currentNode.parents.length
    }, 0)
  }

  /*
  const sortNodesOnSameLevel = (level: Level) => level.sort((x: Node, y: Node) => x.runTime < y.runTime)

  const addNodesInLevelsDictionary = (nodes: Array<Node>) => {
    nodes.reduce((dictionary: Array<Level>, node: Node) => {
      if(dictionary[node.topLevel]) dictionary[node.topLevel] = []
      dictionary[node.topLevel].push(node)
      return dictionary
    }, [])
  }

  function myParentsAvgRuntime(currentNode: Node) {
    return currentNode.parents.reduce((prev, curr): number => {
      prev += curr.value
      return prev / currentNode.parents.length
    }, 0)
  }*/

  React.useEffect(() => {
    if (file) {
      file.filter(t => t.children.length === 0).forEach(t => bottomUp(t))
      // setResult(file)
      console.log(file)
      setResult(file)
      setIsLevelSort(false)
    }
  }, [file])

  console.log(myParentsAvgRuntime(node))

  const getIndex = parent => file.map(f => f.name).indexOf(parent)

  function bottomUp(node) {
    const { name, parents } = node
    console.log(name)
    // console.log(name, parents)
    if (file[index] > 0) {
      return file[index].topLevel;
    }
    const index = getIndex(name)
    let newNodeToCheck
    if (parents.length <= 0) {
      // console.log('in the if statement')
      return 0
    } else {
      for (let nodeElement of parents) {
        const newIndex = getIndex(nodeElement)
        // console.log(index, newIndex)
        newNodeToCheck = file[newIndex]
        // console.log(index, 'im here')
        file[index].topLevel = 1 + bottomUp(newNodeToCheck)
        // console.log(index)
        // console.log(file[index], 'none', file[index].topLevel)
      }
    }
    file[index].topLevel = 1 + newNodeToCheck.topLevel
  }

  function onChange(event) {
    const reader = new FileReader()
    reader.readAsText(event.target.files[0])
    reader.onload = event => {
      console.log(JSON.parse(event.target.result).workflow.tasks)
      setFile(
        JSON.parse(event.target.result).workflow.tasks.map(task => {
          task.topLevel = 0
          return task
        })
      )
    }
  }
  var endTime = performance.now()
  console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)

  return (
    <Layout>
      <PageHeader title="Display" />
      <Container>
        <Segment textAlign={"center"}>
          <div>
            <h1>Json File Upload</h1>
            <input type="file" onChange={onChange} />
          </div>
          --------------------------- file content ---------------------------
          <div>Total Task: {result ? result.length : ""}</div>
        </Segment>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Children</Table.HeaderCell>
              <Table.HeaderCell>Parents</Table.HeaderCell>
              <Table.HeaderCell>
                Top Level
                <button onClick={e => sortLevel("topLevel")}>sort</button>
              </Table.HeaderCell>
              <Table.HeaderCell>
                Runtime<button onClick={e => sortLevel("runtime")}>sort</button>
              </Table.HeaderCell>
              <Table.HeaderCell>
                Memory<button onClick={e => sortLevel("memory")}>sort</button>
              </Table.HeaderCell>
              <Table.HeaderCell>
                AvgCPU<button onClick={e => sortLevel("avgCPU")}>sort</button>
              </Table.HeaderCell>
              <Table.HeaderCell>
                BytesRead
                <button onClick={e => sortLevel("bytesRead")}>sort</button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {result ? (
            <Table.Body>
              <>
                {result.map(t =>
                  isLevelSort ? (
                    t.map(t => (
                      <Table.Row key={t.name}>
                        <Table.Cell>{t.name}</Table.Cell>
                        <Table.Cell>{t.children.length}</Table.Cell>
                        <Table.Cell>{t.parents.length}</Table.Cell>
                        <Table.Cell>{t.topLevel}</Table.Cell>
                        <Table.Cell>{t.runtime}</Table.Cell>
                        <Table.Cell>{t.memory}</Table.Cell>
                        <Table.Cell>{t.avgCPU}</Table.Cell>
                        <Table.Cell>{t.bytesRead}</Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row key={t.name}>
                      <Table.Cell>{t.name}</Table.Cell>
                      <Table.Cell>{t.children.length}</Table.Cell>
                      <Table.Cell>{t.parents.length}</Table.Cell>
                      <Table.Cell>{t.topLevel}</Table.Cell>
                      <Table.Cell>{t.runtime}</Table.Cell>
                      <Table.Cell>{t.memory}</Table.Cell>
                      <Table.Cell>{t.avgCPU}</Table.Cell>
                      <Table.Cell>{t.bytesRead}</Table.Cell>
                    </Table.Row>
                  )
                )}
              </>
            </Table.Body>
          ) : null}
        </Table>
      </Container>
    </Layout>
  )
}

export default DisplayInfo

// const WfFormat = {
//   name: "Yeji", // none empty *
//   description: "whatever", // none empty
//   createdAt: Date().toISOString, // none empty time-format-iso
//   schemaVersion: "", // "1.0","1.1","1.2","1.3" *
//   wms: {
//     name: "wms name", // none empty *
//     version: "", // none empty *
//     url: "" // none empty uri
//   },
//   author: {
//     name: "", // none empty *
//     email: "", // none empty email *
//     institution: "", // none empty
//     country: "" // none empty
//   },
//   workflow: { // *
//     makespan: 0, // *
//     executedAt: "", // none empty *
//     machines: [ // none empty
//       {
//         system: "", // "linux","macos","windows"
//         architecture: "", // none empty
//         nodeName: "", // none empty hostname *
//         release: "", // none empty
//         memory: 0, //none 0
//         cpu: {
//           count: 0, // none 0
//           speed: 0, // none 0
//           vendor: "", // none empty
//         }
//       }
//     ],
//     tasks: [ // none empty *
//       {
//         name: "", // none empty *
//         id: "", // none empty
//         category: "", // none empty
//         type: "", //"compute","transfer","auxiliary" *
//         command: {
//           program: "", // none empty
//           arguments: [] // none empty
//         },
//         parents: [], // none empty ^[0-9a-zA-Z-_.]*$
//         files: [
//           {
//             name: "", // *
//             size: 0, // *
//             link: "" // "input", "output" *
//           }
//         ],
//         runtime: 0,
//         cores: 0, // min 1
//         avgCPU: 0,
//         bytesRead: 0,
//         bytesWritten: 0,
//         memory: 0,
//         energy: 0,
//         avgPower: 0,
//         priority: 0,
//         machine: "" // none empty
//       }
//     ]
//   }
// }
//
// function buildWms() {
//   const name = "wms name" // none empty *
//   const version = "1.3" // none empty *
//   const url = "https://wfcommons.org/format" // none empty uri
//
//   return { name, version, url }
// }
//
// function buildAuthor() {
//   const name = "author name" // none empty *
//   const email = "author@email.org" // none empty email *
//   const institution = "UH Manoa" // none empty
//   const country = "US" // none empty
//
//   return { name, email, institution, country }
// }
//
// function buildWorkflow() {
//   const makespan = 0 // *
//   const executedAt = new Date().toISOString() // none empty string *
//   const machines = [ // none empty
//     {
//       system: "window", // "linux","macos","windows"
//       architecture: "desktop", // none empty
//       nodeName: "localhost", // none empty hostname *
//       release: "", // none empty
//       memory: 0, //none 0
//       cpu: {
//         count: 0, // none 0
//         speed: 0, // none 0
//         vendor: "", // none empty
//       }
//     }
//   ]
//   const tasks = [ // none empty *
//     {
//       name: "task name", // none empty *
//       id: "123", // none empty
//       category: "hi", // none empty
//       type: "compute", //"compute","transfer","auxiliary" *
//       command: {
//         program: "node", // none empty
//         arguments: ["run"] // none empty
//       },
//       parents: ["1aZ.0_"], // none empty ^[0-9a-zA-Z-_.]*$
//       files: [
//         {
//           name: "file name", // *
//           size: 100, // *
//           link: "input" // "input", "output" *
//         }
//       ],
//       runtime: 0,
//       cores: 10, // min 1
//       avgCPU: 0,
//       bytesRead: 0,
//       bytesWritten: 0,
//       memory: 0,
//       energy: 0,
//       avgPower: 0,
//       priority: 0,
//       machine: "windows" // none empty
//     }
//   ]
//
//   return { makespan, executedAt, machines, tasks }
// }
//
// function buildWfJson() {
//   const name = "Yeji"// none empty *
//   const description = "wfformat description" // none empty
//   const createAt = "2020-03-20T15:19:28-08:00"//new Date().toISOString()// none empty time format iso
//   const schemaVersion = "1.3" // "1.0","1.1","1.2","1.3" *
//
//   return { name, description, createAt, schemaVersion, wms: buildWms(), author: buildAuthor(), workflow: buildWorkflow() }
//
//   // const tempElapse = ((5 * 60) + 30) * 1000
//
//   // const start = new Date()
//   // const end = new Date(new Date().getDate() + tempElapse)
//
//   // const date = {
//   //   second: 1000,
//   //   minute: 60 * 1000,
//   //   hour: 60 * 60 * 1000
//   // }
//
//   // const elapse = end.getDate() - start.getDate()
//
//   // const elapseDate = new Date(elapse)
//
//   // const duration = end - start
//   // console.log(elapse , elapse < date.hour, elapse < date.minute, elapse < date.second )
//   // const iso8601string = `${start.getFullYear()}-${start.getMonth().toString().padStart(2,"0")}-${start.getDay().toString().padStart(2,"0")}T${start.getHours().toString().padStart(2,"0")}:${start.getMinutes().toString().padStart(2,"0")}:${start.getSeconds().toString().padStart(2,"0")}-${elapse < date.hour ? "" : ":" + end.getHours.toString().padStart(2,"0")()}${elapse < date.minute ? "" : ":" + end.getMinutes().toString().padStart(2,"0")}${elapse < date.second ? "" : ":" + end.getSeconds().toString().padStart(2,"0")}`
//
//   // console.log(iso8601string)
// }
