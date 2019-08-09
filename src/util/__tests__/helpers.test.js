import React from 'react'
import Column from '../../navigation/Column'
import Item from '../../navigation/Item'
import { focusableChildrenOf } from '../helpers'

const node = (
  <Column>
    <Item>1</Item>
    <Item>2</Item>
    <Item>3</Item>
    <div>Not Focusable!</div>
    <div>
      <Item>4</Item>
      <div>
        <Item>5</Item>
      </div>
    </div>
    <Item>6</Item>
  </Column>
)

it('should only return the focusable components', () => {
  expect(focusableChildrenOf(node).length).toBe(6)
})
