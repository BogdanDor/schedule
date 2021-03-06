import ScheduleDOM from '../src/index';
import { JSDOM } from 'jsdom';
import Component from '../src/Component';

let container;

beforeAll(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'container');
});

beforeEach(() => {
  container.innerHTML = '';
});

test('should mount element to container', function() {
  ScheduleDOM.render({
    type: 'div',
    props: { children: [] }
  }, container);
  expect(container.outerHTML).toEqual('<div id="container"><div></div></div>');
});

test('should expand tree', function() {
  function InnerComponent() { 
    return {
      type: 'div',
      props: { children: [] }
    }; 
  }
  function ExternalComponent() { 
    return {
      type: InnerComponent,
      props: { children: [] }
    }; 
  }
  ScheduleDOM.render({
    type: ExternalComponent,
    props: { children: [] }
  }, container);
  expect(container.outerHTML).toEqual('<div id="container"><div></div></div>');
});

test('should expand tree that contains composite component inside host', function() {
  function InnerComponent() { 
    return {
      type: 'div',
      props: { children: [] }
    }; 
  }
  function ExternalComponent() { 
    return {
      type: 'div',
      props: { children: [{
        type: InnerComponent,
        props: { children: [] }
      }]}
    };
  }
  ScheduleDOM.render({
    type: ExternalComponent,
    props: { children: [] }
  }, container);
  expect(container.outerHTML).toEqual('<div id="container"><div><div></div></div></div>')
});

test('should clear container', function() {
  container.innerHTML = '<div></div>';
  expect(container.outerHTML).toEqual('<div id="container"><div></div></div>')
  ScheduleDOM.unmountComponentAtNode(container);
  expect(container.outerHTML).toEqual('<div id="container"></div>');
});

test('should rerender component', function() {
  container.innerHTML = '<div></div>';
  expect(container.outerHTML).toEqual('<div id="container"><div></div></div>')
  ScheduleDOM.render({
    type: 'p',
    props: { children: [] }
  }, container);
  expect(container.outerHTML).toEqual('<div id="container"><p></p></div>')
});

test('should rerender composite component', function() {
  function TestComponent(props) {
    return {
      type: 'div',
      props: { id:props.id, children: [] }
    };
  }
  ScheduleDOM.render({
    type: TestComponent,
    props: { id: 'first', children: [] }
  }, container);
  ScheduleDOM.render({
    type: TestComponent,
    props: { id: 'second', children: [] }
  }, container);
  expect(container.outerHTML).toEqual('<div id="container"><div id="second"></div></div>');
});

test('should update prop in host component', function() {
  ScheduleDOM.render({
    type: 'div',
    props: { id: 'first', children: [] }
  }, container);
  ScheduleDOM.render({
    type: 'div',
    props: { id: 'second', children: [] }
  }, container);
  expect(container.outerHTML).toEqual('<div id="container"><div id="second"></div></div>');
});

test('should add few nodes', function() {
  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: {children: []} },
    ]}
  }, container);

  expect(container.outerHTML).toEqual('<div id="container"><div><p></p></div></div>')

  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: { children: [
        { type: 'button', props: {children: []} }
      ]}},
      { type: 'img', props: {children: []} },
    ]}
  }, container);

  expect(container.outerHTML).toEqual(
    '<div id="container"><div><p><button></button></p><img></div></div>'
  );
});


test('should add few nodes with minimum dom operations', function() {
  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: {children: []} },
    ]}
  }, container);

  const button = document.createElement('button');
  const img = document.createElement('img');
  const appendChildMock = jest.fn();
  Node.prototype.oldAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(element) {
    const result = Node.prototype.oldAppendChild.call(this, element);
    if (container.contains(this) || this === container) {
      appendChildMock(element);
    }
    return result;
  };

  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: { children: [
        { type: 'button', props: {children: []} }
      ]}},
      { type: 'img', props: {children: []} },
    ]}
  }, container);

  expect(appendChildMock).toHaveBeenCalledWith(button);
  expect(appendChildMock).toHaveBeenCalledWith(img);
  expect(appendChildMock).toHaveBeenCalledTimes(2);
}); 


test('should remove some nodes', function() {
  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: { children: [
        { type: 'button', props: {children: []} }
      ]}},
      { type: 'img', props: {children: []} },
    ]}
  }, container);

  expect(container.outerHTML).toEqual(
    '<div id="container"><div><p><button></button></p><img></div></div>'
  );

  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: {children: []} },
    ]}
  }, container);

  expect(container.outerHTML).toEqual('<div id="container"><div><p></p></div></div>');
});


test('should remove some nodes with minimum dom operations', function() {
  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: { children: [
        { type: 'button', props: {children: []} }
      ]}},
      { type: 'img', props: {children: []} },
    ]}
  }, container);

  const button = document.createElement('button');
  const img = document.createElement('img');
  const removeChildMock = jest.fn();
  Node.prototype.oldRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function(element) {
    const result = Node.prototype.oldRemoveChild.call(this, element);
    if (container.contains(this) || this === container) {
      removeChildMock(element);
    }
    return result;
  };

  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: {children: []} },
    ]}
  }, container);

  expect(removeChildMock).toHaveBeenCalledWith(button);
  expect(removeChildMock).toHaveBeenCalledWith(img);
  expect(removeChildMock).toHaveBeenCalledTimes(2);
});


