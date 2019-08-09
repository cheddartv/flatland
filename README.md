# Flatland #

## Usage ##

### Item ###
`Item` is the atomic component of Flatland. An item is a component that can receive focus:

```
<Item>Movies</Item>
```

You may pass an `Item` `onFocus` and `onSelect` callbacks via props:


```
<Item onFocus={this.textToSpeech("Movies")} onSelect={this.showMovies}>Movies</Item>
```

You may also pass an `Item` a `classNames` prop, which accepts an object that [conditionally renders CSS classnames](https://github.com/JedWatson/classnames) for the DOM node that is ultimately rendered:

```
<Item classNames={{ navItem: true }}>Movies</Item>
```

An Item will have a classname of `.item` by default, and will additionally have classname `.hasFocus` when focused. It will be helpful for you to define a default global styling of your focused element using these classnames:

```
.item.hasFocus {
  border: 10px solid #eb228f;
}
```

### Focusables ###
You may give context to your `Items` by passing them as children to `Focusables`:

```
<Column flatId={'navColumn'}>
  <Item>Comedy</Item>
  <Item>Drama</Item>
  <Item>Documentary</Item>
  <Item>Action</Item>
</Column>
```
You must pass a `Focusable` a `flatId` prop, which is a string that will be used to pass focus around the app (more on this below).

Like `Item`, `Focusables` can be passed a `classNames` prop.

The first child `Item` of a `Focusable` will have focus by default.

`Column` and `Row` will promote and demote focus of child `Items` in one dimension of your app. A listener configured by `Boundary` emits keypress events to your `Focusables`, aliased as LEFT, UP, RIGHT, DOWN, and SELECT.

`Column` promotes and demotes focus on `UP` and `DOWN` events. In the `navColumn` example above, pressing `DOWN` will promote focus from `<Item>Comedy</Item>` to `<Item>Drama</Item>`. The same promotion would happen if this example were a `Row` instead, and `RIGHT` was pressed.

When a boundary is hit, a new focusable may steal focus from the actively focused component. This is configured via the `pushFocusTo` prop:

```
  <Column flatId={'navColumn'} pushFocusTo={[
    { flatId: 'videoResultsRow', onExitFrom: RIGHT }
  ]}>
    ...
  </Column>
```

Assuming there is another `Focusable` within the app with the specified `flatId`, hitting a boundary after a RIGHT keypress will pass focus to that `Focusable`.
