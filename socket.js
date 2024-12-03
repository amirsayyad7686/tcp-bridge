const net = require('net');
const ioClient = require('socket.io-client');

// Connect to the existing Socket.IO server
const socketIoServerUrl = 'http://localhost:5201'; // Update this if your server runs elsewhere
const io = ioClient(socketIoServerUrl);

// Port for TCP (net) server
const TCP_PORT = 5202;

// Start the TCP server
const tcpServer = net.createServer((socket) => {

    console.log('New TCP client connected');

    // Handle incoming messages from TCP clients
    socket.on('data', (data) => {

        try {
            // Parse the incoming data (e.g., "client23832:2943.5274,05227.6750,asdasdasd")
            const message = data.toString().trim();
            const [clientId, coordinates] = message.split(":");
            console.log(coordinates);
            // Split the data by commas
            const splitData = coordinates.split(',');

            // Check if index 4 exists
            if (splitData[3]) {
                // Convert the 4th index (0-based index 3) to an integer
                const integerValue = parseInt(splitData[3], 10);

                if (!isNaN(integerValue)) {
                    console.log("Integer value:", integerValue);
                } else {
                    console.error("The value at index 4 is not a valid integer.");
                }
            } else {
                console.error("Index 4 does not exist in the data.");
            }
            if (clientId === 'client23832') {
                // If the clientId matches, join the corresponding room in Socket.IO
                const roomId = '67437be2b177696c9afb3594'; // Room ID associated with this client
                console.log(`Client joined room: ${roomId}`);

                // Find the socket corresponding to the client (you can store client sockets)
                // Emit a message to the room or do something else
                io.emit('message', {
                    userId: roomId,
                    component_id: '674eb927133796980ce232cb',
                    component_value: integerValue,
                    component_type: 'Sensor',
                    node_id: 'dac5e546-4ed0-423a-8110-1f7e695680ce',
                    user_id: '67437be2b177696c9afb3594'
                });
            } else {
                // If the clientId doesn't match, block the IP
                console.log(`Blocking IP: ${socket.remoteAddress}`);
                socket.end(); // Close the socket to block the client
            }
        } catch (err) {
            console.error('Error processing data:', err);
            socket.end(); // Ensure we end the connection on errors
        }
    });

    socket.on('error', (err) => {
        console.error('TCP socket error:', err);
    });

    socket.on('end', () => {
        console.log('TCP client disconnected');
    });
});

// Start the TCP server
tcpServer.listen(TCP_PORT, () => {
    console.log(`TCP server listening on port ${TCP_PORT}`);
});

// Handle Socket.IO client connection errors
io.on('connect_error', (err) => {
    console.error('Error connecting to Socket.IO server:', err);
});

io.on('connect', () => {
    console.log('Connected to Socket.IO server at', socketIoServerUrl);
});