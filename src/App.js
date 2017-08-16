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
        Points Clicked
        {points.map((point, index) =>
          <div key={index}>
            <span>{point.x}</span>
            <span>{point.y}</span>
          </div>
        )}
      </div>
    );
  }
  renderLogin() {
    return (
      <FacebookLogin
        appId="1771436973087378"
        autoLoad={true}
        fields="name"
        callback={this.responseFacebook} />
    )
  }
  renderSections() {
    return (
      <div>
        <div>
          <canvas
            height={this.state.height}
            width={this.state.width}
            id="imageCanvas"
            style={{ border: '1px solid #d3d3d3' }}
            onClick={this.recordPoints}
          >
          </canvas>
        </div>
        <div>
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
        {this.state.loggedIn ?
          this.renderLogin()
          :
          this.renderSections()
        }
      </div>
    );
  }
}

export default App;
