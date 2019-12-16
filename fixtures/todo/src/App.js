import React from '/node_modules/schedule/dist/React.js';
import Component from '/node_modules/schedule/dist/Component.js'
import TodoList from './TodoList.js';
import TodoInput from './TodoInput.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      todos: [],
      lastId: 0
    }

    this.createTodo = this.createTodo.bind(this);
  }

  createTodo(title) {
   const lastId = this.state.lastId;
   const nextTodos = this.state.todos.concat({id: lastId, title: title}); 
   this.setState({todos: nextTodos, lastId: lastId+1}); 
  }

  render() {
    return (
      <div>
        <TodoInput onCreateTodo={this.createTodo} />
        <TodoList 
          items={this.state.todos}
        />
      </div>
    );  
  }
}

export default App;
