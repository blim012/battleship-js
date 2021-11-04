const Ship = require('./ship');

const Gameboard = (defaultShips = [[], []]) => {
  let ships = defaultShips;
  let missedBitBoard = 0n;

  const getMissedBitBoard = () => missedBitBoard;

  const placeShip = (playerNum, placeBitBoard) => {
    let playerShipsPlacement = getPlayerShipsPlacement(playerNum);
    if(playerShipsPlacement & placeBitBoard) // illegal placement 
      return playerShipsPlacement; 
    ships[playerNum].push(Ship(placeBitBoard));
    return playerShipsPlacement | placeBitBoard;
  };

  const receiveAttack = (playerNum, attackBitBoard) => {
    let playerShips = ships[playerNum];
    for(let i = 0; i < playerShips.length; i++) {
      if(playerShips[i].getPositionBitBoard() & attackBitBoard)
        return playerShips[i].hit(attackBitBoard);
    }
    missedBitBoard |= attackBitBoard;
    return 0n;
  };

  const getPlayerShipsPlacement = (playerNum) => {
    let playerShips = ships[playerNum];
    if(playerShips.length === 0) return 0n;
    return playerShips.reduce((playerShipsPlacement, ship) => { 
      return playerShipsPlacement | ship.getPositionBitBoard() }, 0n);
  };
  return { getMissedBitBoard, placeShip, receiveAttack };
};

module.exports = Gameboard;
