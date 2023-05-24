'use strict';
import { debug } from './jshelprs.js';
import renderPage from './page.js';
import renderSummary from './summary.js';
import renderExperience from './experience.js';
import renderProficiency from './proficiency.js';

console.info('%cmain.js', debug.fn);

const _ele = {
  exportButtons: document.querySelectorAll('.export-button'),
  guides: document.querySelector('.guides'),
  main: document.querySelector('main'),
  overflowLines: document.querySelectorAll('.overflow-line'),
  pages: document.querySelectorAll('page'),
  pageContent: document.querySelectorAll('page-content'),
  pageNumbers: document.querySelector('.page-markers'),
  padPage: document.getElementById('padPage'),
  preview: document.getElementById('documentPreview'),
  summary: document.querySelector('.summary'),
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

let _pageCount = 0;
function newPage() {
  _pageCount = _pageCount + 1;
  return _pageCount;
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
    return res;
  }).then(res => {
    if (_ele.pages) {
      _ele.pages.forEach(page => renderPage(page, res, newPage()));
    }
    return res;
  }).then(res => {
    console.log(res);
    
    if (res.summary) {
     if (_ele.summary) {
        _ele.summary.lastElementChild.textContent = res.summary;
      } else {
        renderSummary(res.summary);
      }
    }

    if (res.proficiency) {
      renderProficiency(res.proficiency);
    }
    
    renderExperience(res);
  }).then( () => {

    // listeners
    window.addEventListener('keydown', keys, false);
    _ele.preview.addEventListener('click', previewHandler);
    _ele.toggleButtons.forEach(button => button.addEventListener('click', toggleButtonHandler));
  });
}

// `DOMContentLoaded` may fire before your script has a chance to run, so check before adding a listener
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {  // `DOMContentLoaded` already fired'
  init();
}