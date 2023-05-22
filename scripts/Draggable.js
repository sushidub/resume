'use strict';

import { Trigger_Event, debug } from './jshelprs.js';

export default class Draggable {
  
  /*
   * Constructor arguments should include:
   *    - draggable element target
   *    - until an event bus is in place listener objects (i.e., listener element, drag element 
   *      listen property) should be passed in as an array
   *    - any directional constraints (e.g., up, down, left, right) during drag
   */

  constructor(ele, stage = {}, listeners = [], name = "") {
    console.info('%cclass: Draggable (%s)', debug.fn, name);

    this.ele = ele;
    this.name = name;
    this.listeners = listeners;

    for (const [key, value] of Object.entries(stage)) {
      this[key] = value;
    }

    this.ele.onmousedown = this.onmousedown.bind(this);

    console.info('%cclass: Draggable\n%o', debug.small, this);
    
    this.ele.ondragstart = function() {
      return false;
    };
  }

  onmousedown(event) {
    event.preventDefault();
    
    console.info('%cfn: onmousedown', debug.fn);
    this.updateListeners(event);

    const moveAt = (event) => {
      this.updateListeners(event);
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

    const onmouseup = (event) => {
      console.info('%cfn: onmouseup', debug.fn);
      document.removeEventListener('mousemove', onMove);
      this.ele.onmouseup = null;
      this.updateListeners(event);
    };
  
    const onmouseout = (event) => {
      console.info('%cfn: onmouseout', debug.fn);
      document.removeEventListener('mousemove', onMove);
      this.ele.onmouseout = null;
      this.updateListeners(event);
    }
    
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