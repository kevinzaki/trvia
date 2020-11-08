import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchGameId = createAsyncThunk("game/fetchGameId", async id => {
  return id;
});

// export const setTimer = createAsyncThunk(
//   "game/setTimer",
//   async (time) => {
//     const res = await setTimeout(() => dispatch(updateTimer(13)), 1000);
//   }
// )

// export const fetchQuestions = createAsyncThunk(
//   "questions/fetchQuestions",
//   async ({ numOfQuestions, categoryId }) => {
//     const res = await getQuestions(numOfQuestions, categoryId);
//     return res;
//   }
// );

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    id: null,
    error: null,
    status: "idle",
    players: [],
    selectedCategories: [],
    numberOfRounds: 3,
    numberOfQuestionsPerRound: 10,
    currentRound: 12,
    currentQuestion: 10
    //timer: -1
  },
  reducers: {
    setNumberOfRounds: (state, action) => {
      state.numberOfRounds = action.payload;
    },
    setNumberOfQuestionsPerRound: (state, action) => {
      state.numberOfQuestionsPerRound = action.payload;
    },
    updateSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    }
    // updateTimer: (state, action) => {
    //   state.timer = action.paylod;
    // }
  },
  extraReducers: {
    [fetchGameId.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchGameId.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.id = action.payload;
    },
    [fetchGameId.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    }
  }
});

export const {
  setNumberOfRounds,
  setNumberOfQuestionsPerRound,
  updateSelectedCategories
  //updateTimer
} = gameSlice.actions;

export const numberOfQuestionsPerRound = state =>
  state.game.numberOfQuestionsPerRound;
export const numberOfRounds = state => state.game.numberOfRounds;
export const currentRound = state => state.game.currentRound;
export const currentQuestion = state => state.game.currentQuestion;
export const gameId = state => state.game.id;
export const categories = state => state.game.selectedCategories;
//export const timer = state => state.game.timer;

export default gameSlice.reducer;
