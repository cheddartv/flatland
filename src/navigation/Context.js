import React from 'react'

export const BoundaryContext = React.createContext({
  registerFocusThief: ((_flatId, _stealable) => {}),
})
export const FocusableContext = React.createContext({
  updateCurrentItem: ((_item) => {}),
})
