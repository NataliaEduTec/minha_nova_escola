import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import Login from "./pages/Login";
import Header from "./components/Header";
import {useEffect, useMemo, useRef, useState} from "react";
import NotFound from "./pages/NotFound";
import Questionnaries from "./pages/Questions";
import QuestionnariesForm from "./pages/Questions/Form";
import Notification from "./components/General/Notification";
import ProtectedRoute from "./routes/ProtectedRoute";
import {AuthProvider} from "./context/Auth";
import Diagnostic from "./pages/Diagnostic";
import Indicator from "@/pages/Indicators";
import QuestionnairePrint from "@/pages/Report/Questionnaire";
import DiagnosticsReportResults from "@/pages/Report/Diagnostics";
import ViewAllDiagnostics from './pages/Diagnostic/ViewAll';
import Employee from './pages/Employee';

function App() {
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    const prefix = useMemo<string>(() => {
        return '/indicadores';
    }, []);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, [headerRef]);

    const paddingTop = headerHeight ? (headerHeight as number) + 8 : 0

  return (
      <Router>
          <Notification />

          <section className={`bg-violet-50 w-full h-full flex
            bg-gradient-to-t from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] 
            to-[var(--bg-gradient-to)] bg-[length:100%_100%] animate-gradient
            `}>
              <Header ref={headerRef}/>

              <Routes>
                  {["", "/login", prefix, `${prefix}/login`].map((p) => (
                      <Route key={p} path={p} element={<Login />} />
                  ))}

                  <Route path={`${prefix}/indicadores`} element={
                      <AuthProvider headerHeight={headerHeight}>
                          <ProtectedRoute>
                              <Indicator
                                  style={{
                                      paddingTop
                                  }}/>
                          </ProtectedRoute>
                      </AuthProvider>
                  }/>

                  <Route path={`${prefix}/funcionarios`} element={
                      <AuthProvider headerHeight={headerHeight}>
                          <ProtectedRoute>
                              <Employee
                                  style={{
                                      paddingTop
                                  }}/>
                          </ProtectedRoute>
                      </AuthProvider>
                  }/>

                  <Route path={`${prefix}/diagnosticos`} element={
                      <AuthProvider headerHeight={headerHeight}>
                      <ProtectedRoute>
                          <Diagnostic
                              style={{
                                  paddingTop
                              }}/>
                      </ProtectedRoute>
                      </AuthProvider>
                  }/>

                <Route path={`${prefix}/diagnosticos/consultar`} element={
                      <AuthProvider headerHeight={headerHeight}>
                      <ProtectedRoute>
                          <ViewAllDiagnostics
                              style={{
                                  paddingTop
                              }}/>
                      </ProtectedRoute>
                      </AuthProvider>
                  }/>

                  <Route path={`${prefix}/questoes`} element={
                      <AuthProvider headerHeight={headerHeight}>
                      <ProtectedRoute>
                          <Questionnaries
                              style={{
                                paddingTop
                                }}
                          />
                        </ProtectedRoute>

                      </AuthProvider>
                  }/>

                  <Route path={`${prefix}/questoes/formulario`} element={
                      <AuthProvider headerHeight={headerHeight}>
                          <ProtectedRoute>
                              <QuestionnariesForm
                                  style={{
                                      paddingTop
                                  }}
                              />
                          </ProtectedRoute>

                      </AuthProvider>
                  }/>

                  <Route path={`${prefix}/questionario`} element={
                      <AuthProvider headerHeight={headerHeight}>
                          <ProtectedRoute>
                              <QuestionnairePrint/>
                          </ProtectedRoute>
                      </AuthProvider>
                  }/>

                  <Route path={`${prefix}/relatorio/analise-dos-diagnosticos`} element={
                      <AuthProvider headerHeight={headerHeight}>
                          <ProtectedRoute>
                              <DiagnosticsReportResults/>
                          </ProtectedRoute>
                      </AuthProvider>
                  }/>

                  <Route path="*" element={<NotFound />} />
              </Routes>
          </section>
      </Router>
  );
}

export default App

// function RouteWrapper({element, onLoad}: { element: JSX.Element, onLoad: (path: string) => void }) {
//     const location = useLocation();
//
//     useEffect(() => {
//         if (onLoad) onLoad(location.pathname);
//     }, [location, onLoad]);
//
//     return element;
// }
