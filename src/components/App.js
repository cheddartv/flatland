import 'preact/debug'
import '../stylesheets/app.css'
import React from "react"
import { BOTTOM, LEFT, RIGHT, TOP } from '../util/keypress'
import Grid from './navigation/Grid'
import Row from './navigation/Row'
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
          <Boundary initialFocusedSection={'first'}>
            <Column flatId={'first'} pushFocusTo={[
              { flatId: 'second', onExitFrom: RIGHT },
              { flatId: 'third', onExitFrom: BOTTOM }
            ]}>
              <Item>Hello!</Item>
              <Item>Select</Item>
              <div>Skip me!</div>
              <Item>Any</Item>
              <Item onSelect={() => console.log('success!')}>Item</Item>
            </Column>
            <Row flatId={'second'} pushFocusTo={[
              { flatId: 'first', onExitFrom: LEFT },
              { flatId: 'third', onExitFrom: BOTTOM }
            ]}>
              <Item>Or</Item>
              <Item>Navigate</Item>
              <Item>Here!</Item>
            </Row>
            <Grid flatId={'third'} pushFocusTo={[
              { flatId: 'first', onExitFrom: TOP },
            ]}>
              <Item>A</Item>
              <Item>B</Item>
              <Item>C</Item>
              <Item>D</Item>
              <Item>E</Item>
              <Item>F</Item>
              <Item>G</Item>
              <Item>H</Item>
              <Item>I</Item>
            </Grid>
          </Boundary>
        </div>
      </div>
    )
  }
}
