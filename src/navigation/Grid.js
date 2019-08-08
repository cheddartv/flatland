import Classnames from 'classnames'
import React from 'react'
import { focusableChildrenOf } from '../util/helpers'
import item from './Item'
import { DOWN, LEFT, RIGHT, UP } from '../util/keypress'
import withFocusHandling from './FocusHandling'

class Grid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focusX: 0,
      focusY: 0,
      focusedItem: focusableChildrenOf(this)[0],
    }
  }

  get maxFocusX() { return this.maxFocusOfXAt(this.state.focusY) }
  get maxFocusY() { return this.childrenAsMatrix.length - 1 }
  maxFocusOfXAt(y) {
    return this.childrenAsMatrix[y].length - 1
  }

  get childrenAsMatrix() {
    const numPerRow = this.props.numPerRow || Math.ceil(Math.sqrt(focusableChildrenOf(this).length))
    const numRows = Math.ceil(focusableChildrenOf(this).length / numPerRow)

    let matrix = []
    for ( let i = 0; i < numRows; i++ ) {
      matrix.push(focusableChildrenOf(this).slice(i * numPerRow, (i + 1) * numPerRow))
    }
    return matrix
  }

  driveFocus(driverFn) {
    const [newFocusX, newFocusY] = driverFn(this.state.focusX, this.state.focusY)
    this.setState({ focusX: newFocusX, focusY: newFocusY })
  }

  hasFocus(x, y) {
    return this.props.hasFocus && this.state.focusX == x && this.state.focusY === y
  }

  handleLeft() {
    if (this.state.focusX == 0) {
      this.props.handleBoundary(this, LEFT)
    } else {
      this.setState({ focusX: this.state.focusX - 1 })
    }
  }

  handleUp() {
    if (this.state.focusY == 0) {
      this.props.handleBoundary(this, UP)
    } else {
      const currentMaxFocusX = this.maxFocusOfXAt(this.state.focusY)
      const nextMaxFocusX =  this.maxFocusOfXAt(this.state.focusY - 1)
      let nextFocusX = this.state.focusX

      if (nextMaxFocusX > currentMaxFocusX) {
        nextFocusX = this.state.focusX * Math.floor(nextMaxFocusX / currentMaxFocusX)
      }

      this.setState({ focusY: this.state.focusY - 1, focusX: nextFocusX })
    }
  }

  handleRight() {
    if (this.state.focusX == this.maxFocusX) {
      this.props.handleBoundary(this, RIGHT)
    } else {
      this.setState({ focusX: this.state.focusX + 1 })
    }
  }

  handleDown() {
    if (this.state.focusY == this.maxFocusY) {
      this.props.handleBoundary(this, DOWN)
    } else {
      const currentMaxFocusX = this.maxFocusOfXAt(this.state.focusY)
      const nextMaxFocusX =  this.maxFocusOfXAt(this.state.focusY + 1)
      let nextFocusX = this.state.focusX

      if (nextMaxFocusX < currentMaxFocusX) {
        nextFocusX = Math.floor(this.state.focusX / Math.floor(currentMaxFocusX / nextMaxFocusX))
      }

      this.setState({ focusY: this.state.focusY + 1, focusX: Math.min(nextFocusX, nextMaxFocusX) })
    }
  }

  render() {
    let { children, classNames } = this.props
    let { rowClassNames, ...gridClassNames } = classNames

    const matrix = this.childrenAsMatrix

    return (
      <div className={Classnames({ ...gridClassNames, grid: true })}>
        {matrix.reduce((acc, row, yIndex) => {
          return acc.concat((
            <div key={yIndex} className={Classnames(rowClassNames)}>
              {row.map((item, xIndex) => {
                if (typeof(item) !== 'object') {
                  throw(`Child ${item} of Grid is invalid!`)
                }
                let key = `grid-item-${xIndex}-${yIndex}`
                let itemProps = { ...item.props, key }
                return this.hasFocus(xIndex, yIndex) ? React.cloneElement(item, {...itemProps, hasFocus: true}) : React.cloneElement(item, {...itemProps})
              })}
            </div>
          ))},[])}
      </div>
    )
  }
}

Grid.defaultProps = {
  classNames: { rowClass: false }
}
export default withFocusHandling(Grid)
