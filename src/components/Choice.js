import React from 'react';

class Choice extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {checked, text, type, requestChange} = this.props;
		return (
			<li><input type={type} checked={checked} onChange={requestChange}/>{text}</li>
		)
	}
}

export default Choice;
