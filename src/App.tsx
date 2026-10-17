import { BrowserRouter } from "react-router-dom";

import SignupPageRoutes from "./router/signupPageRoutes";

function App() {
  return (
    <BrowserRouter>
      <SignupPageRoutes />
    </BrowserRouter>
  );
}

export default App;
