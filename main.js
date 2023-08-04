let backgroundCanvas = document.getElementById("background-canvas");
let netCanvas = document.getElementById("net-canvas");
let gameCanvas = document.getElementById("game-canvas");

let backgroundCtx = backgroundCanvas.getContext("2d");
let netCtx = netCanvas.getContext("2d");
let gameCtx = gameCanvas.getContext("2d");

let scorePlayer = document.getElementById("scorePlayer")
let scoreComputer = document.getElementById("scoreComputer")

let curentScoreComputer = 0
let curentScorePlayer = 0

let w = gameCanvas.width;
let h = gameCanvas.height;


const circle = {
    x: w / 2,
    y: h / 2,
    radius: 15,
    angle: 2 * Math.PI,
    color: "#95f0e5bd",
    velocityX: 5,
    velocityY: 5,
};

const net = {
    x: w / 2,
    y: h / 2,
    width: 2,
    height: 10,
    color: "#25043b",
};

const computer = {
    x: w - 20,
    y: h / 2 - 45,
    width: 20,
    height: 90,
    color: "green",
};

const player = {
    x: 0,
    y: h / 2 - 45,
    width: 20,
    height: 90,
    color: "red",
};

function drawCircle (ctx)
{
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, circle.angle);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.stroke();
}

function drawNet (ctx)
{
    ctx.fillStyle = net.color;
    for (let i = 0; i <= w; i += 15) {
        ctx.fillRect(net.x, i, net.width, net.height);
    }
}

function drawComputer (ctx)
{
    ctx.fillStyle = computer.color;
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
}

function drawPlayer (ctx, moveY)
{
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, moveY, player.width, player.height);
}

function updateGame ()
{
    gameCtx.clearRect(0, 0, w, h);
    drawCircle(gameCtx);
    drawComputer(gameCtx);
    drawPlayer(gameCtx, player.y);
}

function updateNet ()
{
    netCtx.clearRect(0, 0, w, h);
    drawNet(netCtx);
}

function updateBackground ()
{
    backgroundCtx.clearRect(0, 0, w, h);
    // Draw background or other elements not affected by the animation here
}

function computerMove ()
{
    computer.y = circle.y
    updateComputer();
}

function ballMove ()
{
    circle.x += .5 * circle.velocityX
    circle.y += .5 * circle.velocityY
    // check if the ball touch one of the top or bottum wall change direction
    if (circle.y + circle.radius > h || circle.y - circle.radius < 0) {
        circle.velocityY = -circle.velocityY
    }
    collision()

}


function collision ()
{
    //check if the ball touched player or computer in x & y axis
    if (circle.x + circle.radius >= w - computer.width) {
        if (circle.y > computer.y && circle.y < computer.y + computer.height) {
            circle.velocityX = -circle.velocityX;
            circle.x = w - computer.width - circle.radius;
        }
    } else if (circle.x - circle.radius <= player.width) {
        if (circle.y > player.y && circle.y < player.y + player.height) {
            circle.velocityX = -circle.velocityX;
            circle.x = player.width + circle.radius;
        }
    }
    score()
}


function score ()
{
    // check if the ball touch any wall to add points
    if (circle.x >= w) {
        circle.velocityX = -circle.velocityX
        curentScorePlayer++
        endGame()
        scorePlayer.innerHTML = curentScorePlayer
    } else if (circle.x <= 0) {
        circle.velocityX = -circle.velocityX
        curentScoreComputer++
        endGame()
        scoreComputer.innerHTML = curentScoreComputer
    }
}

function updateComputer ()
{
    //redraw
    updateGame();
    updateNet();
    // requestAnimationFrame(computerMove);
}

function mouseMoveHandler (e)
{
    // get all information about size of element
    let rect = gameCanvas.getBoundingClientRect();
    // make the player in range between half top and half botoum
    player.y = e.clientY - rect.top - player.height / 2;
}

// Move the player
gameCanvas.addEventListener("mousemove", mouseMoveHandler);

// function animate() {
//     updateGame();
//     requestAnimationFrame(animate);
// }


// animate()

// start game
updateComputer();


let computerMoveInterval;
let ballMoveInterval;

computerMoveInterval = setInterval(computerMove, 18);
ballMoveInterval = setInterval(ballMove, 15);

function endGame ()
{
    if (curentScoreComputer === 5 || curentScorePlayer === 5) {
        clearInterval(computerMoveInterval); // Stop the computer movement
        clearInterval(ballMoveInterval); // Stop the ball movement
        gameCanvas.removeEventListener("mousemove", mouseMoveHandler); // Remove the mousemove event listener
        
        let overlay = document.createElement("div");
        overlay.className = "overlay";
        document.body.appendChild(overlay);

        let result =document.createElement("div")
        result.className="result"
        overlay.appendChild(result);

        let img =document.createElement("div")
        img.className="img"
        result.appendChild(img);
        let pic =document.createElement("img")
        if(curentScoreComputer === 5 ){
            pic.src = "imgs/lose.png" 
        }else if(curentScorePlayer === 5){
            pic.src ="imgs/download.jpg"
        }
        img.appendChild(pic)

        let WinMessage =document.createElement("h3")
        WinMessage.className="WinMessage"
        if(curentScoreComputer === 5 ){
            WinMessage.textContent = "Sory You Lose"
        }else if(curentScorePlayer === 5){
            WinMessage.textContent ="congratulations you win";
        }
        result.appendChild(WinMessage);

        let btn =document.createElement("button")
        btn.addEventListener("click",()=>window.location.reload())
        btn.textContent="Play Again"
        result.appendChild(btn);


    }else{
    return
    }
}
