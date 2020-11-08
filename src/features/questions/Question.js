import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  currentRound,
  numberOfQuestionsPerRound,
  numberOfRounds,
  categories
} from "../game/gameSlice";
import {
  setQuestion,
  currentQuestion,
  setCorrectAnswer,
  correctAns
} from "./questionsSlice";
import { useParams } from "react-router-dom";
import { socket } from "../../api/socket";

export default function Question() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const questionPerRound = useSelector(numberOfQuestionsPerRound);
  const numOfRounds = useSelector(numberOfRounds);
  const categoryIds = useSelector(categories);
  const question = useSelector(currentQuestion);

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
      console.log(data);
      dispatch(setCorrectAnswer(data));
    });
  }, []);

  // useEffect(() => {
  //   setTimeout(() => setTimer(30), 5000);
  // }, []);
  //const [timer, setTimer] = useState(0);

  useInterval(() => {
    if (timer > 0) setTimer(timer - 1);
    else if (timer === 0) {
      socket.emit("getCorrectAnswer", { roomId: id });
      setTimer(-1);
    }
    // Your custom logic here
    //setCount(timer - 1);
  }, 1000);

  // useEffect(() => {
  //   let timeout;
  //   if (timer > 0) setTimeout(() => setTimer(timer - 1), 1000);
  //   else if (timer === 0) {
  //     socket.emit("getCorrectAnswer", { roomId: id });
  //     setTimer(-1);
  //   }
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [timer]);

  return (
    <div>
      timer {timer}
      Question {id}
      {question !== null && <div>{question}</div>}
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
