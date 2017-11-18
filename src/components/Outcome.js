import React from 'react';

class Outcome extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		if (this.props.data) {
			console.log(this.props.data);
			return (
				<div>
					<h2> {this.props.data.title} </h2>
					<h3> {this.props.data.subheading} </h3>
					<p>
						{this.props.data.text}
					</p>
					<button onClick={this.props.onRestart}>Try again</button>
				</div>		
			);
		} else {
			return "";
		}
	}

}

export default Outcome;
