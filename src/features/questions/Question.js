import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  currentRound,
  numberOfQuestionsPerRound,
  numberOfRounds,
  categories
} from "../game/gameSlice";
import { setQuestion, currentQuestion } from "./questionsSlice";
import { useParams } from "react-router-dom";
import { socket } from "../../api/socket";
export default function Question() {
  const dispatch = useDispatch();
  //const q = useSelector(state => state.questions.question);
  const status = useSelector(state => state.questions.status);
  const numOfQuestions = useSelector(currentRound);
  const questionPerRound = useSelector(numberOfQuestionsPerRound);
  const numOfRounds = useSelector(numberOfRounds);
  const categoryIds = useSelector(categories);
  const question = useSelector(currentQuestion);
  const { id } = useParams();

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
  }, []);

  useEffect(() => {
    socket.on("question", q => {
      dispatch(setQuestion(q));
      console.log(q);
    });
  });

  // useEffect(() => {
  //   if (status === "idle") {
  //     dispatch(fetchQuestions({ numOfQuestions, categoryId }));
  //   }
  // }, [status, dispatch]);

  return (
    <div>
      Question {id}
      {question !== null && <div>{question}</div>}
    </div>
  );
}
