
const express = require('express');
const cors = require('cors');
const oracleMetrics = require('./oracleMetrics');

const app = express();
const port = 3000;

app.use(cors());

app.get('/cpu', async (req, res) => {
    let conn;
    try {
        conn = await oracleMetrics.getConnection();
        const data = await oracleMetrics.getCpuUsage(conn);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.get('/memory', async (req, res) => {
    let conn;
    try {
        conn = await oracleMetrics.getConnection();
        const data = await oracleMetrics.getMemoryUsage(conn);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.get('/storage', async (req, res) => {
    let conn;
    try {
        conn = await oracleMetrics.getConnection();
        const data = await oracleMetrics.getStorageUsage(conn);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
