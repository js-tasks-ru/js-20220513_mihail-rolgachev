
class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize() {
    document.addEventListener('pointerover', this.handlePointerover.bind(this));
    document.addEventListener('pointerout', this.handlePointerout.bind(this));
  }

  render(value) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = value;
    document.body.append(this.element);
  }

  handlePointerover(event) {
    if (event.target.dataset.tooltip === undefined) return;
    const element = event.target.closest('[data-tooltip]');
    const tooltipValue = element.dataset.tooltip;
    if (!element) {return;}
    this.render(tooltipValue);
    this.positionByEvent(event);
  }
  positionByEvent(event)
  {
    this.element.style.left = event.clientX + 'px';
    this.element.style.top = event.clientY + 'px';
  }
  handlePointerout(event) {
    if (event.target.dataset.tooltip !== undefined) {
      this.remove();
    }
  }
  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
  destroy() {
    this.remove();
    document.removeEventListener('pointerover', this.handlePointerover.bind(this));
    document.removeEventListener('pointerout', this.handlePointerout.bind(this));
  }
}

export default Tooltip;
