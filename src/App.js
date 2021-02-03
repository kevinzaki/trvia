import React from "react";
import "./App.css";
import { BrowserRouter as Switch, Route } from "react-router-dom";
import CreateGame from "./features/game/CreateGame";
import Question from "./features/questions/Question";
import Answers from "./features/questions/Answers";

// function HomePage() {
//   return (
//     <Link to="/create">
//       <Button variant="primary">Primary</Button>
//     </Link>
//   );
// }

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={CreateGame} />
        {/* <Route exact path="/create" component={CreateGame} /> */}
        <Route path="/game/question/:id" component={Question} />
        <Route path="/game/answers/:id" component={Answers} />
      </Switch>
    </div>
  );
}

export default App;
