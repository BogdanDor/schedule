import ScheduleDOM from './index.js';

class Component {
	constructor(props) {
		this.props = props;
	}

	setRootElement(element) {
		this.rootElement = element;
	}

	setRootContainer(container) {
		this.rootContainer = container;
	}

	setState(newState) {
		this.state = newState;
		ScheduleDOM.render(this.rootElement, this.rootContainer);
	}
}

export default Component;
