'use strict';
import { debug } from './jshelprs.js';
import Draggable from './Draggable.js';
import renderHeader from './header.js';
import renderExperience from './experience.js';
import renderProficiency from './proficiency.js';

console.info('%cmain.js', debug.fn);

const _ele = {
  padPage: document.getElementById('padPage1'),
  preview: document.getElementById('documentPreview'),
  exportButtons: document.querySelectorAll('.export-button'),
  page: document.querySelector('.page'),
  pages: document.querySelectorAll('.page'),
  pageContent: document.querySelectorAll('.page-content'),
  pageNumbers: document.querySelector('.page-markers'),
  overflowLines: document.querySelectorAll('.overflow-line'),
  guides: document.querySelector('.guides'),
  toggleButtons: document.querySelectorAll('.toggle-button')
}
const _keyListeners = ['KeyG', 'KeyN', 'KeyP', 'KeyB', 'KeyO'];
const _role = 'senior-frontend-developer';


function getStyle(el, prop) {
  return el.computedStyleMap().get(prop).value;
}

function getOverflow(el) {
  console.info('%cfn: getOverflow', debug.fn);
  const overflow = el.scrollHeight - el.clientHeight;
  console.log('overflow: %d', overflow);
  return overflow;
}

function keys(e) {
  if (_keyListeners.indexOf(e.code) === -1) return false;
  console.info('%cfn: keys', debug.fn);

  switch (e.code) {
    case 'KeyG':
      _ele.guides.hidden = !_ele.guides.hidden;
      document.body.classList.remove('preview');
      return;
    case 'KeyN':
      _ele.pageNumbers.hidden = !_ele.pageNumbers.hidden;
      document.body.classList.remove('preview');
      return;
    case 'KeyP':
      _ele.overflowLines.forEach(line => {
        line.hidden = !line.hidden;
      });
      document.body.classList.remove('preview');
      return;
    case 'KeyB':
      _ele.pages.forEach(page => {
        page.classList.toggle('outline');
      });
      document.body.classList.remove('preview');
      return;
    case 'KeyO':
      _ele.pageContent.forEach(page => {
        page.classList.toggle('overflow');
      });
      _ele.overflowLines.forEach(line => line.hidden = false);
      document.body.classList.remove('preview');
      return;
    default: {
      document.body.classList.remove('preview');
    }
  }
}

function pagePaddingChangeHandler(e) {
  console.info('%cfn: pagePaddingChangeHandler', debug.fn);
  _ele.page.style.paddingBottom = this.value + 'px';
  return true;
}

function pagePaddingFocusHandler(e) {
  console.info('%cfn: pagePaddingFocusHandler', debug.fn);
  _ele.pageContent.forEach(contentItem => {
    contentItem.classList.add('outline');
    contentItem.querySelector('.overflow-line').hidden = false;
  });
  this.addEventListener('blur', function blurHandler() {
    _ele.pageContent.forEach(contentItem => {
      contentItem.classList.remove('outline');
      contentItem.querySelector('.overflow-line').hidden = true;
    });
    return _ele.padPage.removeEventListener('blur', blurHandler);
  });
}

function previewHandler() {
  console.info('%cfn: previewHandler', debug.fn);
  document.body.classList.add('preview');
  _ele.guides.hidden = true;
  _ele.pageNumbers.hidden = true;
  _ele.pages.forEach(page => page.classList.add('outline'));
  _ele.pageContent.forEach(item => {
    item.classList.remove('outline', 'overflow');
    item.scrollTop = 0;
  });
  _ele.overflowLines.forEach(line => line.hidden = true);
  return true;
}

function exportHandler() {
  console.info('%cfn: exportHandler,\n%o', debug.fn, this);
  const exportType = this.dataset.exportType;
  switch(exportType) {
    case 'json':
      return;
    case 'pdf':
      return;
    case 'txt':
      return;
  }
}

function toggleButtonHandler(e) {
  console.info('%cfn: toggleButtonHandler\ne: %o\nkeycode: %s', debug.fn, e, this.dataset.keycode);
  const triggerKeyEvent = new KeyboardEvent('keydown', {
    view: window,
    bubbles: true,
    cancelable: true,
    code: this.dataset.keycode
  });
  window.dispatchEvent(triggerKeyEvent);
}

function init() {
  let result = fetch(`/data/${_role}.json`).then((res) => {
    return res.json();
  });
  result.then((res) => {
    console.log(res);
    if (res.role) {
      const role = res.role.split(' ').join('-');
      document.querySelector('title').textContent = `JGraston-Resume_${role}`;
    }
    return res;
  }).then(res => {
    renderHeader(res);
    if (res.summary) document.querySelector('.summary > p').textContent = res.summary;
    renderExperience(res);
    renderProficiency(res);
  }).then( () => {
    window.addEventListener('keydown', keys, false);
    _ele.padPage.value = _ele.page.computedStyleMap().get('padding-bottom').value;
    _ele.padPage.addEventListener('change', pagePaddingChangeHandler);
    _ele.padPage.addEventListener('focus', pagePaddingFocusHandler);
    _ele.padPage.addEventListener('overflowChange', function(e) {
      this.value = e.detail.value;
    });
    _ele.preview.addEventListener('click', previewHandler);
    _ele.overflowLines.forEach((line, idx) => {
      new Draggable(line, `line${idx}`, [line, _ele.padPage]);
      line.dataset.overflow = _ele.page.computedStyleMap().get('padding-bottom').value;
      line.addEventListener('overflowChange', function(e) {
        this.dataset.overflow = e.detail.value;
        getOverflow(this.nextElementSibling);
      });
    });
    _ele.toggleButtons.forEach(button => button.addEventListener('click', toggleButtonHandler));
    _ele.exportButtons.forEach(button => button.addEventListener('click', exportHandler));
  });
}

// `DOMContentLoaded` may fire before your script has a chance to run, so check before adding a listener
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {  // `DOMContentLoaded` already fired'
  init();
}