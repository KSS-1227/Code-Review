import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import "prismjs/themes/prism-tomorrow.css";
import Markdown from 'react-markdown';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import prism from 'prismjs';
import './Dashboard.css';

function Dashboard() {
  const [code, setCode] = useState(`function sum(){\n    return 1 + 2\n  }`);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user, logout } = useAuth();

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    if (!code.trim()) {
      setReview('Please enter some code to review.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data);
    } catch (error) {
      console.error('Error getting code review:', error);
      if (error.response?.status === 401) {
        setReview('Session expired. Please log in again.');
        logout();
      } else {
        setReview('Error: Unable to get code review. Please check if the server is running.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Code Review Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="content-container">
          <div className="left-panel">
            <div className="code-section">
              <h3>Your Code</h3>
              <div className="code-editor">
                <Editor
                  value={code}
                  onValueChange={setCode}
                  highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
                  padding={20}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 16,
                    minHeight: '400px',
                    background: '#2d3748',
                    color: '#e2e8f0',
                    borderRadius: '8px',
                  }}
                  textareaClassName="code-textarea"
                />
              </div>
              <button 
                className="review-btn" 
                onClick={reviewCode}
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Get AI Review'}
              </button>
            </div>
          </div>
          
          <div className="right-panel">
            <div className="review-section">
              <h3>AI Review Results</h3>
              <div className="review-content">
                {isLoading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Analyzing your code...</p>
                  </div>
                ) : (
                  <Markdown>{review || 'Submit your code to get an AI-powered review with suggestions for improvement.'}</Markdown>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
