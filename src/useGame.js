import { useState, useEffect } from 'react';
import english from './data/english.json';
import polish from './data/polish.json';
import { playKeySound, playWinSound, playLoseSound } from './utils/soundEffects';
import hangman0 from './images/hangman0.png';
import hangman1 from './images/hangman1.png';
import hangman2 from './images/hangman2.png';
import hangman3 from './images/hangman3.png';
import hangman4 from './images/hangman4.png';
import hangman5 from './images/hangman5.png';
import hangman6 from './images/hangman6.png';

const useGame = () => {
  const languages = {
    english: english,
    polish: polish,
  };
  const [userWords, setUserWords] = useState({ easy: [], medium: [], hard: [] });

  const [showTranslation, setShowTranslation] = useState(false);
  const [translation, setTranslation] = useState('');

  const [language, setLanguage] = useState('english');
  const [difficulty, setDifficulty] = useState('easy');
  const [words, setWords] = useState(languages[language][difficulty]);
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [remainingGuesses, setRemainingGuesses] = useState(6);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const hangmanImages = [hangman0,hangman1, hangman2, hangman3, hangman4, hangman5, hangman6];
  const hangmanImg = hangmanImages[6 - remainingGuesses];

  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const [wordsUpdated, setWordsUpdated] = useState(false);


  const regex = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻa-zA-Z]/;

  useEffect(() => {
    setWords(languages[language][difficulty]);
    console.log('Current words:', languages[language][difficulty]);
  }, [language, difficulty]);

  useEffect(() => {
    startNewGame();  // start a new game whenever the words change
  }, [words]);

  const startNewGame = () => {
    const allWords = [...words, ...userWords[difficulty]];
    const randomIndex = Math.floor(Math.random() * allWords.length);
    const randomWordObj = allWords[randomIndex];
    setWord(randomWordObj.word);
    setTranslation(randomWordObj.translation);
    setGuesses([]);
    setRemainingGuesses(6);
    setCurrentGuess('');
    setGameOver(false);
    setWin(false);
    setShowTranslation(false);
  };
  

  useEffect(() => {
    const combinedWords = [...languages[language][difficulty], ...userWords[difficulty]];
    setWords(combinedWords);
  }, [language, difficulty, userWords, wordsUpdated]);


  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  const calculateWinRate = () => {
    const totalGames = wins + losses;
    return totalGames > 0 ? (wins / totalGames * 100).toFixed(2) : 0;
  };

  const guessLetter = () => {
    if (word.includes(currentGuess) && !guesses.includes(currentGuess) && currentGuess !== '' && currentGuess.match(regex)) {
      setGuesses((oldGuesses) => [...oldGuesses, currentGuess]);
      playKeySound(); // Dodaj wywołanie funkcji odtwarzającej dźwięk stukania klawiszy
    } else if (!word.includes(currentGuess) && !guesses.includes(currentGuess) && currentGuess !== '' && currentGuess.match(regex)) {
      setRemainingGuesses((oldGuesses) => oldGuesses - 1);
      setGuesses((oldGuesses) => [...oldGuesses, currentGuess]);
    } else if (!currentGuess.match(regex)) {
      alert('Please enter a letter');
    } else {
      alert('You already guessed that letter!');
    }
    setCurrentGuess('');
  };

  useEffect(() => {
    if (remainingGuesses === 0) {
      setGameOver(true);
      setLosses((oldLosses) => oldLosses + 1);
      playLoseSound(); // Dodaj wywołanie funkcji odtwarzającej dźwięk przegranej
    }

    if (word.length > 0 && word.split('').every((letter) => guesses.includes(letter))) {
      setGameOver(true);
      setWin(true);
      setWins((oldWins) => oldWins + 1);
      playWinSound(); // Dodaj wywołanie funkcji odtwarzającej dźwięk wygranej
    }

  }, [guesses, remainingGuesses]);

  const addUserWord = (newWord, difficultyLevel) => {
    if (newWord && difficultyLevel) {
      setUserWords((prevWords) => {
        return { ...prevWords, [difficultyLevel]: [...prevWords[difficultyLevel], newWord.toUpperCase()] }
      });
      setWordsUpdated(prevState => !prevState);
    }
  };

  return {
    word,
    guesses,
    guessLetter,
    remainingGuesses,
    hangmanImg,
    currentGuess,  // export the current guess and its setter
    setCurrentGuess,
    gameOver,
    win,
    startNewGame,
    wins,
    losses,
    calculateWinRate,
    changeLanguage,
    changeDifficulty,
    addUserWord,
    showTranslation,
    setShowTranslation,
    translation
  };
};

export default useGame;
