function render(element, container) {
  const rootComponent = instantiateComponent(element);
  container.appendChild(rootComponent.mount());
}

function instantiateComponent(element) {
  const type = element.type;
  if (typeof type === 'function') {
    return new CompositeComponent(element);
  } else if (isHostElement(type)) {
    return new HostComponent(element);
  }
}

function isHostElement(typeOfElement) {
  const types = ['a', 'button', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'li', 'ol', 'p', 'span', 'svg', 'ul'];
  return types.includes(typeOfElement);
}

class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
  }

  mount() {
    const type = this.currentElement.type;
    const props = this.currentElement.props;
    let renderedComponent = this.renderedComponent;
    let renderedElement;
    renderedElement = type(props);
    renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;
    return renderedComponent.mount();
  }
}

class HostComponent {
  constructor(element) {
    this.currentElement = element;
    this.node = null;
  }

  mount() {
    const type = this.currentElement.type;
    const props = this.currentElement.props;
    let node = this.node;
    node = document.createElement(type);
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });
    props.children.forEach(child => {
      const childComponent = instantiateComponent(child);
      const childNode = childComponent.mount();
      node.appendChild(childNode);
    });
    this.node = node;
    return node;
  }
}

export default render;
