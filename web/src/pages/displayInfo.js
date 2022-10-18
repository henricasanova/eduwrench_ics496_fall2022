import React, { useState } from 'react';
import Layout from '../components/layout';
import PageHeader from '../components/page_header';
import { Container, Segment, Table } from 'semantic-ui-react';
import DisplayCytoscape from '../components/display_cytoscape';

const DisplayInfo = () => {
  // raw file data
  const [file, setFile] = useState(false)
  // top level defined array - index is the level
  const [result, setResult] = useState([])

  function divideByTopLevel(arr, length) {
    for (let i = 0; i <= length - 1; i++) {
      result.push(file.filter(f => f.topLevel === i))
    }
  }

  function swap(A, num1, num2) {
    let temp = A[num1]
    A[num1] = A[num2]
    A[num2] = temp
  }

  // not use, but maybe later if we need to sort them first
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

  // same
  function sortJson(array, start, end) {
    if (start >= end) {
      return
    }
    let q = partitionJson(array, start, end)
    sortJson(array, start, q - 1)
    sortJson(array, q + 1, end)
  }

  function getIndex(parent) {
    const temp = file.map(f => { return f.name }).indexOf(parent)
    return temp
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
      console.log(node.topLevel)
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

  React.useEffect(() => {
    if (file) {
      const temp = file.filter(task => task.children.length === 0)
      // console.log(temp, file, 'firstEffect')
      temp.map(t => bottomUp(t))
      const newArray = sortJson(file, 0, file.length - 1)
      const resultLength = file[file.length - 1].topLevel
      divideByTopLevel(file, resultLength)
    }
  }, [file])

  // React.useEffect(() => {
  //   if (isTrue) {
  //     const compute = (data) => {
  //       let length = 3000 / (data.length * 2)
  //       let i = length
  //       for (let element of data) {
  //         element.x = i
  //         element.y = element.topLevel * 250
  //         i += (length * 2)
  //       }
  //       return data
  //     }
  //     const something = result.map(node => compute(node));
  //     setOneTrue(true)
  //   }
  //   setIsTrue(false)
  // },[isTrue])
  //
  // React.useEffect(() => {
  //   if (oneTrue) {
  //     function getNodeXAndY(nodeElement) {
  //       const newTemp = temp.filter((t) => t.name === nodeElement)
  //       return newTemp[0]
  //     }
  //
  //     function getSegment(nod) {
  //       // console.log(nod)
  //       const { children, x, y, name, topLevel } = nod
  //       if (nod.children.length <= 0) {
  //         return 0;
  //       }
  //       for (let element of children) {
  //         const newTuple = getNodeXAndY(element)
  //         tuple.push([{ name, x, y, topLevel }, { name: newTuple.name, xPrime: newTuple.x, yPrime: newTuple.y, topLevel: newTuple.topLevel }])
  //       }
  //     }
  //     result.forEach(r => r.forEach(newR => getSegment(newR)))
  //     setIfTrue(true)
  //   }
  //   setOneTrue(false)
  // }, [oneTrue])
  //
  // React.useEffect(() => {
  //   if (ifTrue) {
  //     // console.log(tuple, 'linesweep')
  //     function isIntersection(a, b, c, d) {
  //       const top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
  //       const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)
  //       const point = top / bottom
  //       // console.log(point, ((point > 0.4) && (point < 0.6)))
  //       return (point > 0.4) && (point < 0.6)
  //     }
  //
  //     function lineSweep(arr, nodeLength) {
  //       const newArray = []
  //       let checkingArray = []
  //       for (let j = 0; j <= nodeLength; j++) {
  //         // console.log(j, true)
  //         for (let element of arr) {
  //           if (element[0].topLevel === j) {
  //             // console.log('print if true', element, j)
  //             checkingArray.push(element)
  //           }
  //         }
  //         for (const checkingElement of checkingArray) {
  //           if (checkingElement[1].topLevel === j) {
  //             for (const newElement of checkingArray) {
  //               const isIt = isIntersection({ x: checkingElement[0].x, y: checkingElement[0].y }, { x: checkingElement[1].xPrime, y: checkingElement[1].yPrime }, { x: newElement[0].x, y: newElement[0].y }, { x: newElement[1].xPrime, y: newElement[1].yPrime })
  //               if (isIt) {
  //                 newArray.push({ segmentA: `${checkingElement[0].name} - ${checkingElement[1].name}`, segmentB: `${newElement[0].name} - ${newElement[1].name}`, intersection: isIt.toString(), j })
  //               }
  //             }
  //             checkingArray.shift()
  //           }
  //         }
  //       }
  //       return newArray
  //     }
  //
  //     const sweep = lineSweep(tuple, result.length - 1)
  //     setRenderArray(sweep)
  //   }
  //   setIfTrue(false)
  // }, [ifTrue])

  console.log(file, result)
  function onChange(event) {
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
      console.log(jsonData)
      setFile(jsonData)
      console.log(file, 'onchange')
      // const fileEntries = jsonData.map(node => [node.name, node])
      // setResult([]) // re-set the result to empty array
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
        </Segment>
      </Container>
    </Layout>
  )
}

export default DisplayInfo
