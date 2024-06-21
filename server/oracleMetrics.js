// oracleMetrics.js
const oracledb = require('oracledb');

async function getConnection() {
    return await oracledb.getConnection({
        user: 'system',
        password: '1234Adey',
        connectString: 'localhost/mike'
    });
}

async function getCpuUsage(conn) {
    const result = await conn.execute(`
       SELECT * FROM (
            SELECT username, sid, 
                   ROUND((cpu_usage / (
                       SELECT SUM(value) total_cpu_usage
                       FROM gv$sesstat t
                       INNER JOIN gv$session s ON (t.sid = s.sid)
                       INNER JOIN gv$statname n ON (t.statistic# = n.statistic#)
                       WHERE n.name LIKE '%CPU used by this session%'
                       AND NVL(s.sql_exec_start, s.prev_exec_start) >= SYSDATE - 1 / 24
                   )) * 100, 2) cpu_usage_per_cent, 
                   module_info, client_info
            FROM (
                SELECT NVL(s.username, 'Oracle Internal Proc.') username, s.sid, t.value cpu_usage, 
                       NVL(s.module, s.program) module_info, 
                       DECODE(s.osuser, 'oracle', s.client_info, s.osuser) client_info
                FROM gv$sesstat t
                INNER JOIN gv$session s ON (t.sid = s.sid)
                INNER JOIN gv$statname n ON (t.statistic# = n.statistic#)
                WHERE n.name LIKE '%CPU used by this session%'
                AND NVL(s.sql_exec_start, s.prev_exec_start) >= SYSDATE - 1 / 24
            ) s1
        )
        ORDER BY cpu_usage_per_cent DESC
    `);
    return result.rows;
}

async function getMemoryUsage(conn) {
    const result = await conn.execute(`
        SELECT component, current_size
        FROM V$SGAINFO
    `);
    return result.rows;
}

async function getStorageUsage(conn) {
    const result = await conn.execute(`
        SELECT tablespace_name, SUM(bytes) / 1024 / 1024 AS mb_used
        FROM DBA_SEGMENTS
        GROUP BY tablespace_name
    `);
    return result.rows;
}

module.exports = { getConnection, getCpuUsage, getMemoryUsage, getStorageUsage };
