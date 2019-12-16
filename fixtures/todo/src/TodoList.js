import React from '/node_modules/schedule/dist/React.js';

function TodoList(props) {
  return (
    <ul>
      {props.items.map((todo) =>
        <li>{todo.title}</li>
      )}
    </ul>
  )
}

export default TodoList;
