import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGameId, gameId } from "../game/gameSlice";
import { setAnswers, allAnswers } from "./questionsSlice";
import { socket } from "../../api/socket";

export default function Answers() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const answers = useSelector(allAnswers);
  const idStatus = useSelector(state => state.game.status);
  useEffect(() => {
    if (idStatus === "idle") {
      dispatch(fetchGameId(id));
    }
  }, [idStatus, dispatch]);

  useEffect(() => {
    if (id) socket.emit("joinRoom", { id, name: "kevin " });
  }, []);

  useEffect(() => {
    socket.on("answers", data => {
      dispatch(setAnswers(data));
    });
  });

  return (
    <div>
      ANSWERS {id} {answers.length}
      <ul>{answers.length && answers.map(answer => <li>{answer}</li>)}</ul>
    </div>
  );
}
