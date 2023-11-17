import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./component/Home/Home";
import Form from "./component/Form";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./utils/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Form />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
