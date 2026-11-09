const mongoose = require('mongoose');
const net = require('net');
const dns = require('dns');

// On Windows systems, local DNS frequently rejects/fails SRV record queries for mongodb+srv://
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
    console.warn('DNS server override warning:', e.message);
}

const LOCAL_FALLBACK_URI = 'mongodb://127.0.0.1:27017/udih_platform';

function probeHost(host, port = 27017, timeoutMs = 2000) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(timeoutMs);
        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });
        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        socket.on('error', () => {
            socket.destroy();
            resolve(false);
        });
        socket.connect(port, host);
    });
}

const connectDB = async () => {
    const atlasUri = process.env.MONGODB_URI;

    // 1. Probe Atlas cluster availability first
    if (atlasUri) {
        // Extract host or test shard host
        const isSrv = atlasUri.includes('mongodb+srv://');
        const hostMatch = atlasUri.match(/@([^/?#]+)/);
        const host = hostMatch ? hostMatch[1] : null;

        console.log('[Database] Checking MongoDB Atlas cluster reachability...');
        let atlasReachable = false;
        
        if (host) {
            // Test primary shard or host
            const testHost = isSrv ? `cluster0-shard-00-00.${host.split('@').pop()}` : host.split(':')[0];
            atlasReachable = await probeHost(testHost, 27017, 2000);
        }

        if (atlasReachable) {
            try {
                console.log('[Database] MongoDB Atlas is reachable. Connecting...');
                const conn = await mongoose.connect(atlasUri, {
                    serverSelectionTimeoutMS: 5000,
                    connectTimeoutMS: 5000
                });
                console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
                setupEventHandlers();
                return conn;
            } catch (error) {
                console.warn('[Database Warning] Atlas connect attempt encountered error:', error.message);
            }
        } else {
            console.warn('[Database Notice] MongoDB Atlas cluster is not reachable (Awaiting IP Whitelist in Atlas Network Access).');
            console.log('[Database] Seamlessly engaging local MongoDB instance on port 27017 for 100% full platform persistence...');
        }
    }

    // 2. Connect to local MongoDB instance
    try {
        const conn = await mongoose.connect(LOCAL_FALLBACK_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`[Database] MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
        setupEventHandlers();
        return conn;
    } catch (fallbackError) {
        console.error('[Database Fatal] Both MongoDB Atlas and local fallback connection failed:', fallbackError.message);
        throw fallbackError;
    }
};

const setupEventHandlers = () => {
    mongoose.connection.on('error', (err) => {
        console.error('[Database] MongoDB runtime error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('[Database] MongoDB connection disconnected.');
    });
};

module.exports = connectDB;
