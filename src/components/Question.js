import React from 'react';
import Choice from './Choice';

class Question extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			choices: this.props.choices
				.map(c => Object.assign({checked: false}, c)),
			answered: 0
		};
		this.requestChange = this.requestChange.bind(this);
		this.tally = this.tally.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		if (nextProps.state === "initial") {	
			this.setState({
				choices: this.props.choices
					.map(c => Object.assign({checked: false}, c)),
				answered: 0
			});
		}
	}

	tally() {
		const checked = this.state.choices.filter(c => c.checked);
		if (checked.length === 0) {
			return [];
		}
		return checked
			.map(c => c.increments)
			.reduce((total, incr) => 
				total.map((n, i) => (i < incr.length) ? n + incr[i] : n)
			);
	}

	requestChange(id) {
		const {type, isLocked} = this.props;
		const {answered, choices} = this.state;
		if (isLocked()) {
			console.log('locked; aborting')
			return;
		}
		if (type === "radio") {
			this.setState({
				choices: choices.map((c,i) => {
					if (i === id) {
						return Object.assign({}, c, {checked: true});	
					} else {
						return Object.assign({}, c, {checked: false});
					}
				}),
				answered: 1
			}, () => this.props.tally(this.tally()));
		} else if (type === "checkbox") {
			this.setState({
				choices: choices.map((c,i) => {
					if (i === id) {
						return Object.assign({}, c, {checked: !c.checked});
					} else {
						return c;
					}
				}),
				answered: (choices[id].checked) ? answered - 1 : answered + 1
			}, () => this.props.tally(this.tally()));	
		}
	}

	render() {
		const {title, type} = this.props;
		const {answered, choices} = this.state;
		return (
			<div>
				<h2>{title}</h2>
				<span>answered {answered}</span>
				<ul><form>
				{choices.map((c,id) => 
					<Choice key={id} text={c.text} checked={c.checked} type={type} requestChange={() => this.requestChange(id)}/>		
				)}
				</form></ul>
			</div>		
		)
	}
}

export default Question;
