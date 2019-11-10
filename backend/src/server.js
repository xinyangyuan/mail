process.env.NODE_ENV || require('dotenv').config(); // load environmental variable from .env if no NODE_ENV specified
const http = require('http');
const debug = require('debug')('mail-api');
const app = require('./app'); // express app

// Normalize a port into a number, string, or false.
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// Event listener for HTTP server "error" event.
const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Event listener for HTTP server "listening" event.
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${bind}`.cyan.bold);
};

// Setup Express App Port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Setup Server
const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
