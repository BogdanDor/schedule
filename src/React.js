class React {
  constructor() {}

  createElement(type, props, ...children) {
    return {
      type,
      props: {...props, children}
    }
  }
}

const react = new React();

export default react;