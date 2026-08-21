import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import type { KanjiCard, StudyListResult } from "./data/kanjiSets";
import { useTheme } from "./hooks/useTheme";
import { ChallengePage } from "./pages/ChallengePage";
import { DictionaryPage } from "./pages/DictionaryPage";
import { HomePage } from "./pages/HomePage";
import { SetSelectPage } from "./pages/SetSelectPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
const studyListStorageKey = "kanji-study-list";

function App() {
  const { theme, toggleTheme } = useTheme();
  const [studyCards, setStudyCards] = useState<KanjiCard[]>(() => {
    try {
      const savedCards = localStorage.getItem(studyListStorageKey);
      const parsedCards = savedCards ? JSON.parse(savedCards) : [];
      return Array.isArray(parsedCards) ? (parsedCards as KanjiCard[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(studyListStorageKey, JSON.stringify(studyCards));
    } catch {}
  }, [studyCards]);

  const addToStudyList = (card: KanjiCard): StudyListResult => {
    if (studyCards.some((studyCard) => studyCard.id === card.id)) {
      return "duplicate";
    }

    const nextCards = [...studyCards, card];
    try {
      localStorage.setItem(studyListStorageKey, JSON.stringify(nextCards));
      setStudyCards(nextCards);
      return "added";
    } catch {
      return "error";
    }
  };

  const toggleStudyList = (card: KanjiCard): StudyListResult => {
    const isSaved = studyCards.some((studyCard) => studyCard.id === card.id);
    const nextCards = isSaved
      ? studyCards.filter((studyCard) => studyCard.id !== card.id)
      : [...studyCards, card];

    try {
      localStorage.setItem(studyListStorageKey, JSON.stringify(nextCards));
      setStudyCards(nextCards);
      return isSaved ? "removed" : "added";
    } catch {
      return "error";
    }
  };

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
              studyCardCount={studyCards.length}
            />
          }
        />
        <Route
          path='/desafio/:setId'
          element={
            <ChallengePage
              theme={theme}
              onToggleTheme={toggleTheme}
              studyCards={studyCards}
            />
          }
        />
        <Route
          path='/dicionario/:setId'
          element={
            <DictionaryPage
              theme={theme}
              onToggleTheme={toggleTheme}
              studyCards={studyCards}
              onAddToStudyList={addToStudyList}
              onToggleStudyList={toggleStudyList}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
