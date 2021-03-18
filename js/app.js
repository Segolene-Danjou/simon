const app = {

  colors: [
    {
      name: 'red', 
      soundUrl: 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'
    },
    {
      name: 'green', 
      soundUrl: 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'
    },
    {
      name: 'blue', 
      soundUrl: 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'
    },
    {
      name: 'yellow', 
      soundUrl: 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
    }
  ],

  errorSoundUrl: 'https://s3.amazonaws.com/adam-recvlohe-sounds/error.wav',

  sequence: [],

  playerIndex: 0,

  score: 0,
  

  drawCells: function () {
    for (const color of app.colors) {
      let cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = color.name;
      cell.style.backgroundColor = color.name;
      app.playground.appendChild(cell);
    }
  },

  playgroundClickHandler(evt) {
    const clickElem = evt.target;
    const isCell = clickElem.classList.contains('cell');
    if (isCell) {
      clearTimeout(app.timer);

      app.timer = setTimeout(app.gameOver, 5000);
      const color = clickElem.id;
      app.bumpCell(color);
      if (color === app.sequence[app.playerIndex]) {
        if (app.playerIndex < (app.sequence.length - 1)) {
          app.score++;
          console.log('score après couleur : ', app.score);
          app.playerIndex++;
        } else {
          app.score++; 
          app.score += app.sequence.length;
          console.log('score après séquence de ' + app.sequence.length + ' : ', app.score);
          app.nextMove();
        }
      } else {
        app.gameOver();
      }
    }
  },

  nextMove() {
    const random = Math.floor(Math.random() * app.colors.length);
    const color = app.colors[random].name;
    app.sequence.push(color);
    console.log('app.sequence', app.sequence);
    app.playerIndex = 0;
    clearTimeout(app.timer);
    app.simonSays(app.sequence, true);
  },

  bumpCell: function (color) {
    const currentColorObj = app.colors.find(colorObj => colorObj.name === color);

    currentColorObj.sound.play();
    document.getElementById(color).style.borderWidth = '45px';
    setTimeout(() => {
      document.getElementById(color).style.borderWidth = '0';
    }, 150);

  },

  newGame: function () {
    app.score = 0;
    app.sequence = [];
    for (let index = 0; index < 3; index++) {
      const random = Math.floor(Math.random() * app.colors.length);
      app.sequence.push(app.colors[random].name);
    }

    app.simonSays(app.sequence, true);
  },

  simonSays: function (sequence, firstCall) {

    if (firstCall) {
      app.playground.removeEventListener('click', app.playgroundClickHandler);
      app.showMessage("Mémorisez la séquence");
    }

    if (sequence && sequence.length) {
      setTimeout(app.bumpCell, 500, sequence[0]);
      setTimeout(app.simonSays, 850, sequence.slice(1), false);
    } else if (sequence && sequence.length === 0) {
      app.showMessage("Reproduisez la séquence");
      app.timer = setTimeout(app.gameOver, 5000);
      app.playground.addEventListener('click', app.playgroundClickHandler);
    }
  },

  init: function () {
    console.log('init');

    app.playground = document.getElementById('playground');
    app.drawCells();

    app.errorSound = document.createElement('audio');
    app.errorSound.src = app.errorSoundUrl;
    for(const color of app.colors){
      color.sound = document.createElement('audio');
      color.sound.src = color.soundUrl;
    }

    app.startButton = document.getElementById('go');
    app.startButton.addEventListener('click', app.newGame);
  },

  showMessage: function (message) {
    document.getElementById('message').innerHTML = message;
    app.startButton.classList.add('hidden');
  },

  hideMessage: function () {
    document.getElementById('message').innerHTML = '';
    app.startButton.classList.remove('hidden');
  },

  gameOver() {
    app.errorSound.play();
    alert(`Partie terminée. Votre score : ${app.score}`);
    app.hideMessage();
    app.sequence = [];
    app.playground.removeEventListener('click', app.playgroundClickHandler);
    clearTimeout(app.timer);
  },

};

document.addEventListener('DOMContentLoaded', app.init);