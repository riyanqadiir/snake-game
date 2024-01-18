document.addEventListener("DOMContentLoaded", function () {
  const board = document.getElementById("game-board");
  const gridSize = 20;

  let snake = [{ x: 0, y: 0 }];
  let food = generateFood();
  const b = document.querySelector(".border");

  let direction = "right";
  let score = 0;
  let gameInterval;
  let ateFood = false;
  let speed = 150;

  const body = document.querySelector("body");
  const p = document.querySelector("p");
  const btn = document.createElement("button");

  function update() {
      moveSnake();
      checkCollision();
      checkFood();
      render();
  }

  function render() {
      board.innerHTML = "";
      renderSnake();
      renderFood();
  }

  function renderSnake() {
      snake.forEach((segment) => {
          const snakeSegment = document.createElement("div");
          snakeSegment.className = "snake";
          snakeSegment.style.left = segment.x * gridSize + "px";
          snakeSegment.style.top = segment.y * gridSize + "px";
          board.appendChild(snakeSegment);
      });
  }

  function renderFood() {
      const foodElement = document.createElement("div");
      foodElement.className = "food";
      foodElement.style.left = food.x * gridSize + "px";
      foodElement.style.top = food.y * gridSize + "px";
      board.appendChild(foodElement);
  }

  function moveSnake() {
      const head = { ...snake[0] };

      switch (direction) {
          case "up":
              head.y -= 1;
              break;
          case "down":
              head.y += 1;
              break;
          case "left":
              head.x -= 1;
              break;
          case "right":
              head.x += 1;
              break;
      }

      snake.unshift(head);
      if (!ateFood) {
          snake.pop();
      }
  }

  function checkCollision() {
      const head = snake[0];

      if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= board.clientWidth / gridSize ||
          head.y >= board.clientHeight / gridSize ||
          checkSelfCollision()
      ) {
          endGame();
      }
  }

  function checkSelfCollision() {
      const head = snake[0];
      return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
  }

  function checkFood() {
      const head = snake[0];

      if (head.x === food.x && head.y === food.y) {
          food = generateFood();
          ateFood = true;
          score += 5;

          if (score >= 50) {
            p.innerText="Difficulty level : 2"
              speed = 100;
              clearInterval(gameInterval);
              gameInterval = setInterval(update, speed);
            }
            if (score >= 100) {
              p.innerText="Difficulty level : 3";
              speed = 50;
              clearInterval(gameInterval);
              gameInterval = setInterval(update, speed);
          }
      } else {
          ateFood = false;
      }
  }

  function generateFood() {
      const x = Math.floor(Math.random() * (board.clientWidth / gridSize));
      const y = Math.floor(Math.random() * (board.clientHeight / gridSize));
      return { x, y };
  }

  function endGame() {
      board.classList.add("red");
      b.classList.add("red");
      p.classList.add("red-color");
      let food = document.querySelector(".food");
      food.classList.add("food-clr");
      p.innerText = `Game Over! Your Score: ${score}`;
      btn.classList.add("btn");
      body.appendChild(btn);
      btn.innerText = "Play again";
      btn.addEventListener("click", startGame);
      clearInterval(gameInterval);
  }

  function startGame() {
      board.classList.remove("red");
      b.classList.remove("red");
      p.classList.remove("red-color");
      p.innerText = "Difficulty Level: 1 " ;
      btn.remove();
      btn.innerText = "start";
      snake = [{ x: 0, y: 0 }];
      food = generateFood();
      direction = "right";
      score = 0;
      ateFood = false;
      speed = 150; // Reset speed to the initial value
      clearInterval(gameInterval);
      gameInterval = setInterval(update, speed);
  }

  function handleSwipe() {

      const swipeThreshold = 30;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
              if (deltaX > 0) {
                  direction = "right";
              } else {
                  direction = "left";
              }
          } else {
              if (deltaY > 0) {
                  direction = "down";
              } else {
                  direction = "up";
              }
          }
      }
  }

  let touchStartX, touchStartY, touchEndX, touchEndY;

  document.addEventListener("touchstart", function (event) {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
  });

  document.addEventListener("touchmove", function (event) {
      touchEndX = event.touches[0].clientX;
      touchEndY = event.touches[0].clientY;
  });

  document.addEventListener("touchend", function () {
      handleSwipe();
  });

  document.addEventListener("keydown", function (event) {
      switch (event.key) {
          case "ArrowUp":
              if (direction !== "down") direction = "up";
              break;
          case "ArrowDown":
              if (direction !== "up") direction = "down";
              break;
          case "ArrowLeft":
              if (direction !== "right") direction = "left";
              break;
          case "ArrowRight":
              if (direction !== "left") direction = "right";
              break;
      }
  });

  startGame();
});
