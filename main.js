document.addEventListener('DOMContentLoaded', function() {

  function tetrimino(num){
    const tetriminos = [
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

    return tetriminos[num];
  }

  // 固定されたテトリミノの配置を記憶(10*20の2次元行列)
  let field = Array(20).fill().map(() => Array(10).fill(0));

  // 落ちてくるテトリミノの初期座標(1の座標)を取得
  function getxy(tetrimino){
      const twidth = 4
      const theight = 4
      position = []
      for (let y = 0; y < twidth; y++) {
          for (let x = 0; x < theight; x++) {
              if (tetrimino[y][x] == 1){
                  position.push([x+3, y])
              }
          }
      }
      return position
  }
  
  // テトリミノを描画
  function drawTetrimino(context, position, color) {
    context.fillStyle = color; // テトリミノの色
    const cellSize = 20; // テトリミノのセルのサイズ

    for (let i = 0; i < position.length; i++) {
        let x = position[i][0]
        let y = position[i][1]
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // 他ブロックとの衝突判定
  function judge(x, y, field) {
    return field[y][x] != 0;
  }

  // テトリミノを下に落とす
  function under(position){

    // 下にブロック、壁があるか判定
    for(let i = 0; i < position.length; i++){
      //下にブロックがあったら
      if (position[i][1] === 19 || judge(position[i][0], position[i][1]+1, field)){
          // console.log(position)
          return position
      }
    }

    // 移動後のpositionを取得
    let newPosition = []

    for (let j = 0; j < position.length; j++){
        console.log(position[j][1])
        newPosition.push([position[j][0], position[j][1]+1])
    }
    position = newPosition

    return position
  }

  // テトリミノを右に移動
  function right(position){

    // 右にブロックがあるか判定

    // 移動後のpositionを取得
    let newPosition = []

    for (let j = 0; j < position.length; j++){
        console.log(position[j][1])
        newPosition.push([position[j][0], position[j][1]+1])
    }

    position = newPosition

    return position
  }

  // 左

  // 回転


  
  // canvasの呼び出し
  const mainCanvas = document.getElementById('tetrisCanvas');

  // ↓canvasで2次元描画をするために必要らしい
  const context = mainCanvas.getContext('2d');

  // 使う色
  const red = '#ff0000'
  const gray = '#CCCCCC'

  /* 0~4のランダムな整数を取得して、
     ランダムなテトリミノを１つ取得 */
  let randomNumber = Math.floor(Math.random() * 5);
  let tetriminoPattern = tetrimino(randomNumber);

  // グレーの背景を塗りつぶす
  context.fillStyle = gray; // グレー色
  context.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

  // 下に落とす動作
  let position;
  position = getxy(tetriminoPattern)
  console.log(position)
  drawTetrimino(context, position, red);
  drawTetrimino(context, position, gray);
  drawTetrimino(context, under(position), red);
  console.log(under([[3, 17]], red))

});