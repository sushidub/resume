'use strict';

import { debug } from './jshelprs.js';
import Draggable from './Draggable.js';
import renderHeader from './header.js';

console.info('%cpage.js', debug.fn);

class DocumentPage {
  constructor(el, data, num) {
    this.page = el;
    this.data = data;
    this.id = 'page' + num;
    this.measureContent = this.measureContent.bind(this.page);
    this.overflowGuide = {
      ele: this.page.firstElementChild,
      movement: 0,
      targetEle: this.page,
      targetEleTop: this.page.offsetTop,
      lineEleTop: this.page.firstElementChild.offsetTop,
      startPos: this.page.firstElementChild.offsetTop + this.page.offsetTop,
      startPad: this.page.computedStyleMap().get('padding-bottom').value,
      guide: new Draggable(this.page.firstElementChild, [this.overflowGuideChangeHandler.bind(this), this.blockPointerEvents.bind(this)], this.id)
    };

    this.page.setAttribute('id', this.id);
    this.overflowGuide.ele.dataset.overflow = this.overflowGuide.startPad;
    if (this.page.querySelector('header-section')) renderHeader(this.page.querySelector('header-section'), data);
  }

  get contentBottom() {
    return this.measureContent();
  }

  overflowGuideChangeHandler(event) {
    console.info('%cfn: overflowGuideChangeHandler\nevent: %O\nthis: %O', debug.fn, event, this);
    const track = (mouseY) => {
      console.info('%cfn: track', debug.fn);
      this.overflowGuide.movement = this.overflowGuide.startPos - (this.overflowGuide.ele.offsetTop + this.overflowGuide.targetEle.offsetTop);
      if (this.overflowGuide.movement === 0) {
        this.overflowGuide.ele.classList.add('at-start');
      } else {
        this.overflowGuide.ele.classList.remove('at-start');
      }
    }
  
    switch (event.type) {
      case 'mouseup':
      case 'mouseout':
        track(event.pageY);
        this.overflowGuide.targetEle.computedStyleMap().get('padding-bottom').value;
        break;
      case 'mousedown':
        break;
      case 'mousemove':
        console.info('%ce: onmousemove', debug.event);
        this.overflowGuide.ele.style.top = (event.pageY -  this.overflowGuide.targetEleTop) + 'px';
        track(event.pageY);
        let padTotal = this.overflowGuide.startPad + this.overflowGuide.movement;
        this.overflowGuide.targetEle.style.paddingBottom = `${padTotal}px`;
        this.overflowGuide.ele.dataset.overflow = padTotal;
        break;
    }
  }

  measureContent() {
    console.log(this);
    // const lastEle = document.getElementById(this.id).lastElementChild;
    // return lastEle.getBoundingClientRect();
  }

  blockPointerEvents(event) {
    console.info('%cfn: blockPointerEvents\nevent type: %s\nthis: %O', debug.fn, event.type, this);
    if (event.type === 'mousemove') return false;
    console.info('%cfn: blockPointerEvents\nevent: %s', debug.fn, event.type);
    switch (event.type) {
      case 'mousedown':
        // start blocking pointer
        this.overflowGuide.targetEle.querySelector('.page-content').classList.add('block-pointer-events');
        return;
      default:
        setTimeout(() => {
          this.overflowGuide.targetEle.querySelector('.page-content').classList.remove('block-pointer-events');
        }, 500);
        // stop blocking pointer
        return;
    }
  }
}

export default function renderPage(el, data, num = 0) {
  console.info('%cfn: renderPage\nnum: %d', debug.fn, num);
  const _data = {};
  ['role', 'applicant', 'phone', 'email', 'address1', 'address2', 'links'].forEach(item => {
    _data[item] = data[item];
  });
  return new DocumentPage(el, _data, num);
}