import { useState } from 'react';

export default function Player({ name, symbol, isActive }) {
  const [playerName, setPlayerName] = useState(name);
  const [isEdit, setIsedit] = useState(false);
  function handleEdit() {
    setIsedit((editting) => !editting);
  }
  // function handleChange(event) {
  //   setPlayerName(event.target.value);
  // }
  // let editPlayerName = <span className="player-name">{playerName}</span>;
  // if (isEdit) {
  //   editPlayerName = (
  //     <input
  //       type="text"
  //       required
  //       value={playerName}
  //       onChange={handleChange}
  //     />
  //   );
  // }
  return (
    <li className={isActive ? 'active' : undefined}>
      <span className="player">
        {/* {editPlayerName} */}
        <span className="player-symbol">{symbol}</span>
        {/* <button onClick={handleEdit}>{!isEdit ? 'Edit' : 'Save'}</button> */}
      </span>
    </li>
  );
}
