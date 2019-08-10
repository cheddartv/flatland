# Flatland #

## Usage ##

### Boundaries ###

In the beginning, there was a `Boundary`. Your boundary component is responsible for listening to keypress events. It also keeps track of which child section is active, via state.

```
import { Boundary, Column, Grid } from 'flatland'

<Boundary initialActiveSection={'navColumn'} handleKeydown={this.handleKeydown}>
  <Column flatId={'navColumn'}>
    <Item>Comedy</Item>
    <Item>Drama</Item>
    <Item>Documentary</Item>
    <Item>Action</Item>
  </Column>
  <Grid flatId={'videoResults'} itemsPerRow={3}>
    {this.videoItems}
  </Grid>
</Boundary>
```

`Boundary` will listen to the browser's keypress events, and will attempt to re-render focus when `LEFT`, `UP`, `RIGHT`, or `DOWN`is pressed. If you need to alias keypresses, you may do so by providing a custom `handleKeydown` function prop:

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
```


You should configure your Boundary with a `flatId` value that points to your `initialActiveSection`. The boundary component will delegate to the active section to determine which `Item` is currently focused.

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
<Item classNames={{ navItem: true }}>Movies</Item>
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
You must pass a section a `flatId` prop, which is a string that will be used to pass focus **from section to section** (more on this below).

Like items, sections can be passed a `classNames` prop.

The first child item of a section will have focus when the component first mounts, and is made active.

Flatland has three simple section types, `Column`, `Row`, and `Grid`. Columns and Rows promote and demote focus of child items in one dimension. Grids promote and demote focus in two dimensions.

For example, the `navColumn` above will promotes and demotes focus on the `UP` and `DOWN` events. Assuming the app just mounted, pressing `DOWN` will promote focus from `<Item>Comedy</Item>` to `<Item>Drama</Item>`. The same promotion would happen if this example were a `Row` instead, and `RIGHT` was pressed.

`Grid` will create a matrix of children items, which you can influence with the `itemsPerRow` prop.

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
import { Boundary, Column, Grid, RIGHT, LEFT, RIGHT } from 'flatland'

<Boundary>
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
</Boundary>
```

Assuming there is another section within the Boundary with the specified `flatId`, pressing RIGHT while the `navColumn` is active will pass focus to the `videoResults` Grid. If no section can become active, the active section remains active, and the focused item remains focused.

### Overriding Boundaries ###

In rare cases, you may want to override the handling of a section exit. One notable example is when you want to paginate through a resource via exits from the `BOTTOM` or `TOP` of a grid.

You may do this by providing a `handleBoundary` callback via props:

```
import { Grid, TOP, BOTTOM } from 'flatland'

const VIDEO_ROW_COUNT = 2

handleBoundary(propagateBoundary, ref, dir) {
  if (dir == TOP && this.props.hasPreviousPage) {
    this.props.previousPage()
    ref.driveFocus((x,y) => [x, VIDEO_ROW_COUNT - 1])
  } else if (dir == BOTTOM && this.props.hasNextPage)
    this.props.nextPage().then(() => {
      ref.driveFocus((x,y) => [x, 0])
    })
  } else {
    return propagateBoundary(ref, dir)
  }
}

<Grid
  flatId={'videoResults'}
  handleBoundary={this.handleBoundary}
  pushFocusTo={...}/>
  ...
</Grid>
```

In the above example, `driveFocus` is a method exposed on `Grid` that permits the caller to override the currently focused item. Its argument is a function that returns an array with the new coordinates of focus. By keeping the value of x constant, and only modifiying the y value, the user has horizontal context from their previous page when navigating to a new page of resources.
