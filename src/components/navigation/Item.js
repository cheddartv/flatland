import React from 'react'
import Classnames from 'classnames'

export default class Item extends React.Component {
  render() {
    const { hasFocus, children } = this.props
    const className = Classnames({
      item: true,
      hasFocus
    })

    return <span className={className}>{children}</span>
  }
}

Item.defaultProps = {
  hasFocus: false
}
