const Gameboard = require('../src/gameboard');
const Ship = require('../src/ship');

describe('placeShip function tests', () => {
  test('Places ship if placement is legal, returns updated ship placements', () =>
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

  test('Does not place a ship if placement is illegal, returns non-updated ship placements', () =>{
    const gameboard = Gameboard()
    let playerNum = 0;
    let placeBitBoard = 0xFn; // A1 -> D1, Length 4 ship
    expect(gameboard.placeShip(playerNum, placeBitBoard)).toBe(0xFn);
    placeBitBoard = 0x401n // A1 -> A2, Length 2 ship
    expect(gameboard.placeShip(playerNum, placeBitBoard)).toBe(0xFn);
  });
});

describe('receiveAttack function tests', () => {
  test('Update hit bitboard on successful hit, returns updated hitBitBoard of ship', () => {
    const gameboard = Gameboard([[Ship(0xFn)], []]); // Player 1 has one ship, at A1 -> D1
    let playerNum = 0;
    let attackBitBoard = 0x1n; // Attack at A1
    expect(gameboard.receiveAttack(playerNum, attackBitBoard)).toBe(0x1n);
    attackBitBoard = 0x2n;
    expect(gameboard.receiveAttack(playerNum, attackBitBoard)).toBe(0x3n);
    attackBitBoard = 0x8n;
    expect(gameboard.receiveAttack(playerNum, attackBitBoard)).toBe(0xBn);
  });

  test('Update missed shot bitboard on missed hit, returns 0n', () => {
    const gameboard = Gameboard([[Ship(0xFn)], []]); // Player 1 has one ship, at A1 -> D1
    let playerNum = 0;
    let attackBitBoard = 0x10n; // Attack at E1
    expect(gameboard.receiveAttack(playerNum, attackBitBoard)).toBe(0n);
    expect(gameboard.getMissedBitBoard()).toBe(attackBitBoard);
    attackBitBoard = 0x400n; // Attack at A2
    expect(gameboard.receiveAttack(playerNum, attackBitBoard)).toBe(0n);
    expect(gameboard.getMissedBitBoard()).toBe(0x410n);
  });
});
