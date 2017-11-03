import React, { Component } from "react"
import { subscribeToDrawings } from "./api"

class DrawingList extends Component {
	constructor(props) {
		super(props)

		subscribeToDrawings(drawing => {
			this.setState(prevState => ({
				drawings: prevState.drawings.concat([drawing])
			}))
		})
	}

	state = {
		drawings: []
	}

	renderDrawings = () => {
		return this.state.drawings.map(drawing => (
			<li
				onClick={e => this.props.selectDrawing(drawing)}
				className="DrawingList-item"
				key={drawing.id}
			>
				{drawing.name}
			</li>
		))
	}

	render() {
		return <ul className="DrawingList">{this.renderDrawings()}</ul>
	}
}

export default DrawingList
