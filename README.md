Quantum – 3D Resume Classification Webpage

Quantum is a 3D-enhanced web application built using React and Three.js, integrated with a Python backend for intelligent resume classification.

🚀 Features

🌐 3D interactive frontend using Three.js
⚙️ Python-based backend model for resume classification
📄 Upload and classify resumes in real-time
🔗 Seamless frontend-backend communication
📁 Project Structure

FSD/
│
├── 3d-resume-website/       # Frontend React App with Three.js
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/                 # Python Flask API
│   ├── app.py
│   ├── model/               # Model and utilities
│   ├── requirements.txt
│   └── ...
⚙️ Running the Project

🖥️ Frontend
Navigate to the frontend directory:
cd 3d-resume-website
Install dependencies:
npm install
Start the development server:
npm start
Open your browser and visit:
http://localhost:3000
🧠 Backend (Python API)
Navigate to the backend directory:
cd backend
Set up a virtual environment:
python3 -m venv env
source env/bin/activate
Install dependencies:
pip install -r requirements.txt
Start the Flask server:
python3 app.py
The backend runs at:
http://localhost:5000
📦 Dependencies

🖼️ Frontend
react
three
@react-three/fiber
@react-three/drei
Install with:

npm install three @react-three/fiber @react-three/drei
🧪 Backend
flask
flask-cors
scikit-learn
pandas
joblib
Install with:

pip install flask flask-cors scikit-learn pandas joblib
