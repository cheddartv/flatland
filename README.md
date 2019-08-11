# Flatland #

## Usage ##

In the beginning, there was `Flatland`.

Your flatland component is responsible for listening to keypress events. It also keeps track of which child section is active, via state.

```
import { Flatland, Column, Grid } from 'flatland'

<Flatland initialActiveSection={'navColumn'} handleKeydown={this.handleKeydown}>
  <Column flatId={'navColumn'}>
    <Item>Comedy</Item>
    <Item>Drama</Item>
    <Item>Documentary</Item>
    <Item>Action</Item>
  </Column>
  <Grid flatId={'videoResults'} itemsPerRow={3}>
    {this.videoItems}
  </Grid>
</Flatland>
```

`Flatland` will listen to the browser's keypress events, and will attempt to re-render focus when `LEFT`, `UP`, `RIGHT`, or `DOWN`is pressed. If you need to alias keypresses, you may do so by providing a custom `handleKeydown` function prop:

```
import { BACK, LEFT } from 'flatland'

handleKeydown(propagateKeydown, key) {
  switch(key.keyCode) {
    case BACK:
      propagateKeydown({ keycode: LEFT })
      break
    default:
      propagateKeydown(key)
  }
}
```


You should configure your Flatland component with a `initialActiveSection` prop that matches the `flatId` of the section you would like to be initally focued. The flatland component will delegate to the active section to determine which `Item` is currently focused.

### Item ###
`Items` are the atomic components of your Flatland app. An item is a component that can receive focus:

```
<Item>Comedy</Item>
```

You may pass your items optional `onFocus` and `onSelect` callbacks via props:

```
<Item onFocus={this.textToSpeech("Comedy")} onSelect={this.showComedies}>Comedy</Item>
```

You may also pass an item a `classNames` prop, which accepts an object that [conditionally renders CSS classnames](https://github.com/JedWatson/classnames) for the DOM node that is ultimately rendered:

```
<Item classNames={{ navItem: true }}>Comedy</Item>
```

An item will have a classname of `.item` by default, and will also have classname `.hasFocus` when focused.

### Sections ###
`Sections` are where all the action happens in Flatland. You give context to how focus should travel **from item to item** by passing them as children to your sections:

```
<Column flatId={'navColumn'}>
  <Item>Comedy</Item>
  <Item>Drama</Item>
  <Item>Documentary</Item>
  <Item>Action</Item>
</Column>
```

Note that Flatland is smart enough to pluck items out of any nesting of child components:

```
<Column flatId={'navColumn'}>
  <Item>THIS</Item>
  <div>
    <Item>IS</Item>
    <AnotherComponent>
      <Item>ALSO</Item>
    </AnotherComponent>
  </div>
  <img href={'someImage'} />
  <Item>VALID</Item>
</Column>
```


You must pass a section a `flatId` prop, which is a string that will be used to pass focus **from section to section** [(more on this below)](https://github.com/cheddartv/flatland#warping-around-flatland).

Like items, sections can be passed a `classNames` prop.

The first child item of a section will have focus when the component first mounts, and is made active.

Flatland has three simple section types, `Column`, `Row`, and `Grid`. Columns and Rows promote and demote focus of child items in one dimension. Grids promote and demote focus in two dimensions.

For example, the `navColumn` above will promote and demote focus on the `UP` and `DOWN` events. Assuming the `navColumn` component just mounted, pressing `DOWN` will promote focus from `<Item>Comedy</Item>` to `<Item>Drama</Item>`. The same promotion would happen if this example were a `Row` instead, and `RIGHT` was pressed.

`Grid` will create a matrix of children items, which will be distributed across the X and Y axes of your flatland app. You can control the length of the axes with the `itemsPerRow` prop.

To make sense of how sections pass focus from item to item, it may be helpful for you to define default global base stylings for `.item`, `.column`, `.row`, and `grid`:

```
.item { display: block }
.item.hasFocus { border: red 1px solid }
.column { display: inline-block }
.row .item { display: inline-block }
.row { display: inline-block }
.grid .item { display: inline-block; padding: 10px }
```

### Warping around Flatland ###

There are only four ways to leave an active section in Flatland. In the `navColumn` example above, they are:

* Via the `TOP` of the section (UP is pressed when the Comedy item is active).
* Via the `BOTTOM` of the section (DOWN is pressed when the Action item is active).
* Via the `LEFT` or `RIGHT` of the section (LEFT or RIGHT is pressed at any time).

When a section boundary is hit, a new section may steal focus from the active section. This is configured via the `pushFocusTo` prop:

```
import { Flatland, Column, Grid, RIGHT, LEFT, RIGHT } from 'flatland'

<Flatland>
  <Column flatId={'navColumn'} pushFocusTo={[
    { flatId: 'videoResults', onExitFrom: RIGHT }
  ]}>
    ...
  </Column>
  <Grid flatId={'videoResults'} itemsPerRow={3} pushFocusTo={[
    { flatId: 'navColumn', onExitFrom: LEFT },
    { flatId: 'searchBar', onExitFrom: RIGHT }
  ]}>
    ...
  </Grid>
</Flatland>
```

Assuming there is another child section of `Flatland` with `flatId` equal to `videoResults`, pressing RIGHT while the `navColumn` is active will pass focus to the `videoResults` grid. If no section can become active, the active section remains active, and the focused item remains focused.

You may prevent the default exit of a section by passing an `unless` function:

```
{ flatId: 'videoResults', onExitFrom: RIGHT, unless: () => this.hasNoResults },
```


### Overriding Boundaries ###

In rare cases, you may want to completely override the handling of a section exit. One notable example is when you want to paginate through a resource via exits from the `BOTTOM` or `TOP` of a grid.

You may do this by providing a `handleBoundary` callback to your grid via props:

```
import { Grid, TOP, BOTTOM } from 'flatland'

const VIDEO_ROW_COUNT = 2

handleBoundary(propagateBoundary, sectionRef, direction) {
  if (direction === TOP && this.props.hasPreviousPage) {
    this.props.previousPage()
    sectionRef.driveFocus((x,y) => [x, VIDEO_ROW_COUNT - 1])
  } else if (direction === BOTTOM && this.props.hasNextPage)
    this.props.nextPage().then(() => {
      sectionRef.driveFocus((x,y) => [x, 0])
    })
  } else {
    propagateBoundary(ref, dir)
  }
}

<Grid
  flatId={'videoResults'}
  handleBoundary={this.handleBoundary}
  pushFocusTo={...}/>
  ...
</Grid>
```

In the above example, `driveFocus` is a method exposed on `Grid` that permits the caller to override the currently focused item. Its argument is a function that returns an array with the new coordinates of focus. By keeping the value of the X focus constant, and only modifiying the Y focus value, the user has horizontal context from their previous page when navigating to a new page of resources.

### Composition ###

As your app grows, you may want to compose your simple section types to better organize your components.

Here is an example of a simple app layout using Flatland:

**Layout.js**
```
import React from "react"
import NavColumn from './columns/NavColumn'
import VideoListGrid from './grids/VideoListGrid'
import { Flatland } from 'flatland'
import { fetchVideos } from '../util/fetchVideos'

export default class Layout extends React.Component {
  constructor(props) {
    super(props)

    this.updateCurrentSection = this.updateCurrentSection.bind(this)
    this.startVideoPlayer = this.startVideoPlayer.bind(this)
    this.state = {
      currentCategory: 'Comedy'
      videos = []
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { category } = this.state

    if (prevState.currentCategory !== category) {
      this.setState({ videos: fetchVideos(category) })
    }
  }

  updateCurrentSection(categoryName) {
    this.setState({ currentCategory: categoryName })
  }

  startVideoPlayer(url) {
    // start fullscreen video player here
  }

  render() {
    return (
      <Flatland initialActiveSection={'navColumn'}>
        <NavColumn onFocus={this.updateCurrentSection} startVideoPlayer={this.startVideoPlayer}/>
        <VideoListGrid videos={this.videos} /> // 'videoResults' composed here
      </Flatland>
    )
  }
}

```

**NavColumn.js**
```
import React from "react"
import LiveVideoItem from '../items/LiveVideoItem'
import { Column, Item, RIGHT } from 'flatland'

export default class NavColumn extends React.Component {
  itemProps(name) {
    return { onFocus: () => this.props.onFocus(name) }
  }

  navItem(name) {
    return <Item {...this.itemProps(name)}>{name}</Item>
  }

  render() {
    return (
      <Column flatId={'navColumn'} pushFocusTo={[{ flatId: 'videoResults', onExitFrom: RIGHT }]}>
        <LiveVideoItem onSelect={this.props.startVideoPlayer}/>
        {this.navItem('Comedy')}
        {this.navItem('Drama')}
        {this.navItem('Documentary')}
        {this.navItem('Action')}
      </Column>
    )
  }
}

```

**LiveVideoItem.js**
```
import React from "react"
import { Item } from "flatland"
import { livestreamURL } from "../../util/livestreamURL"

export default class LiveVideoItem extends React.Component {
  constructor(props) {
    super(props)

    this.onSelect = this.onSelect.bind(this)
  }

  onSelect() {
    this.props.startVideoPlayer(livestreamURL)
  }

  render() {
    return (
      <Item hasFocus={this.props.hasFocus} classNames={{ liveVideoItem: true }} onSelect={this.onSelect}/>
    )
  }
}

LiveVideoItem.defaultProps = {
  startVideoPlayer: (() => {})
}
LiveVideoItem.focusable = true

```



**Note on composition:** When composing an item component, make sure to:
* Declare a `.focusable = true` property on the class of the component.
* Pass along the `hasFocus` prop to the child item. This prop will be available to any `focusable` child of a section (`Item` is focusable by default).

### Creating new sections ###

Creating your own sections is easy in Flatland. You will need to define a class-based component that defines any of the following methods:

* `handleLeft`
* `handleUp`
* `handleRight`
* `handleDown`
* `handleSelect`

You also need to export your Section as a HOC using `withFocusHandling`.

Any component `withFocusHandling` will be passed a `handleBoundary(ref, dir)` prop, that should be called when a boundary is crossed:

```
import React from 'react'
import { withFocusHandling, focusableChildrenOf, UP } from flatland'

class OnlyGoesUp extends React.Component {
  constructor(props) {
    super(props)

    this.state = { focusY: 5 }
  }

  handleUp() {
    if (this.state.focusY === 0) {
      this.props.handleBoundary(this, UP)
    } else {
      this.setState({ focusY: this.state.focusY - 1 })
    }
  }

  hasFocus(item) {
    return this.props.hasFocus && this.state.focusY === focusableChildrenOf(this).indexOf(item)
  }

  render() {
    const children = React.Children.toArray(this.props.children)

    return (
      <div className={Classnames({ ...this.props.classNames, onlyGoesUp: true })}>
        {children.map((item, index) => {
          let key = `up-item-${index}`
          let itemProps = { ...item.props, key }
          return this.hasFocus(item) ? React.cloneElement(item, {...itemProps, hasFocus: true}) : React.cloneElement(item, {...itemProps})
        })}
      </div>
    )
  }
}

export default withFocusHandling(OnlyGoesUp)

```

You should also make use of the `focusableChildrenOf(sectionRef)` helper to ignore any non-focusable children passed to your custom section.
