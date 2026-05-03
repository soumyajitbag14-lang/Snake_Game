const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const gridsize = 20;
const tileCount = canvas.width / gridsize;

let score =0;

let snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
];

let dx = 1;
let dy = 0;


let food = randomPosition();


let obstacles = generateObstacles(10);


let gameRunning = true;
let gameInterval;




function drawGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    moveSnake();
    drawSnake();
    drawFood();
    drawObstacles();
    drawScore();
    checkCollision();
    }


function drawGrid() {
    ctx.strokeStyle = "#ddd";

    for (let i = 0; i <= canvas.width; i += gridsize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}


function moveSnake() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = randomPosition();
    } else {
        snake.pop();
    }
}

function drawScore(){
    ctx.fillStyle ="black";
    ctx.font ="20px Arial";
    ctx.fillTest("Score :"+ score, 10, 25);
}


function drawSnake() {
    ctx.fillStyle = "blue";

    snake.forEach(part => {
        ctx.fillRect(
            part.x * gridsize,
            part.y * gridsize,
            gridsize,
            gridsize
        );
    });
}


function drawFood() {
    ctx.fillStyle = "red";

    ctx.beginPath();
    ctx.arc(
        food.x * gridsize + gridsize / 2,
        food.y * gridsize + gridsize / 2,
        gridsize / 3,
        0,
        Math.PI * 2
    );
    ctx.fill();
}


function randomPosition() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}


function generateObstacles(count) {
    let obs = [];

    for (let i = 0; i < count; i++) {
        obs.push(randomPosition());
    }

    return obs;
}


function drawObstacles() {
    ctx.fillStyle = "black";

    obstacles.forEach(ob => {
        ctx.fillRect(
            ob.x * gridsize,
            ob.y * gridsize,
            gridsize,
            gridsize
        );
    });
}


function checkCollision() {
    let head = snake[0];

    
    if (
        head.x < 0 || head.y < 0 ||
        head.x >= tileCount || head.y >= tileCount
    ) {
        gameOver();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }

    
    obstacles.forEach(ob => {
        if (head.x === ob.x && head.y === ob.y) {
            gameOver();
        }
    });
}


function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);

    alert("Game Over!");
}



document.addEventListener("keydown", e => {
    if(dx === 0 && dy === 0) {
        dx = 1;
        dy = 0;
    }

    if (e.key === "ArrowUp" && dy !== 1) {
        dx = 0; dy = -1;
    }
    else if (e.key === "ArrowDown" && dy !== -1) {
        dx = 0; dy = 1;
    }
    else if (e.key === "ArrowLeft" && dx !== 1) {
        dx = -1; dy = 0;
    }
    else if (e.key === "ArrowRight" && dx !== -1) {
        dx = 1; dy = 0;
    }
});




const buttons = document.querySelectorAll("button");

buttons[0].onclick = () => {
    gameRunning = !gameRunning;
};

buttons[1].onclick = () => {
    resetGame();
};



function resetGame() {
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];

    dx = 1;
    dy = 0;
    score=0;
    food = randomPosition();
    obstacles = generateObstacles(10);

    gameRunning = true;

    clearInterval(gameInterval);
    gameInterval = setInterval(drawGame, 150);

    document.activeElement.blur();
}


gameInterval = setInterval(drawGame, 150);