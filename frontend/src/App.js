
import './App.css';
import Home from './pages/Home';
import Chat from './pages/Chat';
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/chat/:modelName" element={<Chat />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
