import Player from './player.js';
import Gameboard from './gameboard.js';
import pubSub from './pubSub';

const Game = (() => {
  const playerBoard = Gameboard();
  const computerBoard = Gameboard();
  const player = Player(playerBoard);
  const computer = Player(computerBoard, false);

  const placeShips = () => {
    // For now, just hardcode placement
    playerBoard.placeShip(0xF800000000000000000000000n);
    pubSub.publish('display ship', { vertical: false, length: 5, tileNum: 96 });
    playerBoard.placeShip(0x10040100400000000000000n);
    pubSub.publish('display ship', { vertical: true, length: 4, tileNum: 59 });
    playerBoard.placeShip(0x40100400000000n);
    pubSub.publish('display ship', { vertical: true, length: 3, tileNum: 35 });
    playerBoard.placeShip(0x40100400000n);
    pubSub.publish('display ship', { vertical: true, length: 3, tileNum: 23 });
    playerBoard.placeShip(0x80200n);
    pubSub.publish('display ship', { vertical: true, length: 2, tileNum: 10 });
    computerBoard.placeShip(0xF800000000000000000000000n);
    computerBoard.placeShip(0x10040100400000000000000n);
    computerBoard.placeShip(0x40100400000000n);
    computerBoard.placeShip(0x40100400000n);
    computerBoard.placeShip(0x80200n);
  };

  const start = () => {
    placeShips();
  }

  return { start };
})();

export default Game;
