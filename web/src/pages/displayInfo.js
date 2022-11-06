import React, { useState } from 'react'
import Layout from '../components/layout'
import PageHeader from '../components/page_header'
import { Container, Segment, Table, Form } from 'semantic-ui-react'
import DisplayCytoscape from '../components/display_cytoscape'

const DisplayInfo = () => {
  // raw file data
  const [file, setFile] = useState(false)
  // top level defined array - index is the level
  const [result, setResult] = useState([])
  //
  const [tuple, setTuple] = useState([]);
  //
  const [ren, setRen] = useState(0)
  //
  const [fileObj, setFileObj] = useState(0)
  const [isTrue, setIsTrue] = useState(0)

  function checkCurrLevel(event) {
    let time = parseInt(event, 10)
    let timeOut = time * 1000
    const newResult = result
    const interval = setInterval(randomSwap, time, result)

    function swapNode(A, num1, num2) {
      if (A[num1].name === A[num2].name) {
        return 0;
      }
      let temp2 = A[num1].x
      A[num1].x = A[num2].x
      A[num2].x = temp2
    }

    function randomSwap(node) {
      let checkRen = 0
      const rand = Math.floor(Math.random() * (node.length - 1 - 0) + 0)
      let curr = node[rand]
      const currLength = curr.length
      const num1 = Math.floor(Math.random() * currLength)
      const num2 = Math.floor(Math.random() * currLength)
      swapNode(curr, num1, num2)
      setTuple([])
      node.map(r => r.map(newR => getSegment(newR)))
      console.log(node)
      checkRen = lineSweep(tuple, result.length - 1)
      console.log(checkRen)
      if (checkRen < ren) {
        setResult(node)
        setRen(checkRen)
      }
    }

    setTimeout(() => {
      clearInterval(interval)
      setFileObj(false)
      console.log(newResult, result)
      setFileObj(Object.fromEntries(result.flat().map(f => [f.name, f])))
    }, timeOut)


  }

  function divideByTopLevel(arr, length) {
    for (let i = 0; i <= length; i++) {
      result.push(file.filter(f => f.topLevel === i))
    }
  }

  function swap(A, num1, num2) {
    let temp2 = A[num1]
    A[num1] = A[num2]
    A[num2] = temp2
  }

  function partitionJson(array, start, end) {
    let value = array[end]
    let index = start
    for (let j = start; j < end; j++) {
      if (array[j].topLevel < value.topLevel) {
        swap(array, j, index)
        index++
      }
    }
    swap(array, index, end)
    return index
  }

  function sortJson(array, start, end) {
    if (start >= end) {
      return
    }
    let q = partitionJson(array, start, end)
    sortJson(array, start, q - 1)
    sortJson(array, q + 1, end)
  }

  function getIndex(parent) {
    return file.map(f => { return f.name }).indexOf(parent)
  }

  function bottomUp(node) {
    const { name, parents } = node
    const index = getIndex(name)
    let newNodeToCheck

    if (file[index].topLevel > 0) {
      return file[index].topLevel
    }

    if (parents.length <= 0) {
      node.topLevel = 0
      return node.topLevel
    } else {
      for (let nodeElement of parents) {
        const newIndex = getIndex(nodeElement)
        newNodeToCheck = file[newIndex]
        file[index].topLevel = 1 + bottomUp(newNodeToCheck)
      }
    }
    file[index].topLevel = 1 + newNodeToCheck.topLevel
  }

  function compute(data) {
    let length = data.length
    for (let i = 0; i <= length - 1; i++) {
      data[i].x = (i + 1) * (3000 / (length + 1))
      data[i].y = data[i].topLevel * 250
    }
  }

  function getParentsXCorr(nodeName) {
    const index = getIndex(nodeName)
    const { x } = file[index]
    return x
  }

  function computeBasedOnParents(data) {
    let length = data.length
    for (let i = 0; i <= length - 1; i++) {
      if (data[i].x) {
        return
      }
      let newCorr = 0
      const { parents } = data[i]
      for (let element of parents) {
        newCorr += getParentsXCorr(element)
      }
      data[i].x = newCorr / parents.length
    }
    data.sort(function (a, b) {
      return a.x < b.x
    })
    compute(data)
  }

  function getNodeXAndY(nodeElement) {
    const newTemp = file.filter((t) => t.name === nodeElement)
    return newTemp[0]
  }

  function getSegment(nod) {
    // console.log(nod)
    const { children, x, y, name, topLevel } = nod
    if (nod.children.length <= 0) {
      return 0;
    }
    for (let element of children) {
      const newTuple = getNodeXAndY(element)
      tuple.push([{ name, x, y, topLevel }, { name: newTuple.name, xPrime: newTuple.x, yPrime: newTuple.y, topLevel: newTuple.topLevel }])
    }
  }

  function isIntersection(a, b, c, d) {
    const top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
    const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)
    const point = top / bottom
    return (point > 0.4) && (point < 0.6)
  }

  function lineSweep(arr, nodeLength) {
    let total = 0
    let checkingArray = []
    for (let j = 0; j <= nodeLength; j++) {
      // console.log(j, true)
      for (let element of arr) {
        if (element[0].topLevel === j) {
          // console.log('print if true', element, j)
          checkingArray.push(element)
        }
      }
      for (const checkingElement of checkingArray) {
        if (checkingElement[1].topLevel === j) {
          for (const newElement of checkingArray) {
            const isIt = isIntersection({ x: checkingElement[0].x, y: checkingElement[0].y }, { x: checkingElement[1].xPrime, y: checkingElement[1].yPrime }, { x: newElement[0].x, y: newElement[0].y }, {
              x: newElement[1].xPrime,
              y: newElement[1].yPrime
            })
            if (isIt) {
              total++
            }
          }
          checkingArray.shift()
        }
      }
    }
    return total
  }

  React.useEffect(() => {
    if (isTrue) {
      const temp = file.filter(task => task.children.length === 0)
      // console.log(temp, file, 'firstEffect')
      temp.map(t => bottomUp(t))
      const newArray = sortJson(file, 0, file.length - 1)
      const resultLength = file[file.length - 1].topLevel
      divideByTopLevel(file, resultLength)
      compute(result[0])
      result.map(arr => computeBasedOnParents(arr))
      result.map(r => r.map(newR => getSegment(newR)))
      setRen(lineSweep(tuple, result.length - 1))
      setFileObj(Object.fromEntries(file.map(f => [f.name, f])))
    }
  }, [isTrue])

  function onChange(event) {
    setIsTrue(false);
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
      setFile(jsonData)
      setIsTrue(true)
      // const fileEntries = jsonData.map(node => [node.name, node])
      // setResult([]) // re-set the result to empty array
    }
  }

  console.log(ren)

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
        <Segment>
          <Form onSubmit={(event) => checkCurrLevel(event.target[0].value)}>
            <Form.Input label={'number'}/>
            <Form.Button content={'Submit'}/>
          </Form>
        </Segment>
        {result.length > 0 && <DisplayCytoscape width={3000} height={result.length * 500} levels={result} file={fileObj} isTrue={fileObj ? true : fileObj}/>}
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
        }
      </Container>
    </Layout>
  )
}

export default DisplayInfo
