import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import MemoList from "./pages/MemoList";
import Board from "./pages/Board";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        {/* 헤더 메뉴 */}
        <header style={{
          backgroundColor: "#333",
          color: "white",
          padding: "15px 20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
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
                gap: 20
              }}>
                <li><NavLink to="/" style={({ isActive }) => getActiveMenuStyle(isActive)}>홈</NavLink></li>
                <li><NavLink to="/board/B1" style={({ isActive }) => getActiveMenuStyle(isActive)}>게시판 1</NavLink></li>
                <li><NavLink to="/board/B2" style={({ isActive }) => getActiveMenuStyle(isActive)}>게시판 2</NavLink></li>
                <li><NavLink to="/board/B3" style={({ isActive }) => getActiveMenuStyle(isActive)}>게시판 3</NavLink></li>
                <li><NavLink to="/memo" style={({ isActive }) => getActiveMenuStyle(isActive)}>메모</NavLink></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main style={{
          maxWidth: 1200,
          margin: "20px auto",
          padding: "0 20px"
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
          marginTop: "40px"
        }}>
          <p>© 2024 메모 & 게시판 시스템. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

// 메뉴 활성화 스타일 함수
const getActiveMenuStyle = (isActive) => ({
  color: "white",
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "4px",
  transition: "background-color 0.3s",
  backgroundColor: isActive ? "#4CAF50" : "transparent",
  fontWeight: isActive ? "bold" : "normal",
  ":hover": {
    backgroundColor: "#4CAF50"
  }
});

export default App;