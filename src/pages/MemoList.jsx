// src/pages/MemoList.jsx
import { useEffect, useState, useCallback } from "react";
import { getMemos, deleteMemo } from "../api/memoApi";
import MemoPopup from "./MemoPopup";

export default function MemoList() {
  const [memos, setMemos] = useState([]);
  const [popup, setPopup] = useState(false);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);

  // 데이터 로드 함수
  const loadMemos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMemos();
      
      console.log("원본 API 응답 데이터:", data);
      
      if (data && Array.isArray(data)) {
        // 데이터 변환 (대문자 필드명에 맞춤)
        const transformedData = data.map(item => ({
          fid: item.FID !== undefined ? Number(item.FID) : (item.fid || item.id || 0),
          ftitle: item.FTITLE !== undefined ? String(item.FTITLE) : (item.ftitle || item.title || ""),
          fcontent: item.FCONTENT !== undefined ? String(item.FCONTENT) : (item.fcontent || item.content || ""),
          fcreated_at: item.FCREATED_AT || item.fcreated_at || item.created_at || item.createdAt || new Date().toISOString()
        }));
        
        console.log("변환된 데이터:", transformedData);
        setMemos(transformedData);
        setOfflineMode(false);
      } else {
        console.warn("API 응답이 배열이 아닙니다:", data);
        setMemos([]);
      }
    } catch (err) {
      console.error("메모를 불러오는 중 오류 발생:", err);
      setError("데이터를 불러오는데 실패했습니다. 오프라인 모드로 전환합니다.");
      setOfflineMode(true);
      
      // 오프라인일 때 로컬 스토리지에서 메모 불러오기
      try {
        const localMemos = localStorage.getItem('localMemos');
        if (localMemos) {
          setMemos(JSON.parse(localMemos));
        }
      } catch (localErr) {
        console.error("로컬 스토리지 에러:", localErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadMemos();
  }, [loadMemos]);

  // 메모 삭제 핸들러
  const handleDelete = async (fid) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      await deleteMemo(fid);
      
      // 오프라인 모드일 경우 로컬 스토리지도 업데이트
      if (offlineMode) {
        const updatedMemos = memos.filter(m => m.fid !== fid);
        setMemos(updatedMemos);
        localStorage.setItem('localMemos', JSON.stringify(updatedMemos));
      }
      
      await loadMemos(); // 목록 새로고침
    } catch (err) {
      console.error("메모 삭제 중 오류 발생:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleAddNew = () => {
    setCurrent(null);
    setPopup(true);
  };

  const handleEdit = (memo) => {
    setCurrent(memo);
    setPopup(true);
  };

  return (
    <div style={{ 
      padding: 20, 
      maxWidth: 800, 
      margin: "0 auto",
      minHeight: "calc(100vh - 200px)"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 20,
        flexWrap: "wrap",
        gap: 10
      }}>
        <h2 style={{ 
          borderBottom: "2px solid #4CAF50", 
          paddingBottom: 10,
          margin: 0,
          color: "#333"
        }}>
          📝 메모장 {offlineMode && <span style={{ fontSize: 12, color: "#e9ceccff" }}>(오프라인 모드)</span>}
        </h2>
        
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {offlineMode && (
            <div style={{ 
              padding: "5px 10px", 
              backgroundColor: "#fff3cd", 
              color: "#856404",
              borderRadius: 5,
              fontSize: 12,
              border: "1px solid #ffeaa7"
            }}>
              🔌 백엔드 연결 실패
            </div>
          )}
          <button 
            onClick={handleAddNew}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#d1e9d2ff"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#98b699ff"}
          >
            + 새 메모 추가
          </button>
        </div>
      </div>

      {offlineMode && (
        <div style={{ 
          padding: 15, 
          backgroundColor: "#fff8e1", 
          borderRadius: 5,
          color: "#dbd2c7ff",
          marginBottom: 20,
          border: "1px solid #ffecb3"
        }}>
          <p style={{ margin: 0 }}>
            ⚠️ 백엔드 서버에 연결할 수 없습니다. Mock 데이터를 표시합니다.
            실제 저장/수정/삭제는 서버 연결 후에 가능합니다.
          </p>
          <button 
            onClick={loadMemos}
            style={{ 
              padding: "5px 15px", 
              marginTop: 10,
              backgroundColor: "#ccc0afff",
              color: "white",
              border: "none",
              borderRadius: 3,
              cursor: "pointer"
            }}
          >
            다시 연결 시도
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ 
          textAlign: "center", 
          padding: 50,
          color: "#666"
        }}>
          <div style={{ 
            display: "inline-block",
            width: 40,
            height: 40,
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #b3d3b4ff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: 10
          }}></div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
          <p>메모를 불러오는 중...</p>
        </div>
      ) : error && !offlineMode ? (
        <div style={{ 
          padding: 30, 
          backgroundColor: "#ffebee", 
          borderRadius: 5,
          color: "#b39696ff",
          marginBottom: 20,
          textAlign: "center"
        }}>
          <p style={{ fontSize: 18, marginBottom: 10 }}>❌ 오류 발생</p>
          <p>{error}</p>
          <button 
            onClick={loadMemos}
            style={{ 
              padding: "10px 20px", 
              marginTop: 10,
              backgroundColor: "#e9d6d5ff",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              fontSize: 16
            }}
          >
            다시 시도
          </button>
        </div>
      ) : memos.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: 50,
          color: "#666",
          backgroundColor: "#f9f9f9",
          borderRadius: 10,
          border: "2px dashed #ddd"
        }}>
          <p style={{ fontSize: 18, marginBottom: 10 }}>📝</p>
          <p style={{ fontSize: 16 }}>아직 메모가 없습니다.</p>
          <p>새 메모를 추가해보세요!</p>
          <button 
            onClick={handleAddNew}
            style={{ 
              padding: "10px 20px", 
              marginTop: 15,
              backgroundColor: "#8dac8eff",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer"
            }}
          >
            첫 번째 메모 작성하기
          </button>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {memos.map(m => (
            <li 
              key={m.fid}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                padding: 20,
                marginBottom: 15,
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 15 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: "0 0 10px 0", 
                    color: "#333",
                    fontSize: 18,
                    fontWeight: "bold"
                  }}>
                    {m.ftitle || "(제목 없음)"}
                  </h3>
                  <p style={{ 
                    margin: "0 0 10px 0", 
                    color: "#666",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6
                  }}>
                    {m.fcontent && m.fcontent.length > 100 
                      ? m.fcontent.substring(0, 100) + "..." 
                      : m.fcontent || "(내용 없음)"}
                  </p>
                  {m.fcreated_at && (
                    <small style={{ 
                      color: "#999", 
                      fontSize: 12,
                      display: "block",
                      marginTop: 10
                    }}>
                      📅 {new Date(m.fcreated_at).toLocaleString('ko-KR')}
                    </small>
                  )}
                </div>
                <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                  <button 
                    onClick={() => handleEdit(m)}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#bdc9d3ff",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 14,
                      transition: "background-color 0.2s"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#9ca7b3ff"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#bbceddff"}
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => handleDelete(m.fid)}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 14,
                      transition: "background-color 0.2s"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#837272ff"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#d1afadff"}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {popup && (
        <MemoPopup
          memo={current}
          onClose={() => setPopup(false)}
          onSaved={loadMemos}
        />
      )}
    </div>
  );
}