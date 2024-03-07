
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
          //[1, 3],   [1, 2],  [1, 1],   [2, 1]   回転前
          //x:-1,y:-2 x:0,y:-1 x:+1,y:0  x:0,y:+1
          //[[0, 1],  [1, 1],  [2, 1],   [2, 2]]　回転前の座標が回転することによりどこに移ったか（xとyの変化量をそれぞれ記憶する）

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
              field[i].fill(0)
              //scoreを保存する
              point = score(point)
              console.log(point)
              //消えた分下に下がる
              down(i, field)
              // console.log(field)

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
  const twidht=4
  const theight=4
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
  function updateCopyField(copyField, newposition){
      //newpositionをcopyFieldに反映させる
      // console.log(copyField)
      // console.log(newposition)
      for (let i = 0; i < newposition.length; i++){
          let x = newposition[i][0]
          let y = newposition[i][1]
          copyField[y][x] = 2 //テトリミノの種類によって数字を変えれば色も変えれるかも
      }

      //copyfileddrow()
      //1のところは消す2のところは描く
      //描くときについでに1は0にできるかも




      //2のままだと固定（もしくは1は一つ前のposition, 2はnewposition, 3は固定でもありかも）
      //underjudge()
      //false
      //2にしたところを1
      //true
      //2のままにして新しいテトリミノについて動作をする
      //固定のブロックは2にしておく



  }
      //copyfileddrow()
      //1のところは消す
      //固定のブロックは2にしておく
      //描くときについでに1は0にできるかも
  function copyfielddrow(copyField, ramdomNumber){
      const red = '#ff0000'
      const grey = '#CCCCCC' 

      for (let y = 0; y < copyField.length; y++){
          for (let x = 0; x < copyField[0].length; x++){
              if (copyField[y][x] == 2){//2以上にするとテトリミノの種類に応じて色変更ができるかも．hashmapを用いれば
                  draw(x, y, color[randomNumber])
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
      //console.log('beforposition: ', position)
      updateCopyField(copyField, position)
      //console.log('aftercopyfield: ', copyField)
      copyfielddrow(copyField, randomNumber)
      //block(field, copyfield, position)

  }
  //最初の地点

// mainCanvasの呼び出し
const mainCanvas = document.getElementById('tetrisCanvas');

// ↓canvasで2次元描画をするために必要らしい
const context = mainCanvas.getContext('2d');
// グレーの背景を塗りつぶす
context.fillStyle = gray; // グレー色
context.fillRect(0, 0, mainCanvas.width, mainCanvas.height);


// miniCanvasの呼び出し
const miniCanvas = document.getElementById('miniCanvas');
const miniContext = miniCanvas.getContext('2d');

/* 0~4のランダムな整数を取得して、
   ランダムなテトリミノを１つ取得 */
let randomNumber = Math.floor(Math.random() * 5);
let tetriminoPattern = tetrimino(randomNumber);


function nextTetrimino(){
  miniContext.fillStyle = '#CCCCCC'; // グレー色
  miniContext.fillRect(0, 0, miniCanvas.width, miniCanvas.height);
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
    miniContext.fillStyle = '#ff0000'
    miniContext.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
  return nextTetriminoPattern
  }
  next = nextTetrimino()

  function mainTetrimino(tetriminoPattern){
    // テトリミノの初期位置を取得
    let position;
    position = getxy(tetriminoPattern);
    if (gameover(position,field)){
      return "gameover"
    }
    // alldrow(copyField, position)
    // for (let i = 0; i < position.length; i++){
    //     let x = position[i][0]
    //     let y = position[i][1]
    //     copyField[y][x] = 1
    // }  
    return position
  }
  //function keyindex(field, position, copyField) {}
      
  const hashmap = {
      ArrowRight: () => right(position),
      ArrowLeft: () => left(position),
      ArrowUp: () => rotate(position),
      ArrowDown: () => under(field, position)
  };
  document.addEventListener("keydown", function (event) {
      // key プロパティによってどのキーが押されたかを調べます。
      // code プロパティを使うと大文字/小文字が区別されます。
      // 何かキーボードの押して、コンソールに出力されているか確かめましょう。
      if (hashmap[event.key]) {
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


  const winningMessageElement = document.getElementById('winningMessage');
  const winningMessageTextElement = document.querySelector('[data-winning-message-text');
  const restartButton = document.getElementById('restartButton');

  function loopInterval() {
      if (autodown() === true) {
        loop = setTimeout(loopInterval, speed);
      }else{
        //着地後の処理
        console.log("着地");
        //copyfileddrow(field)では落ちてきたテトリミノは消える
        copyfielddrow(copyField);
        disapper(copyField, point)
        point = disapper(field, point)
        // console.log(copyField);
        // console.log(field);
        if(mainTetrimino(next) == "gameover"){
          console.log("12345678")
          clearTimeout(loop);

          playerpoint = score(point -10 )

          winningMessageTextElement.innerText = `Score: ${playerpoint}`
          winningMessageElement.classList.add('show');
          restartButton.addEventListener('click', function(){location.reload()});
          return
        }
        // console.log("aaaaaaaaaaaaaaaaaa")
        // console.log(field)
        next = nextTetrimino();
        loopInterval()
      }
  }

  //メイン関数
  function main() {
    mainTetrimino(tetriminoPattern);//最初のテトリミノ
    loopInterval()
  }
  main()

});