import openSocket from 'socket.io-client'
import Rx from 'rxjs/Rx'

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
  const lineStream = Rx.Observable.fromEventPattern(
    h => socket.on(`drawingLine:${drawingId}`, h),
    h => socket.off(`drawingLine:${drawingId}`, h)
  )

  const bufferedStream = lineStream
    .bufferTime(100)
    .map(lines => ({ lines }))

  bufferedStream.subscribe(linesEvent => callback(linesEvent))
  socket.emit('subscribeToNewDrawings', drawingId)
}