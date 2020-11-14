import React from "react";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";

export default function ActionButton({ onQuestion, onRound, onGame }) {
  const settings = useSelector(state => state.game.roundSettings);
  const gameOver = useSelector(state => state.game.isGameOver);
  const roundOver = useSelector(state => state.game.isRoundOver);
  const roundId = useSelector(state => state.game.roundCount);
  const numOfQuestions = settings[roundId - 1].numOfQuestions;
  const qCount = useSelector(state => state.game.questionCount);
  const roundsPerGame = settings.length;
  const correctAns = useSelector(state => state.questions.correctAnswer);

  if (!gameOver && !roundOver && correctAns) {
    return (
      <Button onClick={() => onQuestion()}>
        {numOfQuestions === qCount ? "End Round" : "Next Question"}
      </Button>
    );
  }
  if (gameOver) {
    return <Button onClick={() => onGame()}>New Game</Button>;
  }
  if (roundOver) {
    return (
      <Button onClick={() => onRound()}>
        {roundsPerGame === roundId ? "End Game" : "Next Round"}
      </Button>
    );
  }
  return null;
}
