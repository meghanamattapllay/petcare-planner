import React, { useState, useEffect } from 'react';
import { checkApiHealth } from '../api/apiClient';

export default function ApiStatusBadge() {
  const [status, setStatus] = useState('checking');
  const [healthData, setHealthData] = useState(null);

  const testConnection = async () => {
    setStatus('checking');
    const res = await checkApiHealth();
    if (res.success) {
      setStatus('online');
      setHealthData(res.data);
    } else {
      setStatus('offline');
    }
  };

  useEffect(() => {
    testConnection();
    const interval = setInterval(testConnection, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-badge-container" title="Backend Integration Status">
      <div className={`status-indicator ${status}`}>
        <span className="dot"></span>
        <span className="status-text">
          {status === 'online' ? 'API Online' : status === 'offline' ? 'API Offline' : 'Connecting...'}
        </span>
      </div>
      <button className="btn-refresh" onClick={testConnection} title="Refresh API status">
        ↻
      </button>
    </div>
  );
}
