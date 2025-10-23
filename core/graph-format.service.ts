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

        // MASSIVE SPACING
        dagreGraph.setGraph({
            rankdir: 'TB',
            align: 'UL',
            nodesep: 300,        // HUGE horizontal spacing
            edgesep: 200,        // HUGE edge spacing
            ranksep: 350,        // HUGE vertical spacing
            marginx: 150,
            marginy: 150,
            acyclicer: 'greedy',
            ranker: 'network-simplex'
        });

        const allNodes = [
            ...graphNodes,
            ...c1Outputs.map(c1 => ({ ...c1, type: 'c1' })),
            ...c2Subcategories.map(c2 => ({ ...c2, type: 'c2' }))
        ];

        allNodes.forEach((node: any) => {
            // MASSIVE WIDTHS AND HEIGHTS
            const labelLength = node.label?.length || 10;
            const baseWidth = 400;  // HUGE increase from 250
            const width = Math.max(baseWidth, Math.min(labelLength * 12, 600));
            
            let height = 120;  // HUGE increase
            if (node.type === 'c1') {
                height = 180;  // MASSIVE for C1
            } else if (node.type === 'c2') {
                height = 150;  // MASSIVE for C2
            }

            dagreGraph.setNode(node.id, { 
                width, 
                height,
                rank: node.type === 'c1' ? 0 : node.type === 'c2' ? 1 : 2
            });
        });

        // Build edges
        const allEdges: GraphEdge[] = [];

        c2Subcategories.forEach(c2 => {
            allEdges.push({
                id: `c1-${c2.c1CategoryId}-to-c2-${c2.id}`,
                source: c2.c1CategoryId,
                target: c2.id,
                label: 'contains'
            });
        });

        c2Subcategories.forEach(c2 => {
            c2.nodeIds.forEach(nodeId => {
                allEdges.push({
                    id: `c2-${c2.id}-to-node-${nodeId}`,
                    source: c2.id,
                    target: nodeId,
                    label: 'contains'
                });
            });
        });

        c2Relationships.forEach(rel => {
            const sourceId = c2NameToIdMap.get(rel.fromC2);
            const targetId = c2NameToIdMap.get(rel.toC2);
            if (sourceId && targetId) {
                allEdges.push({
                    id: rel.id,
                    source: sourceId,
                    target: targetId,
                    label: rel.label
                });
            }
        });

        crossC1C2Relationships.forEach(rel => {
            const sourceId = c2NameToIdMap.get(rel.fromC2);
            const targetId = c2NameToIdMap.get(rel.toC2);
            if (sourceId && targetId) {
                allEdges.push({
                    id: rel.id,
                    source: sourceId,
                    target: targetId,
                    label: rel.label
                });
            }
        });

        allEdges.push(...graphEdges);

        allEdges.forEach((edge) => {
            if (edge) {
                dagreGraph.setEdge(edge.source, edge.target, {
                    weight: edge.label === 'contains' ? 2 : 1,
                    minlen: edge.label === 'contains' ? 1 : 3
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
