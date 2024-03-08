document.addEventListener('DOMContentLoaded', function() {
  //HTMLのスコア表示のため↓
  const scoreDisplay = document.querySelector('#score')

  const speed = 500;
  var point = 0;
  function tetrimino(num){

      const tetoriminos = [
          [[0,1,1,0],
          [0,1,1,0],
          [0,0,0,0],
          [0,0,0,0]],

          [[0,1,0,0],
          [0,1,1,0],
          [0,0,1,0],
          [0,0,0,0]],
          
          [[0,0,1,0],
          [0,1,1,1],
          [0,0,0,0],
          [0,0,0,0]],

          [[0,1,0,0],
          [0,1,0,0],
          [0,1,0,0],
          [0,1,0,0]],

          [[0,1,1,0],
          [0,1,0,0],
          [0,1,0,0],
          [0,0,0,0]]]

      return tetoriminos[num]
  }

  const red = '#ff0000'
  const gray = '#CCCCCC' 
  const green = '#008000'
  const yellow = '#ffff00'
  const purple = '#800080'
  const blue = '#0000ff'
  const color = [green, red, purple, blue, yellow, gray]

  let copyField = Array(20).fill().map(() => Array(10).fill(0));
  
  let field = Array(20).fill().map(() => Array(10).fill(0));
  const width = 10;//fieldの横の長さ
  const height = 20;

  //横一列揃ったら一列消える
  function disapper(field, point){
    for (var i = 0; i < height; i++){
        if (field[i].indexOf(0) == -1){
          if (isSoundOn == true) {
            clearingALineSound.play();
          }
            field[i].fill(0)
            //scoreを保存する
            point = score(point)
            console.log(point)
            //消えた分下に下がる
            down(i, field)
        }
    }
    return point
  }

  //上の段のものが一つ下に落ちる
  function down(i,field){
      for (var j = i; j > 0; j--){
          for (var k = 0; k < width; k++){
              field[j][k] = field[j-1][k]
          }
      }
      field[0].fill(0)  //0 or i
  }

  //指定された座標が1or0
  //衝突判定
  //衝突したらTrue
  function judge(x, y, field){
      return field[y][x] != 0
  }
  //positionはfield上
  const twidht = 4
  const theight = 4
  function getxy(tetorimino){
      position = []
      for (let y = 0; y < twidht; y++){
          for (let x = 0; x < theight; x++){
              if (tetorimino[y][x] == 1){
                  position.push([x+3, y])
              }
          }  
      }
      return position
  }

  //fieldに反映させる（固定）
  function updateField(field, position){
      for (let i = 0; i < position.length; i++){
          let x = position[i][0]
          let y = position[i][1]
          field[y][x] = 1
      }
      return field
  }


  //下にブロックがあるか判定
  //ブロックがあるtrue
  function underjudge(field, position){
      for(let i = 0; i < position.length; i++){
          //下にブロックがあったら
          if (position[i][1] === 19 || judge(position[i][0], position[i][1]+1, field)){
              return true
          }
      }
      return false
  }

  //下に落ちる
  function under(field, position){
      for(let i = 0; i < position.length; i++){
          //下にブロックがあったら
          if (underjudge(position[i][0],position[i][1],field)){
            for (let i = 0; i < position.length; i++){
              let x = position[i][0]
              let y = position[i][1]
              field[y][x] = 1
              return;// block(field, position)
          }
      }
    }
      //position更新
      newPosition = []
      for (let j = 0; j < position.length; j++){
          newPosition.push([position[j][0],position[j][1]+1])
      }
      return newPosition
  }

  //右に移動
  function right(position){
      // console.log(field)
      // console.log(copyField)
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

  //回転
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
      newPosition = revisePositionIfOverflow(newPosition)
      return newPosition
  }

  /* テトリミノのx, y座標のはみ出している部分を見つける(あるかどうかも含めて)。
     もしあったら、はみ出ている部分を修正する　*/
    function revisePositionIfOverflow(position) {
      /* x座標のはみ出している部分を見つける(あるかどうかも含めて)。もしあったら、はみ出ている部分を修正する */
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
        // はみ出している部分があるかどうか確かめ、あれば修正(なければそのまま元のpositionを返す)
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
        } else {
          return position
        }
        return newPosition
      }
      /* y座標のはみ出している部分を見つける(あるかどうかも含めて)。もしあったら、はみ出ている部分を修正する*/ 
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
        // はみ出している部分があるかどうか確かめ、あれば修正(なければそのまま元のpositionを返す)
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
        } else {
          return position
        }
        return newPosition
      }
      let revesedPosition = revisePositionOfY(revisePositionOfX(position));
      return revesedPosition
    }

  //消して描いて消して描いてを考える
  //最初の描く部分は考えていない
  function updateCopyField(copyField, newposition, randomNumber){
    //newpositionをcopyFieldに反映させる
    console.log(copyField)
    console.log(copyField)
    for (let i = 0; i < newposition.length; i++){
        let x = newposition[i][0]
        let y = newposition[i][1]
        copyField[y][x] = 2 + randomNumber//テトリミノの種類によって数字を変えれば色も変えれるかも
    }
  }
  function copyfielddrow(copyField, ramdomNumber){
      const red = '#ff0000'
      const grey = '#CCCCCC'

      for (let y = 0; y < copyField.length; y++){
          for (let x = 0; x < copyField[0].length; x++){
              if (copyField[y][x] >= 2){//2以上にするとテトリミノの種類に応じて色変更ができるかも．hashmapを用いれば
                  draw(x, y, color[copyField[y][x]-2])
              }
              else if(copyField[y][x] <= 1){
                  copyField[y][x] = 0
                  draw(x, y, grey)
              }
          }
      }
  }

  //分岐によって色指定をしたいがうまくいかないので描く部分だけ関数にする
  function draw(x, y, color){
      context.fillStyle = color
      const cellSize = 20;
      context.fillRect(x*cellSize, y*cellSize, cellSize, cellSize)
  }

  //描く関数をまとめてみる
  function alldrow(copyField, position,randomNumber){
    updateCopyField(copyField, position, randomNumber)
    copyfielddrow(copyField, randomNumber)

}
  //最初の地点

  // mainCanvasの呼び出し
  const mainCanvas = document.getElementById('tetrisCanvas');

  // ↓canvasで2次元描画をするために必要らしい
  const context = mainCanvas.getContext('2d');
  // グレーの背景を塗りつぶす
  context.fillStyle = gray; // グレー色
  context.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

  /* 0~4のランダムな整数を取得して、
      ランダムなテトリミノを１つ取得 */
  // miniCanvasの呼び出し
  const miniCanvas = document.getElementById('miniCanvas');
  const miniContext = miniCanvas.getContext('2d');
  
  /* 0~4のランダムな整数を取得して、
      ランダムなテトリミノを１つ取得 */
  let randomNumber = Math.floor(Math.random() * 5);
  let tetriminoPattern = tetrimino(randomNumber);
  //  console.log('randomtetorimino', randomNumber)
  function miniGetxy(tetrimino){
    const twidth = 4
    const theight = 4
    let position = []
    for (let y = 0; y < twidth; y++) {
        for (let x = 0; x < theight; x++) {
            if (tetrimino[y][x] == 1){
                position.push([x, y+1])
            }
        }
    }
    return position
  } 


  function nextTetrimino(){
    miniContext.fillStyle = '#CCCCCC'; // グレー色
    miniContext.fillRect(0, 0, miniCanvas.width, miniCanvas.height);

  
    // 次のテトリミノの呼び出し
    let nextRandomNumber = Math.floor(Math.random() * 5);
    let nextTetriminoPattern = tetrimino(nextRandomNumber);
    // テトリミノのminiCanvas内での位置を取得
    let nextPosition;
    nextPosition = miniGetxy(nextTetriminoPattern);
     
    // miniCanvasに描画
    const cellSize = 20
    for (let i = 0; i < nextPosition.length; i++) {
      let x = nextPosition[i][0]
      let y = nextPosition[i][1]
      miniContext.fillStyle = color[nextRandomNumber]
      miniContext.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
    return [nextTetriminoPattern,nextRandomNumber]
  }
  nextlist = nextTetrimino()
  next = nextlist[0]
  nextRandomNumber = nextlist[1]

  function mainTetrimino(tetriminoPattern){
    // テトリミノの初期位置を取得
    let position;
    position = getxy(tetriminoPattern);
    if (gameover(position,field)){
      return "gameover"
    }
    return position
  }
      
  const hashmap = {
      ArrowRight: () => right(position),
      ArrowLeft: () => left(position),
      ArrowUp: () => rotate(position),
      ArrowDown: () => under(field, position)
  };
  document.addEventListener("keydown", function (event) {
        if (hashmap[event.key]) {
          // 下に移動する前に衝突判定を行う
          if (underjudge(field, position)) {
            // 下にブロックがある場合、無効化して処理を終了する
            return;
          }
            for (let i = 0; i < position.length; i++){
                let x = position[i][0]
                let y = position[i][1]
                copyField[y][x] = 1
            }
            position = hashmap[event.key]();
            alldrow(copyField, position,randomNumber)
        }
        return position
    });


  //点数を保存
  function score(point){
      point += 10
      scoreDisplay.innerHTML = point
      return point
  }

  //ゲームオーバー判定
  function gameover(position,field){
      for (let i = 0; i < position.length; i++){
          let x = position[i][0]
          let y = position[i][1]
          if (field[y][x] == 1){
              return true
          }
      }
      return false
  }

  //自動落下
  function autodown() {
    alldrow(copyField, position,randomNumber)
    
    if (underjudge(field,position)){
        // 新しいテトリミノを生み出す
      for (let i = 0; i < position.length; i++){
        let x = position[i][0];
        let y = position[i][1];
        field[y][x] = 1;
      }
      return false;
    }
    else{
        for (let i = 0; i < position.length; i++){
            let x = position[i][0];
            let y = position[i][1];
            copyField[y][x] = 1;
        } 
        position = under(field, position);
        return true;
    }
  }

  // ゲームオーバー時の画面に関する定数
  const winningMessageElement = document.getElementById('winningMessage');
  const winningMessageTextElement = document.querySelector('[data-winning-message-text');
  const restartButton = document.getElementById('restartButton');

  // 一時停止・再開ボタンの制御
  const startButton = document.getElementById('start-button');
  let isPaused = false;
  let loop;
  startButton.addEventListener('click', function() {
    if (!isPaused) {
      clearTimeout(loop);
      if (isSoundOn == true) {
        gameSound.pause();
      }
      startButton.innerText = 'Restart';
    } else {
      loopInterval();
      startButton.innerText = 'Pause';
      if (isSoundOn == true) {
        gameSound.play();
      }
    }
    isPaused = !isPaused;
  });

  // ゲーム中の音楽 ↓ // 
  /* ブラウザ側の設定で、HTMLがrenderされた時点で音楽を流す設定にしてしまうと良くないので、
  　　ユーザーがゲーム音をonにした時のみ音楽がながれるようにする */

  // プレイ中のデフォルト音楽
  const gameSound = document.getElementById("gameSound");
  // ゲームオーバー時の効果音
  const gameOverSound = document.getElementById("gameOver");
  // 横一列揃った時の効果音
  const clearingALineSound = document.getElementById("clearingALine");
  let isSoundOn = false;
  const soundBottun = document.getElementById("isGameSoundOn");
  soundBottun.addEventListener('click', function() {
    isSoundOn = !isSoundOn;
    // gameSound.loop = true;
    gameSound.volume = 0.3;
    if (isSoundOn == true) {
      gameSound.play();
    } else {
      gameSound.pause();
    }
  });

  // loopInterval 関数内の setTimeout を条件付きで呼び出す
  function loopInterval() {
    if (!isPaused) {
      // 一時停止中でない場合にのみ自動落下を実行
      if (autodown() === true) {
        loop = setTimeout(loopInterval, speed);
      } else {
        // 落下が止まった場合の処理
        randomNumber = nextRandomNumber
        copyfielddrow(copyField);
        disapper(copyField, point);
        point = disapper(field, point);
        if (mainTetrimino(next) == "gameover") {
          // ゲームオーバーの処理
          if (isSoundOn == true) {
              gameSound.pause();
              gameOverSound.play();
          }
          clearTimeout(loop);
          playerpoint = score(point - 10);
          winningMessageTextElement.innerText = `Score: ${playerpoint}`;
          winningMessageElement.classList.add('show');
          restartButton.addEventListener('click', function(){location.reload()});
          return;
        }
        // 次のテトリミノをセットし、ループを再開
        nextlist = nextTetrimino();
        next = nextlist[0]
        nextRandomNumber = nextlist[1]
        loopInterval();
      }
    } else {
      // 一時停止中の場合、再帰的に関数を呼び出して待機
      loop = setTimeout(loopInterval, speed);
    }
  }


  //メイン関数
  function main() {
    mainTetrimino(tetriminoPattern);//最初のテトリミノ
    loopInterval()
  }
  main()

});