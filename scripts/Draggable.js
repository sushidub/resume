'use strict';

import { debug } from './jshelprs.js';

export default class Draggable {
  
  /*
   * Constructor arguments:
   *    - HTMLElement: draggable element target
   *    - Array: listeners/handlers (until an event bus is justified)
   *    - String: name (optional)
   *    - TBD: directional constraints (e.g., up, down, left, right) during drag
   */

  constructor(ele, listeners = [], name = "") {
    console.info('%cclass: Draggable (%s)', debug.fn, name);

    this.ele = ele;
    this.name = name;
    this.listeners = listeners;

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
      console.info('%cfn: moveAt', debug.fn);
      this.updateListeners(event);
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

  updateListeners(event) {
    this.listeners.forEach(listener => {
      listener(event);
    });
  }
}