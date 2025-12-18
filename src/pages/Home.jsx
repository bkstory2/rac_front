// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  const menuItems = [
    { 
      title: "메모 관리", 
      path: "/memo", 
      desc: "개인 메모 작성 및 관리",
      icon: "📝"
    },
    { 
      title: "공지사항", 
      path: "/board/B1", 
      desc: "공지사항 게시판",
      icon: "📢"
    },
    { 
      title: "자유게시판", 
      path: "/board/B2", 
      desc: "자유로운 대화 공간",
      icon: "💬"
    },
    { 
      title: "문의게시판", 
      path: "/board/B3", 
      desc: "질문과 답변 게시판",
      icon: "❓"
    },
  ];

  return (
    <div style={{ 
      padding: "40px 0", 
      maxWidth: 1024,
      margin: "0 auto",
      width: "100%"
    }}>
      {/* 헤더 섹션 */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: "50px",
        padding: "0 20px"
      }}>
        <h1 style={{ 
          color: "#222", 
          marginBottom: "16px", 
          fontWeight: 500,
          fontSize: "28px",
          lineHeight: 1.2
        }}>
          메모 & 게시판 시스템
        </h1>
        <p style={{ 
          color: "#666", 
          fontSize: "16px", 
          lineHeight: "1.6",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          간편한 메모 작성과 다양한 게시판 기능을 제공하는 통합 관리 시스템
        </p>
      </div>
      
      {/* 메뉴 그리드 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
        gap: "20px",
        padding: "0 20px",
        marginBottom: "50px"
      }}>
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.path} 
            style={{ textDecoration: "none" }}
          >
            <div style={{
              backgroundColor: "white",
              padding: "28px 24px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              height: "100%",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
              e.currentTarget.style.borderColor = "#ccc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)";
              e.currentTarget.style.borderColor = "#e0e0e0";
            }}
            >
              {/* 아이콘 */}
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                fontSize: "24px",
                color: "#555",
                border: "1px solid #eee"
              }}>
                {item.icon}
              </div>
              
              <h3 style={{ 
                color: "#333", 
                margin: "0 0 12px 0", 
                fontWeight: 500,
                fontSize: "18px"
              }}>
                {item.title}
              </h3>
              <p style={{ 
                color: "#666", 
                fontSize: "14px", 
                lineHeight: "1.5",
                margin: "0 0 20px 0",
                flex: 1
              }}>
                {item.desc}
              </p>
              
              <div style={{
                color: "#555",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#f8f8f8",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #e0e0e0"
              }}>
                <span>이동하기</span>
                <span style={{ fontSize: "12px" }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 하단 정보 섹션 */}
      <div style={{
        marginTop: "50px",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
      }}>
        <div style={{
          maxWidth: "700px",
          margin: "0 auto",
          textAlign: "center"
        }}>
          <h3 style={{ 
            color: "#333", 
            marginBottom: "16px", 
            fontSize: "18px",
            fontWeight: "500"
          }}>
            시스템 안내
          </h3>
          <p style={{ 
            color: "#666", 
            fontSize: "14px", 
            lineHeight: "1.6",
            marginBottom: "20px"
          }}>
            이 시스템은 메모 작성, 게시판 관리 등 다양한 기능을 무채색 디자인으로 제공합니다.111111111111
            깔끔하고 직관적인 인터페이스로 편리하게 이용할 수 있습니다.
          </p>
          
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px"
          }}>
            <button 
              className="btn-secondary"
              style={{
                padding: "8px 16px",
                fontSize: "14px"
              }}
              onClick={() => window.location.href = '/memo'}
            >
              메모장 시작하기
            </button>
            <button 
              className="btn-secondary"
              style={{
                padding: "8px 16px",
                fontSize: "14px"
              }}
              onClick={() => window.location.href = '/board/B1'}
            >
              게시판 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}