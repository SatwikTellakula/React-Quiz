import React from 'react'

export default function NextButton({dispatch,answer,index,numOfQuestions}) {

if (answer===null) return;
if (index<numOfQuestions-1) {
  return (
    <div>
      <button className="btn btn-ui" onClick={()=>dispatch({type:"nextQuestion"})}>Next</button>
    </div>
  )
}
else {
  return (
    <button onClick={()=>dispatch({type:"finishQuiz"})} className="btn btn-ui">Finish Quiz</button>
  )
}
}
