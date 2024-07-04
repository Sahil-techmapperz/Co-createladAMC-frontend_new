import { useState } from "react";
import AllRoute from './components/Routers';
function App() {
  const [count, setCount] =useState(0)
  return (
    <>
    <AllRoute/>
    </>
  );
}

export default App;
