import React from "react"
import Screen from "../navigation/Screen"
import Row from "../navigation/Row"
import VideoRow from "../rows/VideoRow"
import withPagination from "../connectors/Paginator"
import Boundary from "../navigation/util/Boundary"
import ScreenBoundary from "../navigation/util/ScreenBoundary"
import '../../stylesheets/screens/videoList.css'
import Header from "./Header"

export const ROW_COUNT=2
export const VIDEOS_PER_ROW=3

export class VideoListScreen extends React.Component {
  get videoRows() {
    const { videos } = this.props
    let rows = []
    let batch

    for (let i=0; i<ROW_COUNT; i++) {
      let startIndex = i * VIDEOS_PER_ROW
      let endIndex = startIndex + VIDEOS_PER_ROW
      batch = videos.slice(startIndex, endIndex)

      if (batch.length > 0) {
        rows.push(<VideoRow videos={batch} />)
      }
    }

    return rows
  }

  get sections() {
    return ScreenBoundary([ [ Boundary(this.videoRows) ], [ Boundary([]) ] ])
  }

  get classNames() {
    return {"videoListScreen": true}
  }

  handleBoundary(vectorX, vectorY) {
    if (vectorY < 0 && this.props.hasPreviousPage()) {
      this.props.previousPage()
      return [0, (ROW_COUNT - 1)]
    } else if (vectorY > 0 && this.props.hasNextPage()) {
      return this.props.nextPage().then(() => {
        return [0, (ROW_COUNT - 1) * -1]
      })
    } else {
      return this.props.handleBoundary(vectorX, vectorY)
    }
  }

  render() {
    const { currentCategory } = this.props
    return (
      <div className={"videoListContainer"}>
        <Header currentCategory={currentCategory}/>
        <Screen {...this.props} handleBoundary={this.handleBoundary.bind(this)} classNames={this.classNames} sections={this.sections}/>
      </div>
    )
  }
}

export default withPagination(VideoListScreen, {resourceName: 'videos', pageSize: ROW_COUNT*VIDEOS_PER_ROW})

VideoListScreen.defaultProps = {
  videos: [],
  handleBoundary: ((vectorX, vectorY) => {})
}
