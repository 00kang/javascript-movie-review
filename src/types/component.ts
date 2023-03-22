interface Component {
  readonly node: HTMLElement;
  composeNode(): this;
  setElements(): this;
}

export default Component;