'use strict';

import { Create_New_Element, Iterate, KebabClass, debug } from './jshelprs.js';
import { fetchTemplate } from './main.js';

console.info('%cexperience.js', debug.fn);

class ExperienceSection extends HTMLElement {
  constructor() {
    super();

    const fetchResponse = fetchTemplate('experience-section');
    fetchResponse.then(template => {

      if (this._title) {
        template.querySelector('section').prepend(this.createSectionTitle(this._title));
        template.querySelector('article').classList.add('bar');
      } else {
        template.querySelector('section').prepend(this.wrapElement(null, 'div')); 
      }

      if (this._data.aside) {
        let asideEle;
        switch (this._data.aside.type) {
          case 'inline':
            asideEle = this.createInlineAside(this._data.aside);
            template.querySelector('article').insertBefore(asideEle, template.querySelector('p'));
            break;
          case 'side':
            asideEle = this.createSideAside(this._data.aside);
            if (this._title) {
              const nodes = [template.querySelector('section').firstElementChild, asideEle];
              template.querySelector('section').prepend(this.wrapElement(nodes, 'div'));
            } else {
              template.querySelector('section').firstElementChild.append(asideEle);
            }
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

  connectedCallback() {
    console.log('%cfn: connectedCallback\n%O', debug.fn, this);
  }

  createDescriptionNodes(data) {
    const fragment = new DocumentFragment();
    data.forEach(item => {
      let descriptionItem;
      if (item.startsWith("•")) {
        item = item.split('• ')[1];
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

    newNode.setAttribute('contenteditable', '');

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

  wrapElement(nodes, eltype) {
    const fragment = new DocumentFragment();
    let newNode;

    newNode = Create_New_Element(eltype);
    if (nodes) nodes.forEach(node => newNode.append(node));

    fragment.append(newNode);
    return fragment;
  }

  dragdropListener(ele) {
    function dragstart_handler(ev) {
      console.log(ev);
      // Add the target element's id to the data transfer object
      ev.dataTransfer.setData('text/html', ev.target.outerHTML);
    }
    function dragover_handler(ev) {
      ev.preventDefault();
      console.log(ev);
      ev.dataTransfer.dropEffect = 'move';
    }
    function drop_handler(ev) {
      ev.preventDefault();
      console.log(ev);
      // Get the id of the target and add the moved element to the target's DOM
      const data = ev.dataTransfer.getData("text/plain");
      console.log(data);
      // ev.target.appendChild(document.getElementById(data));
    }
    console.log('%cfn: dragdropListener\n%O', debug.fn, ele);
    ele.addEventListener('dragstart', dragstart_handler);
    ele.addEventListener('dragover', dragover_handler);
    ele.addEventListener('drop', drop_handler);
  }
}

export default function renderExperience(data) {
  console.info('%cfn: renderExperience', debug.fn);
  
  const contentPlaceholders = document.querySelectorAll('experience-section'); // Nodelist
  const experienceItems = data.experience; // Array
  
  const hidden = experienceItems.findIndex(item => item.hide === true);
  if (hidden !== -1) experienceItems.splice(hidden, 1);

  if (!experienceItems || experienceItems.length === 0) {
    console.warn("experience items missing. see data.experience: %o", data.experience);
    return false;
  }

  contentPlaceholders.forEach((place, idx) => {
    const experienceItemData = experienceItems[idx]; // incoming experience item index match
    if (!experienceItemData) {
      return place.remove();
    }
    place._data = experienceItemData;

    if (place.hasAttributes) {
      for (const attr of place.attributes) {
        place['_' + attr.name] = attr.value;
      }
    }
  });

  if (!customElements.get('experience-section')) {
    customElements.define('experience-section', ExperienceSection);
  }
}
