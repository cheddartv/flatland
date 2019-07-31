import React from 'react'
import Classnames from 'classnames'

export default class Item extends React.Component {
  constructor(props) {
    super(props)

    this.handleSelect = this.handleSelect.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.hasFocus && !prevProps.hasFocus) {
      this.props.updateCurrentItem(this)
      this.props.onFocus()
    }
  }

  handleSelect() {
    this.props.onSelect()
  }

  render() {
    const { hasFocus, children, classNames } = this.props
    const className = Classnames({
      ...classNames,
      item: true,
      hasFocus
    })

    return <div className={className}>{children}</div>
  }
}

Item.defaultProps = {
  hasFocus: false,
  onFocus: (() => {}),
  onSelect: (() => {})
}

Item.focusable = true
