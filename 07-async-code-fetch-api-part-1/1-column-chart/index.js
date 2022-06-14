import fetchJson from './utils/fetch-json.js';
import componentProto from './componentProto.js'
const BACKEND_URL = 'https://course-js.javascript.ru/api/dashboard/orders';

export default class ColumnChart extends componentProto{
  constructor({
                data = [],
                label = "",
                value = "",
                link="",
                formatHeading = (str)=> {return str},
                url = '',
                range = {
                  from: new Date(),
                  to: new Date(),
                }
              } = {}) {
    super();
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.url = new URL(BACKEND_URL);
    this.range = range;
    this.render();
    if (data.length === 0)
    {
      this.element.classList.add('column-chart_loading');
    }
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

  async getDataFromServer(from, to) {
    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());
    return await fetchJson(this.url);
  }
  async update(from, to)
  {
    this.element.classList.add('column-chart_loading');
    const data = await this.getDataFromServer(from, to);
    if (!data || !Object.entries(data)) return;
    this.range.from = from;
    this.range.to = to;
    this.data = data;
    this.subElements["body"].innerHTML = this.getItemsTemplate();
    this.subElements["header"].innerHTML = this.formatHeading(this.value);
    this.element.classList.remove('column-chart_loading');
    return data;
  }

  getColumnProps() {
    if (this.data === undefined) return [];
    const values = Object.values(this.data);
    this.value = values.reduce((sum, item) => (sum + item), 0)
    const maxValue = Math.max(...values);
    const scale = 50 / maxValue;
    return values.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
}
