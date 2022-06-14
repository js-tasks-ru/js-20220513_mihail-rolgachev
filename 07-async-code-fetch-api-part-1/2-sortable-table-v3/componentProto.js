export default class ComponentProto {
  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.extenalEvents = [];
    this.readSubElements();
  }
  getTemplate() {
    return `<div>BaseComponent</div>`;
  }
  registerExtenalEvent(externalObject, event, handler)
  {
    this.extenalEvents.push(new ExtenalEventData(externalObject, event, handler));
  }
  unregisterEvents()
  {
    for (const item of this.extenalEvents) {
      item.unregister();
    }
    this.extenalEvents = [];
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
    this.unregisterEvents();
    this.subElements = {};
  }
}

class ExtenalEventData{
  constructor(externalObject, event, handler) {
    this.externalObect = externalObject;
    this.handler = handler;
    this.event = event;
    externalObject.addEventListener(event, handler);
  }
  unregister()
  {
    this.externalObect.removeEventListener(this.event, this.handler);
  }
}
