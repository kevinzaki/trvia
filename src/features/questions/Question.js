import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  roundCount,
  questionCount,
  numberOfQuestionsPerRound,
  numberOfRounds,
  categories,
  incrementRound,
  incrementQuestion,
  setScores,
  setQuestionCount
} from "../game/gameSlice";
import {
  setQuestion,
  currentQuestion,
  setCorrectAnswer,
  correctAns,
  setAnswers
} from "./questionsSlice";
import { useParams } from "react-router-dom";
import { socket } from "../../api/socket";
import { Button } from "react-bootstrap";
import Scores from "../scores/Scores";

export default function Question() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const questionPerRound = useSelector(numberOfQuestionsPerRound);
  const numOfRounds = useSelector(numberOfRounds);
  const categoryIds = useSelector(categories);
  const question = useSelector(currentQuestion);
  const answer = useSelector(correctAns);

  const currRoundCount = useSelector(roundCount);
  const currQuestionCount = useSelector(questionCount);

  const [timer, setTimer] = useState(-1);

  useEffect(() => {
    socket.emit(
      "startGame",
      {
        roomId: id,
        numberOfRounds: numOfRounds,
        numberOfQuestionsPerRound: questionPerRound,
        categoryIds
      },
      () => {
        socket.emit("getQuestion", { roomId: id });
      }
    );
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on("question", q => {
      dispatch(setQuestion(q));
      setTimer(10);
    });

    socket.on("correctAnswer", data => {
      dispatch(setCorrectAnswer(data));
    });

    socket.on("scores", scores => {
      dispatch(setScores(scores.scores));
    });
  }, []);

  useInterval(() => {
    if (timer > 0) setTimer(timer - 1);
    else if (timer === 0) {
      socket.emit("getCorrectAnswer", { roomId: id });
      setTimer(-1);
    }
  }, 1000);

  function nextQuestion() {
    dispatch(setCorrectAnswer(null));
    dispatch(setQuestion(null));
    dispatch(incrementQuestion());
    // game is over
    if (currRoundCount > numOfRounds) {
      socket.emit("endGame", { roomId: id });
    }
    // round is over
    else if (currQuestionCount >= questionPerRound) {
      console.log(currQuestionCount + " " + questionPerRound);
      dispatch(incrementRound());
      socket.emit("getScores", { roomId: id });
    }
    // get next question
    else {
      socket.emit("getQuestion", { roomId: id });
    }
  }

  function nextRount() {
    dispatch(setQuestionCount(0));
    nextQuestion();
  }

  return (
    <div>
      timer {timer}
      Question {id}
      {question !== null && <div>{question}</div>}
      {answer !== null && <div>{answer}</div>}
      {answer !== null && <Button onClick={() => nextQuestion()}>Next</Button>}
      {currQuestionCount > questionPerRound && <Scores />}
      {currQuestionCount > questionPerRound &&
        currRoundCount <= numOfRounds && (
          <Button onClick={() => nextRount()}>Next Round</Button>
        )}
      {currRoundCount > numOfRounds && <Button>New Game</Button>}
    </div>
  );
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
