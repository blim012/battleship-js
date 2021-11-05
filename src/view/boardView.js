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
  };

  const displayShip = (shipData) => {
    let tileOffset = shipData.vertical ? 10 : 1;
    let boardDiv = document.querySelector(`#player-container .board`);
    for(let i = 0; i < shipData.length; i++) {
      let shipTile = shipData.tileNum + (tileOffset * i);
      let tile = boardDiv.querySelector(`div:nth-child(${shipTile})`);
      tile.classList.add('ship-tile');
    }
  };

  return { initBoards, initSubscriptions };
})();

export default boardView;
