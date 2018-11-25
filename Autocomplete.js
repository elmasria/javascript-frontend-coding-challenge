export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign({ numOfResults: 10, data: [] }, options);
    Object.assign(this, { rootEl, options });

    this.previousFocus = '';
    this.previousSelected = '';

    this.init();
  }

  onQueryChange(query) {
    // Get data for the dropdown
    let results = this.getResults(query, this.options.data);
    results = results.slice(0, this.options.numOfResults);

    this.updateDropdown(results);
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];

    // Filter for matching strings
    let results = data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });

    return results;
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement('li');
      Object.assign(el, {
        className: 'result',
        textContent: result.text,
        tabIndex: 0
      });

      // Pass the value to the onSelect callback
      el.addEventListener('click', (event) => {
        this.selectElement(event, result);

      });
  
      // Handle up, down,tab and enter key 
      el.addEventListener('keyup', (event) => {
        switch (event.keyCode) {
          case 38: // up
            if (event.target.previousSibling) {
              event.target.previousSibling.focus();
              this.cleanAddFocus(event.target.previousSibling);
            }
            else {
              this.listEl.lastElementChild.focus();
              this.cleanAddFocus(this.listEl.lastElementChild);
            }
            break;
          case 40: // bottom
            if (event.target.nextSibling) {
              event.target.nextSibling.focus();
              this.cleanAddFocus(event.target.nextSibling);
            }
            else {
              this.listEl.firstElementChild.focus();
              this.cleanAddFocus(this.listEl.firstElementChild);
            }
            break;
          case 9: // tab
            this.cleanAddFocus(event.target);
            break;
          case 13: // enter key
            this.cleanAddFocus(event.target);
            this.selectElement(event, result);
            break;
        }

      });

      fragment.appendChild(el);
    });
    return fragment;
  }
  
  /**
   * Add select style for the element 
   * clean focus if user use click (mouse event)
   * call the onSelect function 
   */
  selectElement(event, result) {
    const { onSelect } = this.options;
    if (typeof onSelect === 'function') onSelect(result.value);
    // remove focus if the user click on li
    if (event.type === 'click') this.cleanAddFocus(event.target);
    if (this.previousSelected) {
      this.previousSelected.classList.remove('active');
    }

    event.target.classList.add('active');
    this.previousSelected = event.target;
    
    this.inputEl.value =  result.text;
  }

  /**
   * Remove focus style from previous element and add it to the new one
   */
  cleanAddFocus(elem) {
    if (this.previousFocus) {
      this.previousFocus.classList.remove('focus');
      this.previousFocus = '';
    }
    if (elem) {
      elem.classList.add('focus');
      this.previousFocus = elem;  
    }
    
  }

  createQueryInputEl() {
    const inputEl = document.createElement('input');
    Object.assign(inputEl, {
      type: 'search',
      name: 'query',
      autocomplete: 'off',
    });

    inputEl.addEventListener('input', event =>
      this.onQueryChange(event.target.value));

    return inputEl;
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl);
    
    // remove focus from li if user select input
    this.inputEl.addEventListener('focus', (event) => {
      this.cleanAddFocus();
    });

    // help user enter the list directly using the key up/down 
    this.inputEl.addEventListener('keyup', (event) => {

      if (this.listEl.children && this.listEl.children.length > 0) {
        switch (event.keyCode) {
          case 38: // up 

            this.listEl.lastElementChild.focus();
            this.cleanAddFocus(this.listEl.lastElementChild);

            break;
          case 40: // bottom
            this.listEl.firstElementChild.focus();
            this.cleanAddFocus(this.listEl.firstElementChild);

            break;
        }
      }

    });

    // Build results dropdown
    this.listEl = document.createElement('ul');
    Object.assign(this.listEl, { className: 'results' });
    this.rootEl.appendChild(this.listEl);
  }
}
