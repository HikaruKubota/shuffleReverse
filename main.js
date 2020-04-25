let cells
// true = 〇
let turnFlag
const cell_CR = 4
const main = () => {
  //WARNING: 偶数にすること！！

  cells = init(cell_CR)
  renderingBoard(cells)
  setInterval(()=>{
    cells = shuffleCells(cells, cell_CR)
    renderingBoard(cells)
  }, 2000)
}

// 初期化
const init = (cell_CR) => {
  turnFlag = true

  let cells = new Array(cell_CR);
  for(let y = 0; y < cell_CR; y++) {
    cells[y] = new Array(cell_CR).fill('');
  }

  // 初期配置
  cells[cell_CR/2-1][cell_CR/2-1] = '〇'
  cells[cell_CR/2-1][cell_CR/2]   = '×'
  cells[cell_CR/2][cell_CR/2-1]   = '×'
  cells[cell_CR/2][cell_CR/2]     = '〇'
  return cells
}

// 描画処理
const renderingBoard = cells => {
  const turn = document.getElementById(`turn`)
  const root = document.getElementById(`root`)
  let cells_table = `<table>`

  for (let i = 0; i < cells.length; i++) {
    cells_table += `<tr>`
    for (let j = 0; j < cells.length; j++) {
      cells_table += `<td id=${i}${j} onclick=putPiece(this)>${cells[i][j]}</td>`
    }
    cells_table += `</tr>`
  }
  cells_table += `</table>`
  root.innerHTML = cells_table
  if(turnFlag){
    turn.innerHTML = `〇のターンです`
  }else{
    turn.innerHTML = `×のターンです`
  }
}

// ｼｬｯﾌｫｵｵｵｵｵｵｵｵｵｵｵｵｵﾙ
const shuffleCells = (cells, cell_CR) =>{
  // Fisher–Yatesでシャッフルし、詰めなおす。
  cells = cells.flat()
  let m = cells.length
  let res = new Array(cell_CR);
  for(let y = 0; y < cell_CR; y++) {
    res[y] = new Array(cell_CR).fill('');
  }
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [cells[m], cells[i]] = [cells[i], cells[m]];
  }
  for (let i = 0; i < cell_CR; i++) {
    for (let j = 0; j < cell_CR; j++) {
      res[i][j] = cells[0]
      cells.shift()
    }
  }
  return res
}

// TODO: 駒を置く処理を作る。
const putPiece = e => {
  const x = e.id.split('')[0]
  const y = e.id.split('')[1]
  const putFlag = [];
  if (cells[x][y] != '') return console.log('おけねぇ！！！');
  putFlag.push(turnUp(turnFlag, x, y, []))
  putFlag.push(turnRight(turnFlag, x, y, []))
  putFlag.push(turnDown(turnFlag, x, y, []))
  putFlag.push(turnLeft(turnFlag, x, y, []))
  putFlag.push(turnUpLeft(turnFlag, x, y, []))
  putFlag.push(turnUpRight(turnFlag, x, y, []))
  putFlag.push(turnDownLeft(turnFlag, x, y, []))
  putFlag.push(turnDownRight(turnFlag, x, y, []))
  console.log(putFlag);
  // 1方向もひっくり返せない場合早期リターン
  if(!(putFlag.some(e=>{return e;}))) return console.log('おけねぇ！！！');
  if (turnFlag) {
    cells[x][y] = '〇'
  }else{
    cells[x][y] = '×'
  }
  turnFlag = !turnFlag
  renderingBoard(cells)
  // TODO: ゲームの終了判定を呼び出す。
  gameEnd()
}

const gameEnd = () =>{
  const arr = cells.flat()
  const endFlag = arr.some(e=>{
    if(e==''){
      return true
    }
  })
  if(!endFlag){
    console.log('ゲーム終了');
    let count = arr.filter(e => {return e == '〇'}).length
    if (count > cell_CR*cell_CR/2) {
      console.log(`〇が${count}個で〇の勝ち`);
    }else if(count == cell_CR*cell_CR/2){
      console.log(`引き分け`);
    }else{
      const batu = cell_CR*cell_CR/2 - count;
      console.log(`×が${batu}個で×の勝ち`);
    }
  }
}

const turnUp = (turnFlag, x, y, targetCells) => {
  while(true){
    if(cells[--x] == undefined){
      return false
    }
    if(cells[x][y] == undefined){
      return false
    }
    return hantei(turnFlag, x, y, targetCells, turnUp);
  }
}

const turnUpLeft = (turnFlag, x, y, targetCells) => {
  while(true){
    if(cells[--x] == undefined){
      return false
    }
    if(cells[x][--y] == undefined){
      return false
    }
    return hantei(turnFlag, x, y, targetCells, turnUpLeft);
  }
}

const turnUpRight = (turnFlag, x, y, targetCells) => {
  while(true){
    if(cells[--x] == undefined){
      return false
    }
    if(cells[x][++y] == undefined){
      return false
    }
    return hantei(turnFlag, x, y, targetCells, turnUpRight);
  }
}

const turnDown = (turnFlag, x, y, targetCells) => {
  while(true){
    if(cells[++x] == undefined){
      return false
    }
    if(cells[x][y] == undefined){
      return false
    }
    return hantei(turnFlag, x, y, targetCells, turnDown);
  }
}

const turnDownLeft = (turnFlag, x, y, targetCells) => {
  while(true){
    if(cells[++x] == undefined){
      return false
    }
    if(cells[x][--y] == undefined){
      return false
    }
    return hantei(turnFlag, x, y, targetCells, turnDownLeft);
  }
}

const turnDownRight = (turnFlag, x, y, targetCells) => {
  while(true){
    if(cells[++x] == undefined){
      return false
    }
    if(cells[x][++y] == undefined){
      return false
    }
    return hantei(turnFlag, x, y, targetCells, turnDownRight);
  }
}

const turnLeft = (turnFlag, x, y, targetCells) => {
  while(true){
    if(cells[x] == undefined){
      return false
    }
    if(cells[x][--y] == undefined){
      return false
    }
    return hantei(turnFlag, x, y, targetCells, turnLeft);
  }
}

const turnRight = (turnFlag, x, y, targetCells) => {
  if(cells[x] == undefined){
    return false
  }
  if(cells[x][++y] == undefined){
    return false
  }
  return hantei(turnFlag, x, y, targetCells, turnRight);
}

const hantei = (turnFlag, x, y, targetCells, callback) =>{
  if (turnFlag) {
    if (cells[x][y] == '×'){
      targetCells.push({x:x,y:y})
    }else if(cells[x][y] == '〇' && targetCells.length != 0){
      targetCells.forEach(e => {
        cells[e.x][e.y] = '〇'
      });
      return true
    } else {
      return false
    }
    return callback(turnFlag, x, y, targetCells)

  }else{
    if (cells[x][y] == '〇'){
      targetCells.push({x:x,y:y})
    }else if(cells[x][y] == '×' && targetCells.length != 0){
      targetCells.forEach(e => {
        cells[e.x][e.y] = '×'
      });
      return true
    } else {
      return false
    }
    return callback(turnFlag, x, y, targetCells)
  }
}

// TODO: 牛のアニメーションのような物も作ってみたい。
// NOTE: あれは実現するとなるとcanvasで描画していくことになりそうなので現状不可。
// const rivaushi = () => {}
(() => {
  main()
})()


