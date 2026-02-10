import { useEffect } from 'react';
import './App.css'
import Pokelist from './components/pokelist'
import { Link, useNavigate } from 'react-router'

function App() {
  const navigate = useNavigate();
  console.log(navigate);

  useEffect(() => {
    console.log("App component mounted");
  }, []);

  return (
    <div>
      <Pokelist></Pokelist>
    </div>
  )

}

export default App
