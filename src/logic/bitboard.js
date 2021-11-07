const Bitboard = (() => {
  const getLSB = (bigIntNum) => bigIntNum & ~(bigIntNum - 1n);
  const getNumTrailingZeros = (bigIntNum) => 
    bigIntNum === 0n ? 0 : Math.log2(Number(bigIntNum & ~(bigIntNum - 1n))); 
  const tileNumToBitBoard = (tileNum) =>
    1n << BigInt((tileNum - 1));
  const bitboardToTileNum = (bitboard) => {
    let tileNums = [];
    while(bitboard != 0) {
      tileNums.push(getNumTrailingZeros(bitboard) + 1);
      bitboard &= (bitboard - 1n);
    }
    return tileNums;
  }

  return { getLSB, getNumTrailingZeros, tileNumToBitBoard, bitboardToTileNum };
})();

module.exports = Bitboard;
