// src/pages/Home.jsx - 더 심플한 버전
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "30px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ 
        color: "#444", 
        marginBottom: "40px", 
        fontWeight: 300,
        fontSize: "28px",
        borderBottom: "1px solid #eee",
        paddingBottom: "15px"
      }}>
        메모 & 게시판 시스템
      </h1>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "25px",
        marginTop: "30px"
      }}>
        {[
          { title: "메모 관리", path: "/memo", desc: "메모 작성 및 관리" },
          { title: "게시판 1", path: "/board/B1", desc: "일반 게시판" },
          { title: "게시판 2", path: "/board/B2", desc: "자료 게시판" },
          { title: "게시판 3", path: "/board/B3", desc: "문의 게시판" },
        ].map((item, index) => (
          <Link 
            key={index} 
            to={item.path} 
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "6px",
              border: "1px solid #e0e0e0",
              height: "100%",
              transition: "border-color 0.2s",
              ":hover": {
                borderColor: "#ccc"
              }
            }}>
              <div style={{
                fontSize: "24px",
                color: "#999",
                marginBottom: "15px"
              }}>
                {item.path === "/memo" ? "📝" : "📋"}
              </div>
              <h3 style={{ 
                color: "#555", 
                margin: "0 0 10px 0", 
                fontWeight: 400,
                fontSize: "18px"
              }}>
                {item.title}
              </h3>
              <p style={{ 
                color: "#888", 
                fontSize: "14px", 
                lineHeight: "1.5",
                margin: 0
              }}>
                {item.desc}
              </p>
              <div style={{
                marginTop: "20px",
                color: "#aaa",
                fontSize: "13px"
              }}>
                클릭하여 이동 →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{
        marginTop: "50px",
        padding: "25px",
        backgroundColor: "#f9f9f9",
        borderRadius: "6px",
        border: "1px solid #eaeaea"
      }}>
        <p style={{ 
          color: "#777", 
          fontSize: "15px", 
          lineHeight: "1.6",
          margin: 0,
          textAlign: "center"
        }}>
          필요한 기능을 선택하여 이용해주세요. 각 페이지는 최소한의 디자인으로 구성되어 있습니다.
        </p>
      </div>
    </div>
  );
}