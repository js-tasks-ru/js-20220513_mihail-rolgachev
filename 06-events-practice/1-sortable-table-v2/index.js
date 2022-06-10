import ComponentProto from "./componentProto.js";
import HeaderComponent from "./headersComponent.js";
export default class SortableTable extends ComponentProto {
  element;
  subElements = {};

  constructor(headersConfig, {
    data = [],
  } = {}) {
    super();
    this.readColumnTemplates(headersConfig);
    this.data = data;
    this.headerComponent = new HeaderComponent(headersConfig, this);
    this.render();

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

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    this.headerComponent.setOrderArrow(field, order);
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }
  sortData(field, order) {
    const arr = Array.from(this.data);
    const {sortType, customSorting} = this.headerComponent.columnMap.get(field);
    const direction = order === 'asc' ? 1 : -1;
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
    const { id, order } = column.dataset;
    const sortedData = this.sortData(id, order);
    this.headerComponent.setOrderArrow(column);
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

}
