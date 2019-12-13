import Component from '../src/Component';
import ScheduleDOM from '../src/index';

test('setState should call rerender', function() {
	const testComponent = new Component();
	ScheduleDOM.render = jest.fn();
	testComponent.setState({text: 'newState'});
	expect(ScheduleDOM.render).toHaveBeenCalled();
});

test('call setState using event', function() {
	class Button extends Component {
		constructor(props) {
			super(props);
			this.state = { text: 'before click' }
			this.handleClick = this.handleClick.bind(this);
		}

		handleClick() {
			this.setState({text: 'after click'})
		}

		render() {
			return {
				type: 'button',
				props: { onClick: this.handleClick, children: [this.state.text] }
			}
		}
	};

	const buttonComponent = new Button();
	buttonComponent.setState = jest.fn();
	buttonComponent.render().props.onClick();
	expect(buttonComponent.setState).toHaveBeenCalled();
});
