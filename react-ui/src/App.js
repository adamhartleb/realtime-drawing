import React, { Component } from "react"
import "./App.css"

import DrawingForm from "./DrawingForm"
import DrawingList from "./DrawingList"
import Drawing from "./Drawing"

class App extends Component {
	state = {
		selectedDrawing: null
	}

	selectDrawing = drawing => {
		this.setState({
			selectedDrawing: drawing
		})
	}

	renderDrawingList = () => {
		return (
			<div>
				<DrawingForm />
				<DrawingList selectDrawing={this.selectDrawing} />
			</div>
		)
	}

	render() {
		return (
			<div className="App">
				<div className="App-header">
					<h2>Our awesome drawing app</h2>
				</div>
				{this.state.selectedDrawing ? (
					<Drawing drawing={this.state.selectedDrawing} key={this.state.selectedDrawing.id} />
				) : (
					this.renderDrawingList()
				)}
			</div>
		)
	}
}

export default App
