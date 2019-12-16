import React from '/node_modules/schedule/dist/React.js';
import Component from '/node_modules/schedule/dist/Component.js'

class TodoInput extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ 
      value: event.target.value
    });
  }

  handleSubmit(event) {
    this.props.onCreateTodo(this.state.value);
    this.setState({ 
      value: '',
    });
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          placeholder="enter new todo"
          value={this.state.value} 
          onChange={this.handleChange} 
        />
      </form>
    );
  }
}

export default TodoInput;
