function isHostElement(typeOfElement) {
  const types = ['a', 'button', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'li', 'ol', 'p', 'span', 'svg', 'ul'];
  return types.includes(typeOfElement);
}

function mountComposite(element) {
  const type = element.type;
  const props = element.props;
  const publicInstanse = type(props);
  return mount(publicInstanse);
}

function mountHost(element) {
  const type = element.type;
  const props = element.props;
  const parentNode = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });
  props.children.forEach(child => {
    const childNode = mount(child);
    parentNode.appendChild(childNode);
  });
  return parentNode;
}

function mount(element) {
  const type = element.type;
  if (typeof type === 'function') {
    return mountComposite(element);
  } else if (isHostElement(type)) {
    return mountHost(element);
  }
}

function render(element, container) {
  const node = mount(element);
  container.appendChild(node);
}

export default render;
