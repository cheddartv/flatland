import React from 'react'

export function focusableChildrenOf(node) {
  const nodeName = node.constructor ? node.constructor.name : node.type.name
  if (nodeName === "Item") {
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
