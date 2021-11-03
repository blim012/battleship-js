/*
const FactoryFunction = string => {
  const capitalizeString = () => string.toUpperCase();
  const printString = () => console.log(`----${capitalizeString()}----`);
  return { printString };
};
*/

const Ship = positionBitBoard => {
  const hit = attackBitBoard => BigInt(positionBitBoard) & BigInt(attackBitBoard);
  return { hit };
};

module.exports = Ship;
