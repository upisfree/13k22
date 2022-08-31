// фоновый шум (бас)
// длинные гудки в телефонной трубке
// бум-бум как фон бас
// create web audio api context
let audioCtx = new AudioContext();

// http://outputchannel.com/post/recreating-phone-sounds-web-audio/

// create Oscillator node
let oscillator = audioCtx.createOscillator();

oscillator.type = 1;
oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
oscillator.connect(audioCtx.destination);

// setTimeout(() => {
//   oscillator.start();
// }, 1000);

console.log(audioCtx, oscillator);