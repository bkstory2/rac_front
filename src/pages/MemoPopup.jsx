// src/pages/MemoPopup.jsx
import { useState, useEffect } from "react";
import { saveMemo } from "../api/memoApi";

export default function MemoPopup({ memo, onClose, onSaved }) {
  const [ftitle, setFtitle] = useState("");
  const [fcontent, setFcontent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // memo prop이 변경될 때마다 폼 초기화
  useEffect(() => {
    setFtitle(memo?.ftitle || "");
    setFcontent(memo?.fcontent || "");
    setError(null);
  }, [memo]);

  const handleSave = async () => {
    if (!ftitle.trim() && !fcontent.trim()) {
      setError("제목이나 내용을 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      // 전송할 데이터 확인
      const memoData = {
        fid: memo?.fid || null, // null로 보내거나 아예 필드를 제외
        ftitle: ftitle.trim(),
        fcontent: fcontent.trim()
      };
      
      console.log("저장 요청 데이터:", memoData);
      console.log("현재 메모:", memo);
      console.log("fid 값:", memo?.fid);
      
      const result = await saveMemo(memoData);
      console.log("저장 응답:", result);
      
      if (result.success === false) {
        throw new Error(result.message || "저장 실패");
      }
      
      onSaved();
      onClose();
    } catch (err) {
      console.error("메모 저장 중 오류 발생:", err);
      setError("저장 중 오류가 발생했습니다: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ESC 키로 팝업 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: 30,
        borderRadius: 10,
        width: "90%",
        maxWidth: 500,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
      }}>
        <h3 style={{ marginTop: 0, color: "#333" }}>
          {memo ? "📝 메모 수정" : "📝 새 메모 작성"}
        </h3>

        {error && (
          <div style={{
            padding: 10,
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: 5,
            marginBottom: 15
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
            제목
          </label>
          <input
            type="text"
            placeholder="메모 제목을 입력하세요"
            value={ftitle}
            onChange={e => setFtitle(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 5,
              fontSize: 16,
              boxSizing: "border-box"
            }}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
            내용
          </label>
          <textarea
            placeholder="메모 내용을 입력하세요"
            value={fcontent}
            onChange={e => setFcontent(e.target.value)}
            style={{
              width: "100%",
              height: 150,
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 5,
              fontSize: 16,
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: "inherit"
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f5f5f5",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: 5,
              cursor: "pointer",
              fontSize: 16
            }}
            disabled={isSaving}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: "10px 20px",
              backgroundColor: isSaving ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: isSaving ? "not-allowed" : "pointer",
              fontSize: 16
            }}
          >
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}