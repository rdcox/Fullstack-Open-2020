import React from 'react'

const PersonForm = ({name, num, nameHandler, numHandler, personHandler}) => {  
    return (
      <form onSubmit={personHandler}>
        <div>
          name: 
          <input 
            value={name}
            onChange={nameHandler}
          />
          <br/>
          number:
          <input 
            value={num}
            onChange={numHandler}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm