import React from 'react'

export function focusableChildrenOf(node) {
  if (node.type && node.type.focusable) {
    return [node]
  }

  if (!node.props) {
    return []
  }

  const childrenToArray = React.Children.toArray(node.props.children)
  if (childrenToArray.length == 0) {
    return []
  }

  return childrenToArray.reduce((m, child) => [...m, ...focusableChildrenOf(child)], [])
}
