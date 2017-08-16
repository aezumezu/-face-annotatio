import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FacebookLogin from 'react-facebook-login';

class App extends Component {
  constructor() {
    super();
    this.state = {
      imageUrl: 'http://www.uni-regensburg.de/Fakultaeten/phil_Fak_II/Psychologie/Psy_II/beautycheck/english/durchschnittsgesichter/m(01-32)_gr.jpg',
      points: [],
      height: 500,
      width: 300,
      count: 1,
      loggedIn: false
    };
    this.recordPoints = this.recordPoints.bind(this);
    this.drawImageOnCanvas = this.drawImageOnCanvas.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  componentDidMount() {
    this.drawImageOnCanvas()
  }

  setSize(height, width) {
    this.setState({ height, width });
  }

  responseFacebook(response) {
    if (response.name) {
      this.setState({ loggedIn: true })
    }
  }

  addPoints(x, y) {
    const points = this.state.points;
    let count = this.state.count;
    count++;
    const newPoint = { x, y };

    points.push(newPoint);
    this.setState({ points, count });
  }

  drawImageOnCanvas() {
    const canvas = document.getElementById("imageCanvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = this.state.imageUrl;
    image.onload = () => {
      this.setSize(image.height, image.width)
      context.drawImage(image, 0, 0);
    };

  }

  recordPoints(e) {
    const xAxis = e.nativeEvent.offsetX;
    const yAxis = e.nativeEvent.offsetY;
    const count = this.state.count;
    this.addPoints(xAxis, yAxis);

    const canvas = document.getElementById("imageCanvas");
    const context = canvas.getContext("2d");
    context.beginPath();
    context.arc(xAxis, yAxis, 5, 0, 2 * Math.PI);
    context.strokeStyle = '#4eb2ea'
    context.stroke();

    context.fillStyle = "#4eb2ea";
    context.font = "normal 16px Calibri";
    context.fillText(count, xAxis - 4, yAxis - 8);
  }

  renderPoints() {
    const points = this.state.points;
    if (!points.length) {
      return;
    }

    return (
      <div>
        <table>
          <thead>
            <tr>
              <td>Points Clicked</td>
            </tr>
            <tr>
              <td>X</td>
              <td>Y</td>
            </tr>
          </thead>
          <tbody>
            {points.map((point, index) =>
              <tr key={index}>
                <td>{point.x}</td>
                <td>{point.y}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  renderLogin() {
    return (
      <div
        hidden={this.state.loggedIn}>
        <FacebookLogin
          appId="1771436973087378"
          autoLoad={true}
          fields="name"
          callback={this.responseFacebook} />
      </div>
    )
  }
  renderSections() {
    return (
      <div hidden={!this.state.loggedIn}>
        <div style={{ display: 'inline-block', width: '45%' }}>
          <canvas
            height={this.state.height}
            width={this.state.width}
            id="imageCanvas"
            style={{ border: '1px solid #d3d3d3' }}
            onClick={this.recordPoints}
          >
          </canvas>
        </div>
        <div style={{ display: 'inline-block', width: '45%' }}>
          {this.renderPoints()}
        </div>
      </div>);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        {this.renderSections()}
        {this.renderLogin()}
      </div>
    );
  }
}

export default App;
