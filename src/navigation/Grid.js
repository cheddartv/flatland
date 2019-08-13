import Classnames from 'classnames'
import React from 'react'
import item from './Item'
import withFocusHandling from './FocusHandling'
import { focusableChildrenOf } from '../util/helpers'
import { DOWN, LEFT, RIGHT, UP } from '../util/keypress'

class Grid extends React.Component {
  constructor(props) {
    super(props)

    const indexOfFocus = focusableChildrenOf(this).findIndex(f => f.props.hasInitialFocus)
    const focusX = Math.max(0, indexOfFocus % this.itemsPerRow)
    const focusY = Math.max(0, indexOfFocus % this.numRows)
    const focusedItem = this.childrenAsMatrix.length > 0 && this.childrenAsMatrix[focusX][focusY]
    this.state = { focusX, focusY, focusedItem: focusedItem }
  }

  get maxFocusX() { return this.maxFocusOfXAt(this.state.focusY) }
  get maxFocusY() { return this.childrenAsMatrix.length - 1 }
  maxFocusOfXAt(y) {
    return this.childrenAsMatrix[y].length - 1
  }

  get itemsPerRow() {
    return this.props.itemsPerRow || Math.ceil(Math.sqrt(focusableChildrenOf(this).length))
  }

  get numRows() {
    return Math.ceil(focusableChildrenOf(this).length / this.itemsPerRow)
  }

  get childrenAsMatrix() {
    let matrix = []
    for ( let i = 0; i < this.numRows; i++ ) {
      matrix.push(focusableChildrenOf(this).slice(i * this.itemsPerRow, (i + 1) * this.itemsPerRow))
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
        nextFocusX = this.state.focusX * Math.floor(nextMaxFocusX / (currentMaxFocusX || 1))
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
Grid.displayName = 'Grid'

export default withFocusHandling(Grid)
