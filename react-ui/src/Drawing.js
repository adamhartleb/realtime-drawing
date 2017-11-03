import React, { Component } from 'react';
import Canvas from 'simple-react-canvas'
import { publishDrawing, subscribeToNewDrawings } from './api'

class Drawing extends Component {
  state = {
    lines: []
  }

  componentDidMount() {
    subscribeToNewDrawings(this.props.drawing.id, line => {
      this.setState(prevState => {
        return {
          lines: [...prevState.lines, line]
        }
      })
    })
  }

  handleDrawing = line => {
    publishDrawing({
      drawingId: this.props.drawing.id,
      line
    })
  }

  render() {
    return (this.props.drawing) ? (
      <div className="Drawing">
        <div className="Drawing-title">
          {this.props.drawing.name}
        </div>
        <Canvas drawingEnabled={true} onDraw={this.handleDrawing} lines={this.state.lines} />
      </div>
    ) : null
  }
}

export default Drawing;