import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Evaluation } from "../styles/evaluation";

const maxLetters = 5;

interface GameState {
  solution: string;
  boardState: string[];
  evaluations: Evaluation[][];
  letterStatus: { [letter: string]: Evaluation };
  currentRowIndex: number;
  status: "IN_PROGRESS" | "FAIL" | "WIN" | "EVALUATE_IN_PROGRESS";
}

const initialState: GameState = {
  solution: "",
  boardState: ["", "", "", "", "", ""],
  evaluations: [],
  letterStatus: {},
  currentRowIndex: 0,
  status: "IN_PROGRESS",
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setSolution: (state, action: PayloadAction<string>) => {
      state.solution = action.payload;
    },
    addLetter: (state, action: PayloadAction<string>) => {
      if (state.status !== "IN_PROGRESS") return;
      if (state.boardState[state.currentRowIndex].length === maxLetters) return;

      const letter = action.payload;
      state.boardState[state.currentRowIndex] += letter;
    },
    removeLetter: (state) => {
      if (state.status !== "IN_PROGRESS") return;
      if (!state.boardState[state.currentRowIndex].length) return;

      state.boardState[state.currentRowIndex] = state.boardState[
        state.currentRowIndex
      ].slice(0, -1);
    },
    evaluateRow: (state) => {
      if (
        state.boardState[state.currentRowIndex].length < 5 ||
        state.status !== "IN_PROGRESS"
      )
        return;

      state.status = "EVALUATE_IN_PROGRESS";

      const guess = state.boardState[state.currentRowIndex];
      state.evaluations.push(
        Array.from(guess).map((guessedLetter, guessedLetterIndex) => {
          if (state.solution.at(guessedLetterIndex) === guessedLetter) {
            state.letterStatus[guessedLetter] = "correct";
            return "correct";
          } else if (state.solution.includes(guessedLetter)) {
            if (!state.letterStatus[guessedLetter])
              state.letterStatus[guessedLetter] = "present";
            return "present";
          } else {
            if (!state.letterStatus[guessedLetter])
              state.letterStatus[guessedLetter] = "absent";
            return "absent";
          }
        })
      );
    },
    lastTileReveal: (state) => {
      const guess = state.boardState[state.currentRowIndex];
      if (guess === state.solution) state.status = "WIN";
      else if (state.currentRowIndex === state.boardState.length)
        state.status = "FAIL";
      else state.status = "IN_PROGRESS";
      state.currentRowIndex++;
    },
  },
});

export const {
  setSolution,
  addLetter,
  removeLetter,
  evaluateRow,
  lastTileReveal,
} = gameSlice.actions;
export default gameSlice.reducer;