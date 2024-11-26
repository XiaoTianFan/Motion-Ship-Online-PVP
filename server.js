// server.js

/* Install socket.io and config server
npm init -y
npm install express socket.io
node server.js
*/

/* Install mkcert and generate CERT for https
choco install mkcert
mkcert -install
mkcert <your_local_IP> localhost 127.0.0.1 ::1
mv <localIP>+2.pem server.pem
mv <localIP>+2-key.pem server-key.pem
mkdir certs
mv server.pem certs/
mv server-key.pem certs/
*/

const express = require('express');
const https = require('https');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs'); // Required for reading directory contents

const app = express();

// Path to SSL certificates
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'server-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.pem')),
};

// Create HTTPS server
const httpsServer = https.createServer(sslOptions, app);
// Initialize Socket.io
const io = socketIo(httpsServer);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle client connections
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Listen for broadcast messages from clients
  socket.on('broadcast', (data) => {
    // console.log(`Broadcast from ${socket.id}:`, data);
    // Emit the data to all other connected clients
    socket.broadcast.emit('broadcast', data);
  });

  // Handle client disconnections
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start HTTPS server
const PORT = 3000; // Use desired port
httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server listening on port ${PORT}`);
});