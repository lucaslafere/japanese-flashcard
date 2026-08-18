import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { ChallengePage } from "./pages/ChallengePage";
import { DictionaryPage } from "./pages/DictionaryPage";
import { HomePage } from "./pages/HomePage";
import { SetSelectPage } from "./pages/SetSelectPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route
          path='/'
          element={
            <HomePage
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          }
        />
        <Route
          path='/modo/:mode/conjunto'
          element={
            <SetSelectPage
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          }
        />
        <Route
          path='/desafio/:setId'
          element={
            <ChallengePage
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          }
        />
        <Route
          path='/dicionario/:setId'
          element={
            <DictionaryPage
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
