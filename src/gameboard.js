const Ship = require('./ship');

const Gameboard = () => {
  let ships = [[], []];

  const placeShip = (playerNum, placeBitBoard) => {
    let playerShipsPlacement = getPlayerShipsPlacement(playerNum);
    if(playerShipsPlacement & placeBitBoard) // illegal placement 
      return playerShipsPlacement; 
    ships[playerNum].push(Ship(placeBitBoard));
    return playerShipsPlacement | placeBitBoard;
  };

  const getPlayerShipsPlacement = (playerNum) => {
    let playerShips = ships[playerNum];
    if(playerShips.length === 0) return 0n;
    return playerShips.reduce((playerShipsPlacement, ship) => { 
      return playerShipsPlacement | ship.getPositionBitBoard() }, 0n);
  };
  return { placeShip };
};

module.exports = Gameboard;
