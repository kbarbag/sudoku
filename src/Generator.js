function randomNum(n) {
    return Math.floor(Math.random() * n);
}

//return true if the number does not exist in the square, false otherwise
function notInBox(props) {
    let solution = props.solution.slice();
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            if (solution[props.row + y][props.col + x] === props.num) {
                return false;
            }
        }
    }
    return true;
}

//fill the box with random numbers
function fillBox(props) {
    let solution = props.solution.slice();
    for (let i = 0; i < 3; i++) {
        for (let x = 0; x < 3; x++) {
            let tempNum = randomNum(9) + 1;
            let data = {
                row: props.row,
                col: props.col,
                solution: solution,
                num: tempNum
            };
            while (!notInBox(data)) {
                tempNum = randomNum(9) + 1;
                data.num = tempNum;
                data.solution = solution;
            }

            solution[props.row + i][props.col + x] = data.num;

            data.solution = solution;
        }
    }
    return solution;
}

//fill the squares of the board diagonally from top left to bottom right
function fillDiag(props) {
    let mySol = props.solution.slice();
    let data = {
        solution: mySol,
        col: 0,
        row: 0
    };
    for (let i = 0; i < 3; i++) {
        data.row = (i*3);
        data.col = (i*3);
        let tempSolution = fillBox(data);
        data.solution = tempSolution;
    }
    return data.solution;
}

//randomize the elements in an array
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function fillRemaining(arr) {
    let mat = arr.slice();
    let [rows, cols, triples, visit] = [{}, {}, {}, []];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let t = [Math.floor(r / 3), Math.floor(c / 3)];
            rows[r] = rows[r] || new Set();
            cols[c] = cols[c] || new Set();
            triples[t] = triples[t] || new Set();
            if (mat[r][c] !== 0) {
                rows[r].add(mat[r][c]);
                cols[c].add(mat[r][c]);
                triples[t].add(mat[r][c]);
            } else {
                visit.push([r, c]);
            }
        }
    }
    dfs(visit, rows, cols, triples, mat);
}

function dfs(visit, rows, cols, triples, mat) {
    if (visit[0] === undefined) {
        return true;
    }
    let [r, c] = visit[0];
    let t = [Math.floor(r / 3), Math.floor(c / 3)];
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    arr = shuffle(arr);
    for (let i = 1; i < 10; i++) {
        let dig = arr[i - 1];
        if (!(rows[r].has(dig)) && !(cols[c].has(dig)) && !(triples[t].has(dig))) {
            mat[r][c] = dig;
            rows[r].add(dig);
            cols[c].add(dig);
            triples[t].add(dig);
            visit.shift();
            if (dfs(visit, rows, cols, triples, mat)) {
                return true;
            }
            else {
                mat[r][c] = 0;
                rows[r].delete(dig);
                cols[c].delete(dig);
                triples[t].delete(dig);
                visit.unshift([r, c]);
            }
        }
    }
    return false;
}

function removeCells(arr, c) {
    let board = arr.slice();
    let removedCount = 0;
    while(removedCount < c) {
        //remove cells
        let row = randomNum(9);
        let col = randomNum(9);
        if(board[row][col] !== 0) {
            board[row][col] = 0;
            removedCount += 1;
        }
    }
    return board;
}

export function createBoard(props) {
    //fill diagonal squares ([0,0], [1,1], [2,2])
    let data = {
        solution: props.solution
    };
    let solution = fillDiag(data);
    let board = [];

    //fill the rest of the squares
    fillRemaining(solution);
    for(var i=0; i<9; i++) {
        board[i] = solution[i].slice();
    }

    //remove random cells from the board
    removeCells(board, 40);
    return [solution, board];
}