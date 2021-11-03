const Ship = require('../src/ship');

describe('hit function tests', () => {
  test('hit returns true when ship is hit', () => {
    let ship = Ship(0x40100400000); // C3 -> C5, length 3 ship
    let attackBitBoard = 0x40000000000; // Attack on C3
    let result = ship.hit(attackBitBoard);
    expect(result).toBeTruthy();
  });
  
  test('hit returns false when attack misses ship', () => {
    let ship = Ship(0x40100400000); // C3 -> C5, length 3 ship
    let attackBitBoard = 0x80000000000; // Attack on D3
    let result = ship.hit(attackBitBoard);
    expect(result).toBeFalsy();
  });

  test('hit handles large integer bitboards correctly', () => {
    let ship = Ship(0x8000000000000000000000000); // J10, length 1 ship
    let attackBitBoard = 0x4000000000000000000000000 // Attack on I10
    let result = ship.hit(attackBitBoard);
    expect(result).toBeFalsy();
  });
});
