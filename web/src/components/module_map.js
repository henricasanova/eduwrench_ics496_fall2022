import React from "react"
// import { useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const ModuleMap = () => {
  const elements = {
    nodes: [
      {
        data: {
          id: '1',
          label: 'A.1',
          href: '/pedagogic_modules/single_core_computing/'
        },
        position: {
          x: 543.5,
          y: 409
        },
      },
      {
        data: {
          id: '2',
          label: 'A.3.1',
          href: '/pedagogic_modules/single_core_computing/'
        },
        position: {
          x: 261.75,
          y: 838
        },
      },
      {
        data: {
          id: '3',
          label: 'A.2',
          href: '/pedagogic_modules/single_core_computing/'
        },
        position: {
          x: 543.5,
          y: 838
        },
      },
      {
        data: {
          id: '4',
          label: 'A.3.2',
          href: '/pedagogic_modules/single_core_computing/'
        },
        position: {
          x: 261.75,
          y: 1267
        },
      },{
        data: {
          id: '5',
          label: 'A.3.3',
          href: '/pedagogic_modules/single_core_computing/'
        },
        position: {
          x: 543.5,
          y: 1267
        },
      },{
        data: {
          id: '6',
          label: 'A.3.4',
          href: '/pedagogic_modules/single_core_computing/'
        },
        position: {
          x: 825.25,
          y: 1267
        },
      },{
        data: {
          id: '7',
          label: 'C.1',
          href: '/pedagogic_modules/single_core_computing/'
        },
        position: {
          x: 1107,
          y: 1267
        },
      },
      {
        data: {
          id: '8',
          label: 'B.1',
          href: '/pedagogic_modules/single_core_computing/'
        },
        position: {
          x: 261.75,
          y: 1696
        },
      },
      {
        data: {
          id: '9',
          label: 'C.2',
          href: '/pedagogic_modules/single_core_computing/'
        },
        position: {
          x: 543.5,
          y: 1696
        },
      },
      {
        data: {
          id: '10',
          label: 'D.1',
          href: '/pedagogic_modules/single_core_computing/'
        },
        position: {
          x: 1107,
          y: 1696
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
      {
        data: {
          source: '1',
          target: '3',
          label: 'edge from node1 to node2',
        },
      },
      {
        data: {
          source: '2',
          target: '4',
          label: 'edge from node1 to node2',
        },
      },
      {
        data: {
          source: '2',
          target: '5',
          label: 'edge from node1 to node2',
        },
      },
      {
        data: {
          source: '2',
          target: '6',
          label: 'edge from node1 to node2',
        },
      },
      {
        data: {
          source: '3',
          target: '4',
          label: 'edge from node1 to node2',
        },
      },
      {
        data: {
          source: '3',
          target: '5',
          label: 'edge from node1 to node2',
        },
      },
      {
        data: {
          source: '3',
          target: '6',
          label: 'edge from node1 to node2',
        },
      },
      {
        data: {
          source: '3',
          target: '7',
          label: 'edge from node1 to node2',
        },
      },
      {
        data: {
          source: '4',
          target: '8',
          label: 'edge from node1 to node2',
        },
      },
      {
        data: {
          source: '4',
          target: '9',
          label: 'edge from node1 to node2',
        },
      },
      {
        data: {
          source: '5',
          target: '9',
          label: 'edge from node1 to node2',
        },
      },
    ],
  };

  // const cyRef = useRef();

  return (
        <CytoscapeComponent
            elements={CytoscapeComponent.normalizeElements(elements)}
            maxZoom={10}
            minZoom={0.3}
            autolock={true}
            cy={(cy) => {
              cy.on('tap', 'node', function(){
                try {
                  window.open( this.data('href') );
                } catch(e){
                  window.location.href = this.data('href');
                }
				      });
			      }}
            stylesheet={[
              {
                selector: 'node',
                style: {
                  'background-color': 'transparent',
                  'color': 'blue',
                  'label': 'data(label)',
                  'text-wrap': 'wrap',
                  'text-halign': 'center',
                  'text-valign': 'center',
                  'width': '50'
                }
              },
              {
                selector: 'edge',
                style: {
                  'width': 3,
                  'curve-style': 'bezier',
                  'line-color': '#333',
                  'target-arrow-color': '#333',
                  'target-arrow-shape': 'triangle'
                }
              },
            ]}

            style={{ width: '1172px', height: '1716px' }}

        />
  );
};

export default ModuleMap;
