import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  
  const handleChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div className="App">
      <h1>Vulnerable Frontend App</h1>
      <h2>This is a new text</h2>
      <h2>This is a can of coke</h2>
      <h2>This is a hello of coke</h2>
      <h2>This is a piece of cake</h2>
      <input 
        type="text" 
        placeholder="Enter text"
        value={input}
        onChange={handleChange}
      />
      <div dangerouslySetInnerHTML={{ __html: input }} />
    </div>
  );
}

export default App;
