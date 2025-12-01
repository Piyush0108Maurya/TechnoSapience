import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#ff1a1a' }}>
            Oops! Something went wrong
          </h1>
          <p style={{ fontSize: '16px', marginBottom: '20px', maxWidth: '600px', textAlign: 'center' }}>
            An error occurred while rendering the application. Please try refreshing the page.
          </p>
          <details style={{ 
            marginTop: '20px', 
            padding: '10px', 
            backgroundColor: '#1a1a1a', 
            borderRadius: '5px',
            maxWidth: '600px',
            overflow: 'auto'
          }}>
            <summary style={{ cursor: 'pointer', color: '#22d3ee' }}>
              Error Details
            </summary>
            <pre style={{ 
              marginTop: '10px', 
              fontSize: '12px', 
              color: '#ff1a1a',
              overflow: 'auto'
            }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#22d3ee',
              color: '#000000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
