import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Board from "../components/board/Board";
import DarkModeButton from "../components/DarkModeButton";
import Keyboard from "../components/keyboard/Keyboard";
import seedrandom from "seedrandom";
import answers from "../answers";
import { useEffect } from "react";
import { useAppDispatch } from "../state/hooks";
import {
  addLetter,
  evaluateRow,
  removeLetter,
  setSolution,
} from "../state/gameSlice";

export const getServerSideProps: GetServerSideProps<{
  solution: string;
}> = async (context) => {
  const rng = seedrandom(new Date().toDateString());
  const index = Math.floor(rng() * answers.length);
  const solution = answers[index];
  return {
    props: {
      solution,
    },
  };
};

export default function Home({
  solution,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setSolution(solution));
  }, []);

  const handleLetter = (letter: string) => {
    dispatch(addLetter(letter));
  };

  const handleBackspace = () => {
    dispatch(removeLetter());
  };

  const handleSubmit = () => {
    dispatch(evaluateRow());
  };

  const darkMode = true;

  return (
    <div
      className={`${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      } w-screen h-screen`}
    >
      <Head>
        <title>Next.js Wordle Clone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="w-full flex justify-center items-center border-b-gray-500 border-b-2">
        <div className="text-2xl font-bold">Wordle Clone</div>
        <div className="absolute right-0 pr-4 flex justify-center items-center">
          <DarkModeButton onClick={() => null} darkMode={darkMode} />
        </div>
      </header>
      <main className="flex flex-col items-center">
        <div className="grow flex justify-center items-center">
          <Board solution={solution} />
        </div>
        {solution}
        <Keyboard
          onLetter={handleLetter}
          onBackspace={handleBackspace}
          onEnter={handleSubmit}
        />
      </main>
    </div>
  );
}
