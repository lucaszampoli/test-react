import React, { useState } from 'react';
import './App.css';
import Axios from "axios";


function App() {
  const [values, setValues] = useState();

  const getValues = (value) => {
    setValues((prevValue) => ({
      ...prevValue,
      [value.target.name]: value.target.value,
    }));
  };

  const clickButton = () =>{
    console.log(values);
  }

  return (
    <div className="app--container">
        <div className="register--container">
          <h1 className="register--title"/>
            Editora Globo
          <input type="text" 
                 name="titulo" 
                 placeholder="Titulo" 
                 className="register--input" 
                 onChange={getValues}/>
          <input type="text" 
                 name="content" 
                 placeholder="Conteudo" 
                 className="register--content" 
                 onChange={getValues}/>
          <input type="date" 
                 name="date"
                 placeholder="Data" 
                 className="register--date" 
                 onChange={getValues}/>
          <button className="register--button" onClick={() => clickButton()}>Cadastrar</button>
        </div>
    </div>
  );
}

export default App;
