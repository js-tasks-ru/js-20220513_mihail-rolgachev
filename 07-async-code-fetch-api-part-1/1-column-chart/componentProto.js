export default class ComponentProto {
  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.readSubElements();
  }
  getTemplate() {
    return `<div>BaseComponent</div>`;
  }
  readSubElements() {
    this.subElements = {};
    const elements = this.element.querySelectorAll('[data-element]');
    elements.forEach((subElement) => {
      const name = subElement.dataset.element;
      this.subElements[name] = subElement;
    });
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    this.subElements = {};
  }
}
