// src/pages/BoardPostPopup.jsx
import { useState, useEffect } from "react";
import { createBoardPost, updateBoardPost } from "../api/boardApi";

export default function BoardPostPopup({ brCd, post = null, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // post가 변경될 때마다 폼 초기화
  useEffect(() => {
    if (post) {
      setTitle(post.br_title || "");
      setContent(post.br_content || "");
    } else {
      setTitle("");
      setContent("");
    }
    setError("");
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력값 검증
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      if (post) {
        // 수정 모드 - br_pid가 필요함
        if (!post.br_pid) {
          throw new Error("게시글 ID가 없습니다.");
        }
        await updateBoardPost(brCd, post.br_pid, {
          br_title: title,
          br_content: content,
        });
      } else {
        // 생성 모드
        await createBoardPost(brCd, {
          br_title: title,
          br_content: content,
        });
      }

      // 성공 시 콜백 호출
      if (onSaved) onSaved();

      // 팝업 닫기
      if (onClose) onClose();
    } catch (err) {
      console.error("게시글 저장 오류:", err);
      setError(err.message || "저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  // brCd가 없는 경우 기본값 처리
  if (!brCd) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
          <div className="text-red-500">게시판 코드가 유효하지 않습니다.</div>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-gray-300 rounded"
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  const SpinnerIcon = () => (
    <svg
      className="animate-spin h-4 w-4 mr-2 text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {post ? "게시글 수정" : "새 게시글 작성"}
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={isSaving}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSaving}
              maxLength={200}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="내용을 입력하세요"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSaving}
              maxLength={4000}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCancel}
              disabled={isSaving}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] flex items-center justify-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <SpinnerIcon />
                  저장 중
                </>
              ) : post ? (
                "수정"
              ) : (
                "저장"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}