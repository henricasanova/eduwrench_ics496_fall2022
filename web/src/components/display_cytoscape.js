import React, { useEffect, useState } from "react"
import { useRef } from "react"
import CytoscapeComponent from "react-cytoscapejs"

const DisplayCytoscape = ({ width, height, levels, file }) => {
  // console.log(width, height, levels, file)
  const [elements, setElements] = useState({ nodes: [], edges: [] })

  useEffect(() => {
    const fileById = Object.fromEntries(Object.entries(file).map(([key, value]) => [value.id, value]))

    const elements = levels.reduce((elements, nodes) => {

      const element = nodes.reduce((element, node) => {

        const { id, name: label, x, y } = node

        element.nodes.push({
          data: { id, label },
          position: { x, y },
        })

        const edges = node.children.length > 0 ? node.children.map(childName => {
          const { id: childId } = file[childName]

          return {
            data: {
              source: id,
              target: childId,
              label: childName,
            }
          }
        }) : []

        element.edges = element.edges.concat(edges)

        return element
      }, { nodes: [], edges: [] })

      elements.nodes = elements.nodes.concat(element.nodes)
      elements.edges = elements.edges.concat(element.edges)

      return elements
    }, { nodes: [], edges: [] })

    elements.edges.forEach(edge => {
      const currentSourceNode = fileById[edge.data.source]
      const currentTargetNode = fileById[edge.data.target]

      elements.edges.filter(otherEdge => {

        const sourceNode = fileById[otherEdge.data.source]
        const targetNode = fileById[otherEdge.data.target]

        if (currentSourceNode.topLevel === sourceNode.topLevel && ((currentSourceNode.x < sourceNode.x && currentTargetNode.x > targetNode.x) || (currentSourceNode.x > sourceNode.x && currentTargetNode.x < targetNode.x))) {
          currentSourceNode.intersect = currentSourceNode.intersect === undefined ? 1 : currentSourceNode.intersect + 1
        }
      })
    })
    console.log(fileById)
    // const taskNodes = Object.values(file)
    /* taskNodes.forEach(task => {
      console.log('# of children: ' + task.children.length)
    }) */
    console.log(file)
    setElements(elements)

  }, [levels])

  const cyRef = useRef()

  return (
    <>
      <h1>Json Cytoscape Component</h1>
      <CytoscapeComponent
        elements={CytoscapeComponent.normalizeElements(elements)}
        maxZoom={10}
        minZoom={0.2}
        cy={cy => (cyRef.current = cy)}
        stylesheet={[
          {
            selector: "node",
            style: {
              "background-color": "transparent",
              color: "white",
              label: "data(label)",
              "text-wrap": "wrap",
              "text-halign": "center",
              "text-valign": "center",
              width: "200",
              height: "50"
            },
          },
          {
            selector: "edge",
            style: {
              width: 3,
              "curve-style": "bezier",
              "line-color": "#333",
              "target-arrow-color": "#333",
              "target-arrow-shape": "triangle",
            },
          },
        ]}
        style={{ "minHeight": `${width}px`, "maxHeight": `${height}px` }}
      />
    </>
  )
}

export default DisplayCytoscape
