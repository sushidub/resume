'use strict';

import { Create_New_Element, debug } from './jshelprs.js';
import { fetchTemplate } from './main.js';

console.info('%cproficiency.js', debug.fn);

class ProficiencySection extends HTMLElement {
  constructor() {
    super();

    const fetchResponse = fetchTemplate('proficiency-section');
    fetchResponse.then(template => {

      if (this._title) {
        template.querySelector('section').prepend(this.createSectionTitle(this._title));
        template.querySelector('article').classList.add('bar');
      }

      this._data.categories.forEach(cat => {
        template.querySelector('article').append(this.createCategoryList(cat));
      });
        
      if (this._data.description && this._data.description.length > 0) {
        template.querySelector('article').append(this.createDescriptionNodes(this._data.description));
      }

      this.replaceWith(template);
    });
  }

  connectedCallback() {
    console.log('%cfn: connectedCallback\n%O', debug.fn, this);
  }

  createDescriptionNodes(data) {
    const fragment = new DocumentFragment();
    data.forEach(item => {
      let descriptionItem;
      if (item.startsWith("•")) {
        item = item.split('• ')[1];
        console.log(item);
        descriptionItem = Create_New_Element('p', {'class': 'list-item'});
      } else {
        descriptionItem = Create_New_Element('p');
      }
      descriptionItem.textContent = item;
      fragment.append(descriptionItem);
    });
    return fragment;
  }

  createSectionTitle(data) {
    const fragment = new DocumentFragment();
    let newNode;

    newNode = Create_New_Element('h3', {
      'class': 'bar bar-side'
    });
    newNode.textContent = data;

    fragment.append(newNode);
    return fragment;
  }

  createCategoryList(data) {
    const fragment = new DocumentFragment();
    let newNode;

    newNode = Create_New_Element('ul', {
      'data-title': data.title,
      'class': 'keywords'
    });

    const limit = data.keywords.length - 1;
    data.keywords.forEach((word, idx) => {
      const listItemNode = Create_New_Element('li');
      listItemNode.textContent = idx === limit ? `${word}` : `${word}, `;
      newNode.append(listItemNode);
    });

    fragment.append(newNode);
    return fragment;
  }
}

export default function renderProficiency(data) {
  console.info('%cfn: renderProficiency', debug.fn);
  
  const contentPlaceholder = document.querySelector('proficiency-section'); // Nodelist
  const proficiencyData = data; // Object

  if (!proficiencyData || proficiencyData.length === 0) {
    console.warn("proficiency section missing. see data.proficiency: %o", data.proficiency);
    return false;
  }

  contentPlaceholder._data = proficiencyData;

  if (contentPlaceholder.hasAttributes) {
    for (const attr of contentPlaceholder.attributes) {
      contentPlaceholder['_' + attr.name] = attr.value;
    }
  }

  if (!customElements.get('proficiency-section')) {
    customElements.define('proficiency-section', ProficiencySection);
  }
}