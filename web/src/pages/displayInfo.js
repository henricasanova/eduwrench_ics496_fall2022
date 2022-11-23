import React, { useState, useRef, useEffect } from 'react'
import Layout from '../components/layout'
import PageHeader from '../components/page_header'
import { Container, Segment, Table, Form, Card, Button } from 'semantic-ui-react'
import DisplayCytoscapeFile from '../components/cytoscape-helper-function/DisplayCytoscapeFile';
import { SortNodeArray } from '../components/cytoscape-helper-function/SortNodeArray';
import { BotttomUpRecurs } from '../components/cytoscape-helper-function/BottomUpRecurs';
import CytoscapeHashTable from '../components/cytoscape-helper-function/CytoscapeHashTable';
import { LineSweep } from '../components/cytoscape-helper-function/LineSweep';
import DisplayCytoscape from '../components/display_cytoscape';

const cyTable = new CytoscapeHashTable()

let result = false
let file
let intersection = false

const DisplayInfo = () => {

  const [isTrue, setIsTrue] = useState(false)

  function bottomUp(objName) {
    let { name, parents, topLevel } = objName
    let count
    if (topLevel > 0) {
      return topLevel
    }
    if (parents.length <= 0) {
      return topLevel
    } else {
      for (let nodeElement of parents) {
        count = cyTable.updateTopLevel(name, 1 + bottomUp(cyTable.search(nodeElement)))
      }
    }
    return count
  }


  if (isTrue) {
    cyTable.getBottomNode().map(arrObj => bottomUp(arrObj))
    result = cyTable.getTopLevel()
    intersection = cyTable.getTotalIntersection()
    file = cyTable.values
  }

  function handleOnchange(event) {
    setIsTrue(false)
    if (event.target.files[0]) {
      const reader = new FileReader()
      reader.readAsText(event.target.files[0])
      reader.onload = event => {
        const jsonData = JSON.parse(event.target.result).workflow.tasks.forEach(task => {
          const { name, type, runtime, parents, children, files, cores, avgCPU, bytesRead, bytesWritten, memory, machine, id, category, command } = task
          cyTable.add(name, { name, type, runtime, parents, children, files, cores, avgCPU, bytesRead, bytesWritten, memory, machine, id, category, command, topLevel: 0 })
        })
        setIsTrue(true)
      }
    }
  }

  function handleInputChange(event) {
    const num = parseInt(event, 10)
    let temp
    let tempTotal = intersection
    if (num >= 0) {
      let timeOut = num * 1000
      const interval = setInterval(randomization, num)

      function randomization() {
        const newArray = result.map(arr => arr)
        console.log(newArray)
        randomSwap(newArray)
      }

      function swapNode(A, num1, num2) {
        if (A[num1].name === A[num2].name) {
          return 0;
        }
        let temp2 = A[num1].x
        A[num1].x = A[num2].x
        A[num2].x = temp2
      }

      function randomSwap(node) {
        const rand = Math.floor(Math.random() * (node.length - 1 - 0) + 0)
        const curr = node[rand]
        const currLength = curr.length
        const num1 = Math.floor(Math.random() * currLength)
        const num2 = Math.floor(Math.random() * currLength)
        swapNode(curr, num1, num2)
        const totalInt = LineSweep({ resultLength: node.length, jsonData: node.flat() })
        console.log(intersection, totalInt, tempTotal)
        if (totalInt < tempTotal) {
          temp = node
          tempTotal = totalInt
          console.log('satisfied123:', intersection, temp, tempTotal)
        }
      }

      setTimeout(() => {
        clearInterval(interval)

        console.log('satisfied1234:', intersection, result)
        if (tempTotal < intersection) {
          console.log('yes it is')
          result = temp
        }
        file = Object.fromEntries(result.flat().map(arr => [arr.name, arr]))
        console.log(result, tempTotal, file)
      }, timeOut)
    }
  }


  return (
    <Layout>
      <PageHeader title="Display"/>
      <Container style={{ marginBottom: "20px" }}>
        <Segment textAlign={'center'}>
          <Form>
            <Form.Input type={'file'} label={'Json File Upload'} onChange={handleOnchange}/>
          </Form>
          <Form onSubmit={(event) => handleInputChange(event.target[0].value)}>
            <Form.Input type={'number'} label={'Search'}/>
            <Button type={'submit'}/>
          </Form>
        </Segment>
      </Container>
      {result && <DisplayCytoscapeFile width={3000} height={result.length * 500} levels={result} file={file}/>}
    </Layout>
  )
}

export default DisplayInfo
