import React, { useEffect, useState } from "react"
import { useRef } from "react"
import CytoscapeComponent from "react-cytoscapejs"

const DisplayCytoscape = ({ width, height, levels, file }) => {
  // console.log(width, height, levels, file)
  const [elements, setElements] = useState({ nodes: [], edges: [] })

  useEffect(() => {
    setElements(
        levels.reduce((elements, nodes) => {

          const element = nodes.reduce((element, node) => {

            const { id, name: label, x, y } = node

            element.nodes.push({
              data: { id, label },
              position: { x, y },
            })

            element.edges = node.children.length > 0 ? node.children.map(childName => {
              const { id: childId } = file[childName]

              return {
                data: {
                  source: id,
                  target: childId,
                  label: childName,
                }
              }
            }) : []

            return element
          }, { nodes: [], edges: [] })

          elements.nodes = elements.nodes.concat(element.nodes)
          elements.edges = elements.edges.concat(element.edges)

          return elements
        }, { nodes: [], edges: [] }))
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
