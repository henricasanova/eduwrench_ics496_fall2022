import React, { useState, useRef } from 'react'
import Layout from '../components/layout'
import PageHeader from '../components/page_header'
import { Container, Segment, Form, Button } from 'semantic-ui-react'
import DisplayCytoscapeFile from '../components/cytoscape-helper-function/DisplayCytoscapeFile';
import CytoscapeHashTable from '../components/cytoscape-helper-function/CytoscapeHashTable';
import LineSweep from '../components/cytoscape-helper-function/LineSweep';


const DisplayInfo = () => {

  // for re-rendering DisplayCytoscape
  const [isTrue, setIsTrue] = useState(false)
  //
  const [result, setResult] = useState([])
  //
  const [file, setFile] = useState({})
  //
  const [test, setTest] = useState(false)
  //
  const [totalIntersection, setTotalIntersection] = useState(0)

  //
  const cyTable = useRef(null)
  const cyIntersection = useRef(null)
  const cySet = useRef(null)

  function max(a, b) {
    if (a < b) {
      return a
    }
    return b
  }

  function bottomUp(objName) {
    let { name, parents, topLevel } = objName
    let count
    if (topLevel > 0) {
      return topLevel
    }
    if (parents.length <= 0) {
      return topLevel
    } else {
      if (cySet.current.has(name)) {
        return 0
      }
      cySet.current.add(name)
      const level = 1 + parents.reduce((max, parentName) => {
        const level = bottomUp(cyTable.current.search(parentName))
        if (max < level) max = level
        return max
      }, 0)
      count = topLevel < level ? level : topLevel
      cyTable.current.values[name].topLevel = count

    }
    return count
  }

  // function bottomUp(objName) {
  //   let { name, parents, topLevel } = objName
  //   let count
  //   if (topLevel > 0) {
  //     return topLevel
  //   }
  //   if (parents.length <= 0) {
  //     return topLevel
  //   } else {
  //     if (cySet.current.has(name)) {
  //       return 0
  //     }
  //     for (let nodeElement of parents) {
  //       cySet.current.add(name)
  //       count =  1 + bottomUp(cyTable.current.search(nodeElement))
  //       cyTable.current.values[name].topLevel = count
  //     }
  //   }
  //   return count
  // }

  async function getIntersection() {
    cyIntersection.current = new LineSweep()
    const total = await cyIntersection.current.getTotalIntersection(cyTable.current.valueArray)
    return total
  }

  async function getResult() {
    await setResult(() => cyTable.current.getTopLevel())
    const total = await getIntersection()
    await setTotalIntersection(total)
    await setIsTrue(true)
  }

  async function getFile() {
    await setFile(cyTable.current.values)
    await getResult()
  }

  async function handleOnchange(event) {
    await setIsTrue(false)
    if (event.target.files[0]) {
      await handleParseData(event)
      await setTimeout(() => {
        console.log(cyTable.current.bottomValue)
        cyTable.current.getBottomNode().map(arrObj => bottomUp(arrObj))
        getFile()
      }, 3000)
    }
  }

  function handleParseData(event) {
    cySet.current = new Set()
    cyTable.current = new CytoscapeHashTable()
    const reader = new FileReader()
    reader.readAsText(event.target.files[0])
    reader.onload = event => {
      JSON.parse(event.target.result).workflow.tasks.forEach((task) => {
        const { name, type, runtime, parents, children, files, cores, avgCPU, bytesRead, bytesWritten, memory, machine, id, category, command } = task
          cyTable.current.add(name, { name, type, runtime, parents, children: children !== undefined ? children : [], files, cores, avgCPU, bytesRead, bytesWritten, memory, machine, id, category, command, topLevel: 0 })
      })
      cyTable.current.checkJsonFormatAndUpdate()
    }
  }

  function handleInputChange(event) {
    const num = parseInt(event, 10)
    let tempArray = JSON.parse(JSON.stringify(result))
    let tempTotal = totalIntersection
    if (num >= 0) {
      setTest(false)
      let timeOut = num * 1000
      const interval = setInterval(randomization, num)

      function randomization() {
        const newArray = JSON.parse(JSON.stringify(tempArray))
        // const subArray = []
        // for (let i = 0; i <= result.length - 1; i++) {
        //   for (let j = 0; j <= result[i].length - 1; j++) {
        //     console.log(result.length - 1, result[i].length - 1, i, j, result[i], result[i][j])
        //     subArray[j] = result[i][j]
        //     console.log(subArray[j])
        //   }
        //   newArray[i] = subArray
        //   console.log(newArray[i])
        // }
        // console.log(newArray)
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
        cyIntersection.current = new LineSweep()
        let totalInt = 0
        const rand = Math.floor(Math.random() * (node.length - 1 - 0) + 0)
        const curr = node[rand]
        const currLength = curr.length
        const num1 = Math.floor(Math.random() * currLength)
        const num2 = Math.floor(Math.random() * currLength)
        swapNode(curr, num1, num2)
        totalInt = cyIntersection.current.getTotalIntersection(node)
        // console.log(totalInt, tempTotal, totalInt < tempTotal)
        if (totalInt < tempTotal) {
          // console.log('its true')
          tempArray = node
          tempTotal = totalInt
          // console.log('updated:', tempTotal, tempArray)
        }
      }

      setTimeout(() => {
        clearInterval(interval)
        setResult(tempArray)
        setTotalIntersection(tempTotal)
        setFile(() => Object.fromEntries(tempArray.flat().map(arr => [arr.name, arr])))
        setTest(true)
      }, timeOut)

    }
  }


  return (<Layout>
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
    {isTrue && <DisplayCytoscapeFile width={3000} height={result.length * 250} file={file} levels={result} test={test} isTrue={isTrue} intersection={totalIntersection}/>}
  </Layout>)
}

export default DisplayInfo
