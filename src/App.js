import React , {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import ErrorBoundary from './Component/ErrorBoundary'
import MyCompontent from './Component/MyCompontent'
import ContextCase from './Component/Context' 
import Portals from './Component/Portals'
import Hocdemo from './Component/HOC'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="Error-boundary">
          <ErrorBoundary>
            <MyCompontent />
          </ErrorBoundary>
        </div>
        <div className="Context-case">
          <ContextCase />
        </div>
        <div className="Portals-case">
          <Portals />
        </div>
        <div className="Hocdemo-case">
          <Hocdemo />
        </div>
      </div>
    );
  }
}

export default App;
