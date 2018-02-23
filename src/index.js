import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (
    <button className="square" style={props.color} onClick={() => props.onClick()}>
    {props.value}
    </button>
  );
}

class Board extends React.Component {

  getWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c]; //return the line of winner squares
      }
    }
    return null;
  }

  renderSquare(i) {
    const winSquares = this.getWinner(this.props.squares);

    if (winSquares && (i===winSquares[0] || i===winSquares[1] || i===winSquares[2])) {
      return <Square key={i} value = {this.props.squares[i]} onClick = {() => this.props.onClick(i)} color = {{backgroundColor: '#DF6565'}}/>;
     }
    else {
    return <Square key={i} value = {this.props.squares[i]} onClick = {() => this.props.onClick(i)} />;
    }
}

  render() {
    let row = [], boardRow =[];
    for(let i=0; i<3; i++) {
      for (let j=0; j<3; j++) {
        row.push(this.renderSquare(j + i * 3));
      };
      boardRow.push(<div key={i} className="board-row">{row}</div>);
      row = [];
    }
    const board = <div> {boardRow} </div>;
    console.log(board);
    return board;
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      history: [{
        squares:Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNet:true,
      moves: [
        'Game Start'
      ],
  };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNet ? 'X' : 'O';


    let x, y;
    if(i>5) {
      x = 3; y = i-5;
    } else if(i>2) {
      x = 2; y = i-2;
    } else {
      x = 1; y = i+1;
    }

    const desc = squares[i] + ' moved to (' +x +',' +y + ').';
    const moves = this.state.moves.slice(0, this.state.stepNumber+1);
    moves.push(desc);

    this.setState({
      history: history.concat([{
        squares:squares,
      }]),
      stepNumber: history.length,
      xIsNet: !this.state.xIsNet,
      moves:moves
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if(winner)
      status = ' Congrats to winner ' + winner;
    else
      status = 'Next Player: ' + (this.state.xIsNet ? 'X' :'O');

    let moves = this.state.moves.map(
      (step, move) => {
      if(moves === this.state.stepNumber) {return (
        <li key={move}>
          <a href='#' onClick={() => this.jumpTo(move)} style={{color: 'red'}}>{step}</a>
        </li>
      )} else {return (
        <li key={move}>
          <a href='#' onClick={() => this.jumpTo(move)}>{step}</a>
        </li>
      )}
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol className="moves">{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; //return the winner
    }
  }
  return null;
}
// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
