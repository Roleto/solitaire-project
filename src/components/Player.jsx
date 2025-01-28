export default function Player({ symbol, isActive }) {
  return (
    <li className={isActive ? 'active' : undefined}>
      <span className="player">
        <span className="player-symbol">{symbol}</span>
      </span>
    </li>
  );
}
