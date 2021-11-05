import pubSub from '../logic/pubSub';

const boardView = (() => {
  const initBoards = () => {
    let boardDivs = document.querySelectorAll('.board');
    boardDivs.forEach((boardDiv) => {
      for(let i = 0; i < 100; i++) {
        let tileDiv = document.createElement('div');
        tileDiv.classList.add('tile');
        boardDiv.appendChild(tileDiv);
      }
    });
  };

  const initSubsciptions = () => {
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

  return { initBoards, initSubsciptions };
})();

export default boardView;