test('should replace some nodes', function() {
  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: {children: []} },
    ]}
  }, container);

  expect(container.outerHTML).toEqual('<div id="container"><div><p></p></div></div>')

  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'div', props: {children: []} },
    ]}
  }, container);

  expect(container.outerHTML).toEqual('<div id="container"><div><div></div></div></div>')
});


test('should replace some nodes with minimum dom operations', function() {
  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: {children: []} },
    ]}
  }, container);

  const div = document.createElement('div');
  const p = document.createElement('p');
  const replaceChildMock = jest.fn();
  Node.prototype.oldReplaceChild = Node.prototype.replaceChild;
  Node.prototype.replaceChild = function(newElement, oldElement) {
    const result = Node.prototype.oldReplaceChild.call(this, newElement, oldElement);
    if (container.contains(this) || this === container) {
      replaceChildMock(newElement, oldElement);
    }
    return result;
  };

  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'div', props: {children: []} },
    ]}
  }, container);

  expect(replaceChildMock).toHaveBeenCalledWith(div, p);
  expect(replaceChildMock).toHaveBeenCalledTimes(1);
});


test('should add some composite components', function() {
  function Button() { 
    return { type: 'button', props: {children: []} } 
  };
  function Image() {
    return { type: 'img', props: {children: []} } 
  };

  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: {children: []} },
    ]}
  }, container);
  
  expect(container.outerHTML).toEqual('<div id="container"><div><p></p></div></div>')

  ScheduleDOM.render({
    type: 'div',
    props: { children: [
      { type: 'p', props: { children: [
        { type: Button, props: {children: []} }
      ]}},
      { type: Image, props: {children: []} },
    ]}
  }, container);

  expect(container.outerHTML).toEqual(
    '<div id="container"><div><p><button></button></p><img></div></div>'
  );
});

test('node with props', function() {
  ScheduleDOM.render({
    type: 'div',
    props: {
      id: 'test-item',
      children: []
    }
  }, container);
  expect(container.outerHTML).toEqual(
    '<div id="container"><div id="test-item"></div></div>'
  );
});

test('composite component with props', function() {
  function TestComponent(props) {
    return {
      type: 'div',
      props: {
        id: props.id,
        children: []
      }
    }
  }
  ScheduleDOM.render({
    type: TestComponent,
    props: {
      id: 'test-component',
    }
  }, container);
  expect(container.outerHTML).toEqual(
    '<div id="container"><div id="test-component"></div></div>'
  );
});

test('render text', function() {
  ScheduleDOM.render({
    type: 'p', 
    props: {
      children: ['text']
    }
  }, container);
  expect(container.outerHTML).toEqual('<div id="container"><p>text</p></div>')
});


test ('render ES6 class', function() {
  class TestComponent extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return {
        type: 'p',
        props: { children: ['Class Component'] }
      };
    }
  }
  ScheduleDOM.render({
    type: TestComponent,
    props: { children: [] }
  }, container);
  expect(container.outerHTML).toEqual('<div id="container"><p>Class Component</p></div>');
});


test('should render state', function() {
  class TestComponent extends Component {
    constructor(props) {
      super(props);
      this.state = { text: 'current state'}
    }
    render() {
      return {
        type: 'p',
        props: { children: [this.state.text] }
      };
    }
  }
  ScheduleDOM.render({
    type: TestComponent,
    props: { children: [] }
  }, container);
  expect(container.outerHTML).toEqual('<div id="container"><p>current state</p></div>');
});


test('method render should set root element to stateful component', function() {
  class TestComponent extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return {
        type: 'p',
        props: { children: ['Class Component'] }
      };
    }
  }

  TestComponent.prototype.setRootElement = jest.fn();
  const rootElement = {
    type: 'div',
    props: { children: [{
      type: TestComponent,
      props: { children: [] }
    }]}
  };

  ScheduleDOM.render(rootElement, container);
  expect(TestComponent.prototype.setRootElement).toHaveBeenCalledWith(rootElement);
});


test('method render should set root container to stateful component', function() {
  class TestComponent extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return {
        type: 'p',
        props: { children: ['Class Component'] }
      };
    }
  }

  TestComponent.prototype.setRootContainer = jest.fn();

  ScheduleDOM.render({
    type: 'div',
    props: { children: [{
      type: TestComponent,
      props: { children: [] }
    }]}
  }, container);
  expect(TestComponent.prototype.setRootContainer).toHaveBeenCalledWith(container);
});

test('add event listener', function() {
  const handleClick = jest.fn();
  function TestComponent() {
    return {
      type: 'button',
      props: { onClick: handleClick, children: [] }
    };
  }
  EventTarget.prototype.addEventListener = jest.fn();
  ScheduleDOM.render({type: TestComponent, props:{children: []}}, container);
  expect(EventTarget.prototype.addEventListener).toHaveBeenCalledWith('click', handleClick);
});

test('html element should has class', function() {
  ScheduleDOM.render({
    type: 'div',
    props: { 
      className: 'myClass',
      children: [] 
    }
  }, container);
  expect(container.outerHTML).toEqual('<div id="container"><div class="myClass"></div></div>');
});
