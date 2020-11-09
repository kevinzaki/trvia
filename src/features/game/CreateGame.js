import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import QRCode from "qrcode.react";
import Settings from "./Settings";
import { socket } from "../../api/socket";
import { useLocation } from "react-router-dom";
import { fetchCategories, categories } from "../categories/categoriesSlice";

import {
  fetchGameId,
  setNumberOfRounds,
  setNumberOfQuestionsPerRound,
  numberOfQuestionsPerRound,
  numberOfRounds,
  updateSelectedCategories,
  gameId
} from "./gameSlice";
export default function CreateGame() {
  const dispatch = useDispatch();
  const idStatus = useSelector(state => state.game.status);
  const id = useSelector(gameId);

  const numOfQuestions = useSelector(numberOfQuestionsPerRound);
  const numOfRounds = useSelector(numberOfRounds);
  const allCategories = useSelector(categories);

  useEffect(() => {
    if (idStatus === "idle" && socket.connected) {
      dispatch(fetchGameId(socket.id.slice(-12)));
    }
  }, [idStatus, dispatch, socket.connected]);

  useEffect(() => {
    if (id) {
      socket.emit("createRoom", {
        id,
        numberOfRounds: numOfRounds,
        numberOfQuestionsPerRound: numOfQuestions,
        categoryIds: allCategories
      });
    } else {
      socket.connect();
    } //
  }, [id]);

  useEffect(() => {
    socket.on("newPlayer", data => {
      console.log(data);
    });
  }, []);

  return (
    <Container>
      {`localhost:3000/game/answers/${id}`}
      {id && <QRCode value={`localhost:3000/game/answers/${id}`}></QRCode>}
      <Settings />
    </Container>
  );
}
