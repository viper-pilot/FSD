import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import '../styles/dashboard.css';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    setIsUploading(true);
    setResumeFile(file);
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'resumes':
        return (
          <div className="dashboard-section">
            <h2>Upload Resume</h2>
            <p className="section-description">
              Upload your resume for AI-powered analysis and optimization.
            </p>
            <div
              className={`resume-uploader ${resumeFile ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={!resumeFile ? openFileDialog : null}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
              />
              {!resumeFile ? (
                <>
                  <div className="upload-icon"></div>
                  <h3>Drag & drop your resume</h3>
                  <p>or <span className="browse-link">select a file</span></p>
                  <p className="file-types">PDF, DOC, DOCX</p>
                </>
              ) : (
                <>
                  <div className="file-info">
                    <div className="file-icon"></div>
                    <div>
                      <p className="file-name">{resumeFile.name}</p>
                      <p className="file-status">Ready for analysis</p>
                    </div>
                  </div>
                  <button
                    className="analyze-btn"
                    onClick={() => setActiveSection('analysis')}
                  >
                    Analyze Now
                  </button>
                  {isUploading && (
                    <div className="upload-progress">
                      <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                      <span>{uploadProgress}%</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="dashboard-section">
            <h2>Resume Analysis</h2>
            <p className="section-description">
              Detailed analysis of your resume with improvement suggestions.
            </p>
            {resumeFile ? (
              <div className="analysis-results">
                <div className="score-card">
                  <h3>Resume Score</h3>
                  <div className="score">87/100</div>
                  <p>Good, but could be improved</p>
                </div>
                <div className="suggestions">
                  <h3>Key Suggestions</h3>
                  <ul>
                    <li>Add more quantifiable achievements</li>
                    <li>Include relevant keywords for your industry</li>
                    <li>Improve action verb usage</li>
                    <li>Optimize for ATS compatibility</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="no-resume">
                <div className="no-resume-icon"></div>
                <h3>No Resume Uploaded</h3>
                <p>Upload your resume to see detailed analysis</p>
                <button
                  className="upload-again-btn"
                  onClick={() => setActiveSection('resumes')}
                >
                  Upload Resume
                </button>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="dashboard-section">
            <h2>Dashboard Overview</h2>
            <p className="section-description">
              Welcome to your AI Resume Classifier dashboard.
            </p>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon resume-icon"></div>
                <h3>Resumes</h3>
                <p>{resumeFile ? '1 uploaded' : 'None'}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon match-icon"></div>
                <h3>Job Matches</h3>
                <p>{resumeFile ? '24 potential' : 'Upload to see'}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon improve-icon"></div>
                <h3>Improvements</h3>
                <p>{resumeFile ? '4 suggestions' : 'Upload to see'}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Background Canvas - lower z-index */}
      <div className="canvas-container">
        <Canvas className="dashboard-canvas" shadows dpr={[1, 2]}>
          <color attach="background" args={['#0a0a14']} />
          <fog attach="fog" args={['#0a0a14', 5, 20]} />
          <PerspectiveCamera
            makeDefault
            position={[0, 0, 3.5]}
            fov={40}
            near={0.1}
            far={100}
          />
          <ambientLight intensity={1.2} color="#c0caf5" />
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
      </div>
      
      {/* Particle Overlay */}
      <div className="particle-overlay"></div>
      
      {/* Dashboard UI - higher z-index */}
      <div className="dashboard-ui">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-logo">
            <span className="logo-icon"></span>
            <span className="logo-text">QUANTUM</span>
          </div>
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <div className="menu-icon overview-icon"></div>
              <span>Overview</span>
            </button>
            <button
              className={`menu-item ${activeSection === 'resumes' ? 'active' : ''}`}
              onClick={() => setActiveSection('resumes')}
            >
              <div className="menu-icon upload-icon"></div>
              <span>Upload Resume</span>
            </button>
            <button
              className={`menu-item ${activeSection === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveSection('analysis')}
            >
              <div className="menu-icon analysis-icon"></div>
              <span>Analysis</span>
            </button>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <div className="logout-icon"></div>
            <span>Logout</span>
          </button>
        </div>
        
        {/* Main Content */}
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <div className="user-profile">
              <span>{auth.currentUser?.email}</span>
              <div className="user-avatar">
                {auth.currentUser?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          <div className="dashboard-content">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
}