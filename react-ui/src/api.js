import openSocket from 'socket.io-client'

const socket = openSocket('https://intense-sea-37553.herokuapp.com/')

export const subscribeToDrawings = callback => {
  socket.on('drawing', callback)
  socket.emit('subscribeToDrawings', 1000)
}

export const createDrawing = name => {
  socket.emit('createDrawing', { name })
}

export const publishDrawing = ({ drawingId, line }) => {
  socket.emit('publishDrawing', { drawingId, ...line })
}

export const subscribeToNewDrawings = (drawingId, callback) => {
  socket.on(`drawingLine:${drawingId}`, callback)
  socket.emit('subscribeToNewDrawings', drawingId)
}