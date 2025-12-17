// src/api/boardApi.js
const BASE = "http://localhost:9999/api/board";

// 게시판 글 목록 조회
export const getBoardPosts = async (brCd, page = 1) => {
  try {
    console.log(`게시판 ${brCd} 글 목록 조회 요청, 페이지: ${page}`);
    
    const response = await fetch(`${BASE}/posts?brCd=${brCd}&page=${page}`);
    console.log("게시글 목록 응답 상태:", response.status);
    
    if (!response.ok) {
      return response.text().then(text => {
        console.error("게시글 목록 조회 실패 응답:", text);
        return {
          success: false,
          content: [],
          totalPages: 0,
          currentPage: 1,
          message: `HTTP error! status: ${response.status}`
        };
      });
    }
    
    const data = await response.json();
    console.log("게시글 목록 응답 데이터:", data);
    console.log("첫 번째 항목:", data.content ? data.content[0] : "없음");
    
    return data;
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    return {
      success: false,
      content: [],
      totalPages: 0,
      currentPage: 1,
      message: error.message
    };
  }
};

// 게시판 정보 조회
export const getBoardInfo = async (brCd) => {
  try {
    console.log(`게시판 ${brCd} 정보 조회 요청`);
    
    const response = await fetch(`${BASE}/info?brCd=${brCd}`);
    console.log("게시판 정보 응답 상태:", response.status);
    
    if (!response.ok) {
      return response.text().then(text => {
        console.error("게시판 정보 조회 실패 응답:", text);
        // 기본 정보 반환
        return {
          brNm: `게시판 ${brCd.substring(1)}`,
          brCd: brCd,
          description: `게시판 ${brCd.substring(1)} 설명`
        };
      });
    }
    
    const data = await response.json();
    console.log("게시판 정보 응답 데이터:", data);
    
    return data;
  } catch (error) {
    console.error('게시판 정보 조회 오류:', error);
    // 기본 정보 반환
    return {
      brNm: `게시판 ${brCd.substring(1)}`,
      brCd: brCd,
      description: `게시판 ${brCd.substring(1)} 설명`
    };
  }
};

// 게시글 작성
export const createBoardPost = async (postData) => {
  try {
    console.log("게시글 작성 요청:", postData);
    
    const response = await fetch(`${BASE}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    });
    
    console.log("게시글 작성 응답 상태:", response.status);
    
    if (!response.ok) {
      return response.text().then(text => {
        console.error("게시글 작성 실패 응답:", text);
        throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
      });
    }
    
    const data = await response.json();
    console.log("게시글 작성 성공 응답 데이터:", data);
    
    return data;
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    throw error;
  }
};

// 게시글 수정
export const updateBoardPost = async (postId, postData) => {
  try {
    console.log(`게시글 ${postId} 수정 요청:`, postData);
    
    const response = await fetch(`${BASE}/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    });
    
    console.log("게시글 수정 응답 상태:", response.status);
    
    if (!response.ok) {
      return response.text().then(text => {
        console.error("게시글 수정 실패 응답:", text);
        throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
      });
    }
    
    const data = await response.json();
    console.log("게시글 수정 성공 응답 데이터:", data);
    
    return data;
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    throw error;
  }
};

// 게시글 삭제
export const deleteBoardPost = async (postId) => {
  try {
    console.log(`게시글 ${postId} 삭제 요청`);
    
    const response = await fetch(`${BASE}/posts/${postId}`, { 
      method: "DELETE" 
    });
    
    console.log("게시글 삭제 응답 상태:", response.status);
    
    if (!response.ok) {
      return response.text().then(text => {
        console.error("게시글 삭제 실패 응답:", text);
        throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
      });
    }
    
    return response.text();
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    throw error;
  }
};