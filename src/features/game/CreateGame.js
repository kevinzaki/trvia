import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import QRCode from "qrcode.react";
import Settings from "./Settings";
import { socket } from "../../api/socket";
import { categories } from "../categories/categoriesSlice";
import "./createGame.css";
import { fetchGameId, gameId, addPlayer } from "./gameSlice";

export default function CreateGame() {
  const dispatch = useDispatch();

  const idStatus = useSelector(state => state.game.status);
  const id = useSelector(gameId);
  const allCategories = useSelector(categories);
  const players = useSelector(state => state.game.players);

  useEffect(() => {
    if (idStatus === "idle" && socket.connected) {
      dispatch(fetchGameId(socket.id.slice(-12)));
    }
  }, [idStatus, dispatch, socket.connected]);

  useEffect(() => {
    if (id) {
      socket.emit("createRoom", {
        id,
        roundSettings: []
      });
    } else {
      socket.connect();
    }
  }, [id]);

  useEffect(() => {
    socket.on("newPlayer", data => {
      dispatch(addPlayer(data));
    });
  }, []);

  return (
    <div>
      <div className="sidebar">
        {id && <QRCode value={`localhost:3000/game/answers/${id}`}></QRCode>}
        Players:{" "}
        {
          <ul>
            {players.map(({ id, name }) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
        }
      </div>
      <div className="main">
        {`localhost:3000/game/answers/${id}`}
        <Settings />
      </div>
    </div>
  );
}
