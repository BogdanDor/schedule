function render(element, container) {
  let rootComponent;
  if (container.firstChild) {
    rootComponent = container.firstChild._internalInstance;
  }
  if (!rootComponent) {
    rootComponent = instantiateComponent(element);
    container.innerHTML = '';
    container.appendChild(rootComponent.mount());
    container.firstChild._internalInstance = rootComponent;
  } else {
    rootComponent.receive(element);
  }
}

function unmountComponentAtNode(container) {
  container.innerHTML = '';
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
    this.children = [];
    this.node = null;
  }

  mount() {
    const type = this.currentElement.type;
    const props = this.currentElement.props;
    const children = this.children;
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
      children.push(childComponent);
    });
    this.node = node;
    return node;
  }

  receive(nextElement) {
    const currentType = this.currentElement.type;
    const currentProps = this.currentElement.props;
    const nextType = nextElement.type;
    const nextProps = nextElement.props;
    const children = this.children;
    const node = this.node;
    if (nextType === currentType) {
      nextProps.children.forEach((childElement, i) => {
        if (i >= children.length) {
          const childComponent = instantiateComponent(childElement);
          const childNode = childComponent.mount();
          children.push(childComponent);
          node.appendChild(childNode);
        } else {
          children[i].receive(childElement);
        }
      });
    }
  }
}

const ScheduleDOM = { render, unmountComponentAtNode };
export default ScheduleDOM;
