const Ship = positionBitBoard => {
  let _hitBitBoard = 0n;
  const hit = attackBitBoard =>
    _hitBitBoard |= BigInt(positionBitBoard) & BigInt(attackBitBoard);
  const isSunk = (hitBitBoard = _hitBitBoard) => 
    (Boolean)((hitBitBoard & positionBitBoard) === positionBitBoard);
  return { hit, isSunk };
};

module.exports = Ship;
