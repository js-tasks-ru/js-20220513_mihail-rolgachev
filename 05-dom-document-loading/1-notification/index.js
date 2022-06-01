class NotificationClass
{
  static SUCCESS_TYPE = "success";
  static ERROR_TYPE = 'error';
  static getClassName (notificationType)
  {
    switch (notificationType) {
    case this.SUCCESS_TYPE: return 'notification success';
    case this.ERROR_TYPE: return 'notification error';
    default: throw "NotificationClass : неверный тип ${notificationType}";
    }
  }
}
export default class NotificationMessage {
  constructor(
    message = "",
    {    duration = 0, type = 'error'} = {})
  {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.render();
  }
  getTemplate ()
  {
    const className = NotificationClass.getClassName(this.type);
    return `
  <div class="${className}" style="--value:20s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">${this.message}</div>
    </div>
  </div>`;
  }

  render()
  {
    const element = document.createElement("div");
    const template = this.getTemplate();
    element.innerHTML = template;
    this.element = element.firstElementChild;
  }
  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
  show(parent = document.body) {
    parent.append(this.element);
    if (NotificationMessage.activeElement) {
      NotificationMessage.activeElement.remove();
    }
    NotificationMessage.activeElement = this.element;
    setTimeout(()=>this.remove(), this.duration);
  }
  destroy() {
    this.remove();
    this.element = null;
  }
}
