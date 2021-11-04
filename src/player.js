const Player = (gameboard, human = true) => {
  const sendAttack = (receiveAttackCB, attackBitBoard) => 
    receiveAttackCB(attackBitBoard);

  return { sendAttack };
}

module.exports = Player;
