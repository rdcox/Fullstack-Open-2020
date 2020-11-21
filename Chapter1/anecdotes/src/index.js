import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const Anecdote = (props) => {
  return (
    <div>
      {props.anecdote}
      <br />
      <p>has {props.votes} votes</p>
    </div>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(props.anecdotes.length + 1).join('0').split('').map(parseFloat))

  const setRandomAnecdote = () => {
    let num = Math.floor(Math.random() * anecdotes.length)
    setSelected(num)
  }

  const castVote = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)
  }

  const getMaxIndex = (array) => {
    let max = Math.max(...array)
    return array.indexOf(max)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={props.anecdotes[selected]} votes={votes[selected]} />
      <Button onClick={() => castVote()} text='vote' />
      <Button onClick={() => setRandomAnecdote()} text='next anecdote' />
      <h1>Anecdote with most votes</h1>
      <Anecdote anecdote={props.anecdotes[getMaxIndex(votes)]} votes={votes[getMaxIndex(votes)]} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)