import Bitboard from '../../src/logic/bitboard';

describe('getLSB function tests', () => {
  test('Returns LSB of a non-zero BigInt', () => {
    let num = 0b01101010n;
    expect(Bitboard.getLSB(num)).toBe(0b00000010n);
  });

  test('Returns LSB of zero', () => {
    let num = 0b0n;
    expect(Bitboard.getLSB(num)).toBe(0b0n);
  });
});

describe('getNumTrailingZeros function tests', () => {
  test('Returns the number of trailing zeros of a non-zero BigInt binary number', () => {
    let num = 0b10000000000n;
    expect(Bitboard.getNumTrailingZeros(num)).toBe(10);
  });

  test('Return 0 if the input is 0n', () => {
    let num = 0b0n;
    expect(Bitboard.getNumTrailingZeros(num)).toBe(0);
  });
});
