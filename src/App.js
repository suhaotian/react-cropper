import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Cropper from './lib';


class App extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      zoom: 1,
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <div>
          zoom: <input type="range" min={1} value={this.state.zoom} onChange={(e) => {
            this.setState({
              zoom: e.target.value
            })
          }}/>
        </div>

        <Cropper 
          src={'https://qnypy.doubanio.com/201603081752324747__l'}
          width={(document.documentElement.clientWidth > 480 ? 480 : document.documentElement.clientWidth) *.8}
          ratio={.8}
          zoom={(this.state.zoom - 1)/100 + 1}
          onCrop={(data) => {console.log(data)}}
        />

      </div>
    );
  }
}

export default App;
