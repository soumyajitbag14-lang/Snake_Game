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

let obstacles = generateObstacles(10); // generate random obstacle
let food = getValidFoodPosition();   // get food in a valid position






let gameRunning = true;
let gameInterval;




function drawGame() {
    if (!gameRunning) return;   

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveSnake();
    checkCollision();           

    drawGrid();
    drawSnake();
    drawFood();
    drawObstacles();
    drawScore(); // game position
}


function drawGrid() {
    ctx.strokeStyle = "#ddd";

    
    for (let x = 0; x <= canvas.width; x += gridsize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += gridsize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
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
        food = getValidFoodPosition();
    } else {
        snake.pop();
    }
}

function getValidFoodPosition() {
    let newFood;
    let collision;
    let attempts = 0;

    do {
        newFood = randomPosition(); // most probable error

        collision = snake.some(s => s.x === newFood.x && s.y === newFood.y) ||
                    obstacles.some(o => o.x === newFood.x && o.y === newFood.y);

        attempts++;
        if (attempts > 1000) break;   

    } while (collision);

    return newFood;
}



function drawScore(){
    ctx.fillStyle ="black";
    ctx.font ="20px Arial";
    ctx.fillText("Score: " + score, 10, 25);  
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

    while (obs.length < count) {
        let pos = randomPosition();

        let collision =
            snake.some(s => s.x === pos.x && s.y === pos.y) ||
            obs.some(o => o.x === pos.x && o.y === pos.y);

        if (!collision) {
            obs.push(pos);
        }
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

    // Wall collision
    if (
        head.x < 0 || head.y < 0 ||
        head.x >= tileCount || head.y >= tileCount
    ) {
        gameOver();
        return;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Obstacle collision
    for (let ob of obstacles) {
        if (head.x === ob.x && head.y === ob.y) {
            gameOver();
            return;
        }
    }
}



function gameOver() {
    if (!gameRunning) return;   

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




const buttons = document.querySelectorAll("button"); // button fixed

buttons[0].onclick = () => {
    if (gameRunning) {
        clearInterval(gameInterval);
    } else {
        gameInterval = setInterval(drawGame, 150);
    }
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