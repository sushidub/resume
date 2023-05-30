'use strict';

import { Create_New_Element, debug } from './jshelprs.js';
import { fetchTemplate } from './main.js';

console.info('%csummary.js', debug.fn);

class SummarySection extends HTMLElement {
  constructor() {
    super();

    const fetchResponse = fetchTemplate('summary-section');
    fetchResponse.then(template => {

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

  if (!customElements.get('proficiency-section')) {
    customElements.define('summary-section', SummarySection);
  }
  
  customElements.upgrade(summary);
}