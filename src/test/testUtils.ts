import type { VueWrapper } from "@vue/test-utils";
import type { Component } from "vue";

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

export function findAllTypedComponents<T extends Component>(wrapper: VueWrapper, component: T) {
  return wrapper.findAllComponents(component as never) as VueWrapper<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    InstanceType<T & (new () => any)>
  >[];
}
