import React, { Component } from 'react';
import {createBoard} from './Generator';
import './App.css';

function PieceInner(props) {
    let tempClass = " d-none";
    if (props.possibles === 1) {
        tempClass = "";
    }
    return (
        <div className={"piece-inner xcol" + tempClass}>{props.val}</div>
    );
}

function Piece(props) {
    let tempClass = "";
    if (props.col % 3 === 0) {
        tempClass = " lb";
    }
    let bClass = "";
    if (props.row % 3 === 0) {
        bClass = " bb";
    }
    if (props.selected) {
        tempClass += " selected";
    }
    const pieces = [];
    const row = props.row;
    const col = props.col;

    if (props.board !== undefined && props.board[row][col] > 0) {
        pieces.push(props.board[row][col]);
        if(props.board[row][col] === props.selectedNum) {
            tempClass += " highlight2";
        }
    } else {
        if (props.state1) {
            for (let i = 0; i < 9; i++) {
                if (props.isSelector !== true) {
                    const tempI = (props.row * 81) + (props.col * 9) + i;
                    if(i+1 === props.selectedNum && props.possibles[tempI] === 1) {
                        tempClass += " highlight";
                    }
                    pieces.push(<PieceInner possibles={props.possibles[tempI]} key={i + 1} val={i + 1} />);
                }
            }
        }
    }
    return (
        <div className={"piece col-1" + tempClass + bClass} onClick={props.pieceSelect}>{props.isSelector ? props.num : pieces}</div>
    );
}

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: new Array(9).fill(0),
        };
    }

    render() {
        const pieces = [];
        let row = parseInt(this.props.selected / 9, 10);
        let col = this.props.selected % 9;
        if (col === 0) {
            row -= 1;
            col = 8;
        } else {
            col -= 1;
        }
        for (let i = 0; i < 9; i++) {
            if (this.props.isSelector === false) {
                const tempI = (this.props.row * 9) + i + 1;
                let isSelected = false;
                if (this.props.row === row && i === col && this.props.selected !== this.props.lastSelected) {
                    isSelected = true;
                }
                pieces.push(<Piece selectedNum={this.props.num} state1={this.props.state1} board={this.props.board} isSelector={this.props.isSelector} possibles={this.props.possibles} pieceSelect={() => this.props.pieceSelect(tempI)} key={(this.props.row * 9) + i + 1} selected={isSelected} row={this.props.row} col={i} num={(this.props.row * 9) + i + 1} />);
            } else {
                pieces.push(<Piece isSelector={this.props.isSelector} pieceSelect={() => this.props.pieceSelect(i)} key={i} selected={false} row={this.props.row} col={i} num={i + 1} />);
            }
        }

        let optionalClass = "";
        if (this.props.isSelector === false) {
            optionalClass += " justify-content-center";
        } else {
            optionalClass += " justify-content-between";
        }
        if ((this.props.row + 1) % 3 === 0) {
            optionalClass += " bb";
        }
        return (
            <div className={"board-row row" + optionalClass}>{pieces}</div>
        );
    }
}

function removePossibles(props) {
    const possibles = props.possibles.slice();
    const board = props.board.slice();
    const row = props.row;
    const col = props.col;
    //get all values in box
    let x = Math.floor(col/3) * 3;
    let y = Math.floor(row/3) * 3;
    let vals = [];
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            if(board[y+i][x+j] > 0) {
                vals.push(board[y+i][x+j]);
            }
        }
    }
    //remove values from box
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            vals.forEach((n) => {
                let tempI = ((y+i)*81) + ((x+j)*9) + n - 1;
                possibles[tempI] = 0;
            });
        }
    }

    //get all values from row
    vals = [];
    for(let i=0; i<9; i++) {
        if(board[row][i] > 0) {
            vals.push(board[row][i]);
        }
    }
    //remove all values from row
    for(let i=0; i<9; i++) {
        vals.forEach((n) => {
            let tempI = (row*81) + (i*9) + n-1;
            possibles[tempI] = 0;
        });
    }

    //get all values from col
    vals = [];
    for(let i=0; i<9; i++) {
        if(board[i][col] > 0) {
            vals.push(board[i][col]);
        }
    }
    //remove all values from col
    for(let i=0; i<9; i++) {
        vals.forEach((n) => {
            let tempI = (i*81) + (col*9) + n-1;
            possibles[tempI] = 0;
        });
    }

    return possibles;
}

