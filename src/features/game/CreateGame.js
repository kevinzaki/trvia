import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import QRCode from "qrcode.react";
import Settings from "./Settings";
import { fetchGameId, gameId } from "./gameSlice";
import { socket } from "../../api/socket";
import { useLocation } from "react-router-dom";
export default function CreateGame() {
  const dispatch = useDispatch();
  const idStatus = useSelector(state => state.game.status);
  const id = useSelector(gameId);
  let location = useLocation();
  useEffect(() => {
    if (idStatus === "idle") {
      dispatch(fetchGameId(socket.id.slice(-12)));
    }
  }, [idStatus, dispatch]);

  return (
    <Container>
      {`localhost:3000/game/answers/${id}`}
      {id && <QRCode value={`localhost:3000/game/answers/${id}`}></QRCode>}
      <Settings />
    </Container>
  );
}
