'use strict';

import { Create_New_Element, Iterate, KebabClass, debug } from './jshelprs.js';

console.info('%cexperience.js', debug.fn);

class ExperienceItem extends HTMLElement {
  constructor() {
    super();

    const templateString = fetch('templates/experience.html').then((res) => {
      if (res.ok) return res.text();
    });

    templateString.then((res) => {
      const parser = new DOMParser();
      const header = parser.parseFromString(res, 'text/html');
      const template = header.getElementById('experience-item-template').content.cloneNode(true);
      // console.dir(this);

      if (this._bar && this._title) {
        template.querySelector('section').prepend(this.createSectionTitle(this._title));
        template.querySelector('article').classList.add('bar');
      }

      template.querySelector('section').classList.add(`${this._layout}-layout`);
      console.log(this);

      if (this._data.aside) {
        let asideEle;
        switch (this._data.aside.type) {
          case 'inline':
            asideEle = this.createInlineAside(this._data.aside);
            template.querySelector('article').insertBefore(asideEle, template.querySelector('p'));
            break;
          case 'side':
            asideEle = this.createSideAside(this._data.aside);
            template.querySelector('section').prepend(asideEle);
            break;
        }
      }

      ['position', 'company', 'location', 'date'].forEach(item => {
        if (this._data[item]) {
          template.querySelector(`.${item}`).innerHTML = this._data[item];
        }
      });

      if (this._data.description && this._data.description.length > 0) {
        template.querySelector('article').append(this.createDescriptionNodes(this._data.description));
      }

      if (this._overflow === "true") template.querySelector('.header').remove();

      this.replaceWith(template);
    });
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

  createInlineAside(data) {
    const fragment = new DocumentFragment();
    let newNode;
    newNode = Create_New_Element('aside', {
      'type': 'inline'
    });

    // title
    const asideTitleNode = Create_New_Element('h4', {'class': 'title'});
    asideTitleNode.textContent = data.title;

    newNode.append(asideTitleNode);

    // create a parent list element for items within supplemental content
    const asideListNode = Create_New_Element('ul', {'class': `${KebabClass(data.title)}`});
    
    // iterate over each item within item list
    data.items.forEach(itm => {

      // create a list item element for each list item
      const asideListItemNode = Create_New_Element('li');
      asideListItemNode.textContent = itm;

      // insert the list element into the list parent
      asideListNode.append(asideListItemNode);
    });

    // insert the list parent element and its children into the supplement content element parent
    newNode.append(asideListNode);

    // insert the supplemental content element into the placeholder frag
    fragment.append(newNode);
    return fragment;
  }

  createSideAside(data) {
    const fragment = new DocumentFragment();
    let newNode;

    // create aside
    newNode = Create_New_Element('aside', {
      'type': 'side'
    });

    const asideTitleNode = Create_New_Element('h4', {
      'class': 'title'
    });
    asideTitleNode.textContent = data.title;
    newNode.append(asideTitleNode);

    // iterate over each item within item list
    data.items.forEach(itm => {
      if (itm.html) {
        const parser = new DOMParser();
        const asideHTML = parser.parseFromString(itm.html, 'text/html').body.firstElementChild;
        newNode.append(asideHTML);
      }
    });

    fragment.append(newNode);
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
}

export default function renderExperience(data) {
  console.info('%cfn: renderExperience', debug.fn);
  
  const contentPlaceholders = document.querySelectorAll('experience-item'); // Nodelist
  const experienceItems = data.experience; // Array
  
  const hidden = experienceItems.findIndex(item => item.hide === true);
  if (hidden !== -1) experienceItems.splice(hidden, 1);

  if (!experienceItems || experienceItems.length === 0) {
    console.warn("experience items missing. see data.experience: %o", data.experience);
    return false;
  }

  contentPlaceholders.forEach((place, idx) => {
    const experienceItemData = experienceItems[idx]; // incoming experience item index match
    place._data = experienceItemData;

    if (place.hasAttributes) {
      for (const attr of place.attributes) {
        place['_' + attr.name] = attr.value;
      }
    }
  });
  
  return customElements.define('experience-item', ExperienceItem);
}
