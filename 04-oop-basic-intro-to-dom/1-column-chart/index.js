export default class ColumnChart {
  constructor({
    data = [],
    label = "",
    value = "",
    link="",
    formatHeading = (str)=> {return str}
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
  }
element = "";
chartHeight = 50;
dataElements = {};
getTemplate()
{
  return `
      <div class="dashboard__chart_orders">
      <div class="column-chart" style="--chart-height: 50">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLinkTemplate()}</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.getItemsTemplate()}
          </div>

      </div>
    </div>`;
}
getLoadingTemplate()
{
  return `
    <div class="column-chart column-chart_loading" style="--chart-height: 50">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.getLinkTemplate()}</a>
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
        <div data-element="body" class="column-chart__chart">
        </div>
      </div>
    </div>`
}
getLinkTemplate()
{
  if (!this.link) return "";
  return `<a href="${this.link}" class="column-chart__link">{this.link}</a>`;
}
getItemsTemplate()
{
  const colProps = this.getColumnProps();
  let chartData = "";
  for (const colProp of colProps) {
    chartData += `<div style="--value: ${colProp.value}" data-tooltip="${colProp.percent}"></div>`;
  }
  return chartData;
}
render() {
  this.element = document.createElement("div");
  const template = (this.data.length > 0) ? this.getTemplate() : this.getLoadingTemplate();
  this.element.innerHTML = template;
  this.element = this.element.firstElementChild;
  this.readSubElements();
}
update(data)
{
  this.data = data;
  this.dataElements["body"].innerHTML = this.getItemsTemplate();
}
remove()
{
  this.element.remove();
}
destroy()
{
  this.remove();
  //destroing
}
readSubElements()
{
  this.dataElements = {};
  const elements = this.element.querySelectorAll('[data-element]');
  elements.forEach((subElement)=>
  {
    console.log(subElement.dataset.element);
    const name = subElement.dataset.element;
    this.dataElements[name] = subElement;
  });
}
getColumnProps() {
  if (this.data === undefined) return [];
  const maxValue = Math.max(...this.data);
  const scale = 50 / maxValue;

  return this.data.map(item => {
    return {
      percent: (item / maxValue * 100).toFixed(0) + '%',
      value: String(Math.floor(item * scale))
    };
  });
}

}
