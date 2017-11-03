const socket = require("socket.io")
const r = require("rethinkdb")
const express = require('express');
const path = require('path');

const app = express()
const server = require('http').Server(app)
const io = socket(server)

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

const createDrawing = (connection, name) => {
	r
		.table("drawings")
		.insert({
			name,
			timestamp: new Date().toLocaleString()
		})
		.run(connection)
		.then(() => console.log("Drawing created"))
}

const subscribeToDrawings = ({ client, connection }) => {
	r
		.table("drawings")
		.changes({ include_initial: true })
		.run(connection)
		.then(cursor => {
			cursor.each((err, drawingRow) => client.emit("drawing", drawingRow.new_val))
		})
}

const publishDrawing = ({ connection, line }) => {
	r
		.table("lines")
		.insert(Object.assign(line, { timestamp: new Date() }))
		.run(connection)
}

const subscribeToNewDrawings = ({ connection, client, drawingId }) => {
	return r
		.table("lines")
		.filter(r.row("drawingId").eq(drawingId))
		.changes({ include_initial: true })
    .run(connection)
    .then(cursor => {
      cursor.each((err, lineRow) => client.emit(`drawingLine:${drawingId}`, lineRow.new_val))
    })
}

r
	.connect({
		host: process.env.DOCKHERO_HOST || "localhost",
		port: 28015,
		db: "test"
	})
	.then(connection => {
		io.on("connection", client => {
			client.on("createDrawing", ({ name }) => {
				createDrawing(connection, name)
			})

			client.on("subscribeToDrawings", () => {
				subscribeToDrawings({ client, connection })
			})

      client.on("publishDrawing", line => publishDrawing({ connection, line }))

      client.on("subscribeToNewDrawings", drawingId => {
        subscribeToNewDrawings({ connection, client, drawingId})
      })
		})
	})

const PORT = process.env.PORT || 5000;
server.listen(PORT)
console.log(`Listening on ${PORT}`)
