import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, updateEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './components/Node/Node'
import { useState, useCallback } from 'react';
import dagre from 'dagre';
import fileToDep from './FilePathToDep'
import { MarkerType } from 'reactflow';
import FrontPage from './frontPage.jpg'
import SecondPage from './secondPage.jpg'
import ContactUs from './contactUs.jpg'
import TextField from '@mui/material/TextField';

import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';

const getNodesAndEdges = () => {


  const fPaths = Object.keys(fileToDep);
  const edgeInclude = new Set()
  // console.log(fPaths)
  const nodes = [];
  const edges = [];
  for (const fPath of fPaths) {
    const arr = fPath.split('/');
    const fileName = arr[arr.length - 1];
    const node = {
      id: fPath,
      type: 'cNode',
      data: { label: fileName, id: fPath },

    }
    nodes.push(node)
    for (const depFilePath of fileToDep[fPath]) {

      if (edgeInclude.has(fPath + depFilePath) || edgeInclude.has(fPath + depFilePath)) {
        continue;
      }
      const edge = {
        id: fPath + depFilePath,
        source: fPath,
        target: depFilePath,
        // handle: 'b',
        sourceHandle: "b",
        style: {
          stroke: 'black',
          strokeWidth: 2,
          stroke: 'black',
        },
        targetHandle: 'a',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: 'black',
        },
      }
      edges.push(edge)
    }
  }

  return { initialNodes: nodes, initialEdges: edges };
}


const { initialEdges, initialNodes } = getNodesAndEdges();
const nodeTypes = { cNode: CustomNode };
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 230;
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

function App() {
  const [showPlayground, setPlayGround] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [nodes, setNodes] = useState(layoutedNodes);
  const [edges, setEdges] = useState(layoutedEdges);

  const onNodesChange = useCallback(
    (changes) => {
      return setNodes((nds) => applyNodeChanges(changes, nds))
    },
    []
  );

  const onNodeSelect = (event) => {
    const nodeId = event.target.id.substring(5);
    console.log(nodeId);
    const modifiedEdges = [];
    console.log(' nodeId', nodeId);
    for (const edge of edges) {
      if (edge.source === nodeId || edge.target === nodeId) {
        console.log(edge)
        modifiedEdges.push({
          ...edge, style: {
            stroke: 'black',
            strokeWidth: 2,
            stroke: '#FF0072',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#FF0072',
          },
        });
      }
      else {
        modifiedEdges.push({
          ...edge, style: {
            stroke: 'black',
            strokeWidth: 2,
            stroke: 'black',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: 'black',
          },
        });
      }

    }
    setEdges(modifiedEdges)
    // return setEdges((eds) => applyEdgeChanges(modifiedEdges, eds))
  }

  const onConnect = useCallback(
    (connection) => { console.log("connection ", connection); return setEdges((eds) => addEdge(connection, eds)) },
    [setEdges]
  );
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'auto', background:'black' }}>
      <img src={FrontPage} style={{ height: '100vh', width: '95vw' }} />

      <div style={{ background: 'black' }}>
        <h1 style={{color:'white', margin:'24px', marginLeft:'120px'}}>
          Demo
        </h1>
        <div style={{display:'flex', gap:'12px',  margin:'24px', marginLeft:'120px'}}>

          <input
            id="outlined-required"
            label="Path To Directory"
            style={{width:'50vw', background:'white', padding:'24px'}}
            placeholder="Path To Directory"
          />
          <Button variant="outlined" style={{padding:'24px', background:'white'}} onClick = {()=>{setShowLoading(true)
            setTimeout(()=>{
              setShowLoading(false);
              setPlayGround(true);
            }, 3000)
          }}>Generate Map</Button>
        </div>
      </div>
      <div style={{minHeight:'80vh', height:'80vh', background:showPlayground?'white':'black', border:'1px solid black', borderRadius:'30px', margin:'24px'}}>
        {showLoading &&  <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> }
        {showPlayground && <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          // onEdgeUpdate={onEdgesChange}
          onConnect={onConnect}
          fitView
          onNodeClick={onNodeSelect}
        />}
      </div>
      <img src={SecondPage} style={{ height: '100vh', width: '95vw', marginTop: '24px' }} />
      
      {/* <img src={ContactUs} style={{ height: '50vh', width: '50vw', marginTop: '24px', margin:'auto', }} /> */}

    </div>
  )
}

export default App;