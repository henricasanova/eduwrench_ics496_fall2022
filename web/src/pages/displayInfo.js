import React, { useState } from 'react';
import Layout from '../components/layout';
import PageHeader from '../components/page_header';
import { Container, Segment, Table } from 'semantic-ui-react';
import DisplayCytoscape from '../components/display_cytoscape';

// function checkSegments(a, b, c) {
//   // console.log((c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x), (c.y - a.y), (b.x - a.x), (b.y - a.y), (c.x - a.x))
//   return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x)
// }
//
// function isIntersection(a, b, c, d) {
//   return checkSegments(b, c, d) !== checkSegments(a, c, d) && checkSegments(a, b, c) !== checkSegments(a, b, d)
// }

// function isIntersection(a, b, c, d) {
//   const top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
//   const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)
//   const point = top / bottom
//   console.log(point, ((point > 0.4) && (point < 0.6)))
//   return (point > 0.4) && (point < 0.6)
// }
//
// function lineSweep(arr, nodeLength) {
//   let checkingArray = []
//   for (let j = 0; j <= nodeLength; j++) {
//     // console.log(j, true)
//     for (let element of arr) {
//       if (element[0].topLevel === j) {
//         // console.log('print if true', element, j)
//         checkingArray.push(element)
//       }
//     }
//     for (const checkingElement of checkingArray) {
//       if (checkingElement[1].topLevel === j) {
//         for (const newElement of checkingArray) {
//           const isIt = isIntersection({ x: checkingElement[0].x, y: checkingElement[0].y }, { x: checkingElement[1].xPrime, y: checkingElement[1].yPrime }, { x: newElement[0].x, y: newElement[0].y }, { x: newElement[1].xPrime, y: newElement[1].yPrime })
//           console.log(checkingElement, newElement, isIt, j)
//         }
//         checkingArray.shift()
//       }
//     }
//   }
// }

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

// const compute = (data) => {
//   let length = 3000 / (data.length * 2)
//   let i = length
//   for (let element of data) {
//     element.isItTrue = false
//     element.x = i
//     element.y = element.topLevel * 250
//     i += (length * 2)
//   }
//   return data;
// }

const DisplayInfo = () => {
  // raw file data
  const [file, setFile] = useState(false)
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
  //
  const [ifTrue, setIfTrue] = useState(false)
  //
  const [oneTrue, setOneTrue] = useState(false)
  const [renderArray, setRenderArray] = useState(false)

  // useEffect to find the lowest children using children parameter from the jsonFile array object.
  React.useEffect(() => {
    if (file) {
      let jsonFile = Object.values(file)
      setTemp(jsonFile)
      jsonFile = jsonFile.filter(task => task.children.length === 0)
      jsonFile.forEach(bottomNode => bottomUpLevel(file, bottomNode.name, result))
      setResult([...result])
      setIsTrue(true)
      setTemp(result.flat())
    }
  }, [file])

  React.useEffect(() => {
    if (isTrue) {
      const compute = (data) => {
        let length = 3000 / (data.length * 2)
        let i = length
        for (let element of data) {
          element.x = i
          element.y = element.topLevel * 250
          i += (length * 2)
        }
        return data
      }
      const something = result.map(node => compute(node));
      setOneTrue(true)
    }
    setIsTrue(false)
  },[isTrue])

  React.useEffect(() => {
    if (oneTrue) {
      function getNodeXAndY(nodeElement) {
        const newTemp = temp.filter((t) => t.name === nodeElement)
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
      result.forEach(r => r.forEach(newR => getSegment(newR)))
      setIfTrue(true)
    }
    setOneTrue(false)
  }, [oneTrue])

  React.useEffect(() => {
    if (ifTrue) {
      // console.log(tuple, 'linesweep')
      function isIntersection(a, b, c, d) {
        const top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
        const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)
        const point = top / bottom
        // console.log(point, ((point > 0.4) && (point < 0.6)))
        return (point > 0.4) && (point < 0.6)
      }

      function lineSweep(arr, nodeLength) {
        const newArray = []
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
                const isIt = isIntersection({ x: checkingElement[0].x, y: checkingElement[0].y }, { x: checkingElement[1].xPrime, y: checkingElement[1].yPrime }, { x: newElement[0].x, y: newElement[0].y }, { x: newElement[1].xPrime, y: newElement[1].yPrime })
                if (isIt) {
                  newArray.push({ segmentA: `${checkingElement[0].name} - ${checkingElement[1].name}`, segmentB: `${newElement[0].name} - ${newElement[1].name}`, intersection: isIt.toString(), j })
                }
              }
              checkingArray.shift()
            }
          }
        }
        return newArray
      }

      const sweep = lineSweep(tuple, result.length - 1)
      setRenderArray(sweep)
    }
    setIfTrue(false)
  }, [ifTrue])


  async function onChange(event) {
    const reader = new FileReader()
    reader.readAsText(event.target.files[0])
    reader.onload = event => {
      const jsonData = JSON.parse(event.target.result).workflow.tasks

      const fileEntries = jsonData.map(node => [node.name, node])
      setResult([]) // re-set the result to empty array
      setRenderArray(false)
      setFile(Object.fromEntries(fileEntries))
      setTotalNodes(fileEntries.length)
    }
  }
  console.log(renderArray)
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
        {
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>segment a</Table.HeaderCell>
                <Table.HeaderCell>segment b</Table.HeaderCell>
                <Table.HeaderCell>isIntersection</Table.HeaderCell>
                <Table.HeaderCell>topLevel</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            {renderArray ? (
              <Table.Body>
                {renderArray.map((level, index) =>
                    <Table.Row key={index}>
                      <Table.Cell>{level.segmentA}</Table.Cell>
                      <Table.Cell>{level.segmentB}</Table.Cell>
                      <Table.Cell>{level.intersection}</Table.Cell>
                      <Table.Cell>{level.j}</Table.Cell>
                    </Table.Row>)}
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
