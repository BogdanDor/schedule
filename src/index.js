class Schedule {
  constructor() {}

  createElement(type, props, ...children) {
    return {
      type,
      props: {...props, children}
    }
  }

  mount(element) {
    const type = element.type;
    const props = element.props;
    let publicInstanse;
    if (typeof type === 'function') {
      publicInstanse = type(props);
      return this.mount(publicInstanse);
    } else if (isHostElement(type)) {
      const node = document.createElement(type);
      Object.keys(props).forEach(propName => {
        if (propName !== 'children') {
          node.setAttribute(propName, props[propName]);
        }
      });
      return node;
    }
  }  
}

function isHostElement(typeOfElement) {
  const types = ['a', 'button', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'li', 'ol', 'p', 'span', 'svg', 'ul'];
  return types.includes(typeOfElement);
}

const React = new Schedule();

export default React;
