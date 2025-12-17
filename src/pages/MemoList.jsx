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

 // 데이터 로드 함수에 변환 로직 추가   2222
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
        fcreated_at: item.FCREATED_AT || item.fcreated_at || item.created_at || item.createdAt
      }));
      
      console.log("변환된 데이터:", transformedData);
      setMemos(transformedData);
    } else {
      console.warn("API 응답이 배열이 아닙니다:", data);
      setMemos([]);
    }
  } catch (err) {
    console.error("메모를 불러오는 중 오류 발생:", err);
    setError("데이터를 불러오는데 실패했습니다.");
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
      await loadMemos(); // 목록 새로고침
    } catch (err) {
      console.error("메모 삭제 중 오류 발생:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ borderBottom: "2px solid #333", paddingBottom: 10 }}>
        📝 메모장
      </h2>
      
      <div style={{ marginBottom: 20 }}>
        <button 
          onClick={() => { setCurrent(null); setPopup(true); }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#cff1d1ff",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontSize: 16
          }}
        >
          + 새 메모 추가
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <p>메모를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div style={{ 
          padding: 20, 
          backgroundColor: "#ffebee", 
          borderRadius: 5,
          color: "#c7a2a2ff",
          marginBottom: 20
        }}>
          <p>{error}</p>
          <button 
            onClick={loadMemos}
            style={{ 
              padding: "5px 10px", 
              marginTop: 10,
              backgroundColor: "#ad7a7aff",
              color: "white",
              border: "none",
              borderRadius: 3
            }}
          >
            다시 시도
          </button>
        </div>
      ) : memos.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: 50,
          color: "#666"
        }}>
          <p>아직 메모가 없습니다. 새 메모를 추가해보세요!</p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {memos.map(m => (
            <li 
              key={m.fid}
              style={{
                border: "1px solid #ddd",
                borderRadius: 5,
                padding: 15,
                marginBottom: 10,
                backgroundColor: "#f9f9f9"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                    {m.ftitle || "(제목 없음)"}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: "#666",
                    whiteSpace: "pre-wrap",
                    maxHeight: 60,
                    overflow: "hidden"
                  }}>
                    {m.fcontent || "(내용 없음)"}
                  </p>
                  {m.fcreated_at && (
                    <small style={{ color: "#999", fontSize: 12 }}>
                      {new Date(m.fcreated_at).toLocaleString()}
                    </small>
                  )}
                </div>
                <div>
                  <button 
                    onClick={() => { setCurrent(m); setPopup(true); }}
                    style={{
                      padding: "8px 15px",
                      marginRight: 5,
                      backgroundColor: "#b5d1e7ff",
                      color: "white",
                      border: "none",
                      borderRadius: 3,
                      cursor: "pointer"
                    }}
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => handleDelete(m.fid)}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#f8e1e0ff",
                      color: "white",
                      border: "none",
                      borderRadius: 3,
                      cursor: "pointer"
                    }}
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