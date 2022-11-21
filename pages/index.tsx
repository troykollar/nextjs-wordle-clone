import { useEffect, useState } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { FaGithub } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import seedrandom from "seedrandom";
import answers from "../answers";
import Board from "../components/board/Board";
import DarkModeButton from "../components/DarkModeButton";
import Keyboard from "../components/keyboard/Keyboard";
import Modal from "../components/Modal";
import {
  addLetter,
  evaluateRow,
  removeLetter,
  setSolution,
} from "../state/gameSlice";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setDarkMode } from "../state/settingsSlice";

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
  const [winModal, setWinModal] = useState(false);
  const [failModal, setFailModal] = useState(false);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const status = useAppSelector((state) => state.game.status);

  useEffect(() => {
    dispatch(setSolution(solution));
  }, [dispatch, solution]);

  useEffect(() => {
    if (status === "WIN") setWinModal(true);
    else if (status === "FAIL") setFailModal(true);
  }, [status]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      dispatch(setDarkMode(true));
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

  return (
    <div className={`flex h-full w-full flex-col bg-light-bg dark:bg-dark-bg`}>
      <Head>
        <title>Next.js Wordle Clone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex h-16 w-full items-center justify-center border-b-2 border-b-gray-500 text-black dark:text-white">
        <div className="absolute left-0 flex items-center justify-center pl-4">
          <a href="https://github.com/troykollar/nextjs-wordle-clone">
            <FaGithub size={24} />
          </a>
        </div>
        <div className="text-2xl font-bold">Wordle Clone</div>
        <div className="absolute right-0 flex items-center justify-center pr-4">
          <DarkModeButton
            onClick={() => dispatch(setDarkMode(!settings.darkMode))}
            darkMode={settings.darkMode}
          />
        </div>
      </header>
      <main className="flex grow flex-col items-center">
        <Toaster />
        <div className="flex grow items-center justify-center">
          <Board solution={solution} />
        </div>
        <Modal
          open={winModal}
          onClose={() => setWinModal(false)}
          title="Winner!"
        >
          Congrats! You won!
        </Modal>
        <Modal
          open={failModal}
          onClose={() => setFailModal(false)}
          title="Better luck next time!"
        >
          The word was <b className="uppercase">{solution}</b>. Better luck next
          time!
        </Modal>
        <Keyboard
          onLetter={handleLetter}
          onBackspace={handleBackspace}
          onEnter={handleSubmit}
        />
      </main>
    </div>
  );
}
