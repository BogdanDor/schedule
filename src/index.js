import Component from './Component';

function render(element, container) {
  let rootComponent;
  if (container.firstChild) {
    rootComponent = container.firstChild._internalInstance;
  }
  if (!rootComponent) {
    rootComponent = instantiateComponent(element, element, container);
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

function instantiateComponent(element, rootElement, rootContainer) {
  const type = element.type;
  if (typeof type === 'function') {
    return new CompositeComponent(element, rootElement, rootContainer);
  } else if (isHostElement(type)) {
    return new HostComponent(element, rootElement, rootContainer);
  } else if (typeof element === 'string') {
    return new TextComponent(element);
  }
}

function isHostElement(typeOfElement) {
  const types = ['a', 'button', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'li', 'ol', 'p', 'span', 'svg', 'ul'];
  return types.includes(typeOfElement);
}

function isClass(type) {
  return Object.getPrototypeOf(type) === Component;
}

class CompositeComponent {
  constructor(element, rootElement, rootContainer) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.rootElement = rootElement;
    this.rootContainer = rootContainer;
  }

  mount() {
    const type = this.currentElement.type;
    const props = this.currentElement.props;
    let renderedComponent = this.renderedComponent;
    let renderedElement;
    if (isClass(type)) {
      const component = new type(props);
      component.setRootElement(this.rootElement);
      component.setRootContainer(this.rootContainer);
      renderedElement = component.render();
    } else {
      renderedElement = type(props);
    }
    renderedComponent = instantiateComponent(renderedElement, this.rootElement, this.rootContainer);
    this.renderedComponent = renderedComponent;
    return renderedComponent.mount();
  }
}

class HostComponent {
  constructor(element, rootElement, rootContainer) {
    this.currentElement = element;
    this.children = [];
    this.node = null;
    this.rootElement = rootElement;
    this.rootContainer = rootContainer;
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
      const childComponent = instantiateComponent(child, this.rootElement, this.rootContainer);
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
          const childComponent = instantiateComponent(childElement, this.rootElement, this.rootContainer);
          const childNode = childComponent.mount();
          children.push(childComponent);
          node.appendChild(childNode);
        } else {
          children[i].receive(childElement);
        }
      });
      const diff = children.length - nextProps.children.length;
      for (let i=0; i<diff; i++) {
        children.pop();
        node.removeChild(node.lastChild);
      }
    } else {
      const newNode = instantiateComponent(nextElement, this.rootElement, this.rootContainer).mount();
      node.parentNode.replaceChild(newNode, node);
    }
  }
}

class TextComponent {
  constructor(textValue) {
    this.node = document.createTextNode(textValue);
  }
  mount() {
    return this.node;
  }
}

const ScheduleDOM = { render, unmountComponentAtNode };
export default ScheduleDOM;
