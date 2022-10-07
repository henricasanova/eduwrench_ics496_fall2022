import React, { useState } from 'react';
import Layout from '../components/layout';
import PageHeader from '../components/page_header';
import { Container, Segment, Table } from 'semantic-ui-react';
import DisplayCytoscape from '../components/display_cytoscape';

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
  let length = 3000 / (data.length * 2)
  let i = length
  for (let element of data) {
    element.isItTrue = false
    element.x = i
    element.y = index * 250
    i += (length * 2)
  }
  return data;
}

const DisplayInfo = () => {
  // raw file data
  const [file, setFile] = useState({})
  // top level defined array - index is the level
  const [result, setResult] = useState([])
  // number of total nodes/tasks
  const [totalNodes, setTotalNodes] = useState(0)
  // temp
  const [temp, setTemp] = useState(false);
  // isTrue
  const [isTrue, setIsTrue] = useState(false)
  //
  const [tuple, setTuple] = useState([])



  React.useEffect(() => {
    if (file) {
      let jsonFile = Object.values(file)
      setTemp(jsonFile)
      jsonFile = jsonFile.filter(task => task.children.length === 0)
      jsonFile.forEach(bottomNode => bottomUpLevel(file, bottomNode.name, result))
      setResult([...result])
      setTemp(result.flat())
      setIsTrue(true)
    }
  }, [file])

  const temp2 = result.length > 0 ? result.map((t, index) => compute(t, index)) : false
  let tupleList = []

  function getNodeXAndY(nodeElement) {
    const newTemp = temp.filter((t) => t.name === nodeElement)
    console.log(newTemp)
    return newTemp[0]
  }

  function getSegment(nod) {
    console.log(nod)
    const { children, x, y, name } = nod
    if (nod.children <= 0) {
      return 0;
    }
    for (let element of children) {
      const newTuple = getNodeXAndY(element)
      tuple.push([x, y, newTuple.x, newTuple.y, name, newTuple.name])
    }
  }
  const temp3 = temp2 ? temp2.map(r => r.map(newR => getSegment(newR))) : 'nothing'
  console.log(tuple)
  function onChange(event) {
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

  return (
    <Layout>
      <PageHeader title="Display"/>
      <Container style={{ marginBottom: "20px" }}>
        <Segment textAlign={"center"}>
          <div>
            <h1>Json File Upload</h1>
            <input type="file" onChange={onChange}/>
          </div>
          --------------------------- file content ---------------------------
          <div>Total Task: {totalNodes && totalNodes}</div>
        </Segment>
        {result.length > 0 && <DisplayCytoscape width={3000} height={result.length * 500} levels={result} file={file}/>}
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

export default DisplayInfo


// let tupleList = []
// function getNodeIndex(nodeName) {
//   return temp.map(t => { return t.name }).indexOf(nodeName)
// }
//
// function getSegment(nod) {
//   const { x, y, name, parents, topLevel } = nod
//   const index = getNodeIndex(name)
//   if (parents.length <= 0) {
//     return { x, y }
//   } else {
//     for (let element of parents) {
//       let newNodeToCheck = getNodeIndex(element)
//       let tempo3 = getSegment(temp[newNodeToCheck])
//       console.log(tempo3, name)
//       let newTuple = []
//       if (tempo3) {
//         newTuple = [tempo3.x, tempo3.y, x, y, name]
//         tupleList.push(newTuple)
//       }
//     }
//   }
