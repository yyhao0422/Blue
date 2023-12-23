export default function Log({ turns }) {
  return (
    <ol id="log">
      <h1>Logs of the Game</h1>
      {turns.map((turn) => (
        <li key={`${turn.square.row}${turn.square.col}`}>
          {turn.player} selected {turn.square.row},{turn.square.col}
        </li>
      ))}
    </ol>
  );
}
