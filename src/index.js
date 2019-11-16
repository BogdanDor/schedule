class Schedule {
  constructor() {}
  createElement(type, props, ...children) {
    return {
      type,
      props: {...props, children}
    }
  }  
}

const React = new Schedule();

export default React;