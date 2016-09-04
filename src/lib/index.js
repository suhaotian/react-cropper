import React, { Component } from 'react'

import throttle from 'lodash.throttle'

class Cropper extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
    }

    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd= this.handleTouchEnd.bind(this)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)

    this.handleStart = this.handleStart.bind(this)
    this.handleMove = this.handleMove.bind(this)
    this.handleEnd = this.handleEnd.bind(this)

    this.drawImageToCanvas = this.drawImageToCanvas.bind(this)
    this.calculateDistance = this.calculateDistance.bind(this)
    this.drawImage = throttle(this.drawImage, 100).bind(this)

    this.current_xy = null // initial position x,y
    this.x = 0
    this.y = 0
    this.firstDraw = true
  }

  componentDidMount() {
    this.canvasContext = this._canvas.getContext('2d')
    this.drawImageToCanvas()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.zoom !== this.props.zoom) {
      this.drawImage()
    }
  }

  drawImageToCanvas() {
    const { width, ratio, src } = this.props

    if (!src) return
    const height = width/ratio

    this.img = new Image()
    this.img.onload = () => {
      let b = this.img.width/this.img.height
      if (b > 1) {
        this.width = height * b
        this.height = height
      } else {
        this.width = width
        this.height = width/b
      }

      this._canvas.width = width
      this._canvas.height = height

      this.drawImage()
      this.firstDraw = false

      this.img.onload=null
    }
    this.img.src=src
  }

  drawImage() {
    const zoom = this.props.zoom
    const width = this.width * zoom
    const height = this.height * zoom

    let max_offset_x = null
    let max_offset_y = null

    if (height <= this._canvas.height) { // 如果高度一定，那么上下不能移动
      this.y = 0
    } else {
      max_offset_y = this._canvas.height - height
      if (this.y > 0) {
        this.y = 0
      } else if (this.y < max_offset_y) {
        this.y = max_offset_y
      }    
    }

    if (width <= this._canvas.width) {
      this.x = 0
    } else {
      max_offset_x = this._canvas.width - width
      if (this.x > 0) {
        this.x = 0
      } else if (this.x < max_offset_x) {
        this.x = max_offset_x
      }
    }

    if(!this.firstDraw) {
      this.canvasContext.clearRect(0, 0, this.width, this.height)
    }

    this.canvasContext.drawImage(this.img, this.x, this.y, width, height)
    this.props.onCrop({x: this.x, y: this.y, width, height})
  }

  handleStart() {
  }
  handleMove() {
  }
  handleEnd() {
  }

  handleTouchStart(e) {
    e.preventDefault()

    this.current_xy = {
      x: e.touches[0].pageX, 
      y: e.touches[0].pageY,
    }
  }
  handleTouchMove(e) {
    e.preventDefault()

    if (!this.current_xy) return
    this.calculateDistance(e.touches[0])
  }
  handleTouchEnd(e) {
    this.current_xy = null
  }

  handleMouseDown(e) {
    this.current_xy = {
      x: e.pageX,
      y: e.pageY,
    }
  }
  handleMouseMove(e) {
    if (!this.current_xy) return
    this.calculateDistance(e)
  }
  handleMouseUp(e) {
    this.current_xy = null
  }

  calculateDistance(e) {
    const dx = e.pageX - this.current_xy.x
    const dy = e.pageY - this.current_xy.y
    this.current_xy = {
      x: e.pageX,
      y: e.pageY,
    }
    this.x+=dx
    this.y+=dy
    this.drawImage()
  }

  render() {
    return (
      <div
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        onTouchCancel={this.handleTouchEnd}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
      >
      <canvas 
        ref={c => {this._canvas = c}} 
      />
      </div>
    )
  }
}

Cropper.defaultProps={
  zoom: 1,
  onCrop: n => n,
}

export default Cropper