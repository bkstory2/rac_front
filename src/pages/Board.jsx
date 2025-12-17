// src/pages/Board.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBoardPosts, getBoardInfo } from "../api/boardApi";

export default function Board() {
  const { brCd } = useParams();
  
  const [posts, setPosts] = useState([]);
  const [boardInfo, setBoardInfo] = useState({ brNm: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 게시판 데이터 로드
  const loadBoardData = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // 게시판 정보 조회
      const infoData = await getBoardInfo(brCd);
      setBoardInfo(infoData);
      
      // 게시글 목록 조회
      const postsData = await getBoardPosts(brCd, page);
      
      console.log("Board 컴포넌트에서 받은 데이터:", postsData);
      
      // API 응답 처리
      if (postsData.success === false) {
        // API 호출 실패
        setPosts([]);
        setError(postsData.message || "게시글을 불러오는데 실패했습니다.");
      } else if (postsData.content && Array.isArray(postsData.content)) {
        // 게시글이 있는 경우
        if (postsData.content.length > 0) {
          setPosts(postsData.content);
          setTotalPages(postsData.totalPages || 1);
          setCurrentPage(postsData.currentPage || page);
        } else {
          // 게시글이 없는 경우
          setPosts([]);
        }
      } else if (Array.isArray(postsData) && postsData.length > 0) {
        // 배열로 직접 반환된 경우
        setPosts(postsData);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        // 게시글이 없는 경우
        setPosts([]);
      }
      
    } catch (err) {
      console.error("게시판 데이터 로드 오류:", err);
      setError("게시판 데이터를 불러오는데 실패했습니다.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (brCd) {
      loadBoardData(1);
    }
  }, [brCd]);

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 로직 구현 (API 호출 필요)
    console.log("검색어:", searchKeyword);
    alert("검색 기능은 API와 연동 필요");
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadBoardData(page);
    }
  };

  // brCd에 따른 게시판 이름
  const getBoardName = () => {
    return boardInfo.brNm || {
      'B1': '게시판 1',
      'B2': '게시판 2', 
      'B3': '게시판 3'
    }[brCd] || '게시판';
  };

  if (!brCd) {
    return (
      <div style={{ textAlign: "center", padding: 50, color: "#666" }}>
        <p>게시판 코드가 지정되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div>
      {/* 게시판 헤더 */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: 15,
          marginBottom: 20
        }}>
          <h2 style={{ 
            color: "#444",
            margin: 0,
            fontWeight: 400,
            fontSize: "24px"
          }}>
            {getBoardName()}
          </h2>
          <div style={{ 
            fontSize: "13px", 
            color: "#888",
            backgroundColor: "#f5f5f5",
            padding: "4px 10px",
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}>
            코드: {brCd}
          </div>
        </div>
        
        {boardInfo.description && (
          <div style={{
            backgroundColor: "#f9f9f9",
            padding: "15px",
            borderRadius: "6px",
            marginTop: "10px",
            borderLeft: "3px solid #ccc"
          }}>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              {boardInfo.description}
            </p>
          </div>
        )}
      </div>

      {/* 검색 및 글쓰기 */}
      <div style={{ 
        marginBottom: 25, 
        display: "flex", 
        gap: 10,
        flexWrap: "wrap"
      }}>
        <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", gap: 10 }}>
          <input 
            type="text" 
            placeholder="제목 또는 내용으로 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 15px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: "#fff",
              color: "#333"
            }}
          />
          <button 
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#f5f5f5",
              color: "#666",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9e9e9"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
          >
            검색
          </button>
        </form>
        
        <button 
          onClick={() => alert("글쓰기 기능은 API 연동 필요")}
          style={{
            padding: "10px 25px",
            backgroundColor: "#f5f5f5",
            color: "#666",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9e9e9"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
        >
          새 글 작성
        </button>
      </div>

      {/* 로딩 상태 */}
      {loading ? (
        <div style={{ 
          textAlign: "center", 
          padding: 50,
          color: "#888",
          backgroundColor: "#fff",
          borderRadius: "6px",
          border: "1px solid #eee"
        }}>
          <p>게시글을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div style={{ 
          padding: 30, 
          backgroundColor: "#fff", 
          borderRadius: "6px",
          color: "#777",
          marginBottom: 20,
          textAlign: "center",
          border: "1px solid #eee"
        }}>
          <p style={{ marginBottom: 15 }}>{error}</p>
          <button 
            onClick={() => loadBoardData(1)}
            style={{ 
              padding: "8px 20px", 
              backgroundColor: "#f5f5f5",
              color: "#666",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            다시 시도
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: 50,
          color: "#888",
          backgroundColor: "#fff",
          borderRadius: "6px",
          border: "1px solid #eee",
          marginTop: 20
        }}>
          <div style={{ fontSize: "40px", marginBottom: "15px", color: "#ccc" }}>📄</div>
          <p style={{ marginBottom: "10px", fontSize: "16px" }}>아직 게시글이 없습니다</p>
          <p style={{ color: "#999", fontSize: "14px", marginBottom: "20px" }}>
            첫 번째 게시글을 작성해보세요
          </p>
          <button 
            onClick={() => alert("글쓰기 기능은 API 연동 필요")}
            style={{
              padding: "8px 20px",
              backgroundColor: "#f5f5f5",
              color: "#666",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            첫 글 작성하기
          </button>
        </div>
      ) : (
        <>
          {/* 게시글 목록 테이블 */}
          <div style={{ 
            backgroundColor: "#fff", 
            borderRadius: "6px", 
            overflow: "hidden",
            border: "1px solid #eee",
            marginBottom: 30
          }}>
            {/* 테이블 헤더 */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 100px 120px 80px",
              backgroundColor: "#f9f9f9",
              color: "#666",
              padding: "12px 20px",
              fontWeight: 500,
              fontSize: "14px",
              borderBottom: "1px solid #eee"
            }}>
              <div style={{ textAlign: "center" }}>번호</div>
              <div>제목</div>
              <div style={{ textAlign: "center" }}>작성자</div>
              <div style={{ textAlign: "center" }}>작성일</div>
              <div style={{ textAlign: "center" }}>조회</div>
            </div>
            
            {/* 게시글 목록 */}
            {posts.map((post, index) => {
              const postNumber = (currentPage - 1) * 10 + (index + 1);
              
              return (
                <div 
                  key={post.id || post.postId || index}
                  onClick={() => alert("게시글 상세 보기는 API 연동 필요")}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 100px 120px 80px",
                    padding: "15px 20px",
                    borderBottom: "1px solid #f5f5f5",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    alignItems: "center",
                    ":hover": {
                      backgroundColor: "#fafafa"
                    }
                  }}
                >
                  <div style={{ textAlign: "center", color: "#777" }}>{postNumber}</div>
                  <div style={{ 
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#444"
                  }}>
                    {post.title || post.postTitle || "제목 없음"}
                    {(post.commentCount && post.commentCount > 0) && (
                      <span style={{ 
                        color: "#888",
                        marginLeft: 5,
                        fontSize: "12px"
                      }}>
                        [{post.commentCount}]
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
                    {post.author || post.createdBy || "익명"}
                  </div>
                  <div style={{ textAlign: "center", color: "#777", fontSize: "13px" }}>
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : (post.date || "-")}
                  </div>
                  <div style={{ textAlign: "center", color: "#777", fontSize: "13px" }}>
                    {post.viewCount || post.views || 0}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center",
              gap: 5,
              marginTop: 30
            }}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 15px",
                  backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
                  color: currentPage === 1 ? "#bbb" : "#666",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "14px"
                }}
              >
                이전
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={index}
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      padding: "8px 12px",
                      minWidth: "40px",
                      backgroundColor: currentPage === pageNum ? "#f0f0f0" : "#fff",
                      color: currentPage === pageNum ? "#333" : "#666",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 15px",
                  backgroundColor: currentPage === totalPages ? "#f5f5f5" : "#fff",
                  color: currentPage === totalPages ? "#bbb" : "#666",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontSize: "14px"
                }}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}