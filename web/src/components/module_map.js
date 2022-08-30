import React from "react"
import { useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const ModuleMap = () => {
  const elements = {
    nodes: [
      {
        data: {
          id: '1',
          label: 'node1',
        },
        position: {
          x: 100,
          y: 100
        },
      },
      {
        data: {
          id: '2',
          label: 'node2',
        },
        position: {
          x: 200,
          y: 100
        },
      },
    ],
    edges: [
      {
        data: {
          source: '1',
          target: '2',
          label: 'edge from node1 to node2',
        },
      },
    ],
  };

  const cyRef = useRef();

  return (
      <>
        <h1>Module Map Component</h1>
        <CytoscapeComponent
            elements={CytoscapeComponent.normalizeElements(elements)}
            maxZoom={2}
            minZoom={0.3}
            cy={(cy) => (cyRef.current = cy)}
            style={{ width: '400px', height: '400px' }}
        />
      </>
  );
};

export default ModuleMap;
