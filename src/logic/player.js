const Player = (human = true) => {
  const sendAttack = (receiveAttackCB, attackBitBoard = 0n) =>
    human 
      ? receiveAttackCB(attackBitBoard)
      : sendRandomAttack(receiveAttackCB);

  const sendRandomAttack = (receiveAttackCB) => {
    let bitShift = Math.floor(Math.random() * 100);
    let attackBitBoard = 1n << BigInt(bitShift);
    let tileNum = bitShift + 1;
    return { attackResult: receiveAttackCB(attackBitBoard), attackBitBoard, tileNum };
  }

  return { sendAttack };
}

module.exports = Player;
