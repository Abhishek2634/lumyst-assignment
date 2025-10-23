import type { GraphNode, GraphEdge, C1Output, C2Subcategory } from './types';

export class ReactFlowService {
    convertDataToReactFlowDataTypes(
        graphNodes: GraphNode[],
        c1Nodes: C1Output[],
        c2Nodes: C2Subcategory[],
        edges: GraphEdge[]
    ) {
        const reactFlowNodes = [
            // Regular nodes - BIG BOXES, BIG FONTS
            ...graphNodes.map((node) => ({
                id: node.id,
                position: node.position || { x: 0, y: 0 },
                data: { label: node.label },
                type: 'default',
                style: {
                    background: '#dbeafe',
                    border: '3px solid #3b82f6',
                    color: '#1e40af',
                    borderRadius: '16px',
                    padding: '24px',
                    fontSize: '20px',      // HUGE font
                    fontWeight: '600',
                    width: '380px',        // HUGE width
                    minHeight: '110px',    // HUGE height
                    textAlign: 'center',
                    lineHeight: '1.6',
                    wordWrap: 'break-word',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
            })),
            
            // C1 nodes - MASSIVE BOXES, MASSIVE FONTS
            ...c1Nodes.map((node) => ({
                id: node.id,
                position: node.position || { x: 0, y: 0 },
                data: { label: node.label },
                type: 'default',
                style: {
                    background: '#fef2f2',
                    border: '5px solid #dc2626',
                    color: '#991b1b',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    padding: '32px',
                    fontSize: '26px',      // MASSIVE font
                    width: '450px',        // MASSIVE width
                    minHeight: '160px',    // MASSIVE height
                    textAlign: 'center',
                    lineHeight: '1.7',
                    letterSpacing: '1px',
                    wordWrap: 'break-word',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                },
            })),
            
            ...c2Nodes.map((node) => ({
                id: node.id,
                position: node.position || { x: 0, y: 0 },
                data: { label: node.label },
                type: 'default',
                style: {
                    background: '#f0fdf4',
                    border: '4px solid #16a34a',
                    color: '#166534',
                    borderRadius: '18px',
                    padding: '28px',
                    fontSize: '22px',    
                    fontWeight: '700',
                    width: '420px',        
                    minHeight: '135px',    
                    textAlign: 'center',
                    lineHeight: '1.6',
                    wordWrap: 'break-word',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                },
            }))
        ];

        const reactFlowEdges = edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.label,
            type: edge.label === 'contains' ? 'straight' : 'smoothstep',
            style: edge.label === 'contains'
                ? { 
                    stroke: '#9ca3af', 
                    strokeDasharray: '10,10',
                    strokeWidth: 3,       
                    opacity: 0.6 
                }
                : edge.id.startsWith('c2_relationship')
                ? { 
                    stroke: '#059669', 
                    strokeWidth: 4,       
                    opacity: 0.8 
                }
                : edge.id.startsWith('cross_c1_c2_rel')
                ? { 
                    stroke: '#d97706', 
                    strokeWidth: 4,       
                    opacity: 0.8 
                }
                : { 
                    stroke: '#64748b', 
                    strokeWidth: 3,      
                    opacity: 0.7 
                },
            labelStyle: { 
                fill: '#1e293b', 
                fontWeight: '800',         
                fontSize: '18px',         
                background: '#ffffff',
                padding: '6px 12px',      
                borderRadius: '8px',
                border: '2px solid #e2e8f0'
            },
            animated: edge.label !== 'contains',
        }));

        return {
            nodes: reactFlowNodes,
            edges: reactFlowEdges,
        };
    }
}
