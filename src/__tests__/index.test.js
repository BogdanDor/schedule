import React from '../index';

test('create empty element', function () {
  const element = <div></div>;
  expect(element).toEqual({
    type: 'div',
    props: { children: [] },
  });
});

test('create element with props', function () {
  const element = <img width="50" height="40" />;
  expect(element).toEqual({
    type: 'img',
    props: { 
      width: '50',
      height: '40',
      children: [] },
  });
});

test('create element with three child', function () {
  const element = <div>
    <img />
    <img />
    <img />
  </div>;
  expect(element).toEqual({
    type: 'div',
    props: { 
      children: [
        { type: 'img', props: { children: [] } },
        { type: 'img', props: { children: [] } },
        { type: 'img', props: { children: [] } }
      ] 
    },
  });
});

test('create composite element', function() {
  function TestComponent() {}
  expect(<TestComponent />).toEqual({
    type: TestComponent,
    props: { children: [] }
  });
})

test('should return mounted node', function() {
  function TestComponent() { return <div></div>; }
  const node = React.mount(<TestComponent />);
  const expected = document.createElement('div');
  expect(node).toEqual(expected);
});

test('should expand tree', function() {
  function InnerComponent() { return <div></div>; }
  function ExternalComponent() { return <InnerComponent />; }
  const node = React.mount(<ExternalComponent />);
  const expected = document.createElement('div');
  expect(node).toEqual(expected);
});

test('should expand tree', function() {
  function InnerComponent() { return <div></div>; }
  function ExternalComponent() { return <div><InnerComponent /></div>; }
  const node = React.mount(<ExternalComponent />);
  const expected = document.createElement('div');
  expected.appendChild(document.createElement('div'));
  expect(node).toEqual(expected);
});
