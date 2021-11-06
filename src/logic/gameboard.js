const Ship = require('./ship');

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

  const getShipsPlacement = () => {
    if(ships.length === 0) return 0n;
    return ships.reduce((shipsPlacement, ship) => { 
      return shipsPlacement | ship.getPositionBitBoard() }, 0n);
  };

  return { getNumShips, getLengthOfNextShip, getMissedBitBoard, placeShip, receiveAttack, isAllSunk };
};

module.exports = Gameboard;
