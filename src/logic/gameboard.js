const Ship = require('./ship');
const Bitboard = require('./bitboard');

const Gameboard = (defaultShips = []) => {
  let ships = defaultShips;
  let missedBitBoard = 0n;

  const getNumShips = () => ships.length;

  const getLengthOfNextShip = () => {
    let shipLengths = [5, 4, 3, 3, 2];
    return shipLengths[ships.length];
  };

  const getMissedBitBoard = () => missedBitBoard;

  const placeShip = (placeBitBoard) => {
    let shipsPlacement = getShipsPlacement();
    if(shipsPlacement & placeBitBoard) // illegal placement 
      return shipsPlacement; 
    ships.push(Ship(placeBitBoard));
    return shipsPlacement | placeBitBoard;
  };

  const placePlayerShip = (shipData) => {
    let shipLength = getLengthOfNextShip();
    shipData.tileNums.splice(shipLength);
    if(shipData.tileNums.length === shipLength) {
      let placeBitBoard = shipData.tileNums.reduce((prev, curr) => {
        return prev | Bitboard.tileNumToBitBoard(curr);
      }, 0n);
      let placeResult = placeShip(placeBitBoard);
      return (Boolean)((placeResult & placeBitBoard) === placeBitBoard);
    }
  };

  const placeComputerShips = () => {
    while(getNumShips() < 5) {
      let shipTileNums = [];
      let shipLength = getLengthOfNextShip();
      let vertical = Math.floor(Math.random() * 2);
      let tileOffset = vertical ? 10 : 1;
      let randTileNum = getRandTileNum(shipLength, vertical);
      for(let i = 0; i < shipLength; i++) 
        shipTileNums.push(randTileNum + (tileOffset * i));
      let placeBitBoard = shipTileNums.reduce((prev, curr) => {
        return prev | Bitboard.tileNumToBitBoard(curr) }, 0n);
      placeShip(placeBitBoard);
    }
  };

  const receiveAttack = (attackBitBoard) => {
    if(missedBitBoard & attackBitBoard) return -1;
    for(let i = 0; i < ships.length; i++) {
      if(ships[i].getHitBitBoard() & attackBitBoard) return -1;
      let positionBitBoard = ships[i].getPositionBitBoard();
      if(positionBitBoard & attackBitBoard) {
        let resultBitBoard = ships[i].hit(attackBitBoard);
        return (((resultBitBoard & positionBitBoard) === positionBitBoard)
                ? positionBitBoard
                : attackBitBoard);
      }
    }
    missedBitBoard |= attackBitBoard;
    return 0n;
  };

  const isAllSunk = () => {
    for(let i = 0; i < ships.length; i++) {
      if(!ships[i].isSunk()) return false;
    }
    return true;
  };

  const getRandTileNum  = (shipLength, vertical) => {
    if(vertical) return Math.floor(Math.random() * (110 - (shipLength * 10))) + 1;
    let randTileNumOnes = Math.floor(Math.random() * (10 - (shipLength - 1))) + 1;
    let randTileNumTens = Math.floor(Math.random() * 10) * 10;
    return randTileNumOnes + randTileNumTens;
  };

  const getShipsPlacement = () => {
    if(ships.length === 0) return 0n;
    return ships.reduce((shipsPlacement, ship) => { 
      return shipsPlacement | ship.getPositionBitBoard() }, 0n);
  };

  return { getNumShips, getLengthOfNextShip, getMissedBitBoard, placePlayerShip, placeComputerShips, placeShip, receiveAttack, isAllSunk };
};

module.exports = Gameboard;
