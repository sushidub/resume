'use strict';

import { Create_New_Element, debug } from './jshelprs.js';
import Draggable from './Draggable.js';
import renderHeader from './header.js';

console.info('%cpage.js', debug.fn);

class DocumentPage {
  constructor(data, num) {
    this.data = data;
    this.id = 'page' + num;

    fetch('templates/page.html').then((res) => {
      if (res.ok) return res.text();
    }).then((res) => {
      const parser = new DOMParser();
      const page = parser.parseFromString(res, 'text/html');
      const template = page.getElementById('document-page-template').content.cloneNode(true);
      
      this.template = template;

      renderHeader(this);

      

      this.template.querySelector('.page').setAttribute('id', this.id);
      document.querySelector('main').append(this.template);
      
      const line = document.getElementById(this.id).firstElementChild;
      
      this.measureContent = this.measureContent.bind(document.getElementById(this.id));
      
      new Draggable(line, {
        movement: 0,
        targetEle: line.parentElement,
        targetEleTop: line.parentElement.offsetTop,
        lineEleTop: line.offsetTop,
        startPos: line.offsetTop + line.parentElement.offsetTop,
        startPad: line.parentElement.computedStyleMap().get('padding-bottom').value
      }, [this.overflowBoundsChangeHandler, this.blockPointerEvents], this.id);

    });
  }

  get contentBottom() {
    return this.measureContent();
  }

  overflowBoundsChangeHandler(event) {
    console.info('%cfn: overflowBoundsChangeHandler\nevent: %s', debug.fn, event.type);
    const track = (mouseY) => {
      // console.info('%cfn: track', debug.fn);
      this.movement = this.startPos - (this.ele.offsetTop + this.targetEle.offsetTop);
      if (this.movement === 0) {
        this.ele.classList.add('at-start');
      } else {
        this.ele.classList.remove('at-start');
      }
    }
  
    switch (event.type) {
      case 'mouseup':
      case 'mouseout':
        track(event.pageY);
        this.targetEle.computedStyleMap().get('padding-bottom').value;
        break;
      case 'mousedown':
        break;
      case 'mousemove':
        console.info('%ce: onmousemove', debug.event);
        this.ele.style.top = (event.pageY -  this.targetEleTop) + 'px';
        track(event.pageY);
        let padTotal = this.startPad + this.movement;
        this.targetEle.style.paddingBottom = `${padTotal}px`;
        break;
    }
  }

  measureContent() {
    console.log(document.getElementById(this.id));
    // const lastEle = document.getElementById(this.id).lastElementChild;
    // return lastEle.getBoundingClientRect();
  }

  blockPointerEvents(event) {
    if (event.type === 'mousemove') return false;
    console.info('%cfn: blockPointerEvents\nevent: %s', debug.fn, event.type);
    switch (event.type) {
      case 'mousedown':
        // start blocking pointer
        this.targetEle.querySelector('.page-content').classList.add('block-pointer-events');
        return;
      default:
        setTimeout(() => {
          this.targetEle.querySelector('.page-content').classList.remove('block-pointer-events');
        }, 500);
        // stop blocking pointer
        return;
    }
  }
}

export default function renderPage(data, num = 0) {
  console.info('%cfn: renderPage\nnum: %d', debug.fn, num);
  const _data = {};
  ['role', 'applicant', 'phone', 'email', 'address1', 'address2', 'links'].forEach(item => {
    _data[item] = data[item];
  });
  return new DocumentPage(_data, num);
}