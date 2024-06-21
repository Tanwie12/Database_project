// src/components/StorageUsage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const StorageUsage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/storage')
            .then(response => {
                const rows = response.data;
                const tablespaceNames = rows.map(row => row[0]);
                const mbUsed = rows.map(row => row[1]);
                setData([{ x: tablespaceNames, y: mbUsed, type: 'bar' }]);
            })
            .catch(error => console.error('Error fetching storage data:', error));
    }, []);

    return (
        <div>
            <h2>Storage Usage</h2>
            <Plot data={data} layout={{ title: 'Storage Usage' }} />
        </div>
    );
};

export default StorageUsage;
