import React from 'react';
import './App.css';
import NetworkGraph from './components/NetworkGraph';
import SankeyGraph from './components/SankeyGraph';

function App() {
  const [graphType, setGraphType] = React.useState('NetworkGraph');

  return (
      <div className="App">
        <NetworkGraph />
         <SankeyGraph />
      </div>
  );
}

export default App;