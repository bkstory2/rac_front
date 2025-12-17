import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import MemoList from "./pages/MemoList";
import Board from "./pages/Board";
import Home from "./pages/Home";

function App() {
  // NavLink 스타일 함수를 컴포넌트 내부로 이동
  const getActiveMenuStyle = (isActive) => ({
    color: "white",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.3s",
    backgroundColor: isActive ? "#4CAF50" : "transparent",
    fontWeight: isActive ? "bold" : "normal",
    display: "inline-block",
  });

  // hover 스타일은 inline style로 처리할 수 없으므로 CSS 파일이나 CSS-in-JS로 처리해야 합니다.
  // 여기서는 간단히 style 객체에 hover 효과를 제거하고 대신 hover 클래스를 사용하도록 수정합니다.
  
  return (
    <Router>
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
        {/* 헤더 메뉴 */}
        <header style={{
          backgroundColor: "#333",
          color: "white",
          padding: "15px 20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}>
            <h1 style={{ margin: 0, fontSize: 24 }}>
              <NavLink to="/" style={{ color: "white", textDecoration: "none" }}>
                메모 & 게시판 시스템
              </NavLink>
            </h1>
            
            <nav>
              <ul style={{
                display: "flex",
                listStyle: "none",
                margin: 0,
                padding: 0,
                gap: 10,
                flexWrap: "wrap",
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
                    메모
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main style={{
          maxWidth: 1200,
          margin: "20px auto",
          padding: "0 20px",
          flex: 1,
          width: "100%",
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
          color: "#999",
          textAlign: "center",
          padding: "20px",
          marginTop: "40px",
        }}>
          <p>© 2024 메모 & 게시판 시스템. All rights reserved.</p>
        </footer>
      </div>

      {/* 인라인 스타일 대신 간단한 CSS 추가 */}
      <style jsx="true">{`
        .nav-link:hover {
          background-color: #4CAF50 !important;
        }
        
        @media (max-width: 768px) {
          header > div {
            flex-direction: column;
            gap: 15px;
          }
          
          nav ul {
            justify-content: center;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;