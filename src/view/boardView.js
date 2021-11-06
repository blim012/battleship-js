import pubSub from '../logic/pubSub';

const boardView = (() => {
  const initBoards = () => {
    let playerBoard = document.querySelector('#player-container .board');
    let enemyBoard = document.querySelector('#enemy-container .board');

    for(let i = 0; i < 100; i++) {
      let tileDiv = document.createElement('div');
      tileDiv.classList.add('tile');
      tileDiv.addEventListener('click', (e) => {
        let element = e.currentTarget;
        let tileNum = Array.from(element.parentNode.children).indexOf(element) + 1;
        pubSub.publish('tile click', { tileNum, boardType: 'player' });
      });
      playerBoard.appendChild(tileDiv);      
    }

    for(let i = 0; i < 100; i++) {
      let tileDiv = document.createElement('div');
      tileDiv.classList.add('tile');
      tileDiv.addEventListener('click', (e) => {
        let element = e.currentTarget;
        let tileNum = Array.from(element.parentNode.children).indexOf(element) + 1;
        pubSub.publish('tile click', { tileNum, boardType: 'enemy' });
      });
      enemyBoard.appendChild(tileDiv);      
    }
  };

  const initSubscriptions = () => {
    pubSub.subscribe('display ship', displayShip);
    pubSub.subscribe('attack miss', displayMiss);
    pubSub.subscribe('attack hit', displayHit);
    pubSub.subscribe('attack sink', displaySink);
  };

  const displayShip = (shipData) => {
    let tileOffset = shipData.vertical ? 10 : 1;
    let boardDiv = document.querySelector(`#player-container .board`);
    for(let i = 0; i < shipData.length; i++) {
      let shipTile = shipData.tileNum + (tileOffset * i);
      let tileDiv = boardDiv.querySelector(`.tile:nth-child(${shipTile})`);
      tileDiv.classList.add('ship-tile');
    }
  };

  const displayMiss = (moveData) => {
    let boardDiv = document.querySelector(`#${moveData.boardType}-container .board`);
    let tileDiv = boardDiv.querySelector(`.tile:nth-child(${moveData.tileNum})`);
    tileDiv.classList.add('miss');
  };

  const displayHit = (moveData) => {
    let boardDiv = document.querySelector(`#${moveData.boardType}-container .board`);
    let tileDiv = boardDiv.querySelector(`.tile:nth-child(${moveData.tileNum})`);
    tileDiv.classList.add('hit');
  };

  const displaySink = (moveData) => {
    let shipTileNums = moveData.shipTileNums;
    let boardDiv = document.querySelector(`#${moveData.boardType}-container .board`);
    for(let i = 0; i < shipTileNums.length; i++) {
      let tileDiv = boardDiv.querySelector(`.tile:nth-child(${shipTileNums[i]})`);
      tileDiv.classList.add('sink');
    }
  }

  return { initBoards, initSubscriptions };
})();

export default boardView;
