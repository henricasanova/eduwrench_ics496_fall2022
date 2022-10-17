import React from "react"
import Layout from "../components/layout"
import PageHeader from "../components/page_header"
import { Container, Segment, Table } from "semantic-ui-react"
import { useState } from "react"
import JsonCytoscape from "../components/display_cytoscape"
import DisplayCytoscape from '../components/display_cytoscape';

/*
type Node = {
  parents: Array<Node>;
  children: Array<Node>;
  topLevel: number;
  runTime: number;
  value: number;
};

type Level = Array<Node>

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
}

function myParentsAvgRuntime(currentNode) {
  return currentNode.parents.reduce((prev, curr) => {
    prev += curr.value
    return prev / currentNode.parents.length
  }, 0)
}

const addNodesInLevelsDictionary = nodes => {
  return nodes.reduce((dictionary, node) => {
    if (!dictionary[node.topLevel]) dictionary[node.topLevel] = []
    dictionary[node.topLevel].push(node)
    console.log(dictionary)
    return dictionary
  }, [])
}
 */

const bottomUpLevel = (nodesObj, nodeName, partition) => {
  const node = nodesObj[nodeName]
  if (nodesObj[node.name].hasOwnProperty("topLevel"))
    return nodesObj[node.name].topLevel

  if (node.parents.length === 0) {
    node.topLevel = 0
    if (!partition[0]) partition[0] = []
    partition[0].push(node)
    return 0
  }

  const level = 1 + node.parents.reduce((max, parentName) => {
    if (!nodesObj[parentName].children) nodesObj[parentName].children = []
    if (nodesObj[parentName].children.filter(child => child === nodeName).length === 0) nodesObj[parentName].children.push(nodeName)
    const level = bottomUpLevel(nodesObj, parentName, partition)
    if (max < level) max = level
    return max
  }, 0)

  node.topLevel = node.topLevel === undefined || node.topLevel < level ? level : node.topLevel

  if (!partition[node.topLevel]) partition[node.topLevel] = []
  partition[node.topLevel].push(node)
  node.index = partition[node.topLevel].length

  return node.topLevel
}

const sortNodesOnSameLevel = (level, sortField) => level.sort((x, y) => x[sortField] - y[sortField])

const sortLevel = (levelDictionary, field) => levelDictionary.map(level => sortNodesOnSameLevel(level, field))

const compute = (data, index) => {
  let length = 3000 / (data.length * 2)
  let i = length
  for (let element of data) {
    element.x = i;
    element.y = index * 250;
    i += (length * 2)
  }
  return data;
}

const DisplayInfoV2 = () => {
  // raw file data
  const [file, setFile] = useState({})
  // top level defined array - index is the level
  const [result, setResult] = useState([])
  // number of total nodes/tasks
  const [totalNodes, setTotalNodes] = useState(0)
  // temp
  const [temp, setTemp] = useState(false)
  // isTrue
  const [isTrue, setIsTrue] = useState(false)

  React.useEffect(() => {
    if (file) {
      let jsonFile = Object.values(file)
      // console.log(jsonFile)
      jsonFile = jsonFile.filter(task => {
        if (task.children === undefined) task.children = []
        return task.children.length === 0 ? task : false
      })

      jsonFile.forEach(bottomNode => bottomUpLevel(file, bottomNode.name, result))

      console.log(result.flat().map((node, index) => { node.index = index; return node }))
      // temporarily given x and y values for testing
      const wPivot = 450
      const hPivot = 100

      result.forEach((nodes, height) => {
        nodes.forEach((node, index) => {
          node.x = index % 2 === 0 ? wPivot - (index * 300) : wPivot + (index * 300)
          node.y = hPivot + (height * 100)
        })
      })
      // till here

      setResult([...result])
    }
    setTemp(result)
    setIsTrue(true)
  }, [file])

  const temp2 = isTrue ? temp.map((t, index) => compute(t, index)) : 'nothing'

  // console.log(temp2)

  function onChange(event) {
    if (event.target.files[0]) {
      const reader = new FileReader()
      reader.readAsText(event.target.files[0])
      reader.onload = event => {
        const jsonData = JSON.parse(event.target.result).workflow.tasks

        const fileEntries = jsonData.map(node => [node.name, node])

        setResult([]) // re-set the result to empty array
        setFile(Object.fromEntries(fileEntries))
        setTotalNodes(fileEntries.length)
      }
    }
  }

  return (
    <Layout>
      <PageHeader title="Display" />
      <Container style={{ marginBottom: "20px" }}>
        <Segment textAlign={"center"}>
          <div>
            <h1>Json File Upload</h1>
            <input type="file" onChange={onChange} />
          </div>
          --------------------------- file content ---------------------------
          <div>Total Task: {totalNodes && totalNodes}</div>
        </Segment>
        {result.length > 0 && <DisplayCytoscape width={3000} height={temp2.length * 500} levels={temp2} file={file} />}
        {
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Children</Table.HeaderCell>
                <Table.HeaderCell>Parents</Table.HeaderCell>
                <Table.HeaderCell>
                  Top Level
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Runtime
                  <button
                    onClick={e => setResult(sortLevel(result, "runtime"))}
                  >
                    sort
                  </button>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Memory
                  <button onClick={e => setResult(sortLevel(result, "memory"))}>
                    sort
                  </button>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  AvgCPU
                  <button onClick={e => setResult(sortLevel(result, "avgCPU"))}>
                    sort
                  </button>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  BytesRead
                  <button
                    onClick={e => setResult(sortLevel(result, "bytesRead"))}
                  >
                    sort
                  </button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            {result.length > 0 ? (
              <Table.Body>
                {result.map(level =>
                  level.map(node => (
                    <Table.Row key={node.name}>
                      <Table.Cell>{node.name}</Table.Cell>
                      <Table.Cell>{node.children.length}</Table.Cell>
                      <Table.Cell>{node.parents.length}</Table.Cell>
                      <Table.Cell>{node.topLevel}</Table.Cell>
                      <Table.Cell>{node.runtime}</Table.Cell>
                      <Table.Cell>{node.memory}</Table.Cell>
                      <Table.Cell>{node.avgCPU}</Table.Cell>
                      <Table.Cell>{node.bytesRead}</Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            ) : null}
          </Table>
        }
      </Container>
    </Layout>
  )
}

export default DisplayInfoV2
