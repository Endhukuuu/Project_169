const net = require('net');

function probeHost(host, port, timeoutMs = 2000) {
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

async function test() {
    console.log('Testing probe...');
    const localOk = await probeHost('127.0.0.1', 27017, 1000);
    console.log('Local 27017 reachable:', localOk);
    const atlasOk = await probeHost('cluster0-shard-00-00.r8hvabb.mongodb.net', 27017, 2000);
    console.log('Atlas reachable:', atlasOk);
}

test();
