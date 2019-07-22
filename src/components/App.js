import 'preact/devtools'
import '../stylesheets/app.css'
import React from "react"
import { LEFT, RIGHT } from '../util/keypress'
import Item from './navigation/Item'
import Column from './navigation/Column'
import Boundary from './navigation/Boundary'

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='container'>
        <div className='app'>
          <Boundary>
            <Column id={'first'} pushFocusTo={[ { id: 'second', onExitFrom: RIGHT } ]}>
              <Item>Hello!</Item>
              <Item>Select</Item>
              <Item>Any</Item>
              <Item>Item</Item>
            </Column>
            <Column id={'second'} classNames={{second: true}} pushFocusTo={[ { id: 'first', onExitFrom: LEFT } ]}>
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
