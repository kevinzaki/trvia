import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "../features/game/gameSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
import questionsReducer from "../features/questions/questionsSlice";

export default configureStore({
  reducer: {
    game: gameReducer,
    categories: categoriesReducer,
    questions: questionsReducer
  }
});
