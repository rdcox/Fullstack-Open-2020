import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const Feedback = (props) => {

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={props.handleGood} text='good' />
      <Button onClick={props.handleNeutral} text='neutral' />
      <Button onClick={props.handleBad} text='bad' />
    </div>
  )
}

const Statistic = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const getTotal = () => {
    return props.good + props.neutral + props.bad
  }

  const getPercentPositive = () => {
    if (getTotal() === 0) {
      return '0 %'
    }
    return (props.good / getTotal()) * 100 + ' %'
  }
  
  const getAverage = () => {
    if (getTotal() === 0) {
      return 0
    }    
    return (props.good - props.bad) / getTotal()
  }

  if (getTotal() === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <Statistic text='good' value={props.good} />
          <Statistic text='neutral' value={props.neutral} />
          <Statistic text='bad' value={props.bad} />
          <Statistic text='all' value={getTotal()} />
          <Statistic text='average' value={getAverage()} />
          <Statistic text='positive' value={getPercentPositive()} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Feedback 
        handleGood={() => setGood(good + 1)} 
        handleNeutral={() => setNeutral(neutral + 1)} 
        handleBad={() => setBad(bad + 1)} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)