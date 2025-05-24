import React from 'react';

interface TerminalOutputProps {
  children: React.ReactNode;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ children }) => {
  return (
    <div className="terminal-output">
      {children}
    </div>
  );
};

export default TerminalOutput;