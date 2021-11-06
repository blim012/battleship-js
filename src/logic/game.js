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
        }
      }
    }
  }

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

  const makeMove = (moveData) => {
    switch(state) {
      case 'ship placement':
        if(moveData.boardType === 'player') {
          console.log('ship placement click');

        }
        break;

      case 'play':
        if(moveData.boardType === 'enemy') {
          if(playerMove(moveData)) {
            if(computerBoard.isAllSunk()) return gameover('player');
            computerMove();
            if(playerBoard.isAllSunk()) return gameover('computer');
          }
        }
        break;

      case 'gameover':
        break;
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
    //placeShips();
  }

  return { start };
})();

export default Game;
