import React from "react"
import Layout from "../components/layout"
import PageHeader from "../components/page_header"
import { Container, Segment, Table } from "semantic-ui-react"
import { useState } from "react"

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
      const level = bottomUpLevel(nodesObj, parentName, partition)
      if (max < level) max = level
      return max
    }, 0)

  node.topLevel = node.topLevel === undefined || node.topLevel < level ? level : node.topLevel

  if (!partition[node.topLevel]) partition[node.topLevel] = []
  partition[node.topLevel].push(node)

  return node.topLevel
}

const sortNodesOnSameLevel = (level, sortField) => level.sort((x, y) => x[sortField] - y[sortField])

const sortLevel = (levelDictionary, field) => levelDictionary.map(level => sortNodesOnSameLevel(level, field))

const compute = (data, index) => {
  let length = 1000 / (data.length * 2)
  let i = length
  for (let element of data) {
    element.position = { y: i, x: index * 10}
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
      jsonFile = jsonFile.filter(task => task.children.length === 0 ? task : false)
      console.log(result)
      jsonFile.forEach(bottomNode => bottomUpLevel(file, bottomNode.name, result))
      setResult([...result])
    }
    setTemp(result)
    setIsTrue(true)
  }, [file])

  const temp2 = isTrue ? temp.map((t, index) => compute(t, index)) : 'nothing'

  console.log(temp2)

  function onChange(event) {
    const reader = new FileReader()
    reader.readAsText(event.target.files[0])
    reader.onload = event => {
      const jsonData = JSON.parse(event.target.result).workflow.tasks

      const fileEntries = jsonData.map(node => [node.name, node])

      setFile(Object.fromEntries(fileEntries))
      setTotalNodes(fileEntries.length)
    }
  }

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
          <div>Total Task: {totalNodes && totalNodes}</div>
        </Segment>
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
