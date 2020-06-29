import React from 'react';
import logo from './logo.svg';
import './App.scss';
import List from './Components/list'

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <h4>Collaborative Todo List</h4>
          <p>A collaborative todo list using socket IO, React &amp; Eloquent.</p>
      </header>

      <div className="listContainer">
        <List/>
      </div>

    </div>
  );
}

export default App;

