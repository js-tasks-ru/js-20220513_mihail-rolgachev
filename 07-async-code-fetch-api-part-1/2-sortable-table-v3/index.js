import ComponentProto from "./componentProto.js";
import HeaderComponent from "./headersComponent.js";
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
export default class SortableTable extends ComponentProto {
  element;
  subElements = {};

  constructor(headersConfig, {
    url = "",
    start,
    end,
    step = 15,
    sorted = {},
    isSortLocally
  } = {}) {
    super();
    this.readColumnTemplates(headersConfig);
    this.headerComponent = new HeaderComponent(headersConfig, this);
    this.url = new URL(url, BACKEND_URL);
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.step = step;
    this.start = start;
    this.end = end;
    this.render();
  }
  async render() {
    super.render();
    const data = await this.loadData();
    this.update(data);
    this.registerExtenalEvent(document, 'scroll', this.onScroll)
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
  }

  readColumnTemplates(headersConfig)
  {
    this.columnTemplates = new Map();
    for (const headerConfig of headersConfig) {
      this.columnTemplates.set(headerConfig.id, headerConfig.template ?
        headerConfig.template : this.defaultColumTemplate);
    }
  }
  getTemplate() {
    return `
      <div class="sortable-table">
        ${this.headerComponent.getTemplate()}
        <div data-element="body" class="sortable-table__body">
            ${this.getTableRows(this.data)}
      </div>
      </div>`;
  }
  defaultColumTemplate(item) { return `<div class="sortable-table__cell">${item}</div>`;}
  getTableRows(data) {
    if (!data) return "";
    return data.map(item => {
      return `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.getTableRow(item)}
      </a>`;
    }).join('');
  }
  getTableRow(item) {
    const fields = Array.from(this.columnTemplates.keys());
    return fields.map(field => this.columnTemplates.get(field)(item[field])).join('');
  }

  sortOnClient() {
    const sortedData = this.sortData();
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }
  async sortOnServer() {
    await this.loadData();
    this.update();
  }
  sortData() {
    const field = this.sorted.id;
    const arr = Array.from(this.data);
    const {sortType, customSorting} = this.headerComponent.columnMap.get(field);
    const direction = this.sorted.order === 'asc' ? 1 : -1;
    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], 'ru');
        case 'custom':
          return direction * customSorting(a, b);
        default:
          throw new Error("Sorting is not allowed!");
      }
    });
  }
  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');
    if (!column) return;
    this.sorted = column.dataset;
    this.headerComponent.setOrderArrow(column);
    this.sortOnClient();

  }
  update (data = this.data)
  {
    this.subElements.body.innerHTML = this.getTableRows(data);
  }
  onScroll = async () =>
  {
    const { bottom } = this.element.getBoundingClientRect();
    if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocally) {
      this.start = this.end;
      this.end = this.start + this.step;
      const data = await this.loadData();
      this.data.concat(data);
      this.update();
    }
  }
  async loadData() {
    if (this.loading) return;
    this.loading = true;
    try {
      if (this.sorted?.id === undefined)
        this.sorted.id = this.headerComponent.columnMap.keys().next().value;
      if (this.sorted.order === undefined)
        this.sorted.order = "asc";
      if (this.start === undefined) this.start = 0;
      if (this.end === undefined) this.end = this.step;
      console.log(`start ${this.start} end ${this.end}`);
      this.url.searchParams.set('_sort', this.sorted.id);
      this.url.searchParams.set('_order', this.sorted.order);
      this.url.searchParams.set('_start', this.start);
      this.url.searchParams.set('_end', this.end);
      this.element.classList.add('sortable-table_loading');
      const data = await fetchJson(this.url);
      this.element.classList.remove('sortable-table_loading');
      this.data = data;
    }
    finally {
      this.loading = false;
    }
    return this.data;
  }
}
