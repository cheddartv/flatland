import React from "react"
import Screen from "../navigation/Screen"
import Column from "../navigation/Column"
import Item from "../navigation/Item"
import Boundary from "../navigation/util/Boundary"
import ScreenBoundary from "../navigation/util/ScreenBoundary"
import LiveVideoItem from "../items/LiveVideoItem"
import '../../stylesheets/screens/nav.css'
import directvlogo from "../../public/directvlogo.png"
import search from "../../public/search.png"
export default class NavScreen extends React.Component {
  get content() {
    return [
      <Column>
        <LiveVideoItem/>
        <Item>Top Picks</Item>
        <Item>Business</Item>
        <Item>Sports</Item>
        <Item>Technology</Item>
        <Item>Culture</Item>
        <Item>Science</Item>
        <Item>Politics</Item>
        <Item>
          Search
          <img className={"search"} src={search} />
        </Item>
      </Column>
    ]
  }
  get sections() {
    return ScreenBoundary([ [ Boundary(this.content) ], [ Boundary([]) ] ])
  }

  get classNames() {
    return {"navScreen": true}
  }

  onSectionEntered() {
    return ((axisIndex) => axisIndex === 0 ? axisIndex+1 : axisIndex)
  }

  render() {
    return (
      <div className={"navContainer"}>
        <div className={"topWrapper"}>
          <div className={"logoContainer"}>
            <img src={directvlogo}/>
          </div>
        </div>
        <Screen {...this.props} onSectionEntered={this.onSectionEntered} classNames={this.classNames} sections={this.sections}/>
      </div>
    )
  }
}
