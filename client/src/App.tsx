import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginForm from "./pages/Login";
import Register from "./pages/Register";
import AuthGuard from "./components/AuthGuard";
import NotFound from "./pages/NotFound";
import MealList from "./pages/MealList";
import MealDetail from "./pages/MealDetail";
import FavouriteMeals from "./pages/FavouriteMeals";



function App() {
  interface RouteConfig {
    path: string;
    element: React.ReactNode;
    role?: "member" | "admin";
  }

  const routes: RouteConfig[] = [
    { path: "/", element: <LoginForm /> },
    { path: "/register", element: <Register /> },

    { path: "/meallist", element: <MealList />, role: "member" },
    { path: "/meal/:id", element: <MealDetail />, role: "member" },
    { path: "/myfavourites", element: <FavouriteMeals />, role: "member" },

  ];

  return (
    <div className="bg-white min-h-screen">
      <BrowserRouter>
        <Routes>
          {routes.map(({ path, element, role }) => (
            <Route
              key={path}
              path={path}
              element={
                role ? (
                  <Layout>
                    <AuthGuard role={role}>{element}</AuthGuard>
                  </Layout>
                ) : (
                  element
                )
              }
            />
          ))}


          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
