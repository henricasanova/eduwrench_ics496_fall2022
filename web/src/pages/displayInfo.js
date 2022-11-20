import React, { useState, useRef, useEffect } from 'react'
import Layout from '../components/layout'
import PageHeader from '../components/page_header'
import { Container, Segment, Table, Form, Card } from 'semantic-ui-react'
import DisplayCytoscapeFile from '../components/cytoscape-helper-function/DisplayCytoscapeFile';
import { LineSweep } from '../components/cytoscape-helper-function/LineSweep';
import { SortNodeArray } from '../components/cytoscape-helper-function/SortNodeArray';
import { BotttomUpRecurs } from '../components/cytoscape-helper-function/BottomUpRecurs';
import CytoscapeHashTable from '../components/cytoscape-helper-function/CytoscapeHashTable';

const cyTable = new CytoscapeHashTable()

const DisplayInfo = () => {
  // top level defined array - index is the level
  const [isTrue, setIsTrue] = useState(false)

  function bottomUp(objName) {
    let { name, parents, topLevel } = objName
    let newNodeToCheck
    let count
    if (topLevel > 0) {
      return topLevel
    }

    if (parents.length <= 0) {
      return topLevel
    } else {
      for (let nodeElement of parents) {
        newNodeToCheck = nodeElement
        count = cyTable.updateTopLevel(name, 1 + bottomUp(cyTable.search(nodeElement)))
        // console.log('inside for Loop', count)
      }
    }
    return count
  }


  useEffect(() => {
    if (isTrue) {
      cyTable.getBottomNode().map(arrObj => bottomUp(arrObj))
      console.log(cyTable.getTopLevel())
      // const temp = cyTable.getAllValues().map(arrObj2 => console.log(arrObj2))

    }
  }, [isTrue])

  function handleOnchange(event) {
    setIsTrue(false)
    if (event.target.files[0]) {
      const reader = new FileReader()
      reader.readAsText(event.target.files[0])
      reader.onload = event => {
        const jsonData = JSON.parse(event.target.result).workflow.tasks.forEach(task => {
         const { name, type, runtime, parents, children, files, cores, avgCPU, bytesRead, bytesWritten, memory, machine, id, category, command } = task
          cyTable.add(name,  { name, type, runtime, parents, children, files, cores, avgCPU, bytesRead, bytesWritten, memory, machine, id, category, command, topLevel: 0 })
        })
        setIsTrue(true)
      }
    }
  }

  function handleInputChange(event) {
    if (event.target.value.length !== 0) {
    }
  }

  return (
    <Layout>
      <PageHeader title="Display"/>
      <Container style={{ marginBottom: "20px" }}>
        <Segment textAlign={'center'}>
          <Form>
            <Form.Input type={'file'} label={'Json File Upload'} onChange={handleOnchange}/>
            <Form.Input type={'text'} label={'Search'} onChange={handleInputChange}/>
          </Form>
        </Segment>
      </Container>
    </Layout>
  )
}

export default DisplayInfo
