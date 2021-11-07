import Player from './player.js';
import Gameboard from './gameboard.js';
import Bitboard from './bitboard.js';
import pubSub from './pubSub';

const Game = (() => {
  const player = Player();
  const computer = Player(false);
  let playerBoard = Gameboard();
  let computerBoard = Gameboard();
  let state = 'ship placement';

  const shipPlacementStatus = (tileEvent) => {
    if(state === 'ship placement') {
      let status = playerBoard.getLengthOfNextShip();
      tileEvent.status = status;
      pubSub.publish('ship status', tileEvent);
    }
  }

  const placeShip = (shipData) => {
    if(state === 'ship placement') {
      let successful = playerBoard.placePlayerShip(shipData);
      if(successful) {
        pubSub.publish('display ship', shipData.tileNums);
        if(playerBoard.getNumShips() === 5) { // All player ships are placed
          placeComputerShips();
          pubSub.publish('ships placed');
          pubSub.publish('display message', { 
            boardType: 'player', 
            text: 'Sink the enemy ships to win!'
          });
          pubSub.publish('display message', {
            boardType: 'enemy',
            text: 'Click this board to fire at the enemy!'
          });
          state = 'play';
        }
      }
    }
  }

  const placeComputerShips = () => {
    if(state === 'ship placement') computerBoard.placeComputerShips();
  };

  const makeMove = (moveData) => {
    if(state === 'play') {
      if(playerMove(moveData)) {
        if(computerBoard.isAllSunk()) return gameover('player');
        computerMove();
        if(playerBoard.isAllSunk()) return gameover('enemy');
      }
    }
  };

  const playerMove = (moveData) => {
    let attackBitBoard = Bitboard.tileNumToBitBoard(moveData.tileNum);
    let attackResult = player.sendAttack(computerBoard.receiveAttack, attackBitBoard);
    if(attackResult < 0) return false;
    if(attackResult) { // Hit
      if(attackResult === attackBitBoard) {
        pubSub.publish('attack hit', moveData);
        pubSub.publish('display message', {
          boardType: 'player',
          text: 'You hit an enemy ship!',
          color: '#ef233c'
        }); 
      }
      else {
        let shipTileNums = Bitboard.bitboardToTileNum(attackResult);
        moveData.shipTileNums = shipTileNums;
        pubSub.publish('attack sink', moveData);
        pubSub.publish('display message', {
          boardType: 'player',
          text: 'You sunk an enemy ship!',
          color: '#ef233c'
        });
      }
    } else {
      pubSub.publish('attack miss', moveData);
      pubSub.publish('display message', {
        boardType: 'player',
        text: 'You fired and missed!'
      });
    }

    return true;
  };

  const computerMove = () => {
    let attackData = computer.sendAttack(playerBoard.receiveAttack);
    while(attackData.attackResult < 0) {
      attackData = computer.sendAttack(playerBoard.receiveAttack);
    }
    let attackResult = attackData.attackResult;
    let attackBitBoard = attackData.attackBitBoard;
    let moveData = { tileNum: attackData.tileNum, boardType: 'player' };

    if(attackResult) { // Hit
      if(attackResult === attackBitBoard) {
        pubSub.publish('attack hit', moveData);
        pubSub.publish('display message', {
          boardType: 'enemy',
          text: 'Enemy hit your ship!',
          color: '#ef233c'
        });
      }
      else {
        let shipTileNums = Bitboard.bitboardToTileNum(attackResult);
        moveData.shipTileNums = shipTileNums;
        pubSub.publish('attack sink', moveData);
        pubSub.publish('display message', {
          boardType: 'enemy',
          text: 'Enemy sunk your ship!',
          color: '#ef233c'
        });
      }
    } else {
      pubSub.publish('attack miss', moveData);
      pubSub.publish('display message', {
        boardType: 'enemy',
        text: 'Enemy fired and missed!'
      });
    }
  };

  const gameover = (winner) => {
    let loser = winner === 'player' ? 'enemy' : 'player';
    pubSub.publish('display message', {
      boardType: winner,
      text: 'Winner!',
      color: '#ef233c'
    });
    pubSub.publish('display message', {
      boardType: loser,
      text: 'Loser!'
    });
    state = 'gameover';
  };

  const resetGame = () => {
    playerBoard = Gameboard();
    computerBoard = Gameboard();
    state = 'ship placement';
    pubSub.publish('display message', {
      boardType: 'player',
      text: 'Place your ships!'
    });
  };

  const initSubscriptions = () => {
    pubSub.subscribe('player tile click', placeShip);
    pubSub.subscribe('enemy tile click', makeMove);
    pubSub.subscribe('ship preview', shipPlacementStatus);
    pubSub.subscribe('reset', resetGame);
  };

  return { initSubscriptions };
})();

export default Game;
