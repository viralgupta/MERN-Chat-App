import { Route } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import Chats from "./components/chats";
import { ChakraProvider } from '@chakra-ui/react'


function App() {
  return (
    <ChakraProvider>
    <div className="App">
      <Route path='/' component={Login} exact />
      <Route path='/signup' component={Signup} exact />
      <Route path='/chats' component={Chats} exact />
    </div>
    </ChakraProvider>
  );
}

export default App;
