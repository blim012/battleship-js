const Player = require('../src/player');
const Gameboard = require('../src/gameboard');
const Ship = require('../src/ship');

describe('sendAttack function tests', () => {
  test('Opposing gameboard receives a receiveAttack call', () => {
    const player = Player({});
    const attackBitBoard = 0x1n;
    const receiveAttackMock = jest.fn();
    player.sendAttack(receiveAttackMock, attackBitBoard);
    expect(receiveAttackMock.mock.calls.length).toBe(1);
    expect(receiveAttackMock.mock.calls[0][0]).toBe(attackBitBoard);
  });
});
