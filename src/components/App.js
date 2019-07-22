import 'preact/devtools'
import '../stylesheets/app.css'
import React from "react"
import Item from './navigation/Item'
import Column from './navigation/Column'
import Boundary from './navigation/Boundary'
import { TOP, BOTTOM, RIGHT } from '../util/keypress'

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='container'>
        <div className='app'>
          <Boundary>
            <Column id={'first'} pushFocusTo={[ { id: 'second', onExitFrom: BOTTOM } ]}>
              <Item>Hello!</Item>
              <Item>Select</Item>
              <Item>Any</Item>
              <Item>Item</Item>
            </Column>
            <Column id={'second'} pushFocusTo={[ { id: 'first', onExitFrom: RIGHT } ]}>
              <Item>Or</Item>
              <Item>Navigate</Item>
              <Item>Here!</Item>
            </Column>
          </Boundary>
        </div>
      </div>
    )
  }
}
