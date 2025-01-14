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

            if (clientId === 'client23832') {
                console.log(coordinates);
                // Split the data by commas
                const splitData = coordinates.split(',');
                var integerValue1 = 0
                var integerValue2 = 0
                var integerValue3 = 0
                var Long = 0
                var Lat = 0

                // Check if index 4 exists

                // Convert the 4th index (0-based index 3) to an integer
                Long = parseFloat(splitData[0]);
                Lat = parseFloat(splitData[1]);
                integerValue1 = parseInt(splitData[2], 10);
                integerValue2 = parseInt(splitData[3], 10);
                integerValue3 = parseInt(splitData[4], 10);

                // if (!isNaN(integerValue1)) {
                //     console.log("Integer value:", integerValue);
                // } else {
                //     console.error("The value at index 4 is not a valid integer.");
                // }

                // If the clientId matches, join the corresponding room in Socket.IO
                const roomId = '67437be2b177696c9afb3594'; // Room ID associated with this client
                console.log(`Client joined room: ${roomId}`);

                // Find the socket corresponding to the client (you can store client sockets)
                // Emit a message to the room or do something else
                io.emit('message', {
                    userId: roomId,
                    Long,
                    Lat,
                    integerValue1,
                    integerValue2,
                    integerValue3,
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