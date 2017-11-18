import React from 'react';
import Question from './Question';
import Outcome from './Outcome';
import '../index.css';

class Quiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			questions: [],
			outcomes: [],
			totals: [],
			locked: false,
		}
		
		this.makeQuestion = this.makeQuestion.bind(this);
		this.tally = this.tally.bind(this);
		this.submit = this.submit.bind(this);
		this.restart = this.restart.bind(this);
		this.updateQuestionState = this.updateQuestionState.bind(this);
	}

	componentDidMount() {
		fetch(this.props.id + ".json")
			.then(res => res.json())
			.then(data => this.setState({
				title:data.title, 
				questions: data.questions.map(q => Object.assign({state: "initial"}, q)),
				outcomes: data.outcomes,
				totals: data.questions.map(q => Array(data.outcomes.length).fill(0)),
				required: data.questions.map(q => JSON.parse(q.required))
			}));	
	}

	makeQuestion(q,i) {
		return (<Question 
				key={i} title={q.title} choices={q.choices} type={q.type} required={q.required} update={(s) => this.updateQuestionState(i,s)}
				tally={(incr) => this.tally(i,incr)} isLocked={() => this.state.locked} state={q.state}
				/>);
	}

	updateQuestionState(i, state) {
		this.setState(prevState => {questions: prevState.questions.map((q,j) => (i === j) ? Object.assign(q, {state: state}) : q)});
	}

	tally(i, increments) {
		console.log(increments);
		this.setState(prevState => {return {
			totals: prevState.totals.map((t,key) => (key === i) ? increments : t),
			questions: prevState.questions.map(q => Object.assign(q, {state: "active"})),
		}}, () => console.log(this.state.totals));
	}	

	submit() {
		// ensure every required question has been answered
		const isValid = this.state.questions
			.filter((q,i) => this.state.required[i])
			.every((q,i) => this.state.totals[i].reduce((a,b) => a + b, 0) > 0);
		if (!isValid) {return;}
		const totals = this.state.totals
			.reduce((sum, vec) => sum
				.map((n, i) => (i < vec.length) ? n + vec[i] : n),
			Array(this.state.outcomes.length).fill(0));
		const winner = this.state.outcomes
			.map((o,i) => Object.assign({}, o, {total: totals[i]}))
			.reduce((a,b) => (b.total > a.total) ? b : a);
		this.setState(prevState => {return {
			winner: winner, locked: true, 
			state: prevState.questions.map(q => Object.assign(q, {state: "finished"}))
		}});
	}

	restart() {
		this.setState(prevState => {return {
			winner: null, locked: false, 
			questions: prevState.questions.map(q => Object.assign(q, {state: "initial"}))
		}});
	}

	render() {
		const {title, questions} = this.state;
		return (
			<div>
			<h1>{title}</h1>
			<ul>
			{questions.map((q,i) => this.makeQuestion(q,i))}
			</ul>
			<button onClick={this.submit}>Submit</button>
			<Outcome data={this.state.winner} onRestart={() => this.restart()}/>
			</div>
		);
	}
}

export default Quiz;
