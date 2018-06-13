'use strict';

const express = require('express');
const app = express();

const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;
const ERROR_TEXT = 'Me no comprendo';

// Sources
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const apiai = require('apiai')(APIAI_TOKEN);

const io = require('socket.io')(server);
io.on('connection', function(socket) {
  socket.on('speech_received', (text) => {
    // Get a reply from API.AI
    const request = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    request.on('response', (response) => {
      const aiText = response.result.fulfillment.speech;
      // Send the result back to the browser
      socket.emit('bot_reply', aiText);
    });

    request.on('error', (error) => {
      socket.emit('bot_reply', ERROR_TEXT);
    });

    apiaiReq.end();
  });
});
