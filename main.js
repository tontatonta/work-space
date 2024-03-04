document.addEventListener('DOMContentLoaded', function() {

    function tetorimino(num){
      const tetoriminos = [
          [
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
          ],
  
          [
            [0,1,0,0],
            [0,1,1,0],
            [0,0,1,0],
            [0,0,0,0]
          ],
  
          [
            [0,0,1,0],
            [0,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
          ],
  
          [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]
          ],
  
          [
            [0,1,1,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,0,0,0]
          ]
      ];
  
      return tetoriminos[num]; // ここが改善点です
    }
  
    let field = Array(20).fill().map(() => Array(10).fill(0));
  
    function drawTetromino(context, pattern) {
        context.fillStyle = '#ff0000'; // テトリミノの色
        const cellSize = 20; // テトリミノのセルのサイズ
        const startX = 3*cellSize; // テトリミノの描画開始X座標
        const startY = 0; // テトリミノの描画開始Y座標
  
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                    context.fillRect(startX + col * cellSize, startY + row * cellSize, cellSize, cellSize);
                }
            }
        }
    }
  
    // canvasの呼び出し
    const mainCanvas = document.getElementById('tetrisCanvas');
  
    // ↓canvasで2次元描画をするために必要らしい
    const context = mainCanvas.getContext('2d');
  
    /* 0~4のランダムな整数を取得して、
       ランダムなテトリミノを１つ取得 */
    let randomNumber = Math.floor(Math.random() * 5);
    const tetrominoPattern = tetorimino(randomNumber);
  
    // グレーの背景を塗りつぶす
    context.fillStyle = '#CCCCCC'; // グレー色
    context.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
  
    // テトリミノを描画
    drawTetromino(context, tetrominoPattern);
  
    //positionはfield上
    const twidth = 4
    const theight = 4
    function getxy(tetorimino){
        position = []
        for (let y = 0; y < twidth; y++) {
            for (let x = 0; x < theight; x++) {
                if (tetorimino[y][x] == 1){
                    position.push([x+3, y])
                }
            }
        }
        return position
    }
    console.log(getxy(tetrominoPattern))
  
  });