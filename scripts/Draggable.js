'use strict';

import { Trigger_Event, debug } from './jshelprs.js';

export default class Draggable {
 
  constructor(ele, name = "", listeners = []) {
    console.info('%cclass: Draggable (%s)', debug.fn, name);

    this.name = name;
    this.ele = ele;
    this.listeners = listeners;
    this.ele.onmousedown = this.onmousedown.bind(this);
    this.movement = 0;
    this.targetEle = this.ele.parentElement;
    this.targetEleTop = this.targetEle.offsetTop;
    this.lineEleTop = this.ele.offsetTop;
    this.startPos = this.ele.offsetTop + this.targetEle.offsetTop;
    this.startPad = this.targetEle.computedStyleMap().get('padding-bottom').value;

    console.info(this);
    this.ele.ondragstart = function() {
      return false;
    };
  }

  onmousedown(event) {  
    console.info('%cfn: onmousedown', debug.fn);

    const moveAt = (event) => {
      // console.info('%cfn: moveAt', debug.fn);
      this.ele.style.top = (event.pageY -  this.targetEleTop) + 'px';
      track(event.pageY);
      let padTotal = this.startPad + this.movement;
      this.targetEle.style.paddingBottom = `${padTotal}px`;
      this.updateListeners(padTotal);
    }

    const onMove = (event) => {
      console.info('%cfn: mousemove', debug.fn);
      moveAt(event);
    }

    const track = (mouseY) => {
      // console.info('%cfn: track', debug.fn);
      this.movement = this.startPos - (this.ele.offsetTop + this.targetEle.offsetTop);
      const trackMap = {
        'name': this.name,
        'movement': this.movement,
        'mouse': mouseY,
        'ele': this.ele.offsetTop + this.targetEle.offsetTop
      }

      if (trackMap.movement === 0) {
        this.ele.classList.add('at-start');
      } else {
        this.ele.classList.remove('at-start');
      }

      // console.info('%o', trackMap);
    }

    const onmouseup = (event) => {
      console.info('%cfn: onmouseup', debug.fn);
      track(event.pageY)
      document.removeEventListener('mousemove', onMove);
      this.ele.onmouseup = null;
      this.updateListeners(this.targetEle.computedStyleMap().get('padding-bottom').value);
    };
  
    const onmouseout = (event) => {
      console.info('%cfn: onmouseout', debug.fn);
      track(event.pageY);
      document.removeEventListener('mousemove', onMove);
      this.ele.onmouseout = null;
      this.updateListeners(this.targetEle.computedStyleMap().get('padding-bottom').value);
    }

    track(event.pageY);
    this.movement = 0;
    
    moveAt(event);

    // move the ele on mousemove
    document.addEventListener('mousemove', onMove);

    this.ele.onmouseup = onmouseup;
    this.ele.onmouseout = onmouseout;
  }

  updateListeners(val) {
    this.listeners.forEach(listener => {
      Trigger_Event('overflowChange', {
        detail: {
          'value': val
        }
      }, listener);
    });
  }
}