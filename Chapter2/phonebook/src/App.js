import React, { useState, useEffect } from 'react'

import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterInput, setFilter ] = useState('')
  
  useEffect(() => {
    console.log('effect triggered')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'person(s)')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    
    if (hasNameBeenUsed(personObject.name)) {
      confirmNumChange(personObject)
    } else {    
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const confirmNumChange = (personObject) => {
    const updatePerson = persons.filter(person => person.name.toLowerCase() === personObject.name.toLowerCase())[0]
    console.log(updatePerson)
    if (window.confirm(`${updatePerson.name} is already added to phonebook, replace the old number with a new one?`)) {
      console.log(updatePerson.id)
      personService
        .update(updatePerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== updatePerson.id ? p : returnedPerson))
        })
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(
          setPersons(persons.filter(p => p.id !== person.id))
        )
    }
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
        <Person key={person.name} person={person} deleteHandler={() => deletePerson(person)}></Person>
      )}
    </div>
  )
}

export default App