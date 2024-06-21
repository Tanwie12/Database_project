// src/components/MemoryUsage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const MemoryUsage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/memory')
            .then(response => {
                const rows = response.data;
                const components = rows.map(row => row[0]);
                const sizes = rows.map(row => row[1]);
                setData([{ labels: components, values: sizes, type: 'pie' }]);
            })
            .catch(error => console.error('Error fetching memory data:', error));
    }, []);

    return (
        <div>
            <h2>Memory Usage</h2>
            <Plot data={data} layout={{ title: 'Memory Usage' }} />
        </div>
    );
};

export default MemoryUsage;
