import Classnames from 'classnames'
import React from 'react'
import { DOWN, LEFT, RIGHT, UP } from '../../util/keypress'
import withFocusHandling from './FocusHandling'

class Grid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focusX: 0,
      focusY: 0,
      focusedItem: props.children[0]
    }
  }

  get maxFocusX() { return this.childrenAsMatrix[this.state.focusX].length - 1 }
  get maxFocusY() { return this.childrenAsMatrix.length - 1 }

  get childrenAsMatrix() {
    const numRows = this.props.numRows || Math.ceil(Math.sqrt(this.props.children.length))

    let matrix = []
    for ( let i = 0; i < numRows; i++ ) {
      matrix.push(this.props.children.slice(i * numRows, (i + 1) * numRows))
    }
    return matrix
  }

  hasFocus(x, y) {
    return this.props.hasFocus && this.state.focusX == x && this.state.focusY === y
  }

  handleLeft() {
    if (this.state.focusX == 0) {
      this.props.handleBoundary(LEFT)
    } else {
      this.setState({ focusX: this.state.focusX - 1 })
    }
  }

  handleUp() {
    if (this.state.focusY == 0) {
      this.props.handleBoundary(UP)
    } else {
      this.setState({ focusY: this.state.focusY - 1 })
    }
  }

  handleRight() {
    if (this.state.focusX == this.maxFocusX) {
      this.props.handleBoundary(RIGHT)
    } else {
      this.setState({ focusX: this.state.focusX + 1 })
    }
  }

  handleDown() {
    if (this.state.focusY == this.maxFocusY) {
      this.props.handleBoundary(DOWN)
    } else {
      this.setState({ focusY: this.state.focusY + 1 })
    }
  }

  render() {
    let { children } = this.props

    const matrix = this.childrenAsMatrix

    return (
      <div className={Classnames({ ...this.props.classNames, grid: true })}>
        {matrix.reduce((acc, row, xIndex) => {
          return acc.concat((
            <div>
              {row.map((item, yIndex) => {
                if (typeof(item) !== 'object') {
                  throw(`Child ${item} of Grid is invalid!`)
                }
                let key = `grid-item-${xIndex}-${yIndex}`
                let itemProps = {...item.props, key }
                return this.hasFocus(yIndex, xIndex) ? React.cloneElement(item, {...itemProps, hasFocus: true}) : React.cloneElement(item, {...itemProps})
              })}
            </div>
          ))},[])}
      </div>
    )
  }
}

export default withFocusHandling(Grid)
