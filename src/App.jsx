import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import MemoList from "./pages/MemoList";
import Board from "./pages/Board";
import Home from "./pages/Home";

function App() {
  const getActiveMenuStyle = (isActive) => ({
    color: isActive ? "#fff" : "#e0e0e0",
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    backgroundColor: isActive ? "#555" : "transparent",
    fontWeight: isActive ? "500" : "400",
    fontSize: "15px",
    display: "inline-block",
  });

  return (
    <Router>
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f5f5f5"
      }}>
        {/* 헤더 메뉴 */}
        <header style={{
          backgroundColor: "#333",
          color: "white",
          padding: "0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
        }}>
          <div style={{
            maxWidth: 1024,
            width: "100%",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
          }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: "20px",
              fontWeight: "500",
              letterSpacing: "-0.3px"
            }}>
              <NavLink to="/" style={{ 
                color: "white", 
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span style={{ 
                  backgroundColor: "#555", 
                  padding: "4px 8px", 
                  borderRadius: "4px",
                  fontSize: "16px"
                }}>
                  📝
                </span>
                메모 & 게시판 시스템
              </NavLink>
            </h1>
            
            <nav>
              <ul style={{
                display: "flex",
                listStyle: "none",
                margin: 0,
                padding: 0,
                gap: "4px",
              }}>
                <li>
                  <NavLink 
                    to="/" 
                    style={({ isActive }) => getActiveMenuStyle(isActive)}
                    className="nav-link"
                  >
                    홈
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/board/B1" 
                    style={({ isActive }) => getActiveMenuStyle(isActive)}
                    className="nav-link"
                  >
                    공지사항
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/board/B2" 
                    style={({ isActive }) => getActiveMenuStyle(isActive)}
                    className="nav-link"
                  >
                    자유게시판
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/board/B3" 
                    style={({ isActive }) => getActiveMenuStyle(isActive)}
                    className="nav-link"
                  >
                    문의게시판
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/memo" 
                    style={({ isActive }) => getActiveMenuStyle(isActive)}
                    className="nav-link"
                  >
                    메모장
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main style={{
          maxWidth: 1024,
          width: "100%",
          margin: "30px auto 40px",
          padding: "0 20px",
          flex: 1,
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/memo" element={<MemoList />} />
            <Route path="/board/:brCd" element={<Board />} />
          </Routes>
        </main>

        {/* 푸터 */}
        <footer style={{
          backgroundColor: "#333",
          color: "#aaa",
          textAlign: "center",
          padding: "24px 20px",
          marginTop: "auto",
          width: "100%",
          borderTop: "1px solid #444"
        }}>
          <div style={{
            maxWidth: 1024,
            margin: "0 auto",
            width: "100%"
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: "14px",
              lineHeight: "1.6"
            }}>
              © 2024 메모 & 게시판 시스템
              <span style={{ 
                display: "block", 
                marginTop: "4px",
                fontSize: "12px",
                color: "#888"
              }}>
                모든 권리 보유
              </span>
            </p>
          </div>
        </footer>
      </div>

      {/* 인라인 스타일 */}
      <style jsx="true">{`
        .nav-link:hover {
          background-color: rgba(85, 85, 85, 0.3) !important;
          color: white !important;
        }
        
        @media (max-width: 768px) {
          header > div {
            flex-direction: column;
            height: auto;
            padding: 12px;
            gap: 12px;
          }
          
          nav ul {
            flex-wrap: wrap;
            justify-content: center;
            gap: 6px;
          }
          
          h1 {
            font-size: 18px;
          }
        }
        
        @media (max-width: 1024px) {
          main {
            padding: 0 16px;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;