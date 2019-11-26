import React from '../React';
import render from '../index';
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
  function TestComponent() { return <div></div>; }
  render(<TestComponent />, container);
  expect(container.outerHTML).toEqual('<div id="container"><div></div></div>');
});

test('should expand tree', function() {
  function InnerComponent() { return <div></div>; }
  function ExternalComponent() { return <InnerComponent />; }
  render(<ExternalComponent />, container);
  expect(container.outerHTML).toEqual('<div id="container"><div></div></div>');
});

test('should expand tree that contains composite component inside host', function() {
  function InnerComponent() { return <div></div>; }
  function ExternalComponent() { return <div><InnerComponent /></div>; }
  render(<ExternalComponent />, container);
  expect(container.outerHTML).toEqual('<div id="container"><div><div></div></div></div>')
});
