import Game from './logic/game.js';
import boardView from './view/boardView.js';

import './style/reset.css';
import './style/style.css';

boardView.initBoards();
boardView.initSubsciptions();

Game.start();
