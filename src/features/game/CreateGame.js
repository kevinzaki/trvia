import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import QRCode from "qrcode.react";
import Settings from "./Settings";
import { socket } from "../../api/socket";
import { categories } from "../categories/categoriesSlice";
import "./createGame.css";
import { fetchGameId, gameId, addPlayer } from "./gameSlice";

function useWindowSize() {
  const [size, setSize] = useState();
  useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export default function CreateGame() {
  const dispatch = useDispatch();
  const width = useWindowSize();

  const idStatus = useSelector(state => state.game.status);
  const id = useSelector(gameId);
  const allCategories = useSelector(categories);
  const players = useSelector(state => state.game.players);

  const leftContainerRef = useRef(null);
  const [QRCodeWidth, setQRCodeWidth] = useState(0);

  useLayoutEffect(() => {
    // I don't think it can be null at this point, but better safe than sorry
    if (leftContainerRef.current) {
      let { paddingLeft, paddingRight, width } = window.getComputedStyle(
        leftContainerRef.current
      );
      setQRCodeWidth(
        width.slice(0, -2) -
          paddingRight.slice(0, -2) -
          paddingLeft.slice(0, -2)
      );
    }
  }, [width]);

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
    <Container className="main-container" fluid>
      <Row>
        <Col ref={leftContainerRef} className="left-container" md={4}>
          <h1>Scan QR Code</h1>
          {id && (
            <QRCode
              className="qrcode"
              size={QRCodeWidth}
              fgColor="#1a1a1a"
              value={`https://trviaco.firebaseapp.com/game/answers/${id}`}
            ></QRCode>
          )}
          <div className="player">
            <h1>Connected Players ({players.length})</h1>
            {players.map(({ id, name }) => (
              <div className="connected-user" key={id}>
                {name}
              </div>
            ))}
          </div>
        </Col>
        <Col className="right-container" md={8}>
          <h1>Game Settings</h1>
          <Settings />
          {/* {`localhost:3000/game/answers/${id}`} */}
        </Col>
      </Row>
    </Container>
  );
}
