import React from 'react'

const Header = ({ course }) => {
    return (
      <h1>{course.name}</h1>
    )
}
  
const Total = ({ course }) => {
    const reducer = (acc, cur) => acc + cur
    const sum = course.parts.map(part => part.exercises).reduce(reducer, 0)
    return(
      <p><b>Number of exercises {sum}</b></p>
    ) 
}
  
const Part = (props) => {
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>    
    )
}
  
const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(part => 
          <Part key={part.id} part={part} />
        )}
      </div>
    )
}
  
const Course = ({ course }) => {
    return (
      <div>
        <Header course={course}></Header>
        <Content course={course}></Content>
        <Total course={course}></Total>
      </div>
    )
}

export default Course
  
