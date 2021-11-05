const Player = require('../../src/logic/player');


describe('sendAttack function tests', () => {
  test('Opposing gameboard receives a receiveAttack call', () => {
    const player = Player();
    const attackBitBoard = 0x1n;
    const receiveAttackMock = jest.fn();
    player.sendAttack(receiveAttackMock, attackBitBoard);
    expect(receiveAttackMock.mock.calls.length).toBe(1);
    expect(receiveAttackMock.mock.calls[0][0]).toBe(attackBitBoard);
  });
});

describe('sendRandomAttack function tests', () => {
  test('Opposing gameboard receives a receiveAttack call, with bitboard from Math.random', () => {
    const player = Player(false);
    const receiveAttackMock = jest.fn();
    player.sendAttack(receiveAttackMock);
    expect(receiveAttackMock.mock.calls.length).toBe(1);
  });
})
