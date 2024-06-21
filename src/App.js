// src/App.js
import React from 'react';
import CpuUsage from './components/CpuUsage';
import MemoryUsage from './components/MemoryUsage';
import StorageUsage from './components/StorageUsage';

const App = () => {
    return (
        <div className="App">
            <h1>Oracle DB Resource Monitoring Dashboard</h1>
            <CpuUsage />
            <MemoryUsage />
            <StorageUsage />
        </div>
    );
};

export default App;
