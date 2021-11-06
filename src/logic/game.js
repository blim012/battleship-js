import Player from './player.js';
import Gameboard from './gameboard.js';
import Bitboard from './bitboard.js';
import pubSub from './pubSub';

const Game = (() => {
  const playerBoard = Gameboard();
  const computerBoard = Gameboard();
  const player = Player();
  const computer = Player(false);
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
      let shipLength = playerBoard.getLengthOfNextShip();
      shipData.tileNums.splice(shipLength);
      if(shipData.tileNums.length === shipLength) {
        let placeBitBoard = shipData.tileNums.reduce((prev, curr) => {
          return prev | Bitboard.tileNumToBitBoard(curr) }, 0n);
        let placeResult = playerBoard.placeShip(placeBitBoard);
        if((placeResult & placeBitBoard) === placeBitBoard) {
          pubSub.publish('display ship', shipData.tileNums);
          if(playerBoard.getNumShips() === 5) { // All player ships are placed
            placeComputerShips();
            // pubSub some function to display enemy board / hide rotate toggle
            state = 'play';
          }
        }
      }
    }
  }

  const placeComputerShips = () => {
    if(state === 'ship placement') {
      while(computerBoard.getNumShips() < 5) {
        let shipTileNums = [];
        let shipLength = computerBoard.getLengthOfNextShip();
        let vertical = Math.floor(Math.random() * 2);
        let tileOffset = vertical ? 10 : 1;
        let randTileNum = getRandTileNum(shipLength, vertical);
        for(let i = 0; i < shipLength; i++) 
          shipTileNums.push(randTileNum + (tileOffset * i));
        let placeBitBoard = shipTileNums.reduce((prev, curr) => {
          return prev | Bitboard.tileNumToBitBoard(curr) }, 0n);
        computerBoard.placeShip(placeBitBoard);
      }
    }
  };

  const getRandTileNum  = (shipLength, vertical) => {
    if(vertical) return Math.floor(Math.random() * (110 - (shipLength * 10))) + 1;
    let randTileNumOnes = Math.floor(Math.random() * (10 - (shipLength - 1))) + 1;
    let randTileNumTens = Math.floor(Math.random() * 10) * 10;
    return randTileNumOnes + randTileNumTens;
  }

  const makeMove = (moveData) => {
    if(state === 'play') {
      if(playerMove(moveData)) {
        if(computerBoard.isAllSunk()) return gameover('player');
        computerMove();
        if(playerBoard.isAllSunk()) return gameover('computer');
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
        console.log('Hit the comp'); 
      }
      else {
        let shipTileNums = Bitboard.bitboardToTileNum(attackResult);
        moveData.shipTileNums = shipTileNums;
        pubSub.publish('attack sink', moveData);
        console.log('Sunk the comp');
      }
    } else {
      pubSub.publish('attack miss', moveData);
      console.log('missed the comp');
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
        console.log('Hit the player');
      }
      else {
        let shipTileNums = Bitboard.bitboardToTileNum(attackResult);
        moveData.shipTileNums = shipTileNums;
        pubSub.publish('attack sink', moveData);
        console.log('Sunk the player');
      }
    } else {
      pubSub.publish('attack miss', moveData);
      console.log('missed the player');
    }
  };

  const gameover = (winner) => {
    console.log(winner);
    state = 'gameover';
    pubSub.publish('gameover', winner);
  }

  const initSubscriptions = () => {
    pubSub.subscribe('player tile click', placeShip);
    pubSub.subscribe('enemy tile click', makeMove);
    pubSub.subscribe('ship preview', shipPlacementStatus);
  };

  const start = () => {
    initSubscriptions();
  }

  return { start };
})();

export default Game;
