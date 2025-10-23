// components/ui/CustomBidirectionalEdge.tsx
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react';
import { useMemo } from 'react';

export function CustomBidirectionalEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
    markerEnd,
    style,
    data,
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: 0.25,
    });

    const isBidirectional = data?.bidirectional || false;
    const edgeDirection = data?.direction || 'forward';

    const labelOffset = useMemo(() => {
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const angle = Math.atan2(dy, dx);

        if (isBidirectional) {
            const perpendicularAngle = angle + Math.PI / 2;
            const offsetDistance = edgeDirection === 'forward' ? 35 : -35;
            
            return {
                x: Math.cos(perpendicularAngle) * offsetDistance,
                y: Math.sin(perpendicularAngle) * offsetDistance,
            };
        }

        return {
            x: Math.cos(angle + Math.PI / 2) * 20,
            y: Math.sin(angle + Math.PI / 2) * 20,
        };
    }, [sourceX, sourceY, targetX, targetY, isBidirectional, edgeDirection]);

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                {label && (
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX + labelOffset.x}px, ${labelY + labelOffset.y}px)`,
                            pointerEvents: 'all',
                            background: 'white',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: '700',
                            border: '2px solid #e2e8f0',
                            boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
                            color: '#1e293b',
                            whiteSpace: 'nowrap',
                            zIndex: 1000,
                        }}
                        className="nodrag nopan"
                    >
                        {label}
                    </div>
                )}
            </EdgeLabelRenderer>
        </>
    );
}
