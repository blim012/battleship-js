const Player = (human = true) => {
  let attackStack = [];

  const sendAttack = (receiveAttackCB, attackBitBoard = 0n) =>
    human 
      ? receiveAttackCB(attackBitBoard)
      : sendRandomAttack(receiveAttackCB);

  const sendRandomAttack = (receiveAttackCB) => {
    let bitShift = attackStack.length > 0 
      ? attackStack.pop() - 1
      : Math.floor(Math.random() * 100);
    let attackBitBoard = 1n << BigInt(bitShift);
    let tileNum = bitShift + 1;
    let attackResult = receiveAttackCB(attackBitBoard); //attackBitBoard
    if(attackResult > 0) { // Hit
      if(attackResult === attackBitBoard) // Hit, no sink
        queueAdjacentAttacks(tileNum);
      else emptyAttackStack(); // Sink 
    }
    return { attackResult, attackBitBoard, tileNum };
  }

  const queueAdjacentAttacks = (tileNum) => {
    let attacksToQueue = [];
    let startingRow = parseInt((tileNum - 1) / 10) + 1;
    let left = tileNum - 1;
    if((startingRow === parseInt((left - 1) / 10) + 1) && left > 0) attackStack.push(left);
    let right = tileNum + 1;
    if(startingRow === parseInt((right - 1) / 10) + 1) attackStack.push(right);
    let up = tileNum - 10;
    if(up > 0) attackStack.push(up);
    let down = tileNum + 10;
    if(down <= 100) attackStack.push(down);

    // Randomize order of attacks
    for (let i = attacksToQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [attacksToQueue[i], attacksToQueue[j]] = [attacksToQueue[j], attacksToQueue[i]];
    }
    attackStack.push(...attacksToQueue);
  };

  const emptyAttackStack = () => attackStack = [];

  return { sendAttack };
}

module.exports = Player;
