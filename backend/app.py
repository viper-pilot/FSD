from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import fitz  # PyMuPDF
import os
import tempfile

app = Flask(__name__)
CORS(app)  # This allows your React frontend to make requests to this Flask API

# Load model components
MODEL_PATH = 'ml_model_nb.pkl'
TFIDF_PATH = 'tfidf_vectorizer_nb.pkl'
LABEL_ENCODER_PATH = 'label_encoder_nb.pkl'

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(TFIDF_PATH, 'rb') as f:
        tfidf = pickle.load(f)
    with open(LABEL_ENCODER_PATH, 'rb') as f:
        label_encoder = pickle.load(f)
    print("Model and components loaded successfully!")
except Exception as e:
    print(f"Error loading model components: {str(e)}")
    # You could initialize these as None and check before using them

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return ""

@app.route('/predict', methods=['POST'])
def predict():
    # Check if a file was uploaded
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['resume']
    
    # Check if the file has a name (i.e., was actually selected)
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Create a temporary file to save the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
            temp_path = temp.name
            file.save(temp_path)
        
        # Extract text from the PDF
        text = extract_text_from_pdf(temp_path)
        
        # Remove temporary file after processing
        os.unlink(temp_path)
        
        if not text:
            return jsonify({'error': 'Could not extract text from PDF'}), 400
        
        # Vectorize the text
        vector = tfidf.transform([text])
        
        # Predict probabilities
        probabilities = model.predict_proba(vector)[0]
        
        # Format predictions
        predictions = [
            {'name': label, 'value': round(float(prob) * 100, 2)}
            for label, prob in zip(label_encoder.classes_, probabilities)
        ]
        
        # Get top prediction
        predicted_class = label_encoder.inverse_transform([model.predict(vector)[0]])[0]
        
        return jsonify({
            'predictions': predictions,
            'predicted_class': predicted_class,
            'text_length': len(text)  # Just for debugging
        })
    
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

# Test route to check if the server is running
@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Server is up and running!'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)