class React {
  constructor() {}

  createElement(type, props, ...children) {
    for (let i=0; i<children.length; i++) {
      if (Array.isArray(children[i])) {
        children.splice(i, 1, ...children[i]);
      }
    }
    return {
      type,
      props: {...props, children}
    }
  }
}

const react = new React();

export default react;
