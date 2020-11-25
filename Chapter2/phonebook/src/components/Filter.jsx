import React from 'react'

const Filter = ({filterVal, filterHandler}) => {
  
    return (
      <div>
        filter shown with 
        <input 
          value={filterVal}
          onChange={filterHandler}
        />
      </div>
    )
}

export default Filter