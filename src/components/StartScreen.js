import React from 'react'

function StartScreen({numOfQuestions,dispatch}) {
  return (
    <div className="start">
    <h2>Welcome to the React Quiz!</h2>
    <h3>{numOfQuestions} questions to test your react Mastery</h3>
    <button className="btn btn-ui" onClick={()=>dispatch({type:"setActive"})}>
    Let's Start
    </button>
     </div>
  )
}

export default StartScreen