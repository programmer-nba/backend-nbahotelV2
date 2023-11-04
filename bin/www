#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('..');
var debug = require('debug')('backend-nbahotel:server');
var http = require('http');
var whitelist = require('./whitelist')

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

const { Server } = require("socket.io");



 const io = new Server(server,{
    cors: {
      origin: whitelist,
      methods: 'GET,PUT,PATCH,POST,DELETE',
      credentials: true,
    }
  });

  
io.path="/socket.io/";

io.on('connection', socket => {
  console.log('a user connected');

  //booking
  socket.on('sendUpdateBooking',function(data) {
    io.emit('bookingUpdate', data)
  })
});

//import collection
const {Booking} = require('../models/booking.schema');
const {Hotel} = require('../models/hotel.schema');
const {Task}= require('../models/task.schema');

  Booking.watch().on('change',data=> {
    console.log('new booking');
  
      io.emit('newbooking',{event:'newbooking'})

  })

  Hotel.watch().on('change',data=> {
    console.log('new hotel');
  
      io.emit('newhotel',{event:'newhotel'})

  })

 Task.watch().on('change',async (data)=>{

        io.emit('newtask',{event:'newtask'}) 

 })


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
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
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
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
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
