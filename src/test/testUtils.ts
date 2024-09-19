interface CustomEventInit extends EventInit {
  target: HTMLElement;
}

export class CustomEvent extends Event {
  _target: HTMLElement;
  constructor(type: string, options: CustomEventInit) {
    super(type, options);
    this._target = options.target || null;
  }

  get target() {
    return this._target;
  }
}
