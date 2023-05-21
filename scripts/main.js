'use strict';

import { debug } from './jshelprs.js';
import renderPage from './page.js';
import renderSummary from './summary.js';
import renderExperience from './experience.js';
import renderProficiency from './proficiency.js';

console.info('%cmain.js', debug.fn);

const _role = 'senior-frontend-developer';
const _ele = {
  padPage: document.getElementById('padPage'),
  preview: document.getElementById('documentPreview'),
  exportButtons: document.querySelectorAll('.export-button'),
  main: document.querySelector('main'),
  pageNumbers: document.querySelector('.page-markers'),
  overflowLines: document.querySelectorAll('.overflow-line'),
  guides: document.querySelector('.guides'),
  toggleButtons: document.querySelectorAll('.toggle-button')
}
const k = ['KeyG', 'KeyN', 'KeyP', 'KeyB', 'KeyO'];
let _pageCount = 0;

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

function keys(e) {
  if (k.indexOf(e.code) === -1) return false;
  console.info('%cfn: keys', debug.fn);

  switch (e.code) {
    case 'KeyG':
      _ele.guides.hidden = !_ele.guides.hidden;
      return;
    case 'KeyN':
      _ele.pageNumbers.hidden = !_ele.pageNumbers.hidden;
      return;
    case 'KeyP':
      _ele.overflowLines.forEach(line => {
        line.hidden = !line.hidden;
      });
      return;
    case 'KeyB':
      _ele.pages.forEach(page => {
        page.classList.toggle('outline');
      });
      return;
    case 'KeyO':
      _ele.pageContent.forEach(page => {
        page.classList.toggle('overflow');
      });
      _ele.overflowLines.forEach(line => line.hidden = false);
      return;
  }
}

function newPage() {
  _pageCount = _pageCount++;
  return _pageCount;
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
  _ele.guides.hidden = true;
  _ele.pageNumbers.hidden = true;
  _ele.pages.forEach(page => page.classList.add('outline'));
  _ele.pageContent.forEach(item => {
    item.classList.remove('outline', 'overflow');
    item.scrollTop = 0;
  });
  return true;
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
  result.then(res => {
    console.log(res);
    if (res.role) {
      const role = res.role.split(' ').join('-');
      document.querySelector('title').textContent = `JGraston-Resume_${role}`;
    }
    const page = renderPage(res, newPage());
    return res;
  }).then(res => {
    console.log(res);
    console.log(page.contentBottom());
    if (res.summary && !document.querySelector('.summary')) {
      renderSummary(res.summary);
    }
      // if (data.proficiency && !document.querySelector('.proficiency')) renderProficiency(data.proficiency);
      // renderExperience(data);

    // listeners
    window.addEventListener('keydown', keys, false);
    _ele.padPage.addEventListener('change', pagePaddingChangeHandler);
    _ele.padPage.addEventListener('focus', pagePaddingFocusHandler);
    _ele.preview.addEventListener('click', previewHandler);
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