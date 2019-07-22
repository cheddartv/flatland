import React from "react"
import Screen from "../navigation/Screen"
import Boundary from "../navigation/util/Boundary"
import ScreenBoundary from "../navigation/util/ScreenBoundary"
import SearchInputRow from "../rows/SearchInputRow"
import SearchInputFeedbackColumn from "../columns/SearchInputFeedbackColumn"
import Item from "../navigation/Item"
import VideoRow from "../rows/VideoRow"
import { VIDEOS_PER_ROW } from "./VideoListScreen" // TODO: export this from a more generic place?
import '../../stylesheets/screens/search.css'
import Header from "./Header"

export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props)

    this.handlePopCharacter = this.handlePopCharacter.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleBoundary = this.handleBoundary.bind(this)
    this.onSectionEntered = this.onSectionEntered.bind(this)
    this.onNextSection = this.onNextSection.bind(this)
    this.screenRef = null
    this.state = {query: ""}
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      if (this.state.query.length >= 3) {
        this.props.onSubmitQuery(this.state.query)
      } else if (this.state.query.length === 0 && this.props.videos.edges.length === 0) {
        this.resetResults()
      }
    }
  }

  componentWillUnmount() {
    this.resetResults()
  }

  get sections() {
    return ScreenBoundary([ [this.searchInputSection, this.searchResultsSection], [this.searchInputFeedbackSection] ])
  }

  get searchInputRows() {
    const withPushChar = {onSelect: this.handlePushCharacter.bind(this)}
    return [
      <SearchInputRow {...withPushChar} inputs={['A','B','C','D','E','F']}/>,
      <SearchInputRow {...withPushChar} inputs={['G','H','I','J','K','L']}/>,
      <SearchInputRow {...withPushChar} inputs={['M','N','O','P','Q','R']}/>,
      <SearchInputRow {...withPushChar} inputs={['S','T','U','V','W','X']}/>,
      <SearchInputRow {...withPushChar} inputs={['Y','Z','0','1','2','3']}/>,
      <SearchInputRow sectionRef={"lastLetterRow"} {...withPushChar} inputs={['4','5','6','7','8','9']}/>,
      <SearchInputRow sectionRef={"actionRow"} inputs={[
        {'CLR': this.handleClear},
        {'SPC': this.handlePushCharacter.bind(this, ' ')},
        {'DEL': this.handlePopCharacter}
      ]} />
    ]
  }

  get hasNoResults() {
    const { query } = this.state
    return query.length > 0 && this.resultsRow.length == 0
  }

  get resultsRow() {
    const { videos } = this.props
    return videos.edges.slice(0, VIDEOS_PER_ROW)
  }

  get videoRows() {
    let rows

    if (this.hasNoResults) {
      rows = [<Item classNames={{noResults: true}}>No results found for this query</Item>]
    } else {
      rows = [<VideoRow sectionRef={"videosRow"} videos={this.resultsRow} />]
    }

    return rows
  }

  get searchInputSection() {
    const envelope = <div key={'searchInput'} className={'searchInputSection'} />
    return Boundary(this.searchInputRows, envelope)
  }

  get searchInputFeedbackSection() {
    const envelope = <div key={'searchInputFeedback'} className={'searchInputFeedbackSection'} />
    return Boundary([
      <SearchInputFeedbackColumn
        videos={this.props.videos}
        query={this.state.query}
        onSelectFeedback={this.setQuery.bind(this)}
      />
    ], envelope)
  }

  get searchResultsSection() {
    return Boundary(this.videoRows)
  }

  setQuery(query) {
    this.setState({query})
  }

  handlePushCharacter(char) {
    this.setState({query: this.state.query + char})
  }

  handlePopCharacter() {
    this.setState({query: this.state.query.slice(0, -1)})
  }

  handleClear() {
    this.setState({query: ""})
  }

  resetResults() {
    this.props.onSubmitQuery("")
  }

  handleBoundary(vectorX, vectorY) {
    const {sectionX: currentSectionX, sectionY: currentSectionY} = this.screenRef.state
    if (this.hasNoResults && vectorX >= 0) {
      return [0, 0]
    } else if (vectorX > 0 && currentSectionX === 0 && currentSectionY !== this.searchInputRows.length) {
      return [1, -currentSectionY]
    } else if (vectorX < 0 && currentSectionX === 1) {
      return [-1,0]
    } else if (vectorY > 0 && currentSectionX === 1) {
        return [-1, this.searchInputRows.length]
    } else {
      return this.props.handleBoundary(vectorX, vectorY)
    }
  }

  onSectionEntered(previousSection, nextSection) {
    if (previousSection) {
      if (nextSection.sectionRef() === "actionRow" && previousSection.sectionRef() === "lastLetterRow") {
        return ((axisIndex) => Math.floor(axisIndex / 2))
      }

      if (nextSection.sectionRef() === "lastLetterRow" && previousSection.sectionRef() === "actionRow") {
        return ((axisIndex) => axisIndex * 2)
      }

      if (nextSection.sectionRef() === "videosRow"){
        return ((axisIndex) => 0)
      }
    }
  }

  onNextSection(vectorX, vectorY, previousSection) {
    if (this.hasNoResults && (vectorX > 0 || (vectorY > 0 && previousSection.sectionRef() === "actionRow"))) {
      return [0,0]
    }
    return [vectorX, vectorY]
  }

  render() {
    return (
      <div className={"searchContainer"}>
        <Header currentCategory={'SEARCH'} />
        <Screen
          {...this.props}
          ref={el => this.screenRef = el}
          handleBoundary={this.handleBoundary}
          onSectionEntered={this.onSectionEntered}
          onNextSection={this.onNextSection}
          sections={this.sections}
        />
      </div>
    )
  }
}

SearchScreen.defaultProps = {
  videos: {edges: []},
  onSubmitQuery: ((query) => {})
}
