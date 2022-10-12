import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, updateEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './components/Node/Node'
import { useState, useCallback } from 'react';
import dagre from 'dagre';
import fileToDep from './FilePathToDep'

const getNodesAndEdges = () => {

  const fPaths = Object.keys(fileToDep);
  const edgeInclude = new Set()
  // console.log(fPaths)
  const nodes = [];
  const edges = []
  for (const fPath of fPaths) {
    const arr = fPath.split('/');
    const fileName = arr[arr.length - 1];
    const node = {
      id: fPath,
      type: 'cNode',
      data: { label: fileName, id: fPath },
      
    }
    // if(fPath === root){
    //   nodes.push({...node, position: { x: 0, y: 0 }})
    // }
    // else{
    // }
    nodes.push(node)
    for (const depFilePath of fileToDep[fPath]) {
      
      if(edgeInclude.has(fPath + depFilePath) || edgeInclude.has(fPath + depFilePath) ){
        continue;
      }
      const edge = {
        id: fPath + depFilePath,
        source: fPath,
        target: depFilePath,
        // handle: 'b',
        sourceHandle: "b",
        style: { stroke: 'black' },
        targetHandle:'a'
      }
      edges.push(edge)
    }
  }
  
  return { initialNodes:nodes, initialEdges:edges };
}
const groups = {"LandingPage":
  [
      "SessionsTable",
      "LanAutomatedTable",
      "Control",
      "Dashlet",
      "Card",
      "StartCard",
      "LandingPage.scss",
      "Overview",
      "Store",
      "DeviceDetailsSlice"
  ]
}

const {initialEdges, initialNodes} = getNodesAndEdges();
const nodeTypes = { cNode: CustomNode };
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 250;
const nodeHeight = 300;
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    console.log('nodeWithPosition ', nodeWithPosition)
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

console.log("nodes >>>> \n", layoutedNodes);
console.log("edges >>>> \n", layoutedEdges);
function App() {

  const [nodes, setNodes] = useState(layoutedNodes);
  const [edges, setEdges] = useState(layoutedEdges);

  const onNodesChange = useCallback(
    (changes) => {
      return setNodes((nds) => applyNodeChanges(changes, nds))
    },
    []
  );

  const onNodeSelect = useCallback((event) => {
    const nodeId = event.target.id.substring(5);
    const modifiedEdges = [];
    console.log(' nodeId', nodeId);
    for (const edge of edges) {
      if (edge.source === nodeId || edge.target === nodeId) {
        modifiedEdges.push({ ...edge, style: { stroke: 'red' } });
      }
      else {
        modifiedEdges.push({ ...edge, style: { stroke: 'black' } });
      }

    }
    setEdges(modifiedEdges)
    // return setEdges((eds) => applyEdgeChanges(modifiedEdges, eds))
  }, [edges])

  const onConnect = useCallback(
    (connection) => { console.log("connection ", connection); return setEdges((eds) => addEdge(connection, eds)) },
    [setEdges]
  );
    console.log('edges ', edges);
  return (
    <div style={{ height: '100vh', width: '100vw'}}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        // onEdgeUpdate={onEdgesChange}
        onConnect={onConnect}
        // fitView
        onNodeClick={onNodeSelect}
      />
    </div>
  )
}

export default App;

// const initialNodes = [
//   {
//     id: 'A',
//     type: 'group',
//     data: { label: null },
//     position: { x: 50, y: 0 },
//     style: {
//       width: 170,
//       height: 140,
//     },
//   },

//   { id: 'node-1', type: 'cNode', position: { x: 0, y: 0 }, data: { label: 123, id: 'node-1' } },
//   {
//     id: 'node-2',
//     type: 'cNode',
//     targetPosition: 'top',

//     // position: { x: 0, y: 200 },
//     data: { label: 'node 2', id: 'node-2' },
//   },
//   {
//     id: 'node-3',
//     type: 'cNode',
//     targetPosition: 'top',
//     // position: { x: 200, y: 200 },
//     data: { label: 'node 3', id: 'node-3' },
//     parentNode: 'A',
//     extent: 'parent',
//   },
//   {
//     id: 'node-4',
//     type: 'cNode',
//     targetPosition: 'top',
//     // position: { x: 200, y: 200 },
//     data: { label: 'node 4', id: 'node-4' },
//   },
//   {
//     id: 'node-5',
//     type: 'cNode',
//     targetPosition: 'top',
//     // position: { x: 200, y: 200 },
//     data: { label: 'node 5', id: 'node-5' },
//   },
//   {
//     id: 'node-6',
//     type: 'cNode',
//     targetPosition: 'top',
//     // position: { x: 200, y: 200 },
//     data: { label: 'node 6', id: 'node-6' },
//   },
// ];


// const initialEdges = [
//   { id: 'A', source: 'node-3', target: 'node-2', handle: 'a', style: { stroke: 'black' } },
//   { id: 'edge-1', source: 'node-1', target: 'node-2', handle: 'a', style: { stroke: 'black' } },
//   { id: 'edge-2', source: 'node-1', target: 'node-3', handle: 'a', style: { stroke: 'black' } },
//   { id: 'edge-3', source: 'node-1', target: 'node-3', handle: 'a', style: { stroke: 'black' } },
//   { id: 'edge-3', source: 'node-3', target: 'node-2', handle: 'a', style: { stroke: 'black' } },
//   { id: 'edge-3', source: 'node-3', target: 'node-4', handle: 'a', style: { stroke: 'black' } },

//   { id: 'edge-4', source: 'node-3', target: 'node-6', handle: 'a', style: { stroke: 'black' } },
//   { id: 'edge-5', source: 'node-2', target: 'node-5', handle: 'a', style: { stroke: 'black' } },
//   { id: 'edge-5', source: 'node-3', target: 'node-5', handle: 'a', style: { stroke: 'black' } },


// ];

// const graph = {
//   "node-2": [{ id: 'edge-1', source: 'node-1', target: 'node-2', handle: 'a' },],
//   "node-1": [{ id: 'edge-1', source: 'node-1', target: 'node-2', handle: 'a' },
//   { id: 'edge-2', source: 'node-1', target: 'node-3', handle: 'a' }]
// }