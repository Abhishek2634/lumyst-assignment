"use client";

import { addEdge, applyEdgeChanges, applyNodeChanges, ReactFlow, Controls, Background, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import { convertDataToGraphNodesAndEdges } from "../core/data/data-converter";
import { GraphFormatService } from "../core/graph-format.service";
import { ReactFlowService } from "../core/react-flow.service";
import { CustomBidirectionalEdge } from "../components/ui/CustomBidirectionalEdge";

const graphFormatService = new GraphFormatService();
const reactFlowService = new ReactFlowService();

const edgeTypes = {
    'custom-bidirectional': CustomBidirectionalEdge,
};

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
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                fitViewOptions={{
                    padding: 0.3,
                    minZoom: 0.02,
                    maxZoom: 1.5
                }}
                minZoom={0.01}
                maxZoom={4}
                style={{ background: "#f8fafc" }}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
            >
                <Controls showInteractive={false} />
                <Background gap={25} size={2} color="#cbd5e1" />
                <MiniMap 
                    nodeStrokeWidth={4}
                    zoomable
                    pannable
                    style={{
                        background: '#f1f5f9',
                        border: '3px solid #cbd5e1',
                        width: '280px',
                        height: '180px'
                    }}
                />
            </ReactFlow>
        </div>
    );
}
