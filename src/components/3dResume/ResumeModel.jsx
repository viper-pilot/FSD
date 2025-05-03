import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ResumeModel({ position = [0, 0, 0] }) {
  const meshRef = useRef();
  
  // Add subtle animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[6, 8, 0.5]} />
      <meshStandardMaterial 
        color="#4a8fe7"
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}