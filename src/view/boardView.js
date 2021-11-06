import pubSub from '../logic/pubSub';

const boardView = (() => {
  const initBoards = () => {
    let playerBoard = document.querySelector('#player-container .board');
    let enemyBoard = document.querySelector('#enemy-container .board');

    // Player tiles
    for(let i = 0; i < 100; i++) {
      let tileDiv = document.createElement('div');
      tileDiv.classList.add('tile');
      tileDiv.addEventListener('click', (e) => {
        let element = e.currentTarget;
        if(element.classList.contains('miss') ||
           element.classList.contains('hit') ||
           element.classList.contains('sink')) return;
        let tileNum = getTileNum(element);
        pubSub.publish('tile click', { tileNum, boardType: 'player' });
      });
      tileDiv.addEventListener('mouseenter', (e) => {
        let type = e.type;
        let element = e.currentTarget;
        pubSub.publish('ship preview', { type, element });
      });
      tileDiv.addEventListener('mouseleave', (e) => {
        let type = e.type;
        let element = e.currentTarget;
        pubSub.publish('ship preview', { type, element });
      });
      playerBoard.appendChild(tileDiv);      
    }

    // Computer tiles
    for(let i = 0; i < 100; i++) {
      let tileDiv = document.createElement('div');
      tileDiv.classList.add('tile');
      tileDiv.addEventListener('click', (e) => {
        let element = e.currentTarget;
        if(element.classList.contains('miss') ||
           element.classList.contains('hit') ||
           element.classList.contains('sink')) return;
        let tileNum = getTileNum(element);
        pubSub.publish('tile click', { tileNum, boardType: 'enemy' });
      });
      enemyBoard.appendChild(tileDiv);      
    }
  };

  const toggleShipPreview = (tileEvent) => {
    let shipPreviewTileDivs = getShipPreviewTileDivs(tileEvent.element, tileEvent.status);
    if(tileEvent.type === 'mouseenter') {
      shipPreviewTileDivs.forEach((tileDiv) => tileDiv.classList.add('preview'));
    } else { // 'mouseleave'
      shipPreviewTileDivs.forEach((tileDiv) => tileDiv.classList.remove('preview'));
    }
  };

  const getTileNum = (tileDiv) => 
    Array.from(tileDiv.parentNode.children).indexOf(tileDiv) + 1;

  const getShipPreviewTileDivs = (tileDiv, status) => {
    let boardDiv = document.querySelector(`#player-container .board`);
    let shipPreviewTileDivs = [];
    let tileNum = getTileNum(tileDiv);
    let tileOffset = getTileOffset(true);
    let shipLengths = [5, 4, 3, 3, 2];
    let shipLength = shipLengths[status];
    if(shipLength) {
      for(let i = 0; i < shipLength; i++) {
        let shipTile = tileNum + (tileOffset * i);  
        let tileDiv = boardDiv.querySelector(`.tile:nth-child(${shipTile})`);
        if(!tileDiv) return shipPreviewTileDivs;
        shipPreviewTileDivs.push(tileDiv);
      }
    }
    return shipPreviewTileDivs;
  };

  const getTileOffset = (vertical) => vertical ? 10 : 1;

  const displayShip = (shipData) => {
    let tileOffset = getTileOffset(shipData.vertical);
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

  const initSubscriptions = () => {
    pubSub.subscribe('ship status', toggleShipPreview);
    pubSub.subscribe('display ship', displayShip);
    pubSub.subscribe('attack miss', displayMiss);
    pubSub.subscribe('attack hit', displayHit);
    pubSub.subscribe('attack sink', displaySink);
  };

  return { initBoards, initSubscriptions };
})();

export default boardView;
