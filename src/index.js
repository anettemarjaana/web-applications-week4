import "./styles.css";

if (document.readyState !== "loading") {
  // Document ready, executing:
  console.log("Document ready, executing");
  initializeCode();
} else {
  // Document was not ready, executing when loaded
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Document ready, executing after a wait");
    initializeCode();
  });
}

function initializeCode() {
  console.log("Initializing");
  // Button for a rematch
  const button = document.getElementById("rematch");
  var result = renderCells(); // finish the table
  if (result === true) {
    // Suggest a new game
    console.log("Game round finished.");
    // After this the board is still playable -> how to block
    // until the button is clicked?
  }
  button.addEventListener("mousedown", (event) => {
    // When the button is clicked, the table is emptied and the game
    // can be started over.
    console.log("Button activated.");
    alert("Starting a rematch!");
    emptyCells();
    event.stopPropagation();
  });
}

// The function below finds the table initialized in index.html and fills it with cells.
// The final table will be of size 5x5.
function renderCells() {
  var tbl = document.getElementById("board");

  for (var i = 0; i < 5; i++) {
    // Creating 5 rows
    var tr = tbl.insertRow();
    for (var j = 0; j < 5; j++) {
      // Creating 5 columns as well
      // Columns are created by inserting 5 cells into each row
      var td = tr.insertCell();
      var player = "X",
        playerno = 1,
        hits = 0;

      // Make cells clickable
      td.addEventListener("click", function () {
        var winnerno = playerno,
          lastround = player;
        player = fillCell(this, player); // when a cell is clicked -> fill it
        // fillCell returns the player symbol of the next player in turn.

        // Find out the player number based on the player symbol.
        // Used in the alert later.
        if (player === "X") {
          playerno = 1;
        } else {
          playerno = 2;
        }

        // The player symbol, whose turn it is next, is shown on the page
        document.getElementById("samplepar").innerHTML = playerno;
        hits++;

        if (hits > 8) {
          // After there's been 5 or more turns, the win condition is checked
          // after each turn.
          var win = calculateWinCondition(lastround);
          console.log(
            "Finished the function calculateWinCondition successfully."
          );
          if (win === 1) {
            document.getElementById("winnertext").innerHTML =
              winnerno + " won!";
            alert("Player " + winnerno + " won!");
            return true;
          } else if (win === 2) {
            document.getElementById("winnertext").innerHTML = "It's a tie!";
            alert("It's a tie!");
            return true;
          }
          // if win === 0 ---> no one won or lost yet ---> the game goes on
        }
      });
    }
  }
}

function fillCell(cell, player) {
  // Player 1: X, player 2: O.
  if (cell.innerHTML === "") {
    // If the on-clicked cell is empty, the cell is filled with the symbol
    // of the current player. The symbol of the next player is returned.
    if (player === "X") {
      cell.appendChild(document.createTextNode(player));
      player = "O";
    } else {
      cell.appendChild(document.createTextNode(player));
      player = "X";
    }
  } else {
    alert("Select another cell!");
  }
  return player;
}

// This function checks whether the game is over. Depending on the result,
// it returns either 1 (win), 2 (tie) or 0 (false).
function calculateWinCondition(player) {
  // player = "X"/"O" depending on the player
  console.log("Calculating the winning condition");

  var tbl = document.getElementById("board");
  var i,
    j,
    k1 = 0,
    k2 = 0,
    t = 0,
    counter = 0,
    row,
    cell,
    result = true,
    win = 0,
    diagonal1 = [],
    diagonal2 = [];

  // CHECK THE WINNING CONDITIONS.

  // Check the 5 rows:
  for (i = 0; i < tbl.rows.length; i++) {
    // Iteration through all the rows of the table
    row = tbl.rows[i];
    result = true;

    for (j = 0; j < row.cells.length; j++) {
      // CHECKING FOR THE RESULT OF EACH ROW:
      // Iteration through the cells in each row
      // check the j cells of the #i row
      cell = row.cells[j];
      result = result && cell.innerHTML === player;
      // if any of the cells is not equal to the player symbol, this Boolean value will be false.

      // PREPARING THE DIAGONAL CHECK:
      // Filling the arrays for the diagonals in the same loop:
      if (i === j) {
        // From up-left to down-right diagonal
        diagonal1[k1] = cell.innerHTML;
        k1++;
      } else if (i + j === 4) {
        // From up-right to down-left diagonal
        diagonal2[k2] = cell.innerHTML;
        k2++;
      }

      // PREPARING THE TIE CHECK:
      // All the non-null values are counted to see if all the cells in the table
      // are filled:
      if (cell.innerHTML !== "") {
        t++;
      }
      // Later it's checked if t === counter
      // --> if true --> tie
      counter++;
    }
    // Checking if the result is true after each row
    if (result === true) {
      win++;
      return win;
    }
  }
  console.log("Iterated through rows successfully.");
  console.log("Count of cells: " + counter + " | Count of filled cells: " + t);

  // Check the 5 columns:
  // As many rounds i as there are columns:
  for (i = 0; i < tbl.rows[0].cells.length; i++) {
    result = true;
    // As many rounds j as there are rows:
    for (j = 0; j < tbl.rows.length; j++) {
      cell = tbl.rows[j].cells[i];
      result = result && cell.innerHTML === player;
    }
    if (result === true) {
      win++;
      return win;
    }
  }
  console.log("Iterated through columns successfully.");

  // Check the diagonals:

  result = true;
  // From up-left to down-right:
  // Iterate through the whole diagonal1 array checking if all the symbols equal to the current player symbol
  for (j = 0; j < k1; j++) {
    result = result && diagonal1[j] === player;
  }
  // After iteration, check if the result is true <=> if all the symbols = player symbol

  if (result === true) {
    win++;
    return win;
  }

  // From up-right to down-left:
  result = true;
  for (j = 0; j < k2; j++) {
    result = result && diagonal2[j] === player;
  }
  // After iteration, check if the result is true <=> if all the symbols = player symbol
  if (result === true) {
    win++;
    return win;
  }

  // Check if all the cells are full -> a tie
  if (t === counter) {
    win = 2;
    return win;
  }

  // If none of the cases were true, the function returns 0
  return win;
}

function emptyCells() {
  console.log("Emptying the table cells");

  var tbl = document.getElementById("board");
  var i, j, col, cell;
  // As many rounds i as there are rows:
  for (i = 0; i < tbl.rows.length; i++) {
    col = tbl.rows[i].cells.length;
    // As many rounds j as there are columns:
    for (j = 0; j < col; j++) {
      cell = tbl.rows[i].cells[j];
      cell.innerHTML = ""; // fill each cell with empty
    }
  }
  console.log("All cells emptied.");
}
