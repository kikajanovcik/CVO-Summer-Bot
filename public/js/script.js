'use strict';

const socket = io();

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('result', (e) => {
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('speech_received', text);
});

socket.on('bot_reply', function(replyText) {
  synthVoice(replyText);
});

function synthVoice(text) {
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;

  const synth = window.speechSynthesis;
  synth.speak(utterance);
}
