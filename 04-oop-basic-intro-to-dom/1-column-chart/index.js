export default class ColumnChart {
  constructor(params) {
    this.data = params['data'];
    this.label = params['label'];
    this.value = params['value'];
    this.link = params['link'];
    this.render();
  }
element = "";

getTemplate()
{
  return `<div className="dashboard__chart_orders">
      <div className="column-chart" style="--chart-height: 50">
        <div className="column-chart__title">
          {{title}}
          {{link}}
        </div>
        <div className="column-chart__container">
          <div data-element="header" className="column-chart__header">{{header}}</div>
          <div data-element="body" className="column-chart__chart">
          {{chartData}}
          </div>
        </div>
      </div>
    </div>`;
}
getItemTemplate(itemData)
{
  let coltemplate =  `<div style="--value: {{value}}" data-tooltip="{{percent}}%"></div>`;
  coltemplate = coltemplate.replace("{{value}}", itemData.value);
  coltemplate = coltemplate.replace("{{percent}}", itemData.percent);
  return coltemplate;
}
getLinkTemplate()
{
  if (!this.link) return "";
  const template =  `<a href="{{link}}" class="column-chart__link">{{link}}</a>`;
  return template.replaceAll("{{link}}", this.link);
}
render() {
  this.element = document.createElement("div");
  let template = this.getTemplate();
  template = template.replace("{{title}}", this.label);
  template = template.replace("{{header}}", this.value);
  template = template.replace("{{link}}", this.getLinkTemplate());
  const colProps = this.getColumnProps();
  let chartData = "";
  for (const colProp of colProps) {
    chartData += this.getItemTemplate(colProp);
  }
  template = template.replace("{{chartData}}", chartData);
  this.element.innerHTML = template;
  this.element = this.element.firstElementChild;

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
