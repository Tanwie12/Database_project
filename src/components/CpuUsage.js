// src/components/CpuUsage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const CpuUsage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/cpu')
            .then(response => {
                const rows = response.data;
                const statNames = rows.map(row => row[0]);
                const values = rows.map(row => row[1]);
                setData([{ x: statNames, y: values, type: 'bar' }]);
            })
            .catch(error => console.error('Error fetching CPU data:', error));
    }, []);

    return (
        <div>
            <h2>CPU Usage</h2>
            <Plot data={data} layout={{ title: 'CPU Usage' }} />
        </div>
    );
};

export default CpuUsage;
