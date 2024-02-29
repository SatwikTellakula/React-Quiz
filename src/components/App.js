import { useEffect, useReducer } from 'react';
import Header from './Header'
import Main from './Main'
import Loader from './Loader'
import Error from './Error'
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';

const SECS_PER_QUESTION=30

const initialState={
    questions:[],
    status:"Loading",
    index:0,
    answer:null,
    points:0,
    highScore:0,
    secondsRemaining:null
}

function reducer(state,action) {


  switch(action.type) {
  case "dataReceived":
    return {...state,questions:action.payload,status:"ready"}
  case "dataFailed":
   return {...state,status:"error"}
  case "setActive":
    return {...state,status:"active",secondsRemaining:state.questions.length*SECS_PER_QUESTION}
  case "newAnswer":
    const {questions,index,points}=state
    const question=questions[index]
    const isCorrect=action.payload===question.correctOption

    return {...state,answer:action.payload,points:isCorrect?points+question.points:points}
  case "nextQuestion":
    return {...state,index:state.index+1,answer:null}
  case "finishQuiz":
    return {...state,status:"finished",highScore:state.points>state.highScore?state.points:state.highScore}
  case "restart":
    return {...initialState,questions:state.questions,status:"ready"}
  case "tick":
    return {...state,secondsRemaining:state.secondsRemaining-1,status:state.secondsRemaining===0?"finished":state.status}
  default:
    throw new Error("Unknown action") 

  }
}

function App() {
 
  const [state,dispatch]=useReducer(reducer,initialState)
  const {questions,status,index,answer,points,highScore,secondsRemaining}=state
  
  const numOfQuestions=questions.length
  const maxPossiblePoints=questions.reduce((prev,cur)=> 
    prev+cur.points
    ,0)

   useEffect(function() {
    fetch("http://localhost:8000/questions")
    .then((res)=>res.json())
    .then((data)=> dispatch({type:"dataReceived",payload:data}))
    .catch((err)=>dispatch({type:"dataFailed"}))
   },[])
   console.log(status)
  console.log(questions)
  console.log(points)
 return (
  <div className='App'>
    <Header />
    <Main>
    {status==="Loading" && 
        <Loader />
    }
    {status==="error" && 
        <Error />
    }

    {
        status==="ready" && 
        <StartScreen numOfQuestions={numOfQuestions} dispatch={dispatch} points={points}/>
    }
    {
        status==="active" && 
        <>
        <Progress numOfQuestions={numOfQuestions} index={index} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer}/>
        <Question question={questions[index]} answer={answer} dispatch={dispatch}/>
        <Footer>
        <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
        <NextButton dispatch={dispatch} index={index} numOfQuestions={numOfQuestions}/>
        </Footer>
        </>
    }
    {
      status=== "finished" && (
        <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highScore={highScore} dispatch={dispatch}/>
      )
    }
    
    </Main>
 </div>
 )
}

export default App;
