const Ship = require('../../src/logic/ship');

describe('hit function tests', () => {
  test('Marks the part of the ship that was hit when attack hits', () => {
    let ship = Ship(0x40100400000n); // C3 -> C5, length 3 ship
    let attackBitBoard = 0x40000000000n; // Attack on C5
    let result = ship.hit(attackBitBoard);
    expect(result).toBe(0x40000000000n);

    attackBitBoard = 0x00100000000n;
    result = ship.hit(attackBitBoard);
    expect(result).toBe(0x40100000000n);
  });
  
  test('Does not mark any part of the ship as hit when attack misses', () => {
    let ship = Ship(0x40100400000n); // C3 -> C5, length 3 ship
    let attackBitBoard = 0x80000000000n; // Attack on D5
    let result = ship.hit(attackBitBoard);
    expect(result).toBe(0n);
  });

  test('Handles large integer bitboards correctly', () => {
    let ship = Ship(0x8000000000000000000000000n); // J10, length 1 ship
    let attackBitBoard = 0x8000000000000000000000000n // Attack on J10
    let result = ship.hit(attackBitBoard);
    expect(result).toBe(0x8000000000000000000000000n);
  });
});

describe('isSunk function tests', () => {
  let ship = Ship(0x40100400000n);

  test('isSunk returns true when ship is completely hit', () => {
    let result = ship.isSunk(0x40300400000n);
    expect(result).toBe(true);
  });

  test('isSunk returns false when ship is not completely hit', () => {
    let result = ship.isSunk(0x40200400000n);
    expect(result).toBe(false);
  });
});
