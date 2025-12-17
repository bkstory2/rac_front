// src/pages/BoardPostPopup.jsx
import { useState, useEffect } from "react";
import { createBoardPost, updateBoardPost } from "../api/boardApi";

export default function BoardPostPopup({ brCd, post = null, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title || post.postTitle || "");
      setContent(post.content || post.postContent || "");
    } else {
      setTitle("");
      setContent("");
    }
    setError("");
  }, [post]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const postData = {
        brCd,
        title: title.trim(),
        content: content.trim(),
        author: "작성자" // 실제로는 로그인 정보에서 가져와야 함
      };

      if (post) {
        // 수정
        await updateBoardPost(post.id || post.postId, postData);
      } else {
        // 새 글 작성
        await createBoardPost(postData);
      }

      onSaved();
    } catch (err) {
      console.error("게시글 저장 오류:", err);
      setError(`저장 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h3 style={{ marginTop: 0, color: "#333", borderBottom: "1px solid #eee", paddingBottom: 10 }}>
          {post ? "✏️ 게시글 수정" : "✏️ 새 글 작성"}
          <small style={{ display: "block", fontSize: 12, color: "#666", fontWeight: "normal" }}>
            게시판: {brCd}
          </small>
        </h3>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 15 }}>
          <label style={labelStyle}>제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>내용</label>
          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ ...inputStyle, height: 200, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onClose}
            disabled={isSaving}
            style={cancelButtonStyle}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            style={{
              ...submitButtonStyle,
              backgroundColor: isSaving ? "#ccc" : "#4CAF50"
            }}
          >
            {isSaving ? "저장 중..." : (post ? "수정" : "등록")}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
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
};

const popupStyle = {
  backgroundColor: "white",
  padding: 30,
  borderRadius: 10,
  width: "90%",
  maxWidth: 700,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
};

const labelStyle = {
  display: "block",
  marginBottom: 5,
  fontWeight: "bold",
  color: "#555"
};

const inputStyle = {
  width: "100%",
  padding: 12,
  border: "1px solid #ddd",
  borderRadius: 5,
  fontSize: 16,
  boxSizing: "border-box"
};

const errorStyle = {
  padding: 12,
  backgroundColor: "#ffebee",
  color: "#c62828",
  borderRadius: 5,
  marginBottom: 15,
  fontSize: 14
};

const cancelButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#f5f5f5",
  color: "#333",
  border: "1px solid #ddd",
  borderRadius: 5,
  cursor: "pointer",
  fontSize: 16
};

const submitButtonStyle = {
  padding: "10px 25px",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
  fontSize: 16,
  fontWeight: "bold"
};