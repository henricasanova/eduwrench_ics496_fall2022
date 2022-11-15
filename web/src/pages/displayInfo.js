import React, { useState, useRef } from 'react'
import Layout from '../components/layout'
import PageHeader from '../components/page_header'
import { Container, Segment, Table, Form } from 'semantic-ui-react'
import DisplayCytoscapeFile from '../components/cytoscape-helper-function/DisplayCytoscapeFile';
import { LineSweep } from '../components/cytoscape-helper-function/LineSweep';
import { SortNodeArray } from '../components/cytoscape-helper-function/SortNodeArray';
import { BotttomUpRecurs } from '../components/cytoscape-helper-function/BottomUpRecurs';

const DisplayInfo = () => {
  // top level defined array - index is the level
  const [result, setResult] = useState([])

  const [fileObj, setFileObj] = useState(0)

  const [totalIntersection, setTotalIntersection] = useState(0)

  const [arrayLength, setArrayLength] = useState(0)
  console.log(totalIntersection)

  function onChange(event) {
    setResult([])
    if (event.target.files[0]) {
      const reader = new FileReader()
      reader.readAsText(event.target.files[0])
      reader.onload = event => {
        const jsonData = JSON.parse(event.target.result).workflow.tasks.map(task => {
          return {
            name: task.name, type: task.type, runtime: task.runtime, parents: task.parents, children: task.children, files: task.files, cores: task.cores, avgCPU: task.avgCPU,
            bytesRead: task.bytesRead, bytesWritten: task.bytesWritten, memory: task.memory, machine: task.machine, id: task.id, category: task.category, command: task.command,
            topLevel: 0
          }
        })
        const temp = jsonData.filter(task => {
          if (task.children === undefined) task.children = []
          if (task.children.length === 0) return task
        })
        const getTopLevel = BotttomUpRecurs({ temp, jsonData })
        const nodes = SortNodeArray({ getTopLevel })
        const { sortedTopLevel, resultLength } = nodes;
        const totalCrossing = LineSweep({ resultLength, jsonData });
        setArrayLength(resultLength)
        setFileObj(Object.fromEntries(sortedTopLevel.flat().map(arr => [arr.name, arr])))
        setResult(sortedTopLevel)
        setTotalIntersection(totalCrossing)
      }
    }
  }
  console.log(result)
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
        </Segment>
        <DisplayCytoscapeFile width={3000} height={result.length * 500} levels={result} file={fileObj} arrayLength={arrayLength} totalIntersection={totalIntersection}/>
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
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Memory
                </Table.HeaderCell>
                <Table.HeaderCell>
                  AvgCPU
                </Table.HeaderCell>
                <Table.HeaderCell>
                  BytesRead
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
      </Container>
    </Layout>
  )
}

export default DisplayInfo
