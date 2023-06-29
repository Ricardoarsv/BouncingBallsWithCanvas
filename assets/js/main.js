// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// function to modelate balls
function Ball(x, y, speedX, speedY, color, size) {
  this.x = x; // horizontal position
  this.y = y; // vertical position
  this.speedX = speedX; // Horizontal speed
  this.speedY = speedY; // Vertical speed
  this.color = color; // Ball color
  this.size = size; // Ball size
}

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.update = function () {
  this.x += this.speedX;
  this.y += this.speedY;

  if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
    this.reverseX();
    playCollisionSound();
    changeBackgroundToWhite();
  }

  if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
    this.reverseY();
    playCollisionSound();
    changeBackgroundToWhite();
  }
};

Ball.prototype.reverseX = function () {
  this.speedX = -this.speedX;
};

Ball.prototype.reverseY = function () {
  this.speedY = -this.speedY;
};

let balls = [];

Ball.prototype.collisionDetect = function() {
    for (var j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        var dx = this.x - balls[j].x;
        var dy = this.y - balls[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          return;
        }
      }
    }
  
    if ((this.x + this.size) >= width || (this.x - this.size) <= 0 || (this.y + this.size) >= height || (this.y - this.size) <= 0) {
      this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
      changeBackgroundToWhite();
      playCollisionSound();
    }
  };

let RangeValue = document.getElementById("range").value;
let Counter = 1;
let SpeedY = -2;
let SpeedX = 2;

let isChangingBackground = false;
let backgroundTimeout;
let soundTimeout;

function changeBackgroundToWhite() {
  if (!isChangingBackground) {
    isChangingBackground = true;
    ctx.fillStyle = '#0D0D0D';
    ctx.fillRect(0, 0, width, height);

    clearTimeout(backgroundTimeout);
    backgroundTimeout = setTimeout(function () {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, width, height);
      isChangingBackground = false;
    }, 100);
  }
}

function playCollisionSound() {
  clearTimeout(soundTimeout);
  soundTimeout = setTimeout(function () {
    const audio = new Audio('/assets/Sounds/CollisionSound.mp3');
    audio.volume = 0.01;
    audio.play();
  }, 0);
}

document.getElementById("range").addEventListener("input", function () {
  RangeValue = Number(this.value);
  SpeedX = RangeValue;
  SpeedY = -RangeValue;

  for (var i = 0; i < balls.length; i++) {
    if (balls[i].speedX < 0) {
      balls[i].speedX = -RangeValue;
    } else {
      balls[i].speedX = RangeValue;
    }

    if (balls[i].speedY < 0) {
      balls[i].speedY = -RangeValue;
    } else {
      balls[i].speedY = RangeValue;
    }
  }
});

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  while (balls.length < Counter) {
    let size = random(10, 20);
    let ball = new Ball(
      random(0 + size, width - size),
      random(0 + size, height - size),
      SpeedX,
      SpeedY, 
      'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
      size
    );
    balls.push(ball);
  }

  for (var i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();

    balls[i].x += balls[i].speedX; // Actualiza la posición horizontal
    balls[i].y += balls[i].speedY; // Actualiza la posición vertical
  }

  requestAnimationFrame(loop);
}

loop();

let ClickInAdd = document.getElementById("Add");
let ClickInMinus = document.getElementById("Minus");

ClickInAdd.addEventListener("click", addBalls);
ClickInMinus.addEventListener("click", MinusBalls);

function addBalls() {
  Counter++;

  let size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    SpeedX,
    SpeedY, 
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
    size
  );
  balls.push(ball);
}

function MinusBalls() {
  if (Counter > 0) {
    Counter--;
    balls.pop(); // Elimina la última pelota del arreglo
  }

  for (var i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();

    balls[i].x += balls[i].speedX; // Actualiza la posición horizontal
    balls[i].y += balls[i].speedY; // Actualiza la posición vertical
  }
}
