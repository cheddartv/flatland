import { def } from 'bdd-lazy-var/global'
import { DOWN, LEFT, RIGHT, SELECT, UP, pressWas } from '../keypress'

def('prevProps', () => ({ globalX: 0, globalY: 0, selects: 0 }))
def('pressWas', () => pressWas($prevProps, $props))

describe('LEFT', () => {
  def('props', () => ({ globalX: -1, globalY: 0, selects: 0 }))

  it('should return LEFT', () => {
    expect($pressWas).toBe(LEFT)
  })
})

describe('UP', () => {
  def('props', () => ({ globalX: 0, globalY: -1, selects: 0 }))

  it('should return UP', () => {
    expect($pressWas).toBe(UP)
  })
})

describe('RIGHT', () => {
  def('props', () => ({ globalX: 1, globalY: 0, selects: 0 }))

  it('should return RIGHT', () => {
    expect($pressWas).toBe(RIGHT)
  })
})

describe('DOWN', () => {
  def('props', () => ({ globalX: 0, globalY: 1, selects: 0 }))

  it('should return DOWN', () => {
    expect($pressWas).toBe(DOWN)
  })
})

describe('SELECT', () => {
  def('props', () => ({ globalX: 0, globalY: 0, selects: 1 }))

  it('should return SELECT', () => {
    expect($pressWas).toBe(SELECT)
  })
})

describe('no delta', () => {
  def('props', () => ({ globalX: 0, globalY: 0, selects: 0 }))

  it('should return 0', () => {
    expect($pressWas).toBe(0)
  })
})
