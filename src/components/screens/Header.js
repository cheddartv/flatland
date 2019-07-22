import React from "react"
import cheddarColorLogo from '../../public/cheddarColorLogo.png'
import '../../stylesheets/screens/header.css'

export default class Header extends React.Component {

  render () {
    const { currentCategory } = this.props
    return (
      <div className={"headerWrapper"}>
        <div className={"categoryName"}>{currentCategory}</div>
        <img className={'cheddarColorLogo'} src={cheddarColorLogo} />
      </div>
    )
  }
}
