import React from 'react'
import './Notification.css'

const Notification = ({ message, isError }) => {
    if (message === null) {
        return null
    }

    const classType = isError ? 'error' : 'info'

    return (
        <div className={classType}>
            {message}
        </div>
    )
}

export default Notification