import React from 'react';

const Toolbar = ({ onSaveAsDocx, onOpenDocx }) => {
  return (
    <div className="toolbar">
      <button onClick={onSaveAsDocx}>Зберегти як .docx</button>
      <input type="file" accept=".docx" onChange={onOpenDocx} />
    </div>
  );
};

export default Toolbar;
