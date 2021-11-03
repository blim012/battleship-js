const Gameboard = require('../src/gameboard');

describe('placeShip function tests', () => {
  test('Places ship if placement is legal', () =>
  {
    const gameboard = Gameboard()
    let playerNum = 0;
    let placeBitBoard = 0xFn; // A1 -> D1, Length 4 ship
    expect(gameboard.placeShip(playerNum, placeBitBoard)).toBe(0xFn);
    placeBitBoard = 0xF0n; // E1 -> H1, Length 4 ship
    expect(gameboard.placeShip(playerNum, placeBitBoard)).toBe(0xFFn);
    placeBitBoard = 0x400n; // A2, Length 1 ship
    expect(gameboard.placeShip(playerNum, placeBitBoard)).toBe(0x4FFn);
  });

  test('Does not place a ship if placement is illegal', () =>{
    const gameboard = Gameboard()
    let playerNum = 0;
    let placeBitBoard = 0xFn; // A1 -> D1, Length 4 ship
    expect(gameboard.placeShip(playerNum, placeBitBoard)).toBe(0xFn);
    placeBitBoard = 0x401n // A1 -> A2, Length 2 ship
    expect(gameboard.placeShip(playerNum, placeBitBoard)).toBe(0xFn);
  });
});
