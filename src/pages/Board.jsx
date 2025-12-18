// src/pages/Board.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    getBoardPosts, 
    getBoardInfo, 
    getBoardDetail, 
    deleteBoardPost,
    searchBoardPosts,
    createBoardPost,
    updateBoardPost 
} from "../api/boardApi";

export default function Board() {
    const { brCd } = useParams();
    const navigate = useNavigate();
    
    const [posts, setPosts] = useState([]);
    const [boardInfo, setBoardInfo] = useState({ brNm: "", totalPosts: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [showPostForm, setShowPostForm] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [detailView, setDetailView] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "", author: "사용자" });

    // ==================== 데이터 로드 함수 ====================
    const loadBoardData = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            // 게시판 정보 조회
            const infoData = await getBoardInfo(brCd);
            setBoardInfo(infoData);
            
            // 게시글 목록 조회
            const postsData = await getBoardPosts(brCd, page);
            
            if (postsData.success === false) {
                setPosts([]);
                setError(postsData.message);
            } else if (postsData.content && Array.isArray(postsData.content)) {
                setPosts(postsData.content);
                setTotalPages(postsData.totalPages || 1);
                setCurrentPage(postsData.currentPage || page);
            } else {
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

    // ==================== 검색 핸들러 ====================
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchKeyword.trim()) {
            loadBoardData(1);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            setIsSearching(true);
            
            const searchData = await searchBoardPosts(brCd, searchKeyword, 1);
            
            if (searchData.success === false) {
                setPosts([]);
                setError(searchData.message);
            } else if (searchData.content && Array.isArray(searchData.content)) {
                setPosts(searchData.content);
                setTotalPages(searchData.totalPages || 1);
                setCurrentPage(searchData.currentPage || 1);
            } else {
                setPosts([]);
            }
            
        } catch (err) {
            console.error("검색 오류:", err);
            setError("검색 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // ==================== 상세 보기 ====================
    const handleViewDetail = async (seq) => {
        try {
            setLoading(true);
            const detail = await getBoardDetail(seq);
            setDetailView(detail);
        } catch (err) {
            console.error("상세 조회 오류:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==================== 글쓰기/수정 폼 핸들러 ====================
    const handleNewPost = () => {
        setSelectedPost(null);
        setFormData({ title: "", content: "", author: "사용자" });
        setShowPostForm(true);
    };

    const handleEditPost = (post) => {
        setSelectedPost(post);
        setFormData({ 
            title: post.br_title || "", 
            content: post.br_content || "", 
            author: post.br_reg_id || "사용자" 
        });
        setShowPostForm(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }
        
        try {
            setLoading(true);
            
            const postData = {
                brCd,
                title: formData.title,
                content: formData.content,
                author: formData.author
            };
            
            let result;
            if (selectedPost) {
                // 수정
                result = await updateBoardPost(selectedPost.br_seq, postData);
            } else {
                // 새 글
                result = await createBoardPost(postData);
            }
            
            if (result.success) {
                alert(selectedPost ? "수정되었습니다." : "등록되었습니다.");
                setShowPostForm(false);
                setSelectedPost(null);
                loadBoardData(1);
                
                if (selectedPost && detailView && detailView.br_seq === selectedPost.br_seq) {
                    // 현재 보고 있는 글이 수정된 경우 상세보기 갱신
                    const updatedDetail = await getBoardDetail(selectedPost.br_seq);
                    setDetailView(updatedDetail);
                }
            } else {
                alert(result.message || "처리 중 오류가 발생했습니다.");
            }
            
        } catch (err) {
            console.error("글 저장 오류:", err);
            alert("저장 중 오류가 발생했습니다: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==================== 삭제 핸들러 ====================
    const handleDeletePost = async (seq, title) => {
        if (!window.confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) return;
        
        try {
            const result = await deleteBoardPost(seq);
            if (result.success) {
                alert("게시글이 삭제되었습니다.");
                if (detailView && detailView.br_seq === seq) {
                    setDetailView(null);
                }
                loadBoardData(currentPage);
            } else {
                alert(result.message || "삭제 실패");
            }
        } catch (err) {
            console.error("삭제 오류:", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // ==================== 네비게이션 핸들러 ====================
    const handleBackToList = () => {
        setDetailView(null);
    };

    const handleGoHome = () => {
        navigate("/");
    };

    const handleChangeBoard = (newBrCd) => {
        navigate(`/board/${newBrCd}`);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            loadBoardData(page);
        }
    };

    // ==================== 초기 로드 ====================
    useEffect(() => {
        if (brCd) {
            loadBoardData(1);
        }
    }, [brCd]);

    // ==================== 컴포넌트 렌더링 ====================
    if (!brCd) {
        return (
            <div style={{ textAlign: "center", padding: 50 }}>
                <p>게시판 코드가 지정되지 않았습니다.</p>
                <button onClick={handleGoHome} style={{ marginTop: 20, padding: "10px 20px" }}>
                    홈으로 이동
                </button>
            </div>
        );
    }

    // 상세보기 화면
    if (detailView) {
        return (
            <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
                {/* 네비게이션 바 */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <button 
                        onClick={handleBackToList}
                        style={{ 
                            padding: "8px 15px", 
                            backgroundColor: "#6c757d",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer"
                        }}
                    >
                        ← 목록으로
                    </button>
                    <div>
                        <button 
                            onClick={handleGoHome}
                            style={{ 
                                padding: "8px 15px", 
                                marginLeft: 10,
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #dee2e6",
                                borderRadius: 4,
                                cursor: "pointer"
                            }}
                        >
                            홈
                        </button>
                    </div>
                </div>
                
                {/* 게시글 상세 */}
                <div style={{ backgroundColor: "#fff", padding: 30, borderRadius: 8, border: "1px solid #dee2e6", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <h2 style={{ marginTop: 0, borderBottom: "2px solid #bbccdfff", paddingBottom: 10, color: "#343a40" }}>
                        {detailView.br_title}
                    </h2>
                    
                    <div style={{ display: "flex", gap: 20, marginBottom: 20, color: "#6c757d", fontSize: 14 }}>
                        <div>작성자: <strong style={{ color: "#495057" }}>{detailView.br_reg_id}</strong></div>
                        <div>작성일: <strong style={{ color: "#495057" }}>{new Date(detailView.br_reg_dt).toLocaleString()}</strong></div>
                        <div>게시판: <strong style={{ color: "#495057" }}>{brCd} ({boardInfo.brNm})</strong></div>
                    </div>
                    
                    <div style={{ 
                        minHeight: 300, 
                        padding: 20, 
                        border: "1px solid #e9ecef", 
                        borderRadius: 6,
                        backgroundColor: "#f8f9fa",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.6,
                        color: "#212529"
                    }}>
                        {detailView.br_content}
                    </div>
                    
                    {/* 파일 첨부 표시 */}
                    {detailView.br_file && (
                        <div style={{ marginTop: 20, padding: 10, backgroundColor: "#e7f3ff", borderRadius: 4 }}>
                            <strong>첨부파일:</strong> {detailView.br_file}
                        </div>
                    )}
                    
                    <div style={{ display: "flex", gap: 10, marginTop: 30 }}>
                        <button 
                            onClick={() => handleEditPost(detailView)}
                            style={{ 
                                padding: "10px 20px", 
                                backgroundColor: "#c3cfddff",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            수정
                        </button>
                        <button 
                            onClick={() => handleDeletePost(detailView.br_seq, detailView.br_title)}
                            style={{ 
                                padding: "10px 20px", 
                                backgroundColor: "#cca9adff",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            삭제
                        </button>
                        <button 
                            onClick={handleBackToList}
                            style={{ 
                                padding: "10px 20px", 
                                backgroundColor: "#6c757d",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer"
                            }}
                        >
                            목록으로
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 글쓰기/수정 폼
    if (showPostForm) {
        return (
            <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <h2 style={{ margin: 0, color: "#343a40" }}>
                        {selectedPost ? "✏️ 게시글 수정" : "📝 새 글 작성"}
                    </h2>
                    <button 
                        onClick={() => setShowPostForm(false)}
                        style={{ 
                            padding: "8px 15px", 
                            backgroundColor: "#6c757d",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer"
                        }}
                    >
                        취소
                    </button>
                </div>
                
                <form onSubmit={handleSubmitPost} style={{ backgroundColor: "#fff", padding: 30, borderRadius: 8, border: "1px solid #dee2e6" }}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#495057" }}>
                            제목 *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            placeholder="제목을 입력하세요"
                            required
                            style={{
                                width: "100%",
                                padding: "12px 15px",
                                border: "1px solid #ced4da",
                                borderRadius: 4,
                                fontSize: 16,
                                boxSizing: "border-box"
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#495057" }}>
                            작성자
                        </label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleFormChange}
                            placeholder="작성자 이름"
                            style={{
                                width: "100%",
                                padding: "12px 15px",
                                border: "1px solid #ced4da",
                                borderRadius: 4,
                                fontSize: 16,
                                boxSizing: "border-box"
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: 30 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#495057" }}>
                            내용 *
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleFormChange}
                            placeholder="내용을 입력하세요"
                            required
                            rows="10"
                            style={{
                                width: "100%",
                                padding: "12px 15px",
                                border: "1px solid #ced4da",
                                borderRadius: 4,
                                fontSize: 16,
                                resize: "vertical",
                                boxSizing: "border-box",
                                lineHeight: 1.5
                            }}
                        />
                    </div>
                    
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <button 
                            type="button"
                            onClick={() => setShowPostForm(false)}
                            disabled={loading}
                            style={{ 
                                padding: "12px 25px", 
                                backgroundColor: "#6c757d",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontSize: 16
                            }}
                        >
                            취소
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            style={{ 
                                padding: "12px 25px", 
                                backgroundColor: loading ? "#ccc" : "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}
                        >
                            {loading ? "처리 중..." : (selectedPost ? "수정하기" : "등록하기")}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // 목록 화면
    return (
        <div style={{ padding: "20px" }}>
            {/* 상단 네비게이션 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
                <div>
                    <button 
                        onClick={handleGoHome}
                        style={{ 
                            padding: "8px 15px", 
                            marginRight: 10,
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #dee2e6",
                            borderRadius: 4,
                            cursor: "pointer"
                        }}
                    >
                        ← 홈
                    </button>
                    <span style={{ fontSize: "24px", fontWeight: "bold", color: "#343a40" }}>
                        {boardInfo.brNm || `게시판 ${brCd}`}
                    </span>
                </div>
                
                {/* 게시판 선택 메뉴 */}
                <div style={{ display: "flex", gap: 5 }}>
                    {['B1', 'B2', 'B3'].map(code => (
                        <button
                            key={code}
                            onClick={() => handleChangeBoard(code)}
                            style={{
                                padding: "8px 15px",
                                backgroundColor: brCd === code ? "#ccdae9ff" : "#f8f9fa",
                                color: brCd === code ? "#fff" : "#495057",
                                border: "1px solid #dee2e6",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontWeight: brCd === code ? "bold" : "normal"
                            }}
                        >
                            {code === 'B1' ? '공지사항' : code === 'B2' ? '자유게시판' : '문의게시판'}
                        </button>
                    ))}
                </div>
            </div>

            {/* 게시판 정보 */}
            <div style={{ 
                backgroundColor: "#e7f3ff", 
                padding: "20px", 
                borderRadius: 8, 
                marginBottom: 30,
                borderLeft: "4px solid #b4c2d1ff"
            }}>
                <p style={{ margin: 0, color: "#9aa7b6ff", fontSize: "16px" }}>
                    {boardInfo.description || `${brCd} 게시판입니다. 총 ${boardInfo.totalPosts || 0}개의 글이 있습니다.`}
                </p>
            </div>

            {/* 검색 및 글쓰기 */}
            <div style={{ marginBottom: 25, display: "flex", gap: 10, alignItems: "center" }}>
                <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", gap: 10 }}>
                    <input 
                        type="text" 
                        placeholder="제목 또는 내용으로 검색"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{
                            flex: 1,
                            padding: "12px 15px",
                            border: "1px solid #ced4da",
                            borderRadius: "4px",
                            fontSize: "16px"
                        }}
                    />
                    <button 
                        type="submit"
                        style={{ 
                            padding: "12px 25px", 
                            backgroundColor: "#6c757d",
                            color: "#fff", 
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        검색
                    </button>
                    {isSearching && (
                        <button 
                            type="button" 
                            onClick={() => { setSearchKeyword(""); loadBoardData(1); }}
                            style={{ 
                                padding: "12px 20px", 
                                backgroundColor: "#e6b8bdff", 
                                color: "#fff", 
                                border: "none", 
                                borderRadius: 4,
                                cursor: "pointer"
                            }}
                        >
                            검색 취소
                        </button>
                    )}
                </form>
                
                <button 
                    onClick={handleNewPost}
                    style={{
                        padding: "12px 25px",
                        backgroundColor: "#9dc2a6ff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "16px"
                    }}
                >
                    + 새 글 작성
                </button>
            </div>

            {/* 로딩/에러 상태 */}
            {loading ? (
                <div style={{ textAlign: "center", padding: 50, color: "#6c757d" }}>
                    <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
                    <p style={{ fontSize: "18px" }}>게시글을 불러오는 중...</p>
                </div>
            ) : error ? (
                <div style={{ padding: 40, backgroundColor: "#fff", borderRadius: "8px", color: "#ccb9bbff", textAlign: "center", border: "1px solid #f8d7da" }}>
                    <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
                    <p style={{ fontSize: "18px", marginBottom: 20 }}>{error}</p>
                    <button 
                        onClick={() => loadBoardData(1)} 
                        style={{ 
                            padding: "12px 25px", 
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer"
                        }}
                    >
                        다시 시도
                    </button>
                </div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60, backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #dee2e6" }}>
                    <div style={{ fontSize: "64px", marginBottom: "20px", color: "#adb5bd" }}>📄</div>
                    <p style={{ fontSize: "20px", color: "#6c757d", marginBottom: "10px" }}>아직 게시글이 없습니다</p>
                    <p style={{ color: "#adb5bd", marginBottom: "30px" }}>첫 번째 게시글을 작성해보세요</p>
                    <button 
                        onClick={handleNewPost} 
                        style={{ 
                            padding: "12px 30px", 
                            backgroundColor: "#28a745",
                            color: "#fff", 
                            border: "none", 
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold"
                        }}
                    >
                        첫 글 작성하기
                    </button>
                </div>
            ) : (
                <>
                    {/* 게시글 목록 */}
                    <div style={{ 
                        backgroundColor: "#fff", 
                        borderRadius: "8px", 
                        overflow: "hidden", 
                        border: "1px solid #dee2e6",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                    }}>
                        {/* 테이블 헤더 */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "80px 1fr 120px 150px 100px 100px",
                            backgroundColor: "#343a40",
                            color: "#fff",
                            padding: "15px 20px",
                            fontWeight: "bold"
                        }}>
                            <div style={{ textAlign: "center" }}>번호</div>
                            <div>제목</div>
                            <div style={{ textAlign: "center" }}>작성자</div>
                            <div style={{ textAlign: "center" }}>작성일</div>
                            <div style={{ textAlign: "center" }}>수정</div>
                            <div style={{ textAlign: "center" }}>삭제</div>
                        </div>
                        
                        {/* 게시글 행 */}
                        {posts.map((post, index) => {
                            const postNumber = (currentPage - 1) * 10 + (index + 1);
                            
                            return (
                                <div 
                                    key={post.br_seq || index}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "80px 1fr 120px 150px 100px 100px",
                                        padding: "15px 20px",
                                        borderBottom: "1px solid #e9ecef",
                                        alignItems: "center",
                                        backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9fa",
                                        transition: "background-color 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e9ecef"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#fff" : "#f8f9fa"}
                                >
                                    <div style={{ textAlign: "center", color: "#6c757d", fontWeight: "500" }}>
                                        {postNumber}
                                    </div>
                                    <div 
                                        style={{ 
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            color: "#212529",
                                            cursor: "pointer",
                                            padding: "5px 0"
                                        }}
                                        onClick={() => handleViewDetail(post.br_seq)}
                                        title={post.br_title}
                                    >
                                        {post.br_title}
                                        {post.br_file && (
                                            <span style={{ marginLeft: 8, color: "#6c757d", fontSize: "12px" }}>
                                                📎
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ textAlign: "center", color: "#495057" }}>
                                        {post.br_reg_id}
                                    </div>
                                    <div style={{ textAlign: "center", color: "#6c757d", fontSize: "14px" }}>
                                        {new Date(post.br_reg_dt).toLocaleDateString()}
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <button 
                                            onClick={() => handleEditPost(post)}
                                            style={{ 
                                                padding: "6px 12px", 
                                                backgroundColor: "#17a2b8",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 3,
                                                cursor: "pointer",
                                                fontSize: "13px"
                                            }}
                                        >
                                            수정
                                        </button>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <button 
                                            onClick={() => handleDeletePost(post.br_seq, post.br_title)}
                                            style={{ 
                                                padding: "6px 12px", 
                                                backgroundColor: "#dbb6baff",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 3,
                                                cursor: "pointer",
                                                fontSize: "13px"
                                            }}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5, marginTop: 40 }}>
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{ 
                                    padding: "10px 20px", 
                                    backgroundColor: currentPage === 1 ? "#e9ecef" : "#fff",
                                    color: currentPage === 1 ? "#adb5bd" : "#495057",
                                    border: "1px solid #dee2e6",
                                    borderRadius: 4,
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                ← 이전
                            </button>
                            
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(pageNum)}
                                        style={{
                                            padding: "10px 15px",
                                            minWidth: "45px",
                                            backgroundColor: currentPage === pageNum ? "#007bff" : "#fff",
                                            color: currentPage === pageNum ? "#fff" : "#495057",
                                            border: "1px solid #dee2e6",
                                            borderRadius: 4,
                                            cursor: "pointer",
                                            fontWeight: currentPage === pageNum ? "bold" : "normal"
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
                                    padding: "10px 20px", 
                                    backgroundColor: currentPage === totalPages ? "#e9ecef" : "#fff",
                                    color: currentPage === totalPages ? "#adb5bd" : "#495057",
                                    border: "1px solid #dee2e6",
                                    borderRadius: 4,
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                다음 →
                            </button>
                        </div>
                    )}

                    {/* 게시글 통계 */}
                    <div style={{ 
                        marginTop: 30, 
                        padding: 20, 
                        backgroundColor: "#f8f9fa", 
                        borderRadius: 8,
                        border: "1px solid #dee2e6",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <span style={{ color: "#6c757d" }}>총 </span>
                            <span style={{ color: "#b0bbc7ff", fontWeight: "bold", fontSize: "18px" }}>
                                {boardInfo.totalPosts || 0}
                            </span>
                            <span style={{ color: "#6c757d" }}> 개의 글</span>
                        </div>
                        <div style={{ color: "#6c757d", fontSize: "14px" }}>
                            현재 페이지: {currentPage} / {totalPages}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}