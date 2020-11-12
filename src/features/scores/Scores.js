import React from "react";
import { scores } from "../game/gameSlice";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";

export default function Scores() {
  const gameScores = useSelector(scores);
  const roundOver = useSelector(state => state.game.isRoundOver);
  if (!roundOver) return null;
  return (
    <div>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Place</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {gameScores.map((score, idx) => (
            <tr>
              <td>{idx + 1}</td>
              <td>{score.name}</td>
              <td>{score.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
