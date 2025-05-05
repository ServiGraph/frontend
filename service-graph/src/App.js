import React from 'react';
import './App.css';
import NetworkGraph from './NetworkGraph';
import SankeyGraph from './SankeyGraph';

function App() {
  const [graphType, setGraphType] = React.useState('NetworkGraph');

  return (
      <div className="App">
        <NetworkGraph />
        {/* <SankeyGraph /> */}
      </div>
  );
}

export default App;