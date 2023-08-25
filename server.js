const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {EventEmitter} = require('events');

const app = express();
const emitter = new EventEmitter();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs'); // Set the default view engine
app.set('views', 'views');
const PORT = 3002;

app.get('/get-subscription', (req, res, next) => {
  res.render('subscribe');
});

app.get('/make-subscription', (req, res, next) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Close the connection when the client disconnects
  req.on('close', () => {
    emitter.off('userAdd', onUserAdd);
  });

  const onUserAdd = (data) => {
    res.write(`data: ${data}\n\n`); // Correctly format the SSE message
  };

  emitter.on('userAdd', onUserAdd);
  // res.send('registered')
});

app.get('/add', (req, res, next) => {
  emitter.emit('userAdd', 'user has been added '+Math.random());
  res.send('User added successfully');  
});


// ##################################
app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`)
})
