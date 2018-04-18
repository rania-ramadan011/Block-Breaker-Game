
//buttons 
var play_ptn = document.getElementById("play")
var pause_ptn = document.getElementById("pause")
var reset_ptn = document.getElementById("reset")
    //Canvas vars
var canvas = document.getElementById("MYC");
var ctx = canvas.getContext("2d");
var player_Name = document.getElementById("playerName");
var playerNameVar;
var firstload = 1;
var lose_win = 0;
//Ball vars
var ballRadius = 7;
var ballColor = "#0095DG"
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 3; // represents the direction and speed of ball    
var dy = -3;
//Dock vars
var dockHeight = 10;
var dockWidth = 70;
var dockSpeed = 4;
var dockX = (canvas.width - dockWidth) / 2; //intial position at the middle
//Keyboard vars
var rightPressed = false;
var leftPressed = false;
//bricks Vars
var brickRowCount = 14;
var brickColumnCount = 9;
var brickWidth = 45;
var brickHeight = 12;
var brickPadding = 7;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
//game variables 
var isPaused = false; //represents the status of game wether its on or off
//Score board
var score = 0;
var lives = 4;
//define bricks with different status 1:easy to break ,2:hard to break
var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        if (c == 4) {
            bricks[c][r] = { x: 0, y: 0, status: 2 };
        } else
            bricks[c][r] = { x: 0, y: 0, status: 1 };

    }
}

player_Name.focus();
//handelling the keyboard events 

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    } else if (e.keyCode == 32) {
        player_Name.blur();
        if (!isPaused) {
            pause_ptn.onclick();
        } else {
            play_ptn.onclick();
        }

    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    } else if (e.keyCode == 32) {
        e.preventDefault();
    }
}
//game logic
function drawGameOver() {
    lose_win = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "70px tahoma bold";
    ctx.fillStyle = "blue";
    ctx.fillText("GAME OVER!", 150, canvas.height / 2);
}

function drawYouWin() {
    lose_win = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "50px Arial bold";
    ctx.fillStyle = "blue";
    ctx.fillText("CONGRATS YOU WON!", 150, canvas.height / 2);
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status >= 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    if (b.status == 2) //handelling the hard brick
                        b.status = 1;
                    else
                        b.status = 0;
                    score++;
                    

                    if (score == 15) { //level 2
                        dx = 4;
                        dy = -4;
                        ballColor = "green"
                        dockWidth = 50
                        dockSpeed = 6
                    }
                    if (score == 25) { //level 3
                        dx = 5;
                        dy = -5;
                        dockSpeed = 8
                        ballColor = "red"
                    }

                    if (score == (brickRowCount * brickColumnCount) + brickColumnCount) {
                       
                        drawYouWin();
                        lose_win = 1
                    }
                }
            }
        }
    }
}


function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawdock() {
    ctx.beginPath();
    ctx.rect(dockX, canvas.height - dockHeight, dockWidth, dockHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status >= 1) {
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if (bricks[c][r].status == 2)
                    ctx.fillStyle = "blue"
                else
                    ctx.fillStyle = "#54aee2";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(playerNameVar + "'s Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}
//main drawing function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawdock();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy; //revers direction
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > dockX && x < dockX + dockWidth) {
            dy = -dy;
        } else {
            lives--; //hit the bottom (live lost)
            if (!lives) { //loss situation
                //alert("GAME OVER");
                drawGameOver();
                pause_ptn.onclick();
                lose_win = 1;
            } else { //reload to center 
                x = canvas.width / 2;
                y = canvas.height - 30;
                dockX = (canvas.width - dockWidth) / 2;
            }
        }
    }

    if (rightPressed && dockX < canvas.width - dockWidth) {
        dockX += dockSpeed;
    } else if (leftPressed && dockX > 0) {
        dockX -= dockSpeed;
    }
    x += dx;
    y += dy;
    if (!isPaused)
        requestAnimationFrame(draw);
}
//is for the reset button to go back to the intial state
var reset = function() {
    lose_win = 0;
    dockX = (canvas.width - dockWidth) / 2;
    dx = 3;
    dy = -3;
    dockWidth = 70;
    dockSpeed = 4;
    for (c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (r = 0; r < brickRowCount; r++) {
            if (c == 4) {
                bricks[c][r] = { x: 0, y: 0, status: 2 };
            } else
                bricks[c][r] = { x: 0, y: 0, status: 1 };

        }
    }
    x = canvas.width / 2;
    y = canvas.height - 30;
    ballColor = "#0095DG"
    score = 0;
    lives = 4;
    firstload = 1;
}

play_ptn.onclick = function() {
    isPaused = false;
    if (lose_win)
        reset_ptn.onclick();
    if (firstload) {
        playerNameVar = player_Name.value;
        firstload = 0;
    }
    if (player_Name.value != "")
        draw();
    else
        window.alert("Enter your name!!!!")
}

pause_ptn.onclick = function() {
    isPaused = true;
}

reset_ptn.onclick = function() {
    isPaused = true;
    reset();
    draw();
}