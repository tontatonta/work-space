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
          return position
      }
    }

    // 移動後のpositionを取得
    let newPosition = []

    for (let j = 0; j < position.length; j++){
        // console.log(position[j][1])
        newPosition.push([position[j][0], position[j][1]+1])
    }
    position = newPosition

    return position
  }

  // 右に移動
  function right(position){
    for (let i = 0; i < position.length; i++){
        let x = position[i][0]
        let y = position[i][1]
        if (x == 9 || judge(x+1, y, field)){
            return position
        }
    }
    newPosition = []
    for (let j = 0; j < position.length; j++){
        let x = position[j][0]
        let y = position[j][1]
        newPosition.push([x+1, y])
    }
    return newPosition
  }

  //左に移動
  function left(position){  
    for (let i = 0; i < position.length; i++){
        let x = position[i][0]
        let y = position[i][1]
        if (x == 0 || judge(x-1, y, field)){
            return position
        }
    }
    newPosition = []
    for (let j = 0; j < position.length; j++){
        let x = position[j][0]
        let y = position[j][1]
        newPosition.push([x-1, y])
    }

    return newPosition
  }

  // 回転
  function rotate(position){

    newPosition = []
    let centerx = 0
    let centery = 0
    for (let i = 0; i < position.length; i++){
        centerx += position[i][0]
        centery += position[i][1]
    }

    for (let j = 0; j < position.length; j++){
        let x = position[j][0]-(centerx/4)
        let y = position[j][1]-(centery/4)
        let X = Math.floor(x*Math.cos(Math.PI/2) - y*Math.sin(Math.PI/2) + (centerx/4))
        let Y = Math.floor(y*Math.cos(Math.PI/2) + x*Math.sin(Math.PI/2) + (centery/4))
        newPosition.push([X,Y])
    }
    return newPosition
  }

  /* x座標のはみ出している部分を見つける(あるかどうかも含めて)
     もしあったら、はみ出ている部分を修正する */
  function revisePositionOfX(position) {
      let maxOutX = -1
      let minOutX = 1
      for (let i = 0; i < position.length; i++) {
          // もし＋にはみ出ているx座標があったら、maxを計算
          if (position[i][0] > 9) {
            maxOutX = Math.max(maxOutX, position[i][0]);
          }
          // もし-にはみ出ているx座標があったら、minを計算
          if (position[i][0] < 0) {
            minOutX = Math.min(minOutX, position[i][0]);
          }
      }
      
      let newPosition = []
      if (maxOutX != -1) {
        for(let i = 0; i < position.length; i++) {
          newPosition.push([position[i][0] - (maxOutX-9), position[i][1]]);
        }
      }
      else if (minOutX != 1) {
        for(let i = 0; i < position.length; i++) {
          newPosition.push([position[i][0] - minOutX, position[i][1]]);
        }
      }
      else {
        return position
      }

      return newPosition
  }

  /* y座標のはみ出している部分を見つける(あるかどうかも含めて)
     もしあったら、はみ出ている部分を修正する*/ 
  function revisePositionOfY(position) {
    let maxOutY = -1
    let minOutY = 1
    for (let i = 0; i < position.length; i++) {
        // もし＋にはみ出ているy座標があったら、maxを計算
        if (position[i][1] > 19) {
          maxOutY = Math.max(maxOutY, position[i][1]);
        }
        // もし-にはみ出ているy座標があったら、minを計算
        if (position[i][1] < 0) {
          minOutY = Math.min(minOutY, position[i][1]);
        }
    }
    
    let newPosition = []
    if (maxOutY != -1) {
      for(let i = 0; i < position.length; i++) {
        newPosition.push([position[i][0], position[i][1] - (maxOutY-19)]);
      }
    }
    else if (minOutY != 1) {
      for(let i = 0; i < position.length; i++) {
        newPosition.push([position[i][0], position[i][1] - minOutY]);
      }
    }
    else {
      return position
    }

    return newPosition
  }


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

  // キーイベントを各関数に割り当てる
  function control (e) {

    if(e.keyCode === 37) {
      // console.log(left(position))
      left(position)
    } else if (e.keyCode === 38) {
      rotate(position)
    } else if (e.keyCode === 39) {
      right(position)
    } else if (e.keyCode === 40) {
      under(position)
    }
  }
  document.addEventListener('keydown', control)

  // 下に落とす動作
  let position;
  position = getxy(tetriminoPattern)
  console.log(position)
  drawTetrimino(context, position, red);
  // drawTetrimino(context, position, gray);
  // drawTetrimino(context, under(position), red);
  // console.log(under([[3, 17]], red))

  console.log(tetriminoPattern)
  // rotatedTetrimino = rotate([[3, 16], [4, 16], [5, 16], [6, 16]])
  // console.log(rotatedTetrimino)
  // console.log(revisePositionOfY(rotatedTetrimino))
  // drawTetrimino(context, revisePositionOfY(rotatedTetrimino), red)
  // console.log(after)

});