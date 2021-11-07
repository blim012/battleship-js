import Game from './logic/game.js';
import boardView from './view/boardView.js';

import './style/reset.css';
import './style/style.css';

document.addEventListener('DOMContentLoaded', () => {
  boardView.initBoards();
  boardView.initBoardReset();
  boardView.initSubscriptions();
  Game.start();
});
