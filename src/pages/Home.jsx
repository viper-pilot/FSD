import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function SciFiComputerRoom() {
  const { scene } = useGLTF('/models/sci-fi_computer_room.glb');
  
  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.transparent = false;
        node.material.opacity = 1;
        node.material.depthWrite = true;
        node.material.depthTest = true;
        if (node.material.map) {
          node.material.map.anisotropy = 16;
        }
      }
    });
  }, [scene]);
  
  return (
    <Center>
      <primitive
        object={scene}
        scale={[1.8, 1.8, 1.8]}
        position={[0, -1.5, 0]}
        rotation={[0, Math.PI / 4, 0]}
      />
    </Center>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner">
        <div className="spinner-inner"></div>
      </div>
      <p>Initializing AI Environment</p>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-container">
      {isLoading && <LoadingScreen />}
      
      {/* Fullscreen 3D Model Background */}
      <Canvas className="fullscreen-canvas" shadows dpr={[1, 2]}>
        <color attach="background" args={['#0a0a14']} />
        <fog attach="fog" args={['#0a0a14', 5, 20]} />
        
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 3.5]}
          fov={40}
          near={0.1}
          far={100}
        />
        
        <ambientLight intensity={0.8} color="#c0caf5" />
        <directionalLight
          position={[5, 7, 5]}
          intensity={1.5}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-3, 3, 2]} intensity={1} color="#7aa2f7" />
        <spotLight
          position={[2, 6, 4]}
          intensity={1.2}
          angle={0.6}
          penumbra={0.8}
          color="#7aa2f7"
          castShadow
        />
        
        <Suspense fallback={null}>
          <SciFiComputerRoom />
          <Environment preset="night" />
        </Suspense>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Canvas>

      {/* Particle Overlay */}
      <div className="particle-overlay"></div>
      
      {/* UI Elements */}
      <header className="main-header">
        <div className="logo">
          <span className="logo-icon"></span>
          <span className="logo-text">QUANTUM</span>
        </div>
        <nav className="nav-links">
          <button onClick={() => navigate('/login')} className="nav-login">Login</button>
        </nav>
      </header>

      {/* Hero Content */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="tech-lines left"></div>
          <div className="tech-lines right"></div>
          
          <h1>AI RESUME CLASSIFIER</h1>
          <div className="subtitle-container">
            <h2>SMART ANALYSIS FOR A SMARTER CAREER</h2>
            <div className="animated-bar"></div>
          </div>
          
          <p>Transform your resume with cutting-edge AI technology designed to highlight your strengths and optimize your career potential.</p>
          
          <div className="feature-highlights">
            <div className="feature">
              <div className="feature-icon scan-icon"></div>
              <span>AI Scanning</span>
            </div>
            <div className="feature">
              <div className="feature-icon match-icon"></div>
              <span>Job Matching</span>
            </div>
            <div className="feature">
              <div className="feature-icon insights-icon"></div>
              <span>Smart Insights</span>
            </div>
          </div>
          
          <div className="cta-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate('/signup')}
            >
              <span className="btn-text">GET STARTED</span>
              <span className="btn-icon">→</span>
            </button>
          </div>
          
          <div className="tech-accent"></div>
        </div>
      </div>
      
      {/* Bottom decorative elements */}
      <div className="bottom-accent">
        <div className="data-line"></div>
      </div>
    </div>
  );
}