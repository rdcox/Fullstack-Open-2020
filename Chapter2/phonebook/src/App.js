import React, { useState } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterInput, setFilter ] = useState('')
  
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    
    if (hasNameBeenUsed(personObject.name)) {
      window.alert(`${personObject.name} is already in phonebook`)
    } else {    
      setPersons(persons.concat(personObject))
    }

    setNewName('')
    setNewNumber('')
  }

  const hasNameBeenUsed = (name) => {
    console.log('Name usage check:', name)
    const nameUsage = persons.findIndex(person => person.name === name) >= 0
    console.log('Has name been used?', nameUsage)
    return nameUsage
  }

  const peopleToShow = filterInput.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(filterInput.toLowerCase()))
    : persons

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter persons={persons} filterVal={filterInput} filterHandler={handleFilterChange}></Filter>
      
      <h2>add a new</h2>
      <PersonForm name={newName} num={newNumber} nameHandler={handleNameChange} numHandler={handleNumberChange} personHandler={addPerson}></PersonForm>

      <h2>Numbers</h2>
      {peopleToShow.map(person => 
        <Person key={person.name} person={person}></Person>
      )}
    </div>
  )
}

export default App