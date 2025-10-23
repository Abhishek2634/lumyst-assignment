"use client";

import { addEdge, applyEdgeChanges, applyNodeChanges, ReactFlow, Controls, Background, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import { convertDataToGraphNodesAndEdges } from "../core/data/data-converter";
import { GraphFormatService } from "../core/graph-format.service";
import { ReactFlowService } from "../core/react-flow.service";

const graphFormatService = new GraphFormatService();
const reactFlowService = new ReactFlowService();

const {
    graphNodes,
    graphEdges,
    c1Output,
    c2Subcategories,
    c2Relationships,
    crossC1C2Relationships
} = convertDataToGraphNodesAndEdges();

const layoutedData = graphFormatService.layoutCategoriesWithNodes(
    graphNodes,
    graphEdges,
    c1Output,
    c2Subcategories,
    c2Relationships,
    crossC1C2Relationships
);

const { nodes: initialNodes, edges: initialEdges } = reactFlowService.convertDataToReactFlowDataTypes(
    layoutedData.graphNodes,
    layoutedData.c1Nodes,
    layoutedData.c2Nodes,
    layoutedData.edges,
);

export default function App() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    return (
        <div style={{ width: "100vw", height: "100vh", background: "#f8fafc" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                fitViewOptions={{
                    padding: 0.3,              // INCREASED padding for better view
                    minZoom: 0.03,             // DECREASED min zoom (can zoom out more)
                    maxZoom: 1.5               // INCREASED max zoom (can zoom in more)
                }}
                minZoom={0.01}
                maxZoom={3}                    // INCREASED from 2 to 3
                defaultEdgeOptions={{
                    animated: false,
                    style: { strokeWidth: 2 }   // INCREASED default edge width
                }}
                style={{ background: "#f8fafc" }}
                // ADDED: Better node drag behavior
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
            >
                <Controls showInteractive={false} />
                <Background 
                    gap={20}                    // INCREASED grid spacing
                    size={2}                    // INCREASED grid dot size
                    color="#cbd5e1"
                />
                <MiniMap 
                    nodeStrokeWidth={4}         // INCREASED minimap node border
                    zoomable
                    pannable
                    style={{
                        background: '#f1f5f9',
                        border: '2px solid #cbd5e1'
                    }}
                />
            </ReactFlow>
        </div>
    );
}
