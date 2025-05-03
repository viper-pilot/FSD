import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const skills = ['React', 'Three.js', 'Node.js', 'MongoDB', 'JavaScript', 'CSS'];

export default function SkillsOrbit() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        const x = Math.sin(angle) * 5;
        const z = Math.cos(angle) * 5;
        
        return (
          <mesh key={skill} position={[x, 0, z]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>
        );
      })}
    </group>
  );
}