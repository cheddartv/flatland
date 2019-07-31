import Classnames from 'classnames'
import React from 'react'
import { focusableChildrenOf } from '../../util/helpers'
import item from './Item'
import { DOWN, LEFT, RIGHT, UP } from '../../util/keypress'
import withFocusHandling from './FocusHandling'

class Grid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focusX: props.initialFocusX || 0,
      focusY: props.initialFocusY || 0,
      focusedItem: focusableChildrenOf(this)[0]
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
      this.setState({ focusY: this.state.focusY - 1 })
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

      this.setState({ focusY: this.state.focusY + 1, focusX: Math.min(this.state.focusX, this.maxFocusOfXAt(this.state.focusY + 1)) })
    }
  }

  render() {
    let { children, classNames } = this.props
    let { rowClassNames, ...gridClassNames } = classNames

    const matrix = this.childrenAsMatrix

    return (
      <div className={Classnames({ ...gridClassNames, grid: true })}>
        {matrix.reduce((acc, row, xIndex) => {
          return acc.concat((
            <div className={Classnames(rowClassNames)}>
              {row.map((item, yIndex) => {
                if (typeof(item) !== 'object') {
                  throw(`Child ${item} of Grid is invalid!`)
                }
                let key = `grid-item-${xIndex}-${yIndex}`
                let itemProps = { ...item.props, key }
                return this.hasFocus(yIndex, xIndex) ? React.cloneElement(item, {...itemProps, hasFocus: true}) : React.cloneElement(item, {...itemProps})
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
