// Copyright (c) 2015 Uber Technologies, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {Component, createElement} from 'react';
import PropTypes from 'prop-types';
import {PerspectiveMercatorViewport} from 'viewport-mercator-project';
import {window} from '../utils/globals';
import autobind from '../utils/autobind';

const propTypes = {
  redraw: PropTypes.func.isRequired
};

const contextTypes = {
  viewport: PropTypes.instanceOf(PerspectiveMercatorViewport),
  isDragging: PropTypes.bool
};

export default class CanvasOverlay extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    this._redraw();
  }

  componentDidUpdate() {
    this._redraw();
  }

  _redraw() {
    const pixelRatio = window.devicePixelRatio || 1;
    const canvas = this._canvas;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.scale(pixelRatio, pixelRatio);

    const {viewport, isDragging} = this.context;
    this.props.redraw({
      width: viewport.width,
      height: viewport.height,
      ctx,
      isDragging,
      project: viewport.project.bind(viewport),
      unproject: viewport.unproject.bind(viewport)
    });

    ctx.restore();
  }

  _canvasLoaded(ref) {
    this._canvas = ref;
  }

  render() {
    const pixelRatio = window.devicePixelRatio || 1;
    const {viewport: {width, height}} = this.context;

    return (
      createElement('canvas', {
        ref: this._canvasLoaded,
        width: width * pixelRatio,
        height: height * pixelRatio,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          position: 'absolute',
          pointerEvents: 'none',
          left: 0,
          top: 0
        }
      })
    );
  }
}

CanvasOverlay.displayName = 'CanvasOverlay';
CanvasOverlay.propTypes = propTypes;
CanvasOverlay.contextTypes = contextTypes;
