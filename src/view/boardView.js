import pubSub from '../logic/pubSub';

const boardView = (() => {
  const initBoards = () => {
    let playerBoard = document.querySelector('#player-container .board');
    let enemyBoard = document.querySelector('#enemy-container .board');

    // Player tiles
    for(let i = 0; i < 100; i++) {
      let tileDiv = document.createElement('div');
      tileDiv.classList.add('tile');
      tileDiv.addEventListener('click', tileClickCB('player'));
      tileDiv.addEventListener('mouseenter', shipPreviewCB);
      tileDiv.addEventListener('mouseleave', shipPreviewCB);
      playerBoard.appendChild(tileDiv);      
    }

    // Computer tiles
    for(let i = 0; i < 100; i++) {
      let tileDiv = document.createElement('div');
      tileDiv.classList.add('tile');
      tileDiv.addEventListener('click', tileClickCB('enemy'));
      enemyBoard.appendChild(tileDiv);      
    }
  };

  const initBoardReset = () => {
    let resetButton = document.querySelector('#reset');
    resetButton.addEventListener('click', () => {
      pubSub.publish('reset');
    });
  };

  const resetBoards = () => {
    let enemyContainer = document.querySelector('#enemy-container');
    let rotateContainer = document.querySelector('#rotate-container');
    let playerBoard = document.querySelector('#player-container .board');
    let enemyBoard = document.querySelector('#enemy-container .board');
    let playerTiles = Array.from(playerBoard.children);
    let enemyTiles = Array.from(enemyBoard.children);

    enemyContainer.classList.add('no-display');
    rotateContainer.classList.remove('no-display');
    playerTiles.forEach((tileDiv) => tileDiv.classList.remove('hit', 'miss', 'sink', 'ship-tile'));
    enemyTiles.forEach((tileDiv) => tileDiv.classList.remove('hit', 'miss', 'sink', 'ship-tile'));
  };

  const toggleShipPreview = (tileEvent) => {
    let shipPreviewTileDivs = getShipPreviewTileDivs(tileEvent.element, tileEvent.status);
    if(tileEvent.type === 'mouseenter') {
      shipPreviewTileDivs.forEach((tileDiv) => tileDiv.classList.add('preview'));
    } else { // 'mouseleave'
      shipPreviewTileDivs.forEach((tileDiv) => tileDiv.classList.remove('preview'));
    }
  };

  const displayShip = (tileNums) => {
    let boardDiv = document.querySelector(`#player-container .board`);
    for(let i = 0; i < tileNums.length; i++) {
      let tileDiv = boardDiv.querySelector(`.tile:nth-child(${tileNums[i]})`);
      tileDiv.classList.add('ship-tile');
      tileDiv.classList.remove('preview');
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
  };

  const displayMessage = (messageData) => {
    let messageElement = document.querySelector(`#${messageData.boardType}-container .board-message`);
    messageElement.textContent = messageData.text;
  };

  const displayEnemy = () => {
    let enemyContainer = document.querySelector('#enemy-container');
    let rotateContainer = document.querySelector('#rotate-container');

    enemyContainer.classList.remove('no-display');
    rotateContainer.classList.add('no-display');
  }

  const getTileNum = (tileDiv) => 
    Array.from(tileDiv.parentNode.children).indexOf(tileDiv) + 1;

  const getShipPreviewTileDivs = (tileDiv, shipLength = 5) => {
    let boardDiv = document.querySelector(`#player-container .board`);
    let shipPreviewTileDivs = [];
    let tileNum = getTileNum(tileDiv);
    let startingRow = parseInt((tileNum - 1) / 10) + 1;
    let vertical = isVertical();
    let tileOffset = getTileOffset(vertical);
    if(shipLength) {
      for(let i = 0; i < shipLength; i++) {
        let shipTileNum = tileNum + (tileOffset * i);  
        let tileDiv = boardDiv.querySelector(`.tile:nth-child(${shipTileNum})`);
        if(!vertical && (startingRow != parseInt((shipTileNum - 1) / 10) + 1))
          return shipPreviewTileDivs;
        if(!tileDiv) 
          return shipPreviewTileDivs;
        shipPreviewTileDivs.push(tileDiv);
      }
    }
    return shipPreviewTileDivs;
  };

  const getTileOffset = (vertical) => vertical ? 10 : 1;

  const isVertical = () => {
    let rotateCheckbox = document.querySelector('#rotate');
    return rotateCheckbox.checked ? false : true;
  };

  const initSubscriptions = () => {
    pubSub.subscribe('display message', displayMessage);
    pubSub.subscribe('ship status', toggleShipPreview);
    pubSub.subscribe('display ship', displayShip);
    pubSub.subscribe('attack miss', displayMiss);
    pubSub.subscribe('attack hit', displayHit);
    pubSub.subscribe('attack sink', displaySink);
    pubSub.subscribe('ships placed', displayEnemy);
    pubSub.subscribe('reset', resetBoards);
  };

  function tileClickCB (boardType) {
    return function (e) {
      let element = e.currentTarget;
      if(element.classList.contains('miss') ||
          element.classList.contains('hit') ||
          element.classList.contains('sink')) return;
      if(boardType === 'player') {
        let vertical = isVertical();
        let shipTileDivs = getShipPreviewTileDivs(element);
        let tileNums = shipTileDivs.map((tileDiv) => getTileNum(tileDiv));
        pubSub.publish('player tile click', { tileNums, boardType, vertical });
      } else { // computer
        let tileNum = getTileNum(element);
        pubSub.publish('enemy tile click', { tileNum, boardType });
      }
    }
  }

  function shipPreviewCB (e) {
    let type = e.type;
    let element = e.currentTarget;
    pubSub.publish('ship preview', { type, element });
  }

  return { initBoards, initBoardReset, initSubscriptions };
})();

export default boardView;
