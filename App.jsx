import axios from 'axios'
import './App.css'

// const api = axios.create({
//   baseURL: `/api/v1/identity-management/tenant/{tenantId}/.well-known/openid-configuration`
// })

function App() {
  

  const Logon = () => {
    const tenantID = 10000000;
    const baseURL = `https://api.playground.usecustos.org/api/v1/identity-management/tenant/${tenantID}/.well-known/openid-configuration`;
    const tenantID = 10000000;
    const baseURL = `https://api.playground.usecustos.org/api/v1/identity-management/tenant/${tenantID}/.well-known/openid-configuration`;
    axios
      .get(baseURL)
      .then(res => {
        const auth = res.data.authorization_endpoint;
        // Redirect the user to the authorization endpoint
        window.location.href = `${auth}?client_id=custos-qt5ye0xuq9fiszscvhpn-10000000&redirect_uri=http://localhost:5173/auth/callback&scope=openid email&state=active&response_type=code`;
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (

    <button onClick={Logon}>Logon</button>
  )


}

export default App
