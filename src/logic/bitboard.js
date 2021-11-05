const Bitboard = (() => {
  const getLSB = (bigIntNum) => bigIntNum & ~(bigIntNum - 1n);
  const getNumTrailingZeros = (bigIntNum) => 
    bigIntNum === 0n ? 0 : Math.log2(Number(bigIntNum & ~(bigIntNum - 1n))); 

  return { getLSB, getNumTrailingZeros };
})();

export default Bitboard;
