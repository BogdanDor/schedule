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
