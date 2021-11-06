const Ship = positionBitBoard => {
  let hitBitBoard = 0n;
  
  const getPositionBitBoard = () => positionBitBoard;
  const getHitBitBoard = () => hitBitBoard; 
  const hit = attackBitBoard =>
    hitBitBoard |= BigInt(positionBitBoard) & BigInt(attackBitBoard);
  const isSunk = (bitboard = hitBitBoard) => 
    (Boolean)((bitboard & positionBitBoard) === positionBitBoard);
  return { getPositionBitBoard, getHitBitBoard, hit, isSunk };
};

module.exports = Ship;
