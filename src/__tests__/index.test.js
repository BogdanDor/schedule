import ScheduleDOM from '../index';
import { JSDOM } from 'jsdom';

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
