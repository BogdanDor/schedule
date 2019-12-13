import React from '../src/React';

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
});

test('create element with text', function() {
  const element = <p>text</p>;
  expect(element).toEqual({
    type: 'p',
    props: { children: ['text'] }
  });
});
