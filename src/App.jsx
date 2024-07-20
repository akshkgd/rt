import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Card from './components/TodoCard'
import Loader from "./components/Loader";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
const firebaseUrl = 'https://frontend-cohort-default-rtdb.asia-southeast1.firebasedatabase.app/';
function App() {
let taskInput = useRef(null);
let [todos, setTodos] = useState([])
let [formStatus, setFormStatus] = useState(false)

  function handleSubmit(){
    setFormStatus(true)
    let task = taskInput.current.value;
    axios.post(`${firebaseUrl}todos.json`, {
      title: task
    }).then(()=>{
      setFormStatus(false);
      fetchTodos();
    })
  }

  function fetchTodos(){
    axios.get(`${firebaseUrl}todos.json`).then(todos=>{
      let tempTodos = [];
      for(let key in todos.data){
        let todo = {
          id: key,
          ...todos.data[key]
        }
        tempTodos.push(todo)
      }
      setTodos(tempTodos)
    })
  }

  function handleDelete(id){
    axios.delete(`${firebaseUrl}todos/${id}.json`).then(()=>{
      fetchTodos();
    })
  }
  useEffect(()=>{
    fetchTodos()
  }, [])
  const {user} = useUser();
  const { isSignedIn } = useAuth();
  return (
    <>
    <header className="border-b py-3 ">
      <div className="flex justify-between max-w-5xl mx-auto">
      <p>Taskkaro</p>
      <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      </div>
      </div>
      
    </header>
    <SignedIn>
      <div className="w-[400px] mx-auto mt-12">
            <h1 className="text-2xl font-bold">Manage your tasks <span className="text-neutral-600">@</span>{isSignedIn ? user.fullName : ""}</h1>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. A, sit facilis! Dolorum.</p>
            <input ref={taskInput} className="mt-2 border rounded-xl p-3 w-full focus:outline-none border-neutral-300" type="text" placeholder="Add task i.e. Learn Hooks in react" />
            <button onClick={handleSubmit} className="mt-2 bg-violet-200 py-3 px-5 text-violet-900 rounded-xl flex align-center gap-4">Create Todos{!formStatus ? "" : <Loader /> }</button>
        
          <div className="mt-12">

           {todos.map(todo=> <Card handleDelete={handleDelete} id={todo.id} title={todo.title} key={todo.id} />) }
          </div>
        
        
        </div>
        </SignedIn>
        <SignedOut>
        You are not logged in
        <button className="bg-black px-5 py-2 text-white rounded"><SignInButton /></button>
      </SignedOut>
    </>
  )
}

export default App
