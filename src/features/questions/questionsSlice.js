import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//import { getQuestions } from "../../api/client";

// export const fetchQuestions = createAsyncThunk(
//   "questions/fetchQuestions",
//   async ({ numOfQuestions, categoryId }) => {
//     const res = await getQuestions(numOfQuestions, categoryId);
//     return res;
//   }
// );

export const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    question: null,
    answers: [],
    correctAnswer: null
  },
  reducers: {
    setQuestion: (state, action) => {
      state.question = action.payload;
    },
    setAnswers: (state, action) => {
      state.answers = action.payload;
    },
    setCorrectAnswer: (state, action) => {
      state.correctAnswer = action.payload;
    }
  }
});

export const {
  setQuestion,
  setAnswers,
  setCorrectAnswer
} = questionsSlice.actions;

export const currentQuestion = state => state.questions.question;
export const allAnswers = state => state.questions.answers;
export const correctAns = state => state.questions.correctAnswer;

export default questionsSlice.reducer;
