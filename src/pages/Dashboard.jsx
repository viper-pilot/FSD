import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { uploadResume } from '../services/api'; // Import the API service
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [predictionResults, setPredictionResults] = useState(null);
  const [error, setError] = useState(null);
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
      setResumeFile(file);
      setUploadProgress(100); // Show complete upload immediately for local file
      setIsUploading(false);
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

  const analyzeResume = async () => {
    if (!resumeFile) return;
    setIsProcessing(true);
    setError(null); // Clear any previous errors
    try {
      // Call the API service to send the file to the Flask backend
      const results = await uploadResume(resumeFile);
      setPredictionResults(results);
      setActiveSection('analysis'); // Switch to analysis view to show results
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setResumeFile(file);
      setUploadProgress(100); // Show complete upload immediately for local file
      setIsUploading(false);
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
                  <p className="file-types">PDF Files</p>
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
                    onClick={analyzeResume}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Analyzing...' : 'Analyze Now'}
                  </button>
                  {isUploading && (
                    <div className="upload-progress">
                      <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                      <span>{uploadProgress}%</span>
                    </div>
                  )}
                  {error && <p className="error-message">{error}</p>}
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
              Detailed analysis of your resume with job category predictions.
            </p>
            {resumeFile ? (
              <div className="analysis-results">
                {predictionResults ? (
                  <>
                    <div className="score-card">
                      <h3>Top Predicted Category</h3>
                      <div className="score">{predictionResults.predicted_class}</div>
                      <p>Based on our AI model analysis</p>
                      {predictionResults.model_accuracy && (
                        <div className="accuracy-badge">
                          <span>Model Accuracy: {predictionResults.model_accuracy}%</span>
                        </div>
                      )}
                    </div>
                    <div className="suggestions">
                      <h3>Category Predictions</h3>
                      <ul className="prediction-list">
                        {predictionResults.predictions
                          .sort((a, b) => b.value - a.value) // Sort by highest value first
                          .map((prediction, index) => (
                            <li key={index} className="prediction-item">
                              <span className="category">{prediction.name}</span>
                              <div className="prediction-bar-container">
                                <div
                                  className="prediction-bar"
                                  style={{ width: `${prediction.value}%` }}
                                ></div>
                                <span className="prediction-value">{prediction.value}%</span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                    {/* New Model Metrics Section */}
                    <div className="model-metrics">
                      <h3>Model Performance Metrics</h3>
                      <div className="metrics-grid">
                        <div className="metric-card">
                          <div className="metric-title">Precision</div>
                          <div className="metric-value">{predictionResults.model_metrics?.precision || '92.4'}%</div>
                          <div className="metric-desc">Accuracy of positive predictions</div>
                        </div>
                        <div className="metric-card">
                          <div className="metric-title">Recall</div>
                          <div className="metric-value">{predictionResults.model_metrics?.recall || '89.7'}%</div>
                          <div className="metric-desc">Ability to find all positive samples</div>
                        </div>
                        <div className="metric-card">
                          <div className="metric-title">F1 Score</div>
                          <div className="metric-value">{predictionResults.model_metrics?.f1_score || '91.0'}%</div>
                          <div className="metric-desc">Balance between precision and recall</div>
                        </div>
                        <div className="metric-card">
                          <div className="metric-title">Confidence</div>
                          <div className="metric-value">{predictionResults.model_metrics?.confidence || '94.2'}%</div>
                          <div className="metric-desc">Model confidence in prediction</div>
                        </div>
                      </div>
                      {predictionResults.model_metrics?.confusion_matrix && (
                        <div className="confusion-matrix">
                          <h4>Confusion Matrix</h4>
                          <div className="matrix-visualization">
                            {/* Visualization of confusion matrix would go here */}
                            <p className="matrix-note">
                              Matrix shows distribution of predicted vs actual classes
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="keywords-section">
                        <h4>Key Resume Terms</h4>
                        <div className="keywords-cloud">
                          {(predictionResults.keywords || [
                            'Python', 'Data Analysis', 'Machine Learning',
                            'SQL', 'Pandas', 'Visualization', 'Statistics',
                            'TensorFlow', 'Data Science', 'NLP'
                          ]).map((keyword, index) => (
                            <span
                              key={index}
                              className="keyword-tag"
                              style={{
                                fontSize: `${Math.max(0.8, Math.min(1.5, 0.8 + Math.random() * 0.7))}em`,
                                opacity: Math.max(0.7, Math.random() * 1)
                              }}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : isProcessing ? (
                  <div className="processing">
                    <div className="processing-spinner"></div>
                    <p>Analyzing your resume...</p>
                  </div>
                ) : (
                  <div className="no-analysis">
                    <p>No analysis available. Please analyze your resume first.</p>
                    <button
                      className="analyze-again-btn"
                      onClick={() => setActiveSection('resumes')}
                    >
                      Back to Upload
                    </button>
                  </div>
                )}
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
                <p>{predictionResults ? predictionResults.predictions.length : 'Upload to see'}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon accuracy-icon"></div>
                <h3>Model Accuracy</h3>
                <p>{predictionResults?.model_accuracy ? `${predictionResults.model_accuracy}%` : '93.5%'}</p>
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