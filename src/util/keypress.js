const LEFT = 37
const UP = 38
const TOP = 38
const RIGHT = 39
const DOWN = 40
const BOTTOM = 40
const SELECT = 13

const pressWas = (prevProps, props) => {
  const { globalX: prevGlobalX, globalY: prevGlobalY } = prevProps
  const { globalX, globalY } = props

  const deltaX = globalX - prevGlobalX
  const deltaY = globalY - prevGlobalY

  switch([deltaX, deltaY].join(',')) {
    case '-1,0':
      return LEFT
    case '0,-1':
      return UP
    case '1,0':
      return RIGHT
    case '0,1':
      return DOWN
    case '0,0':
      return 0
    default:
      console.log(`Could not determine press for ${[deltaX, deltaY]}`)
  }
}

export {
  LEFT,
  UP,
  TOP,
  RIGHT,
  DOWN,
  BOTTOM,
  SELECT,
  pressWas
}
