const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="loading-container" style={{ minHeight: '400px' }}>
      <div className="spinner"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
