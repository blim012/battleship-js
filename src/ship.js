const Ship = positionBitBoard => {
  let hitBitBoard = 0n;
  const hit = attackBitBoard =>
    hitBitBoard |= BigInt(positionBitBoard) & BigInt(attackBitBoard);
  return { hit };
};

module.exports = Ship;
