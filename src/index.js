import Component from './Component.js';

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
    const prevElement = rootComponent.currentElement;
    if (element.type === prevElement.type) {
      rootComponent.receive(element);
    }
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
  const types = ['a', 'button', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'li', 'ol', 'p', 'span', 'svg', 'ul', 'input', 'form'];
  return types.includes(typeOfElement);
}

function isClass(type) {
  return Object.getPrototypeOf(type) === Component;
}

function propToEventName(prop) {
  const props = {
    onClick: 'click',
    onChange: 'input',
    onSubmit: 'submit'
  };
  return props[prop];
}

class CompositeComponent {
  constructor(element, rootElement, rootContainer) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.rootElement = rootElement;
    this.rootContainer = rootContainer;
    this.publicInstance = null;
  }

  getHostNode() {
    return renderedComponent.getHostNode();
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
      this.publicInstance = component;
    } else {
      renderedElement = type(props);
    }
    renderedComponent = instantiateComponent(renderedElement, this.rootElement, this.rootContainer);
    this.renderedComponent = renderedComponent;
    this.renderedElement = renderedElement;
    return renderedComponent.mount();
  }

  receive(nextElement) {
    const currentType = this.currentElement.type;
    const currentProps = this.currentElement.props;
    const nextType = nextElement.type;
    const nextProps = nextElement.props;
    let renderedElement;
    let renderedComponent = this.renderedComponent;
    if (isClass(nextType)) {
      const component = this.publicInstance;
      component.props = nextProps;
      renderedElement = component.render();
    } else {
      renderedElement = nextType(nextProps);
    }
    if (nextType === currentType) {
      renderedComponent.receive(renderedElement);
    } else {
      const prevNode = getHostNode();
      renderedComponent = instantiateComponent(renderedElement, this.rootElement, this.rootContainer);
      const nextNode = renderedComponent.mount();
      prevNode.parentNode.replaceChild(nextNode, prevNode);
    }
    this.renderedElement = renderedElement;
    this.renderedComponent = renderedComponent;
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

  getHostNode() {
    return this.node;
  }

  mount() {
    const type = this.currentElement.type;
    const props = this.currentElement.props;
    const children = this.children;
    let node = this.node;
    node = document.createElement(type);
    Object.keys(props).forEach(propName => {
      const eventName = propToEventName(propName);
      if (propName !== 'children' && !eventName) {
	node.setAttribute(propName, props[propName]);
      }
      if (eventName) {
        node.addEventListener(eventName, props[propName]);
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
    Object.keys(currentProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    if (nextProps.hasOwnProperty('value')) {
      node.value = nextProps.value;
    }
    Object.keys(nextProps).forEach(propName => {
      const eventName = propToEventName(propName);
      if (propName !== 'children' && !eventName) {
        node.setAttribute(propName, nextProps[propName]);
      }
    });
    nextProps.children.forEach((childElement, i) => {
      if (i >= children.length) {
	const childComponent = instantiateComponent(childElement, this.rootElement, this.rootContainer);
        const childNode = childComponent.mount();
        children.push(childComponent);
        node.appendChild(childNode);
      } else if ((typeof childElement !== 'string') && childElement.type === children[i].currentElement.type) {
        children[i].receive(childElement);
      } else {
	const prevNode = children[i].getHostNode();
	const childComponent = instantiateComponent(childElement, this.rootElement, this.rootContainer);
	children[i] = childComponent;
	const nextNode = childComponent.mount();
        node.replaceChild(nextNode, prevNode);
      }
    });
    const diff = children.length - nextProps.children.length;
    for (let i=0; i<diff; i++) {
      children.pop();
      node.removeChild(node.lastChild);
    }
  }
}

class TextComponent {
  constructor(textValue) {
    this.node = document.createTextNode(textValue);
  }

  getHostNode() {
    return this.node;
  }

  mount() {
    return this.node;
  }
}

const ScheduleDOM = { render, unmountComponentAtNode };
export default ScheduleDOM;
