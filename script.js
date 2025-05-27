document.addEventListener("DOMContentLoaded", () => {
  const themeToggleButton = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("theme-icon");

  const nameInHeader = document.getElementById("nameInHeader");
  const nameInAbout = document.getElementById("nameInAbout");
  const nameInCopyright = document.getElementById("nameInCopyright");
  const gameDialogOverlay = document.getElementById("gameDialogOverlay");
  const closeGameDialogButton = document.getElementById(
    "closeGameDialogButton",
  );

  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");

  const gameDialogTitle = document.querySelector("#gameDialog h3");

  const licenseTrigger = document.getElementById("licenseTrigger");
  const licenseDialogOverlay = document.getElementById("licenseDialogOverlay");
  const closeLicenseDialogButton = document.getElementById(
    "closeLicenseDialogButton",
  );

  const currentTheme = localStorage.getItem("theme") || "light";

  document.documentElement.setAttribute("data-theme", currentTheme);

  updateThemeIcon(currentTheme);

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  }

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleTheme);
  }

  const grid = 16;
  let snakeGameCount = 0;
  let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4,
  };
  let apple = {
    x: 320,
    y: 320,
  };
  let gameLoopId;
  let score = 0;
  let isPaused = false;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function updateScore(newScore) {
    score = newScore;
    if (gameDialogTitle) {
      if (score >= 1) {
        gameDialogTitle.textContent = `Score: ${score}`;
      } else {
        gameDialogTitle.textContent = "Snake Game!";
      }
    }
  }

  function resetSnakeGame() {
    snake.x = canvas.width / 2 - grid / 2;
    snake.y = canvas.height / 2 - grid / 2;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;

    apple.x = getRandomInt(0, canvas.width / grid) * grid;
    apple.y = getRandomInt(0, canvas.height / grid) * grid;
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    updateScore(0);
    isPaused = false;
  }

  function gameLoop() {
    if (isPaused) {
      gameLoopId = requestAnimationFrame(gameLoop);
      return;
    }

    gameLoopId = requestAnimationFrame(gameLoop);

    if (++snakeGameCount < 4) {
      return;
    }
    snakeGameCount = 0;

    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;

    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.height) snake.y = 0;

    snake.cells.unshift({
      x: snake.x,
      y: snake.y,
    });

    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    context.fillStyle = "red";
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    context.fillStyle = "green";
    snake.cells.forEach((cell, index) => {
      context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        updateScore(score + 1);

        apple.x = getRandomInt(0, canvas.width / grid) * grid;
        apple.y = getRandomInt(0, canvas.height / grid) * grid;
      }

      for (let i = index + 1; i < snake.cells.length; i++) {
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          resetSnakeGame();
        }
      }
    });
  }

  function togglePause() {
    isPaused = !isPaused;
  }

  function openGameDialog() {
    document.body.style.overflow = "hidden";
    if (gameDialogOverlay) {
      gameDialogOverlay.style.display = "flex";

      isPaused = false;

      if (!gameLoopId && score === 0) {
        resetSnakeGame();
      }

      if (!gameLoopId) {
        gameLoop();
      }

      if (gameDialogTitle) {
        if (score >= 1) {
          gameDialogTitle.textContent = `Score: ${score}`;
        } else {
          gameDialogTitle.textContent = "Snake Game!";
        }
      }
    }
  }

  function closeGameDialog() {
    document.body.style.overflow = "visible";
    if (gameDialogOverlay) {
      gameDialogOverlay.style.display = "none";
      if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
      }
    }
  }

  if (nameInHeader) nameInHeader.addEventListener("click", openGameDialog);
  if (nameInAbout) nameInAbout.addEventListener("click", openGameDialog);
  if (nameInCopyright)
    nameInCopyright.addEventListener("click", openGameDialog);

  if (closeGameDialogButton)
    closeGameDialogButton.addEventListener("click", closeGameDialog);

  document.addEventListener("keydown", (e) => {
    if (gameDialogOverlay && gameDialogOverlay.style.display === "flex") {
      if (!isPaused) {
        if (e.key === "ArrowLeft" && snake.dx === 0) {
          snake.dx = -grid;
          snake.dy = 0;
        } else if (e.key === "ArrowUp" && snake.dy === 0) {
          snake.dy = -grid;
          snake.dx = 0;
        } else if (e.key === "ArrowRight" && snake.dx === 0) {
          snake.dx = grid;
          snake.dy = 0;
        } else if (e.key === "ArrowDown" && snake.dy === 0) {
          snake.dy = grid;
          snake.dx = 0;
        }
      }

      if (e.key === " ") {
        e.preventDefault();
        togglePause();
      } else if (e.key === "Escape") {
        if (isPaused) {
          closeGameDialog();
        } else {
          togglePause();
        }
      }
    }
  });

  function openLicenseDialog() {
    if (licenseDialogOverlay) {
      licenseDialogOverlay.style.display = "flex";
    }
  }

  function closeLicenseDialog() {
    if (licenseDialogOverlay) {
      licenseDialogOverlay.style.display = "none";
    }
  }

  if (licenseTrigger) {
    licenseTrigger.addEventListener("click", openLicenseDialog);
  }

  if (closeLicenseDialogButton) {
    closeLicenseDialogButton.addEventListener("click", closeLicenseDialog);
  }

  [gameDialogOverlay, licenseDialogOverlay].forEach((overlay) => {
    if (overlay) {
      overlay.addEventListener("click", function (event) {
        if (event.target === this) {
          if (this.id === "gameDialogOverlay") closeGameDialog();
          if (this.id === "licenseDialogOverlay") closeLicenseDialog();
        }
      });
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (
        licenseDialogOverlay &&
        licenseDialogOverlay.style.display === "flex"
      ) {
        closeLicenseDialog();
      }
    }
  });
});
