/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line, Stars, Environment, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

// Fix for React 18+ / R3F type compatibility
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      meshStandardMaterial: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      color: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      meshStandardMaterial: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      color: any;
    }
  }
}

// --- VISUALIZATION: TRACKING TRAILS ---

const TrailParticle = ({ position, delay }: { position: [number, number, number], delay: number }) => {
  const ref = useRef<THREE.Group>(null);
  // Generate a random curve path
  const points = useMemo(() => {
    const pts = [];
    const steps = 50;
    let cx = position[0];
    let cy = position[1];
    let cz = position[2];
    for (let i = 0; i < steps; i++) {
        pts.push(new THREE.Vector3(cx, cy, cz));
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
        {/* The Trail */}
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
          ] as [number, number, number],
          delay: Math.random() * 2
      }))
  }, []);

  return (
    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
           {particles.map((p, i) => (
               <TrailParticle key={i} position={p.pos} delay={p.delay} />
           ))}
        </Float>

        <Environment preset="city" />
        {/* Subtle background grid or fog effect could go here */}
      </Canvas>
    </div>
  );
};

// --- VISUALIZATION: OPTIMIZATION GRAPH ---
// Nodes and edges representing the hypothesis graph

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
    
    const nodes = useMemo(() => {
        const n = [];
        for(let x of layers) {
            for(let i=0; i<nodesPerLayer; i++) {
                n.push(new THREE.Vector3(x, (i - 1.5) * 1.5, (Math.random()-0.5)));
            }
        }
        return n;
    }, []);

    const connections = useMemo(() => {
        const lines = [];
        // Connect layers randomly
        for(let i=0; i<nodesPerLayer; i++) { // Layer 1
            const start = nodes[i];
            // Connect to 2 random nodes in next layer
            const targetIndex1 = nodesPerLayer + Math.floor(Math.random() * nodesPerLayer);
            const targetIndex2 = nodesPerLayer + Math.floor(Math.random() * nodesPerLayer);
            
            lines.push([start, nodes[targetIndex1]]);
            lines.push([start, nodes[targetIndex2]]);
        }
        
        for(let i=nodesPerLayer; i<nodesPerLayer*2; i++) { // Layer 2
             const start = nodes[i];
             const targetIndex1 = (nodesPerLayer*2) + Math.floor(Math.random() * nodesPerLayer);
             lines.push([start, nodes[targetIndex1]]);
        }
        return lines;
    }, [nodes]);

    return (
        <group rotation={[0, Math.PI/6, 0]}>
            {/* Nodes */}
            {nodes.map((pos, i) => (
                <Sphere key={i} position={pos} args={[0.15, 16, 16]}>
                    <meshStandardMaterial color="#1e293b" />
                </Sphere>
            ))}

            {/* Edges */}
            {connections.map((line, i) => (
                <Line 
                    key={`l-${i}`}
                    points={line}
                    color={i % 3 === 0 ? "#2563EB" : "#94a3b8"} // Highlight optimal path in Blue, others in Slate
                    lineWidth={i % 3 === 0 ? 3 : 1}
                    transparent
                    opacity={i % 3 === 0 ? 1 : 0.3}
                />
            ))}
        </group>
    )
}