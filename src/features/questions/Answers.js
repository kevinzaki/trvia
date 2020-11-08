import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGameId, gameId } from "../game/gameSlice";
import { setAnswers, allAnswers } from "./questionsSlice";
import { socket } from "../../api/socket";

export default function Answers() {
  const name = useState(null);
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
    if (id && name) socket.emit("joinRoom", { id, name: "kevin " });
  }, [name]);

  useEffect(() => {
    socket.on("answers", data => {
      dispatch(setAnswers(data));
    });
  });

  return (
    <>
      {!name && <div>GET USER NAME HERE</div>}
      {name && (
        <div>
          ANSWERS {id} {answers.length}
          <ul>{answers.length && answers.map(answer => <li>{answer}</li>)}</ul>
        </div>
      )}
    </>
  );
}
