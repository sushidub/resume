'use strict';

import { Create_New_Element, debug } from './jshelprs.js';

console.info('%csummary.js', debug.fn);

class SummarySection extends HTMLElement {
  constructor() {
    super();
    const templateString = fetch('templates/summary.html').then((res) => {
      if (res.ok) return res.text();
    });
    templateString.then((res) => {
      const parser = new DOMParser();
      const summary = parser.parseFromString(res, 'text/html');
      const template = summary.getElementById('summary-section-template').content.cloneNode(true);
      template.querySelector('[role="summary-value"]').textContent = this._data;
      document.querySelector('.page-content').append(this);
      this.replaceWith(template);
    });
  }
}


export default function renderSummary(data) {
  console.info('%cfn: renderSummary', debug.fn);
  const summary = Create_New_Element('summary-section');
  summary._data = data;
  customElements.define('summary-section', SummarySection);
  customElements.upgrade(summary);
}