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
  
    // positionはfield上
    function getxy(tetorimino){
        const twidth = 4
        const theight = 4
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
    function drawTetromino(context, pattern) {
      context.fillStyle = '#ff0000'; // テトリミノの色
      const cellSize = 20; // テトリミノのセルのサイズ
      let position = getxy(pattern)
  
      for (let i = 0; i < position.length; i++) {
          let x = position[i][0]
          let y = position[i][1]
          context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
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
  
    // 下に落ちる
    function under(field, position){
      for(var i = 0; i < position.length; i++){
          //下にブロックがあったら
          if (judge(position[i][0], position[i][1]+1)){
              return position
          }
      }
      for (let j = 0; j < position.length; j++){
          position[j][1] += 1
      }
      return position
    }
  
  });