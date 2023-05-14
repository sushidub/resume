'use strict';

import { Create_New_Element, debug } from './jshelprs.js';

console.info('%cproficiency.js', debug.fn);

class ProficiencySection extends HTMLElement {
  constructor() {
    super();

    const templateString = fetch('templates/proficiency.html').then((res) => {
      if (res.ok) return res.text();
    });
    templateString.then((res) => {
      const parser = new DOMParser();
      const header = parser.parseFromString(res, 'text/html');
      const template = header.getElementById('proficiency-section-template').content.cloneNode(true);
      // console.dir(this);

      if (this._bar && this._title) {
        template.querySelector('section').prepend(this.createSectionTitle(this._title));
        template.querySelector('article').classList.add('bar');
      }

      this._data.categories.forEach(cat => {
        template.querySelector('article').append(this.createCategoryList(cat));
      });

      template.querySelector('section').classList.add(`${this._layout}-layout`);
      this.replaceWith(template);
    });
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

    data.keywords.forEach(word => {
      const listItemNode = Create_New_Element('li');
      listItemNode.textContent = word;
      newNode.append(listItemNode);
    });

    fragment.append(newNode);
    return fragment;
  }
}

export default function renderProficiency(data) {
  console.info('%cfn: renderProficiency', debug.fn);
  
  const contentPlaceholder = document.querySelector('proficiency-section'); // Nodelist
  const proficiencyData = data.proficiency; // Object

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

  return customElements.define('proficiency-section', ProficiencySection);
}