import React from 'react'
import { def } from 'bdd-lazy-var/global'
import { mount } from 'enzyme'
import {VideoListScreen, ROW_COUNT, VIDEOS_PER_ROW} from '../VideoListScreen'
import mockVideos from '../../../util/mockVideos'

def('videoData', () => [])
def('mockPreviousPage', () => jest.fn())
def('mockNextPage', () => jest.fn( () => ( {then: jest.fn()}) ))
def('mockHandleBoundary', () => jest.fn())
def('rendered', () => (
  mount(
    <VideoListScreen
      hasPreviousPage={() => true}
      hasNextPage={() => true}
      handleBoundary={$mockHandleBoundary}
      previousPage={$mockPreviousPage}
      nextPage={$mockNextPage}
      videos={$videoData}
    />
  )
))

it('renders without crashing', () => {
  expect($rendered)
})

describe('with mock videoData', () => {
  const itemCount = ROW_COUNT * VIDEOS_PER_ROW
  def('videoData', () => {
    return [...Array(itemCount).keys()].map((i) => {
      return {node: { title: i }}
    })
  })

  it('renders a VideoItem for each video', () => {
    expect($rendered.find('VideoItem').length).toEqual(itemCount)
  })
})

describe('with mock relay data', () => {
  def('videoData', () => mockVideos.edges)

  it('renders a video item with the appropriate video prop', () => {
    expect($rendered.find('VideoItem').at(0).prop('video')).toEqual(mockVideos.edges[0].node)
  })
})

describe('on Y boundaries', () => {
  def('mockNextPage', () => {
    return jest.fn(() => new Promise(resolve => resolve()))
  })
  describe('at the top of the screen', () => {
    it('should call props.previousPage when navigating off the top of the screen', () => {
      $rendered.instance().handleBoundary(0,-1)
      expect($mockPreviousPage).toHaveBeenCalled()
    })

    it('should return focus vectors to point to the bottom row, after the page is loaded', () => {
      expect($rendered.instance().handleBoundary(0,-1)).toEqual([0,1])
    })
  })

  describe('at the bottom of the screen', () => {
    it('should call props.nextPage when navigating off the bottom of the screen', () => {
      $rendered.instance().handleBoundary(0,1)
      expect($mockNextPage).toHaveBeenCalled()
    })

    it('should return focus vectors to point to the top row', async () => {
      expect(await $rendered.instance().handleBoundary(0,1)).toEqual([0,-1])
    })
  })

  it('should call props.handleBoundary otherwise', () => {
    $rendered.instance().handleBoundary(1,0)
    expect($mockHandleBoundary).toHaveBeenCalled()
  })
})
