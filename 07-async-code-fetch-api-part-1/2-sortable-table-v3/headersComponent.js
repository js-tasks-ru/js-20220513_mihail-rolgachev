export default class HeadersComponent
{
  constructor(headersConfig, parentTable) {
    this.headersConfig = headersConfig;
    this.readColumnMap(headersConfig);
    this.parentTable = parentTable;
  }
  readColumnMap(headersConfig)
  {
    this.columnMap = new Map();
    for (const headerElement of headersConfig) {
      this.columnMap.set(headerElement.id, headerElement);
    }
  }
  getTemplate()
  {
    return `
        <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
        </div>`
  }
  getHeaderRow({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }
  setOrderArrow(column)
  {
    const arrow = column.querySelector('.sortable-table__sort-arrow');
    const order = column.dataset.order;
    column.dataset.order = this.parentTable.sorted.order =
      order === 'asc' ? "desc" : 'asc';
    if (!arrow) {
      column.append(this.parentTable.subElements.arrow);
    }
  }
}
