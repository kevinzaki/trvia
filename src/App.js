import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CreateGame from "./features/game/CreateGame";
import Question from "./features/questions/Question";
import Answers from "./features/questions/Answers";

function HomePage() {
  return (
    <Link to="/create">
      <Button variant="primary">Primary</Button>
    </Link>
  );
}

function App() {
  return (
    <Container>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/create" component={CreateGame} />
        <Route path="/game/question/:id" component={Question} />
        <Route path="/game/answers/:id" component={Answers} />
      </Switch>
    </Container>
  );
}

export default App;
