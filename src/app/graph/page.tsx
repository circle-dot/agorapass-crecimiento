"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { fetchAttestations, fetchAggregateAttestations } from "@/lib/fetchers/attestations";
import ReactDOM from 'react-dom';
import { useRouter } from 'next/navigation';

const ForceGraph3DWrapper = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph3D), {
    ssr: false,
    loading: () => <p>Loading 3D Graph...</p>
});

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};

interface Attestation {
    attester: string;
    recipient: string;
}

interface Node {
    id: string;
    score: number;
}

interface Link {
    source: string;
    target: string;
}

const RankingsGraph: React.FC = () => {
    const graphRef = useRef<HTMLDivElement>(null);
    const { width, height } = useWindowSize();
    const router = useRouter();

    // Fetch attestations data
    const { data: attestations, isLoading, isError } = useQuery({
        queryKey: ['attestations'],
        queryFn: () => fetchAttestations(0, 500),
        placeholderData: [],
    });

    useEffect(() => {
        if (isLoading || isError || !attestations) return;

        const initGraph = async () => {
            const nodes: Node[] = [];
            const links: Link[] = [];
            const nodeMap = new Map<string, Node>();

            attestations.forEach((attestation: Attestation) => {
                if (!nodeMap.has(attestation.attester)) {
                    nodeMap.set(attestation.attester, { id: attestation.attester, score: 0 });
                }
                if (!nodeMap.has(attestation.recipient)) {
                    nodeMap.set(attestation.recipient, { id: attestation.recipient, score: 0 });
                }
                nodeMap.get(attestation.attester)!.score += 1;
                nodeMap.get(attestation.recipient)!.score += 1;
                links.push({
                    source: attestation.attester,
                    target: attestation.recipient
                });
            });

            nodes.push(...nodeMap.values());

            const data = { nodes, links };

            if (graphRef.current) {
                const Graph = ForceGraph3DWrapper;
                const graphElement = (
                    <Graph
                        graphData={data}
                        nodeAutoColorBy="id"
                        nodeLabel="id"
                        linkDirectionalParticles={2}
                        linkDirectionalParticleSpeed={0.005}
                        onNodeClick={(node: any) => {
                            // Handle node click (e.g., focus camera on node)
                            if (typeof node.x === 'number' && typeof node.y === 'number' && typeof node.z === 'number') {
                                // // Access the graph instance through ref instead of using graphInstance
                                // if (graphRef.current) {
                                //     const graphInstance = (graphRef.current as any).__graphInstance;
                                //     graphInstance.cameraPosition(
                                //         { x: node.x, y: node.y, z: node.z },
                                //         node,
                                //         3000
                                //     );
                                // }
                            }
                            // Direct to the user's profile
                            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
                            router.push(`${baseUrl}/address/${node.id}`);
                        }}
                        width={width}
                        height={height}
                        d3AlphaDecay={0.01}
                        d3VelocityDecay={0.1}
                        backgroundColor="#c2c2c2"
                        linkColor={() => "blue"}
                        nodeVal={(node) => node.score}
                        // @ts-ignore
                        nodeLabel={(node) => `
                            <div style="
                                background-color: rgba(0,0,0,0.8);
                                color: white;
                                padding: 5px;
                                border-radius: 5px;
                                font-weight: bold;
                                transform: translateY(-20px);
                            ">
                                ${node.id} 
                                </br>
                                (Score: ${node.score})
                            </div>
                        `}
                    />
                );

                ReactDOM.render(graphElement, graphRef.current);
            }
        };

        initGraph();

        return () => {
            if (graphRef.current) {
                ReactDOM.unmountComponentAtNode(graphRef.current);
            }
        };
    }, [attestations, width, height, isLoading, isError, router]);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading data...</p>;

    return <div ref={graphRef} style={{ backgroundColor: 'white', width: '100%', height: '100%' }} />;
};

const RankingsPage: React.FC = () => {
    return (
        <div className="w-full h-screen bg-white">
            <RankingsGraph />
        </div>
    );
};

export default RankingsPage;
