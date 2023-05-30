'use strict';

import { Create_New_Element, debug } from './jshelprs.js';
import { fetchTemplate } from './main.js';

console.info('%cheader.js', debug.fn);

class HeaderSection extends HTMLElement {
  constructor() {
    super();

    const fetchResponse = fetchTemplate('header-section');
    fetchResponse.then(template => {
      console.log(template);
      ['applicant', 'phone', 'email', 'address1', 'address2'].forEach(item => {
        template.querySelector(`[role="${item}"]`).textContent = this._data[item];
      });

      if (this._data.role) template.querySelector('.content').append(this.createRoleNode(this._data.role));
      if (this._data.links) template.querySelector('.links').append(this.createLinkNodes(this._data.links));

      this.replaceWith(template);
    });
  }

  createRoleNode(data) {
    const fragment = new DocumentFragment();
    const newNode = Create_New_Element('h1', {
      'class': 'role',
      'contenteditable': 'true'
    });

    newNode.textContent = data;
    fragment.append(newNode);
    return fragment;
  }

  createLinkNodes(data) {
    const fragment = new DocumentFragment();

    data.forEach(link => {
      const newNode = Create_New_Element('a', {
        'class': `icon icon-${link.icon}`,
        'role': 'link',
        'href': link.url,
        '_target': 'blank'
      });
      newNode.textContent = link.text;
      fragment.append(newNode);
    });

    return fragment;
  }
}

export default function renderHeader(el, data) {
  console.info('%cfn: renderHeader', debug.fn);

  el._data = {
    'role': data.role,
    'links': data.links,
    'applicant': data.applicant,
    'phone': data.phone,
    'email': data.email,
    'address1': data.address1,
    'address2': data.address2 
  };

  if (!customElements.get('header-section')) {
    customElements.define('header-section', HeaderSection);
  }
}