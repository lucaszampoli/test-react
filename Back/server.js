const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io');

const config = require('./config/db');

// Usando o padrão do Node em vez da biblioteca de promise do Mongoose
mongoose.Promise = global.Promise;

// conectando no banco
mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

let db = mongoose.connection;

db.on('open', () => {
  console.log('Connected to the database.');
});

db.on('error', (err) => {
  console.log(`Database error: ${err}`);
});

// iniciando o express
const app = express();

// usando isso para o middleware de limite de taxa 
// See: https://github.com/nfriedly/express-rate-limit
app.enable('trust proxy');

// Definir a pasta pública usando o middleware express.static integrado
app.use(express.static('public'));

// Definir middleware de analisador de corpo
app.use(bodyParser.json());

// Habilitar o acesso de origem cruzada por meio do middleware CORS
// Apenas para servidor de desenvolvimento React!
if (process.env.CORS) {
  app.use(cors());
}

// Inicializar middleware de rotas
app.use('/api/notices', require('./routes/notices'));

// Usando o middleware de tratamento de erros padrão do Express
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ err: err });
});

// Start do server
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


const io = socket(server);
let online = 0;

io.on('connection', (socket) => {
  online++;
  console.log(`Socket ${socket.id} connected.`);
  console.log(`Online: ${online}`);
  io.emit('visitor enters', online);

  socket.on('add', data => socket.broadcast.emit('add', data));
  socket.on('update', data => socket.broadcast.emit('update', data));
  socket.on('delete', data => socket.broadcast.emit('delete', data));

  socket.on('disconnect', () => {
    online--;
    console.log(`Socket ${socket.id} disconnected.`);
    console.log(`Online: ${online}`);
    io.emit('visitor exits', online);
  });
});
