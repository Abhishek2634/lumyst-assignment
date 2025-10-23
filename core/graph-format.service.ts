import dagre from 'dagre';
import type { GraphNode, GraphEdge, C1Output, C2Subcategory, C2Relationship, CrossC1C2Relationship } from './types';

export class GraphFormatService {
    layoutCategoriesWithNodes(
        graphNodes: GraphNode[],
        graphEdges: GraphEdge[],
        c1Outputs: C1Output[],
        c2Subcategories: C2Subcategory[],
        c2Relationships: C2Relationship[],
        crossC1C2Relationships: CrossC1C2Relationship[]
    ) {
        const c2NameToIdMap = new Map<string, string>();
        c2Subcategories.forEach(c2 => {
            c2NameToIdMap.set(c2.c2Name, c2.id);
        });

        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));

        // IMPROVED LAYOUT CONFIGURATION
        dagreGraph.setGraph({
            rankdir: 'TB',
            align: 'UL',
            nodesep: 200,
            edgesep: 150,
            ranksep: 250,
            marginx: 100,
            marginy: 100,
            acyclicer: 'greedy',
            ranker: 'network-simplex'
        });

        const allNodes = [
            ...graphNodes,
            ...c1Outputs.map(c1 => ({ ...c1, type: 'c1' })),
            ...c2Subcategories.map(c2 => ({ ...c2, type: 'c2' }))
        ];

        // DYNAMIC NODE SIZES
        allNodes.forEach((node: any) => {
            const labelLength = node.label?.length || 10;
            const baseWidth = 350;
            const width = Math.max(baseWidth, Math.min(labelLength * 10, 500));
            
            let height = 100;
            if (node.type === 'c1') {
                height = 140;
            } else if (node.type === 'c2') {
                height = 120;
            }

            dagreGraph.setNode(node.id, { 
                width, 
                height,
                rank: node.type === 'c1' ? 0 : node.type === 'c2' ? 1 : 2
            });
        });

        // BUILD EDGES WITH SAFETY CHECKS
        const allEdges: GraphEdge[] = [
            ...graphEdges,
            // C1 to C2 edges
            ...c2Subcategories.map(c2 => ({
                id: `c1-${c2.c1CategoryId}-to-c2-${c2.id}`,
                source: c2.c1CategoryId,
                target: c2.id,
                label: 'contains'
            })),
            // C2 to node edges (WITH SAFETY CHECK)
            ...c2Subcategories.flatMap(c2 => {
                // Check if nodeIds exists and is an array
                if (!c2.nodeIds || !Array.isArray(c2.nodeIds)) {
                    return [];
                }
                return c2.nodeIds.map(nodeId => ({
                    id: `c2-${c2.id}-to-node-${nodeId}`,
                    source: c2.id,
                    target: nodeId,
                    label: 'contains'
                }));
            }),
            // C2 relationships
            ...c2Relationships.map(rel => {
                const sourceId = c2NameToIdMap.get(rel.fromC2);
                const targetId = c2NameToIdMap.get(rel.toC2);
                return sourceId && targetId ? {
                    id: rel.id,
                    source: sourceId,
                    target: targetId,
                    label: rel.label
                } : null;
            }).filter((edge): edge is GraphEdge => edge !== null),
            // Cross C1-C2 relationships
            ...crossC1C2Relationships.map(rel => {
                const sourceId = c2NameToIdMap.get(rel.fromC2);
                const targetId = c2NameToIdMap.get(rel.toC2);
                return sourceId && targetId ? {
                    id: rel.id,
                    source: sourceId,
                    target: targetId,
                    label: rel.label
                } : null;
            }).filter((edge): edge is GraphEdge => edge !== null)
        ];

        allEdges.forEach((edge) => {
            if (edge) {
                dagreGraph.setEdge(edge.source, edge.target, {
                    weight: edge.label === 'contains' ? 2 : 1,
                    minlen: edge.label === 'contains' ? 1 : 2
                });
            }
        });

        dagre.layout(dagreGraph);

        const positionedGraphNodes = graphNodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            return {
                ...node,
                position: {
                    x: nodeWithPosition.x - nodeWithPosition.width / 2,
                    y: nodeWithPosition.y - nodeWithPosition.height / 2,
                },
            };
        });

        const positionedC1Nodes = c1Outputs.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            return {
                ...node,
                position: {
                    x: nodeWithPosition.x - nodeWithPosition.width / 2,
                    y: nodeWithPosition.y - nodeWithPosition.height / 2,
                },
            };
        });

        const positionedC2Nodes = c2Subcategories.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            return {
                ...node,
                position: {
                    x: nodeWithPosition.x - nodeWithPosition.width / 2,
                    y: nodeWithPosition.y - nodeWithPosition.height / 2,
                },
            };
        });

        return {
            graphNodes: positionedGraphNodes,
            c1Nodes: positionedC1Nodes,
            c2Nodes: positionedC2Nodes,
            edges: allEdges,
        };
    }
}
