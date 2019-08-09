import { sharedExamplesFor } from 'bdd-lazy-var/global'

sharedExamplesFor('it handles left and right correctly', () => {
  describe('handleBoundary', () => {
    describe('handleRight', () => {
      describe('when at boundary', () => {
        it('should call props.handleBoundary', () => {
          $rendered.setState({ focusX: 2 })
          $rendered.instance().handleRight()
          expect($mockFn).toHaveBeenCalled()
        })
      })

      it('should increment state', () => {
        $rendered.instance().handleRight()
        expect($rendered.state().focusX).toBe(1)
      })
    })

    describe('handleLeft', () => {
      describe('when at boundary', () => {
        it('should call props.handleBoundary', () => {
          $rendered.instance().handleLeft()
          expect($mockFn).toHaveBeenCalled()
        })
      })

      it('should increment state', () => {
        $rendered.setState({ focusX: 1 })
        $rendered.instance().handleLeft()
        expect($rendered.state().focusX).toBe(0)
      })
    })
  })
})

sharedExamplesFor('it handles up and down correctly', () => {
  describe('handleBoundary', () => {
    describe('handleDown', () => {
      describe('when at boundary', () => {
        it('should call props.handleBoundary', () => {
          $rendered.setState({ focusY: 2 })
          $rendered.instance().handleDown()
          expect($mockFn).toHaveBeenCalled()
        })
      })

      it('should increment state', () => {
        $rendered.instance().handleDown()
        expect($rendered.state().focusY).toBe(1)
      })
    })

    describe('handleUp', () => {
      describe('when at boundary', () => {
        it('should call props.handleBoundary', () => {
          $rendered.instance().handleUp()
          expect($mockFn).toHaveBeenCalled()
        })
      })

      it('should increment state', () => {
        $rendered.setState({ focusY: 1 })
        $rendered.instance().handleUp()
        expect($rendered.state().focusY).toBe(0)
      })
    })
  })
})