class Sudoku extends Component {
    constructor(props) {
        super(props);
        const nums = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const possibles = Array(9).fill(Array(9).fill(nums));
        const data = {
            solution: [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]],//Array(9).fill(Array(9).fill(0)),
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//Array(81).fill(0),
            possibles: possibles,
            col: 0,
            row: 0
        };
        let [bSolution, board] = createBoard(data);
        this.state = {
            solution: bSolution,
            board: board,
            possibles: Array(729).fill(1),
            lastSelected: -1,
            selected: -1,
            edit: false,
            showPossibles: true,
            num: 0
        };
        //this.updateDimensions = this.updateDimensions.bind(this);
        this.pieceSelect = this.pieceSelect.bind(this);
        this.numberPush = this.numberPush.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.showPossibles = this.showPossibles.bind(this);
        this.clearPossibles = this.clearPossibles.bind(this);
    }

    pieceSelect(n) {
        let row = parseInt(n / 9, 10);
        let col = n % 9;
        let tempLast = this.state.selected;
        let tempSelected = n;
        let tempNum = 0;
        if (n === tempLast) {
            tempLast = -1;
            tempSelected = -1;
        }
        if (col === 0) {
            row -= 1;
            col = 8;
        } else {
            col -= 1;
        }
        tempNum = this.state.board[row][col];
        this.setState({
            selected: tempSelected,
            lastSelected: tempLast,
            num: tempNum
        });
    }

    numberPush(n) {
        const selected = this.state.selected;
        let possibles = this.state.possibles.slice();
        let board = this.state.board.slice();
        let row = parseInt(selected / 9, 10);
        let col = selected % 9;
        if (col === 0) {
            row -= 1;
            col = 8;
        } else {
            col -= 1;
        }
        if (this.state.edit === false) {
            const tempI = (col * 9) + (row * 81) + n;
            possibles[tempI] ^= 1;
            board[row][col] = n+1;
            const data = {
                possibles: this.state.possibles.slice(),
                row: row,
                col: col,
                num: n+1
            };
            data.board = this.state.board.slice();
            let newPossibles = removePossibles(data);
            this.setState({
                possibles: newPossibles,
                board: board,
                num: n+1
            });
        } else {
            let possibles = this.state.possibles.slice();
            possibles[(row*81)+(col*9)+n] ^= 1;
            this.setState({
                possibles: possibles
            });
        }
    }

    handleEdit() {
        let edit = this.state.edit;
        this.setState({
            edit: !edit
        });
    }

    showPossibles() {
        if (this.state.showPossibles === false) {
            this.setState({
                showPossibles: true
            });
        }
    }

    clearPossibles() {
        const data = {
            possibles: this.state.possibles.slice(),
            row: 0,
            col: 0,
            board: this.state.board.slice()
        };
        for(let y=0; y<3; y++) {
            for(let x=0; x<3; x++) {
                data.col = 0;
                data.row = (y*3)+x;
                let newPossibles = removePossibles(data);
                data.possibles = newPossibles;
                data.row = 0;
                data.col = (x*3)+y;
                newPossibles = removePossibles(data);
                data.possibles = newPossibles;
                data.row = (y*3);
                data.col = (x*3);
                newPossibles = removePossibles(data);
                data.possibles = newPossibles;
            }
        }
        this.setState({
            possibles: data.possibles
        });
    }

    componentDidMount() {
        console.log("Sudoku class has beeen mounted");
        this.clearPossibles();
        // window.addEventListener("resize", this.updateDimensions)
    }

    //TODO: implement updateDimensions to change the height dynamically on window resize
    // updateDimensions() {
    //     console.log("the window width is: " + window.innerWidth);
    // }

    render() {
        const rows = [];
        for (let i = 0; i < 9; i++) {
            rows.push(<Row isSelector={false} num={this.state.num} edit={this.state.edit} board={this.state.board} state1={this.state.showPossibles} possibles={this.state.possibles} selected={this.state.selected} lastSelected={this.state.lastSelected} pieceSelect={(n) => this.pieceSelect(n)} row={i} key={i} />);
        }
        const selector = <Row isSelector={true} selected={-1} lastSelected={-1} pieceSelect={(n) => this.numberPush(n)} row={0} />;

        let optionalClass = " align-items-center";
        let optionalClass2 = " d-flex flex-column justify-content-center";
        if (true) {
            optionalClass = "";
        }

        let editClass = " far";
        if (this.state.edit) {
            editClass = " fas";
        }
        return (
            <div className={"row h-100" + optionalClass} style={{ background: 'white', }}>
                <div className={"board col-12" + optionalClass2} style={{ background: 'white' }}>
                    {rows}
                </div>
                <div className="piece-layer col-12">
                    <div className="board-row row"><div className="col-12 pr-0 pb-1 d-flex flex-row justify-content-end pt-1"><i className="edit_button fas fa-ban mr-2" onClick={this.clearPossibles}></i><i className="edit_button fas fa-chess-board mr-2" onClick={this.showPossibles}></i><i className={"edit_button fa-edit" + editClass} onClick={this.handleEdit}></i></div></div>
                    {selector}
                </div>
            </div>
        );
    }
}

export default Sudoku;
