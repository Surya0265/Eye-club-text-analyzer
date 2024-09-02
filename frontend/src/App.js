import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const vantaRef = useRef(null);

  useEffect(() => {
    const vantaEffect = window.VANTA.WAVES({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xf6679,
      waveSpeed: 1.85
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileUploaded(true); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStats(response.data);
      setError('');
    } catch (error) {
      setError('Failed to upload and analyze the file.');
    }
  };

  return (
    <div className="App" ref={vantaRef}>
      <header className="App-header">
        <h1>Welcome to Text File Statistics</h1>
        <p>Upload a file to get word count, character count, and the most frequent words.</p>
      </header>
      
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Analyze</button>
      </form>

     
      {fileUploaded && !stats && !error && <p className="status">File ready for analysis</p>}
      
      {error && <p className="error">{error}</p>}
      
      {stats && (
        <div className="stats-container">
          <p style={{ fontWeight: 'bold',color:'black' }}>Word Count: {stats.wordCount}</p>
          <p style={{ fontWeight: 'bold',color:'black' }}>Character Count: {stats.charCount}</p>
          <h3 style={{ fontWeight: 'bold',color:'black' }}>Most Frequent Words:</h3>
          <ul>
            {stats.mostFrequentWords.map(([word, count]) => (
              <li key={word}>{word}: {count}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;








