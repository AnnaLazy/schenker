import AdsList from "./components/AdsList"; 
import AddAdForm from "./components/AddAdForm";
import AuthForm from "./components/AuthForm";

function App() {
  return (
    <div>
      <h1>Добро пожаловать в Schenker</h1>
      <AuthForm type="register" />
      <AuthForm type="login" />
      <AddAdForm />
      <AdsList />
    </div>
  );
}

export default App;