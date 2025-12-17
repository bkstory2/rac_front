// src/pages/MemoPopup.jsx
import { useState, useEffect } from "react";
import { saveMemo } from "../api/memoApi";

export default function MemoPopup({ memo, onClose, onSaved }) {
  const [ftitle, setFtitle] = useState("");
  const [fcontent, setFcontent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  // memo prop이 변경될 때마다 폼 초기화
  useEffect(() => {
    if (memo) {
      setFtitle(memo.ftitle || "");
      setFcontent(memo.fcontent || "");
    } else {
      setFtitle("");
      setFcontent("");
    }
    setError(null);
    setSuccess(false);
    setShowCloseWarning(false);
  }, [memo]);

  // 내용이 변경되었는지 확인
  const hasUnsavedChanges = () => {
    if (!memo) {
      // 새 메모인 경우: 둘 다 비어있으면 변경사항 없음
      return ftitle.trim() !== "" || fcontent.trim() !== "";
    }
    // 기존 메모 수정인 경우
    return ftitle !== (memo.ftitle || "") || fcontent !== (memo.fcontent || "");
  };

  const handleSave = async () => {
    if (!ftitle.trim() && !fcontent.trim()) {
      setError("제목이나 내용을 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);
      
      // 전송할 데이터 확인
      const memoData = {
        fid: memo?.fid || null,
        ftitle: ftitle.trim(),
        fcontent: fcontent.trim()
      };
      
      console.log("저장 요청 데이터:", memoData);
      
      const result = await saveMemo(memoData);
      console.log("저장 응답:", result);
      
      // 응답 형식에 맞게 처리
      if (result.success === false) {
        throw new Error(result.message || "저장 실패");
      }
      
      setSuccess(true);
      
      // 성공 후 잠시 기다렸다가 닫기
      setTimeout(() => {
        onSaved();
        onClose();
      }, 500);
      
    } catch (err) {
      console.error("메모 저장 중 오류 발생:", err);
      setError("저장 중 오류가 발생했습니다: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 팝업 닫기 핸들러 (변경사항 체크)
  const handleClose = () => {
    if (hasUnsavedChanges() && !success) {
      // 저장되지 않은 변경사항이 있으면 경고 표시
      setShowCloseWarning(true);
    } else {
      onClose();
    }
  };

  // ESC 키로 팝업 닫기 - 허용
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (hasUnsavedChanges() && !success) {
          setShowCloseWarning(true);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, hasUnsavedChanges, success]);

  // Enter 키로 저장 (Ctrl+Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !isSaving) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, isSaving]);

  return (
    <>
      {/* 메인 팝업 */}
      {/* 주의: 여기에 onClick 이벤트가 없습니다! */}
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
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto"
        }}>
          <button
            onClick={handleClose}
            disabled={isSaving}
            style={{
              position: "absolute",
              top: 15,
              right: 15,
              background: "none",
              border: "none",
              fontSize: 20,
              color: "#999",
              cursor: "pointer",
              padding: 5,
              borderRadius: "50%",
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001
            }}
            title="닫기 (ESC)"
          >
            ✕
          </button>

          <h3 style={{ marginTop: 0, color: "#333", paddingRight: 30 }}>
            {memo ? "📝 메모 수정" : "📝 새 메모 작성"}
            {hasUnsavedChanges() && !success && (
              <span style={{ fontSize: 12, color: "#ff9800", marginLeft: 10 }}>
                (저장되지 않은 변경사항)
              </span>
            )}
          </h3>

          {success && (
            <div style={{
              padding: 10,
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              borderRadius: 5,
              marginBottom: 15,
              border: "1px solid #c8e6c9",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span>✓</span>
              <span>저장되었습니다! 잠시 후 닫힙니다...</span>
            </div>
          )}

          {error && (
            <div style={{
              padding: 10,
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: 5,
              marginBottom: 15,
              border: "1px solid #ffcdd2",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
              제목 {!ftitle.trim() && <span style={{ color: "#999", fontSize: 12 }}>(선택사항)</span>}
            </label>
            <input
              type="text"
              placeholder="메모 제목을 입력하세요"
              value={ftitle}
              onChange={e => setFtitle(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                border: `1px solid ${hasUnsavedChanges() ? "#ff9800" : "#ddd"}`,
                borderRadius: 5,
                fontSize: 16,
                boxSizing: "border-box",
                backgroundColor: isSaving ? "#f5f5f5" : "white",
                transition: "border-color 0.3s"
              }}
              autoFocus
              disabled={isSaving}
              maxLength={100}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
              내용 {!fcontent.trim() && <span style={{ color: "#999", fontSize: 12 }}>(선택사항)</span>}
            </label>
            <textarea
              placeholder="메모 내용을 입력하세요 (Ctrl+Enter로 저장)"
              value={fcontent}
              onChange={e => setFcontent(e.target.value)}
              style={{
                width: "100%",
                height: 200,
                padding: 10,
                border: `1px solid ${hasUnsavedChanges() ? "#ff9800" : "#ddd"}`,
                borderRadius: 5,
                fontSize: 16,
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
                backgroundColor: isSaving ? "#f5f5f5" : "white",
                transition: "border-color 0.3s"
              }}
              disabled={isSaving}
              maxLength={1000}
            />
          </div>

          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
            paddingTop: 15,
            borderTop: "1px solid #eee"
          }}>
            <div style={{ fontSize: 12, color: "#666" }}>
              <span style={{ display: "block", marginBottom: 2 }}>
                {ftitle.length}/100 자 (제목)
              </span>
              <span style={{ display: "block" }}>
                {fcontent.length}/1000 자 (내용)
              </span>
            </div>
            
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleClose}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  border: "1px solid #ddd",
                  borderRadius: 5,
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontSize: 16,
                  opacity: isSaving ? 0.6 : 1,
                  minWidth: 80
                }}
                disabled={isSaving}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || (!ftitle.trim() && !fcontent.trim())}
                style={{
                  padding: "10px 20px",
                  backgroundColor: isSaving ? "#ccc" : "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: isSaving || (!ftitle.trim() && !fcontent.trim()) ? "not-allowed" : "pointer",
                  fontSize: 16,
                  opacity: (!ftitle.trim() && !fcontent.trim()) ? 0.6 : 1,
                  minWidth: 80
                }}
              >
                {isSaving ? (
                  <>
                    <span style={{ marginRight: 5 }}>⏳</span>
                    저장 중...
                  </>
                ) : (
                  "저장"
                )}
              </button>
            </div>
          </div>

          <div style={{
            marginTop: 15,
            fontSize: 12,
            color: "#666",
            textAlign: "right"
          }}>
            <small>Ctrl+Enter: 저장, ESC: 닫기</small>
          </div>
        </div>
      </div>

      {/* 저장되지 않은 변경사항 경고 팝업 */}
      {showCloseWarning && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1002
        }}>
          <div style={{
            backgroundColor: "white",
            padding: 25,
            borderRadius: 10,
            width: "90%",
            maxWidth: 400,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
          }}>
            <h4 style={{ marginTop: 0, color: "#d32f2f", marginBottom: 15 }}>
              ⚠️ 저장되지 않은 변경사항
            </h4>
            
            <p style={{ marginBottom: 20, lineHeight: 1.5 }}>
              변경사항이 저장되지 않았습니다.<br />
              정말로 닫으시겠습니까?
            </p>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowCloseWarning(false)}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  border: "1px solid #ddd",
                  borderRadius: 5,
                  cursor: "pointer",
                  fontSize: 14
                }}
              >
                계속 작성
              </button>
              <button
                onClick={() => {
                  setShowCloseWarning(false);
                  onClose();
                }}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                  fontSize: 14
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}