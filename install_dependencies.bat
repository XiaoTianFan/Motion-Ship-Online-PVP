npm init -y
npm install express socket.io
choco install mkcert
mkcert -install
mkcert localhost 127.0.0.1 ::1
mv localhost+2.pem server.pem
mv localhost+2-key.pem server-key.pem
mkdir certs
mv server.pem certs/
mv server-key.pem certs/