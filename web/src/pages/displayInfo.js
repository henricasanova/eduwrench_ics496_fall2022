import React, { useState, useRef, useEffect } from 'react'
import Layout from '../components/layout'
import PageHeader from '../components/page_header'
import { Container, Segment, Table, Form, Card, Button } from 'semantic-ui-react'
import DisplayCytoscapeFile from '../components/cytoscape-helper-function/DisplayCytoscapeFile';
import CytoscapeHashTable from '../components/cytoscape-helper-function/CytoscapeHashTable';
import LineSweep from '../components/cytoscape-helper-function/LineSweep';
import DisplayCytoscape from '../components/display_cytoscape';



const DisplayInfo = () => {

  // const temp = [
  //   [
  //     {
  //       "name": "A",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [],
  //       "children": [
  //         "B"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "0",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 0,
  //       "x": 1500,
  //       "y": 0
  //     }
  //   ],
  //   [
  //     {
  //       "name": "B",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "A"
  //       ],
  //       "children": [
  //         "C"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "1",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 1,
  //       "x": 1500,
  //       "y": 250
  //     }
  //   ],
  //   [
  //     {
  //       "name": "C",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "B"
  //       ],
  //       "children": [
  //         "D",
  //         "E"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "2",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 2,
  //       "x": 1500,
  //       "y": 500
  //     }
  //   ],
  //   [
  //     {
  //       "name": "E",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "C"
  //       ],
  //       "children": [
  //         "F",
  //         "H"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "4",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 3,
  //       "x": 2000,
  //       "y": 750
  //     },
  //     {
  //       "name": "D",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "C"
  //       ],
  //       "children": [
  //         "F",
  //         "G"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "3",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 3,
  //       "x": 1000,
  //       "y": 750
  //     }
  //   ],
  //   [
  //     {
  //       "name": "H",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "E"
  //       ],
  //       "children": [
  //         "K"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "7",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 4,
  //       "x": 2250,
  //       "y": 1000
  //     },
  //     {
  //       "name": "F",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "D",
  //         "E"
  //       ],
  //       "children": [
  //         "I",
  //         "J"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "5",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 4,
  //       "x": 1500,
  //       "y": 1000
  //     },
  //     {
  //       "name": "G",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "D"
  //       ],
  //       "children": [
  //         "J",
  //         "L"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "6",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 4,
  //       "x": 750,
  //       "y": 1000
  //     }
  //   ],
  //   [
  //     {
  //       "name": "L",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "G"
  //       ],
  //       "children": [
  //         "Q"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "11",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 5,
  //       "x": 600,
  //       "y": 1250
  //     },
  //     {
  //       "name": "I",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "F"
  //       ],
  //       "children": [
  //         "M"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "8",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 5,
  //       "x": 1200,
  //       "y": 1250
  //     },
  //     {
  //       "name": "J",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "F",
  //         "G"
  //       ],
  //       "children": [
  //         "N",
  //         "P"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "9",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 5,
  //       "x": 1800,
  //       "y": 1250
  //     },
  //     {
  //       "name": "K",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "H"
  //       ],
  //       "children": [
  //         "O",
  //         "Q"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "10",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 5,
  //       "x": 2400,
  //       "y": 1250
  //     }
  //   ],
  //   [
  //     {
  //       "name": "Q",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "K",
  //         "L"
  //       ],
  //       "children": [
  //         "T"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "16",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 6,
  //       "x": 500,
  //       "y": 1500
  //     },
  //     {
  //       "name": "M",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "I"
  //       ],
  //       "children": [
  //         "R"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "12",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 6,
  //       "x": 1000,
  //       "y": 1500
  //     },
  //     {
  //       "name": "N",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "J"
  //       ],
  //       "children": [
  //         "R"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "13",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 6,
  //       "x": 2000,
  //       "y": 1500
  //     },
  //     {
  //       "name": "O",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "K"
  //       ],
  //       "children": [
  //         "R",
  //         "S"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "14",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 6,
  //       "x": 2500,
  //       "y": 1500
  //     },
  //     {
  //       "name": "P",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "J"
  //       ],
  //       "children": [
  //         "S",
  //         "T"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "15",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 6,
  //       "x": 1500,
  //       "y": 1500
  //     }
  //   ],
  //   [
  //     {
  //       "name": "T",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "P",
  //         "Q"
  //       ],
  //       "children": [
  //         "U"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "19",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 7,
  //       "x": 750,
  //       "y": 1750
  //     },
  //     {
  //       "name": "R",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "M",
  //         "N",
  //         "O"
  //       ],
  //       "children": [
  //         "R"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "17",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 7,
  //       "x": 1500,
  //       "y": 1750
  //     },
  //     {
  //       "name": "S",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "O",
  //         "P"
  //       ],
  //       "children": [
  //         "U"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "18",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 7,
  //       "x": 2250,
  //       "y": 1750
  //     }
  //   ],
  //   [
  //     {
  //       "name": "V",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "R"
  //       ],
  //       "children": [
  //         "W"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "21",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 8,
  //       "x": 2000,
  //       "y": 2000
  //     },
  //     {
  //       "name": "U",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "S",
  //         "T"
  //       ],
  //       "children": [
  //         "W"
  //       ],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "20",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 8,
  //       "x": 1000,
  //       "y": 2000
  //     }
  //   ],
  //   [
  //     {
  //       "name": "W",
  //       "type": "compute",
  //       "runtime": 4.929305,
  //       "parents": [
  //         "U",
  //         "V"
  //       ],
  //       "children": [],
  //       "files": [
  //         {
  //           "link": "output",
  //           "name": "query.fastq.988.sam",
  //           "size": 52081
  //         }
  //       ],
  //       "cores": 1,
  //       "avgCPU": 45.3635,
  //       "bytesRead": 3455974,
  //       "bytesWritten": 99351,
  //       "memory": 5000,
  //       "machine": "worker-2.novalocal",
  //       "id": "22",
  //       "category": "bwa",
  //       "command": {
  //         "program": "bwa",
  //         "arguments": [
  //           "./bwa"
  //         ]
  //       },
  //       "topLevel": 9,
  //       "x": 1500,
  //       "y": 2250
  //     }
  //   ]
  // ]
  //
  // const temp2 = JSON.parse(JSON.stringify(temp))
  // const temp3 = new LineSweep()
  //
  // const temp4 = temp3.getTotalIntersection(temp2)
  // console.log(temp4)

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
        count = cyTable.current.updateTopLevel(name, 1 + bottomUp(cyTable.current.search(nodeElement)))
      }
    }
    return count
  }

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

  function handleOnchange(event) {
    setIsTrue(false)
    if (event.target.files[0]) {
      cyTable.current = new CytoscapeHashTable()
      console.log(cyTable.current)
      const reader = new FileReader()
      reader.readAsText(event.target.files[0])
      reader.onload = event => {
        const jsonData = JSON.parse(event.target.result).workflow.tasks.forEach(task => {
          const { name, type, runtime, parents, children, files, cores, avgCPU, bytesRead, bytesWritten, memory, machine, id, category, command } = task
          cyTable.current.add(name, { name, type, runtime, parents, children, files, cores, avgCPU, bytesRead, bytesWritten, memory, machine, id, category, command, topLevel: 0 })
        })
        cyTable.current.getBottomNode().map(arrObj => bottomUp(arrObj))
        getFile()
      }
    }
  }
  console.log(totalIntersection)

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
        console.log(totalInt, tempTotal, totalInt < tempTotal)
        if (totalInt < tempTotal) {
          console.log('its true')
          tempArray = node
          tempTotal = totalInt
          console.log('updated:', tempTotal, tempArray)
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
