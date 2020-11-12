import React from "react";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";

export default function ActionButton({ onQuestion, onRound, onGame }) {
  const gameOver = useSelector(state => state.game.isGameOver);
  const roundOver = useSelector(state => state.game.isRoundOver);
  const qPerRound = useSelector(state => state.game.numberOfQuestionsPerRound);
  const qCount = useSelector(state => state.game.questionCount);
  const rPerGame = useSelector(state => state.game.numberOfRounds);
  const rCount = useSelector(state => state.game.roundCount);
  const correctAns = useSelector(state => state.questions.correctAnswer);

  if (!gameOver && !roundOver && correctAns) {
    return (
      <Button onClick={() => onQuestion()}>
        {qPerRound === qCount ? "End Round" : "Next Question"}
      </Button>
    );
  }
  if (gameOver) {
    return <Button onClick={() => onGame()}>New Game</Button>;
  }
  if (roundOver) {
    return (
      <Button onClick={() => onRound()}>
        {rPerGame === rCount ? "End Game" : "Next Round"}
      </Button>
    );
  }
  return null;
}
