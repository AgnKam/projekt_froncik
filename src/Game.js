import React, { useState } from 'react';
import useGame from './useGame';
import { useFormik } from 'formik';

function Game() {
  const {
    changeDifficulty,
    changeLanguage,
    word,
    guesses,
    guessLetter,
    remainingGuesses,
    hangmanImg,
    currentGuess,
    setCurrentGuess,
    gameOver,
    win,
    startNewGame,
    wins,
    losses,
    calculateWinRate,
    addUserWord,
  } = useGame();

  const formik = useFormik({
    initialValues: {
      newWord: '',
      newWordDifficulty: 'easy',
      newWordLanguage: 'english',
    },
    onSubmit: values => {
      addUserWord(values.newWord, values.newWordDifficulty, values.newWordLanguage);
      formik.resetForm();
    },
  });


  return (
    <div>
      <h1>Game Screen</h1>
      <img src={hangmanImg} alt="Hangman" />
      <br></br>
      <button onClick={() => changeDifficulty('easy')}>Easy</button>
      <button onClick={() => changeDifficulty('medium')}>Medium</button>
      <button onClick={() => changeDifficulty('hard')}>Hard</button>
      <br></br>
      <br></br>
      <button onClick={() => changeLanguage('english')}>Język Angielski</button>
      <button onClick={() => changeLanguage('polish')}>Język Polski</button>
      <p>
        Word to guess:
        {gameOver ? word : word.split('').map((letter) => (guesses.includes(letter) ? letter : '_')).join(' ')}
      </p>
      <p>Used letters: {guesses.join(', ')}</p>
      <p>Remaining guesses: {remainingGuesses}</p>
      <p>Win Rate: {calculateWinRate()}%</p>
      <p>Wins: {wins}</p>
      <p>Losses: {losses}</p>
      <input
        type="text"
        value={currentGuess}
        onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
        maxLength={1}
      />
      <button onClick={guessLetter} disabled={gameOver}>Guess Letter</button>
      {gameOver && (win ? <p>You win!</p> : <p>You lose!</p>)}
      {gameOver && <button onClick={startNewGame}>Start New Game</button>}
      <br></br>
      {/* Add word form */}
      <form onSubmit={formik.handleSubmit}>
        <input
          id="newWord"
          name="newWord"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.newWord}
          placeholder="Add a new word"
        />
        <select
          id="newWordDifficulty"
          name="newWordDifficulty"
          onChange={formik.handleChange}
          value={formik.values.newWordDifficulty}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select
          id="newWordLanguage"
          name="newWordLanguage"
          onChange={formik.handleChange}
          value={formik.values.newWordLanguage}
        >
          <option value="english">English</option>
          <option value="polish">Polish</option>
        </select>
        <button type="submit">Add word</button>
      </form>
    </div>
  );
}

export default Game;