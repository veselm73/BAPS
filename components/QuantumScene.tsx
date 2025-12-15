/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// --- VISUALIZATION: TRACKING TRAILS ---

type Point = [number, number, number];

const TrailParticle: React.FC<{ position: Point; delay: number }> = ({ position, delay }) => {
  const ref = useRef<THREE.Group>(null);
  
  // Generate a random curve path
  const points = useMemo(() => {
    const pts: Point[] = [];
    const steps = 50;
    let cx = position[0];
    let cy = position[1];
    let cz = position[2];
    for (let i = 0; i < steps; i++) {
        pts.push([cx, cy, cz]);
        cx += (Math.random() - 0.5) * 0.5;
        cy += (Math.random() - 0.5) * 0.5;
        cz += (Math.random() - 0.5) * 0.5;
    }
    return pts;
  }, [position]);

  useFrame((state) => {
    if (ref.current) {
        // Slow rotation of the whole group
        ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={ref}>
        {/* The Particle */}
        <Sphere args={[0.08, 16, 16]} position={points[0]}>
             <meshStandardMaterial color="#2563EB" emissive="#2563EB" emissiveIntensity={0.8} />
        </Sphere>
        {/* The Trail - Using tuple points for stability */}
        <Line 
            points={points} 
            color="#2563EB" 
            opacity={0.3} 
            transparent 
            lineWidth={1} 
        />
    </group>
  );
};

export const HeroScene: React.FC = () => {
  // Generate random starting positions
  const particles = useMemo(() => {
      return Array.from({length: 20}).map(() => ({
          pos: [
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 5
          ] as Point,
          delay: Math.random() * 2
      }))
  }, []);

  return (
    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#2563EB" />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
           {particles.map((p, i) => (
               <TrailParticle key={i} position={p.pos} delay={p.delay} />
           ))}
        </Float>
      </Canvas>
    </div>
  );
};

// --- VISUALIZATION: OPTIMIZATION GRAPH ---

export const GraphNetworkScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#F1F5F9']} />
        <ambientLight intensity={1} />
        <spotLight position={[5, 5, 5]} intensity={1} color="#2563EB" />
        
        <Float rotationIntensity={0.2} floatIntensity={0.1} speed={0.5}>
            <GraphStructure />
        </Float>
      </Canvas>
    </div>
  );
}

const GraphStructure = () => {
    // Create layers of nodes
    const layers = [-2, 0, 2];
    const nodesPerLayer = 4;
    
    // Use tuples [x, y, z] instead of Vector3 to prevent drei Line crashes
    const nodes = useMemo(() => {
        const n: Point[] = [];
        for(let x of layers) {
            for(let i=0; i<nodesPerLayer; i++) {
                n.push([x, (i - 1.5) * 1.5, (Math.random()-0.5)]);
            }
        }
        return n;
    }, []);

    const connections = useMemo(() => {
        const lines: Point[][] = [];
        
        // Connect layers
        // Layer 1 -> Layer 2
        for(let i=0; i<nodesPerLayer; i++) { 
            const start = nodes[i];
            const targetIndex1 = nodesPerLayer + Math.floor(Math.random() * nodesPerLayer);
            const targetIndex2 = nodesPerLayer + Math.floor(Math.random() * nodesPerLayer);
            
            if (nodes[targetIndex1]) lines.push([start, nodes[targetIndex1]]);
            if (nodes[targetIndex2]) lines.push([start, nodes[targetIndex2]]);
        }
        
        // Layer 2 -> Layer 3
        for(let i=nodesPerLayer; i<nodesPerLayer*2; i++) { 
             const start = nodes[i];
             const targetIndex1 = (nodesPerLayer*2) + Math.floor(Math.random() * nodesPerLayer);
             
             if (nodes[targetIndex1]) lines.push([start, nodes[targetIndex1]]);
        }
        return lines;
    }, [nodes]);

    return (
        <group rotation={[0, Math.PI/6, 0]}>
            {/* Nodes */}
            {nodes.map((pos, i) => (
                <Sphere key={`n-${i}`} position={pos} args={[0.15, 16, 16]}>
                    <meshStandardMaterial color="#1e293b" />
                </Sphere>
            ))}

            {/* Edges */}
            {connections.map((line, i) => (
                <Line 
                    key={`l-${i}`}
                    points={line}
                    color={i % 3 === 0 ? "#2563EB" : "#94a3b8"} // Highlight optimal path in Blue
                    lineWidth={i % 3 === 0 ? 3 : 1}
                    transparent
                    opacity={i % 3 === 0 ? 1 : 0.3}
                />
            ))}
        </group>
    )
}