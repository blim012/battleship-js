const Ship = require('./ship');

const Gameboard = (defaultShips = []) => {
  let ships = defaultShips;
  let missedBitBoard = 0n;

  const getMissedBitBoard = () => missedBitBoard;

  const placeShip = (placeBitBoard) => {
    let shipsPlacement = getShipsPlacement();
    if(shipsPlacement & placeBitBoard) // illegal placement 
      return shipsPlacement; 
    ships.push(Ship(placeBitBoard));
    return shipsPlacement | placeBitBoard;
  };

  const receiveAttack = (attackBitBoard) => {
    for(let i = 0; i < ships.length; i++) {
      if(ships[i].getPositionBitBoard() & attackBitBoard)
        return ships[i].hit(attackBitBoard);
    }
    missedBitBoard |= attackBitBoard;
    return 0n;
  };

  const isAllSunk = () => {
    
  };

  const getShipsPlacement = () => {
    if(ships.length === 0) return 0n;
    return ships.reduce((shipsPlacement, ship) => { 
      return shipsPlacement | ship.getPositionBitBoard() }, 0n);
  };
  return { getMissedBitBoard, placeShip, receiveAttack, isAllSunk };
};

module.exports = Gameboard;
