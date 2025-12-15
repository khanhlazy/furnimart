'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import 3D components to avoid SSR and BVH issues
const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), { ssr: false });
const OrbitControls = dynamic(() => import('@react-three/drei').then((mod) => mod.OrbitControls), { ssr: false });
const PerspectiveCamera = dynamic(() => import('@react-three/drei').then((mod) => mod.PerspectiveCamera), { ssr: false });
const Environment = dynamic(() => import('@react-three/drei').then((mod) => mod.Environment), { ssr: false });

interface Product3DViewerProps {
  modelUrl?: string;
}

// Simple 3D viewer without BVH dependencies
function SimpleModel() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function Product3DViewer({ modelUrl }: Product3DViewerProps) {
  if (!modelUrl) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛋️</div>
          <p className="text-gray-600">Không có mô hình 3D</p>
          <p className="text-sm text-gray-500 mt-2">Chế độ xem 2D chỉ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden relative">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />

          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

          {/* Simple placeholder model */}
          <SimpleModel />

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />

          {/* Environment for better lighting */}
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
      
      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
        <p>🖱️ Kéo để xoay • 🔍 Scroll để zoom • 🖱️ Giữ để di chuyển</p>
      </div>
    </div>
  );
}
