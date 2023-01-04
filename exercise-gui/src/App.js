import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage';
import EditExercisePage from './pages/EditExercisePage'
import CreateExercisePage from './pages/CreateExercisePage'

function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState();
  
  return (
    <div className="App">
        <Router>
          <header>
              <h1>Exercise Tracker</h1>
            <Navigation />
          </header>
          <div id="wrapper">
            <Routes>
              <Route path="/" element={<HomePage setExerciseToEdit={setExerciseToEdit} />}></Route>
              <Route path="/edit-exercise" element={<EditExercisePage exerciseToEdit={exerciseToEdit} />}></Route>
              <Route path="/create-exercise" element={<CreateExercisePage />}></Route>
            </Routes>
          </div>
        </Router>
        <footer>
          © 2022 Anna Level
        </footer>
    </div>
  );
}

export default App;