import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchGameId = createAsyncThunk("game/fetchGameId", async id => {
  return id;
});

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    id: null,
    error: null,
    status: "idle",
    players: [],
    roundSettings: [],
    roundCount: 1,
    questionCount: 1,
    isRoundOver: false,
    isGameOver: false,
    scores: []
    //timer: -1
  },
  reducers: {
    incrementRound: (state, action) => {
      state.roundCount += 1;
    },
    setQuestionCount: (state, action) => {
      state.questionCount = action.payload;
    },
    incrementQuestion: (state, action) => {
      state.questionCount += 1;
    },
    setScores: (state, action) => {
      state.scores = [...action.payload];
    },
    setIsRoundOver: (state, action) => {
      state.isRoundOver = action.payload;
    },
    setIsGameOver: (state, action) => {
      state.isGameOver = action.payload;
    },
    addPlayer: (state, action) => {
      state.players.push(action.payload);
    },
    updateRoundSettings: (state, action) => {
      state.roundSettings = [...action.payload];
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
  incrementQuestion,
  incrementRound,
  setScores,
  setQuestionCount,
  setIsGameOver,
  setIsRoundOver,
  addPlayer,
  updateRoundSettings
} = gameSlice.actions;

export const roundCount = state => state.game.roundCount;
export const questionCount = state => state.game.questionCount;
export const gameId = state => state.game.id;
export const scores = state => state.game.scores;
//export const timer = state => state.game.timer;

export default gameSlice.reducer;
