import React, { useEffect, useState, useRef } from "react"
import CytoscapeComponent from "react-cytoscapejs"
import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import "../popper.css";
import { Form, Segment } from 'semantic-ui-react';

cytoscape.use(popper);

const DisplayCytoscapeFile = ({ width, height, levels, file, test, isTrue, intersection }) => {
  const [elements, setElements] = useState({ nodes: [], edges: [] })
  useEffect(() => {
    if (isTrue) {
      const fileById = Object.fromEntries(Object.entries(file).map(([key, value]) => [value.id, value]))

      const elements = levels.reduce((elements, nodes) => {

        const element = nodes.reduce((element, node) => {

          const { id, name: label, avgCPU, runtime, bytesRead, memory, x, y, topLevel, color } = node

          element.nodes.push({
            data: { id, label, avgCPU, runtime, bytesRead, memory, x, y, topLevel, color },
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
        })
      })
      setElements(elements)
      console.log(levels, file, intersection)
    }
  }, [isTrue])

  useEffect(() => {
    if (test) {
      const fileById = Object.fromEntries(Object.entries(file).map(([key, value]) => [value.id, value]))

      const elements = levels.reduce((elements, nodes) => {

        const element = nodes.reduce((element, node) => {

          const { id, name: label, avgCPU, runtime, bytesRead, memory, x, y, color } = node

          element.nodes.push({
            data: { id, label, avgCPU, runtime, bytesRead, memory, x, y, color },
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
        })
      })
      setElements(elements)
      console.log('updated', levels, file, intersection)
    }
  }, [test])

  const cyRef = useRef()
  return (
    <>
      <h1>Json Cytoscape Component</h1>
      <CytoscapeComponent
        elements={CytoscapeComponent.normalizeElements(elements)}
        maxZoom={10}
        minZoom={0.2}
        //cy={cy => (cyRef.current = cy)}
        cy={(cy) => {
          cy.elements().unbind("mouseover");
          cy.elements().bind("mouseover", (event) => {
            if (event.target._private.data.avgCPU) {
              event.target.popperRefObj = event.target.popper({
                content: () => {
                  let content = document.createElement("div");

                  content.classList.add("popper-div-json");

                  content.innerHTML = "Avg CPU: " + event.target[0]._private.data.avgCPU +
                    "<br />Runtime: " + event.target[0]._private.data.runtime +
                    "<br />Bytes Read: " + event.target[0]._private.data.bytesRead +
                    "<br />Memory: " + event.target[0]._private.data.memory +
                    "<br />X: " + event.target[0]._private.data.x +
                    "<br />Y: " + event.target[0]._private.data.y +
                    "<br />Name: " + event.target[0]._private.data.label +
                    "<br />TopLevel: " + event.target[0]._private.data.topLevel

                  document.body.appendChild(content);
                  return content;
                },
              });
            }
          });
          cy.elements().unbind("mouseout");
          cy.elements().bind("mouseout", (event) => {
            if (event.target._private.data.avgCPU) {
              event.target.popperRefObj.state.elements.popper.remove();
              event.target.popperRefObj.destroy();
            }
          });
        }}
        stylesheet={[
          {
            selector: "node",
            style: {
              "background-color": "data(color)",
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

export default DisplayCytoscapeFile
