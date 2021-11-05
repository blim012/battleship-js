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

  return { initBoards };
})();

module.exports = boardView;
