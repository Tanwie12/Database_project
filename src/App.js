import React, { useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import './App.css';
import CpuUsage from './components/CpuUsage';

function App() {
  const [initialUsage, setInitialUsage] = useState(null);
  const [postUsage, setPostUsage] = useState(null);
  const [message, setMessage] = useState('');

  const createLargeTable = async () => {
    try {
      const response = await axios.get('http://localhost:5000/create-large-table');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error creating large table:', error);
    }
  };

//   const partitionLargeTable = async () => {
//     try {
//       await axios.post('http://localhost:5000/partition-large-table');
//       const updatedUsage = await fetchSystemUsage();
//       setPostUsage(updatedUsage);
//     } catch (error) {
//       console.error('Error partitioning table:', error);
//     }
//   };

  const fetchSystemUsage = async () => {
    try {
      const response = await axios.get('http://localhost:5000/system-usage');
      return response.data;
    } catch (error) {
      console.error('Error fetching system usage:', error);
    }
  };

  const handleOptimize = async () => {
    try {
      await axios.post('http://localhost:5000/optimize');
      const postOptimizationUsage = await fetchSystemUsage();
      setPostUsage(postOptimizationUsage);
    } catch (error) {
      console.error('Error optimizing database:', error);
    }
  };

  const handleCheckUsage = async () => {
    const initialUsage = await fetchSystemUsage();
    setInitialUsage(initialUsage);
  };

  const plotUsage = (usageData, title) => {
    if (!usageData) return null;

    const memorySGA = usageData.memory.sga[0][1];
    const memoryPGA = usageData.memory.pga[0][1];
    const cpuUsage = usageData.cpu.map(row => ({ x: row[0], y: row[1] }));;
    const storageUsage = usageData.storage.map(row => ({ x: row[0], y: row[1] }));

    return (
      <div>
        <h3>{title}</h3>
        <Plot
          data={[
            {
              x: ['SGA', 'PGA', ],
              y: [memorySGA, memoryPGA,],
              type: 'bar',
              marker: { color: 'blue' },
            },
          ]}
          layout={{
            title: 'Memory Usage',
            xaxis: { title: 'Component' },
            yaxis: { title: 'Usage (MB / CPU cycles)' },
          }}
        />
        <Plot
          data={[
            {
              x: storageUsage.map(item => item.x),
              y: storageUsage.map(item => item.y),
              type: 'bar',
              marker: { color: 'green' },
            },
          ]}
          layout={{
            title: 'Storage Usage',
            xaxis: { title: 'Table' },
            yaxis: { title: 'Size (MB)' },
          }}
        />
        <Plot
          data={[
            {
              x: cpuUsage.map(item => item.x),
              y: cpuUsage.map(item => item.y),
              type: 'bar',
              mode: 'lines+markers',
              marker: { color: 'red' },
            },
          ]}
          layout={{
            title: 'CPU Usage Over Time',
            xaxis: { title: 'Time' },
            yaxis: { title: 'CPU cycles' },
          }}
        />

      </div>
    );
  };

  return (
    <div className="App">
      <h1>Oracle System Usage</h1>
      <div className="button-container">
        <button onClick={createLargeTable}>Create Large Table</button>
        {/* <button onClick={partitionLargeTable}>Partition Large Table</button> */}
        <button onClick={handleCheckUsage}>Check Initial Usage</button>
        <button onClick={handleOptimize}>Optimize Database</button>
      </div>
      {message && <div className="message">{message}</div>}
      <div className="plot-container">
        {initialUsage && plotUsage(initialUsage, 'Initial System Usage')}
        {postUsage && plotUsage(postUsage, 'Post-Optimization System Usage')}
      </div>
      <div className="footer">
        <p>Created by.........H</p>
      </div>
    
    </div>
  );
}

export default App;
