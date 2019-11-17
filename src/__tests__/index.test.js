import React from '../React';
import mount from '../index';

test('should return mounted node', function() {
  function TestComponent() { return <div></div>; }
  const node = mount(<TestComponent />);
  const expected = document.createElement('div');
  expect(node).toEqual(expected);
});

test('should expand tree', function() {
  function InnerComponent() { return <div></div>; }
  function ExternalComponent() { return <InnerComponent />; }
  const node = mount(<ExternalComponent />);
  const expected = document.createElement('div');
  expect(node).toEqual(expected);
});

test('should expand tree', function() {
  function InnerComponent() { return <div></div>; }
  function ExternalComponent() { return <div><InnerComponent /></div>; }
  const node = mount(<ExternalComponent />);
  const expected = document.createElement('div');
  expected.appendChild(document.createElement('div'));
  expect(node).toEqual(expected);
});
