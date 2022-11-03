let canvas;
    let canvasContext;

    let ballX = 50;
    let ballY = 50;
    let ballSpeedX = 10;
    let ballSpeedY = 4;

    let player1Score = 0;
    let player2Score = 0;
    const WIN_SCORE = 3;

    let showingWinScreen = true;

    let paddle1Y = 250;
    let paddle2Y = 250;
    const PADDLE_HEIGHT = 100;
    const PADDLE_WIDTH = 10;


    function handleMouseClick(evt){
      if(showingWinScreen){
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
      }
    }

    // gets mouse location
    function calculateMousePos(evt) {
      let rect = canvas.getBoundingClientRect();
      let root = document.documentElement;
      let mouseX = evt.clientX - rect.left - root.scrollLeft;
      let mouseY = evt.clientY - rect.top - root.scrollTop;
      return {
        x: mouseX,
        y: mouseY
      };
    }
  

    window.onload = function () {

      
      canvas = document.getElementById('gameCanvas');
      canvasContext = canvas.getContext('2d');

      canvasContext.font = "30px Courier New";

      let framesPerSecond = 30;
      setInterval(function () {
        moveEverything();
        drawEverything();
      }, 1000 / framesPerSecond);

      canvas.addEventListener('mousedown', handleMouseClick);

      canvas.addEventListener('mousemove',
        function (evt) {
          let mousePos = calculateMousePos(evt);
          paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
        });

    }

    //centers ball on screen when missed
    function ballReset() {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = -ballSpeedX;
      if (player1Score >= WIN_SCORE || player2Score >= WIN_SCORE){
        showingWinScreen = true;
      }
    }

    //moves right paddle
    function computerMovement(){
      var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
      if (paddle2YCenter < ballY - 35){
        paddle2Y += 6;
      } else if (paddle2YCenter > ballY + 35){
        paddle2Y -= 6;
      }
    }

    //Moves the ball, bounces when hits any edge.
    function moveEverything() {

      if (showingWinScreen) {
        return;
      }
      computerMovement();
      
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      if (ballX < 30) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
          ballSpeedX = -ballSpeedX;
          //increases ball speed and angle based on proximity to edge of paddle
          let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
          ballSpeedY = deltaY * 0.35;
        } else {
          player2Score++;
          ballReset();
        }
      }

      if (ballX > canvas.width-30) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
          ballSpeedX = -ballSpeedX;
          //increases ball speed and angle based on proximity to edge of paddle
          let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
          ballSpeedY = deltaY * 0.35;
        } else {
          player1Score++;
          ballReset();
        }
      }

      if (ballY > canvas.height || ballY < 0) {
        ballSpeedY = -ballSpeedY;
      }

    }

    function drawNet() {
      for (var i = 10; i < canvas.height; i += 40){
          colorRect(canvas.width/2-1, i, 2, 20, 'white');
      }
    }

    // Draws visible game elemnts to canvas.
    function drawEverything() {

      //draws play area
      colorRect(0, 0, canvas.width, canvas.height, 'black');

      //score counters
      canvasContext.fillStyle = 'white';
      canvasContext.fillText(player1Score, canvas.width/4 - 30, 100);
      canvasContext.fillText(player2Score, canvas.width - canvas.width/4 + 15, 100);

      if (showingWinScreen) {
        if (player1Score >= WIN_SCORE){
          canvasContext.fillText("Left player Won!", canvas.width/2-150, canvas.height/2);
        } 
        if (player2Score >= WIN_SCORE){
          canvasContext.fillText("Right player Won!", canvas.width/2-150, canvas.height/2);
      }
        
        canvasContext.fillText("Click to play", canvas.width/2-120, canvas.height - 200);
        return;
      }

      drawNet();

      //draws left paddle
      colorRect(0 + 10, paddle1Y, PADDLE_WIDTH, 100, 'white');

      //draws right paddle
      colorRect(canvas.width - PADDLE_WIDTH-10, paddle2Y, PADDLE_WIDTH, 100, 'white');

      //draws ball
      colorCircle(ballX, ballY, 10, 'white');


    }

    //this helper function draws rectangles
    function colorRect(leftX, topY, width, height, drawColor) {

      canvasContext.fillStyle = drawColor;
      canvasContext.fillRect(leftX, topY, width, height);

    }

    //this helper function draws the circle
    function colorCircle(centerX, centerY, radius, drawColor) {

      canvasContext.fillStyle = drawColor;
      canvasContext.beginPath();
      canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
      canvasContext.fill();

    }