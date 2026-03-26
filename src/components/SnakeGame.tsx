import React, { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SPEED = 100;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  const lastMoveTimeRef = useRef(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && isGameOver) {
        resetGame();
        return;
      }

      if (e.key === ' ' && !isGameOver) {
        setIsPaused((p) => !p);
        return;
      }

      if (isPaused || isGameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPaused]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
    spawnFood([{ x: 10, y: 10 }]);
  };

  const spawnFood = (currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    setFood(newFood);
  };

  const gameLoop = (time: number) => {
    if (isPaused || isGameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const currentSpeed = Math.max(40, INITIAL_SPEED - Math.floor(score / 5) * 5);

    if (time - lastMoveTimeRef.current >= currentSpeed) {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          onGameOver();
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          onGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          spawnFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
      lastMoveTimeRef.current = time;
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPaused, isGameOver, food, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid lines (raw pixelated look)
    ctx.strokeStyle = '#0ff';
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Draw food (Magenta block)
    ctx.fillStyle = '#f0f';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Draw snake (Cyan blocks)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#fff' : '#0ff';
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    if (isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      ctx.fillStyle = '#f0f';
      ctx.font = '24px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('FATAL_ERR', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 10);
      
      ctx.fillStyle = '#0ff';
      ctx.font = '12px "Press Start 2P"';
      ctx.fillText('[SPACE] TO REBOOT', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 30);
    } else if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      ctx.fillStyle = '#0ff';
      ctx.font = '24px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('HALTED', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }

  }, [snake, food, isGameOver, isPaused]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative p-1 bg-black">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black block"
        />
      </div>
      <div className="mt-6 flex gap-8 text-lg font-sans text-cyan-400 uppercase">
        <span>INPUT: [W/A/S/D]</span>
        <span>SYS_CTRL: [SPACE]</span>
      </div>
    </div>
  );
};
