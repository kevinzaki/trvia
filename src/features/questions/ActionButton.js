import React from "react";
import { useSelector } from "react-redux";
import "./question.css";

export default function ActionButton({ onQuestion, onRound, onGame }) {
  const settings = useSelector(state => state.game.roundSettings);
  const gameOver = useSelector(state => state.game.isGameOver);
  const roundOver = useSelector(state => state.game.isRoundOver);
  const roundId = useSelector(state => state.game.roundCount);
  const numOfQuestions =
    settings.length > 0 ? settings[roundId - 1].numOfQuestions : 0;
  const qCount = useSelector(state => state.game.questionCount);
  const roundsPerGame = settings.length;
  const correctAns = useSelector(state => state.questions.correctAnswer);

  if (!gameOver && !roundOver && correctAns) {
    return (
      <button className="q-action-button" onClick={() => onQuestion()}>
        {numOfQuestions === qCount ? "End Round" : "Next Question"}
      </button>
    );
  }
  if (gameOver) {
    return (
      <button className="q-action-button" onClick={() => onGame()}>
        New Game
      </button>
    );
  }
  if (roundOver) {
    return (
      <button className="q-action-button" onClick={() => onRound()}>
        {roundsPerGame === roundId ? "End Game" : "Next Round"}
      </button>
    );
  }
  return null;
}
