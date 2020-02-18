import React from '/node_modules/schedule/dist/React.js';
import Component from '/node_modules/schedule/dist/Component.js'
import Card from './Card.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { cardIsBack: false };
    this.handleFrontClick = this.handleFrontClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
  }

  handleFrontClick() {
    this.setState({cardIsBack: false});
  }

  handleBackClick() {
    this.setState({cardIsBack: true});
  }

  render() {
    return (
      <div className="app">
        <div className="app__header">Header</div>
        <div className="app__main">
          <Card isBack={this.state.cardIsBack} />
          <div className="app__buttons">
            <button onClick={this.handleFrontClick}>Front</button>
            <button onClick={this.handleBackClick}>Back</button>
          </div>
        </div>
        <div className="app__footer">Footer</div>
      </div>
    );
  }
}

export default App;
