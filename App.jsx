import axios from 'axios'
import './App.css'

// const api = axios.create({
//   baseURL: `/api/v1/identity-management/tenant/{tenantId}/.well-known/openid-configuration`
// })

function App() {
  

  const Logon = () => {
    const tenantID = 10000000;
    const baseURL = `https://api.playground.usecustos.org/api/v1/identity-management/tenant/${tenantID}/.well-known/openid-configuration`;
    axios
        .get(baseURL)
        .then(res => {
          console.log(res.data.authorization_endpoint)
        })
        .catch(error => {
          console.error(error);
        })
  };

  return (

    <button onClick={Logon}>Logon</button>
  )


}

export default App