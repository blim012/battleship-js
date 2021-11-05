const Player = (human = true) => {
  const sendAttack = (receiveAttackCB, attackBitBoard = 0n) =>
    human 
      ? receiveAttackCB(attackBitBoard)
      : sendRandomAttack(receiveAttackCB);

  const sendRandomAttack = (receiveAttackCB) => {
    let bitShift = Math.floor(Math.random() * 100);
    receiveAttackCB(BigInt(1 << bitShift));
  }

  return { sendAttack };
}

module.exports = Player;
