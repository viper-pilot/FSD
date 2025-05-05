// src/services/api.js

const API_URL = 'http://localhost:5001'; // Change this if your Flask server runs on a different URL

export const uploadResume = async (file) => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('resume', file);
    
    // Send the file to the Flask backend
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: formData,
      // No need to set Content-Type header, fetch sets it automatically with the correct boundary for FormData
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};