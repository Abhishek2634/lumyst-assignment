import type { GraphNode, GraphEdge, C1Output, C2Subcategory } from './types';

export class ReactFlowService {
    convertDataToReactFlowDataTypes(
        graphNodes: GraphNode[],
        c1Nodes: C1Output[],
        c2Nodes: C2Subcategory[],
        edges: GraphEdge[]
    ) {
        const reactFlowNodes = [
            ...graphNodes.map((node) => ({
                id: node.id,
                position: node.position || { x: 0, y: 0 },
                data: { label: node.label },
                type: 'default',
                style: {
                    background: '#dbeafe',
                    border: '3px solid #3b82f6',
                    color: '#1e40af',
                    borderRadius: '12px',
                    padding: '20px',
                    fontSize: '18px',
                    fontWeight: '600',
                    width: '340px',
                    minHeight: '90px',
                    textAlign: 'center',
                    lineHeight: '1.5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
            })),
            ...c1Nodes.map((node) => ({
                id: node.id,
                position: node.position || { x: 0, y: 0 },
                data: { label: node.label },
                type: 'default',
                style: {
                    background: '#fef2f2',
                    border: '4px solid #dc2626',
                    color: '#991b1b',
                    fontWeight: 'bold',
                    borderRadius: '16px',
                    padding: '28px',
                    fontSize: '24px',
                    width: '420px',
                    minHeight: '130px',
                    textAlign: 'center',
                    lineHeight: '1.6',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                },
            })),
            ...c2Nodes.map((node) => ({
                id: node.id,
                position: node.position || { x: 0, y: 0 },
                data: { label: node.label },
                type: 'default',
                style: {
                    background: '#f0fdf4',
                    border: '3px solid #16a34a',
                    color: '#166534',
                    borderRadius: '14px',
                    padding: '24px',
                    fontSize: '20px',
                    fontWeight: '700',
                    width: '380px',
                    minHeight: '110px',
                    textAlign: 'center',
                    lineHeight: '1.5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                },
            }))
        ];

        // DETECT BIDIRECTIONAL EDGES
        const edgeMap = new Map<string, GraphEdge[]>();
        edges.forEach(edge => {
            const key = [edge.source, edge.target].sort().join('-');
            if (!edgeMap.has(key)) {
                edgeMap.set(key, []);
            }
            edgeMap.get(key)!.push(edge);
        });

        const reactFlowEdges = edges.map((edge) => {
            const edgeKey = [edge.source, edge.target].sort().join('-');
            const edgesForPair = edgeMap.get(edgeKey) || [];
            const isBidirectional = edgesForPair.length > 1;
            const edgeIndex = edgesForPair.findIndex(e => e.id === edge.id);
            const direction = edgeIndex === 0 ? 'forward' : 'backward';

            return {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                label: edge.label,
                type: 'custom-bidirectional',
                data: {
                    bidirectional: isBidirectional,
                    direction: direction,
                },
                style: edge.label === 'contains'
                    ? { stroke: '#9ca3af', strokeDasharray: '8,8', strokeWidth: 2, opacity: 0.6 }
                    : edge.id.startsWith('c2_relationship')
                    ? { stroke: '#059669', strokeWidth: 3, opacity: 0.8 }
                    : edge.id.startsWith('cross_c1_c2_rel')
                    ? { stroke: '#d97706', strokeWidth: 3, opacity: 0.8 }
                    : { stroke: '#64748b', strokeWidth: 2.5, opacity: 0.7 },
                animated: edge.label !== 'contains',
                markerEnd: {
                    type: 'arrowclosed',
                    width: 20,
                    height: 20,
                    color: edge.label === 'contains' ? '#9ca3af'
                          : edge.id.startsWith('c2_relationship') ? '#059669'
                          : edge.id.startsWith('cross_c1_c2_rel') ? '#d97706'
                          : '#64748b',
                },
            };
        });

        return {
            nodes: reactFlowNodes,
            edges: reactFlowEdges,
        };
    }
}
