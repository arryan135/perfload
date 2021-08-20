import React, {Component} from "react";
import logo from './logo.svg';
import './App.css';
import socket from "./utilities/socketConnection"
import Widget from "./Widget";

class App extends Component{
  constructor(){
    super();
    this.state = {
      performanceData: {}
    }
  }

  componentDidMount() {
    socket.on("data", data => {
      // update state
      const currentState = ({...this.state.performanceData});
      currentState[data.macA] = data;
      this.setState({
        performanceData: currentState
      })
    });
  }

  render() {
    let widgets = [];
    const data = this.state.performanceData;
    // grab each machine 
    Object.entries(data).forEach(([key, value]) => {
      widgets.push(<Widget key = {key} data = {value}/>);
    });

    return (
      <div className="App">
        {widgets}
      </div>
    );
  }
}

export default App;
