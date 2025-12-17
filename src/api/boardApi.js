// src/api/boardApi.js
const BASE = "http://localhost:9999/api/board";

// 공통 fetch 옵션
const getDefaultOptions = (method = 'GET', body = null) => {
    const options = {
        method,
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    return options;
};

// 게시판 정보 조회
export const getBoardInfo = async (brCd) => {
    try {
        console.log(`게시판 정보 조회 요청: ${brCd}`);
        
        const response = await fetch(`${BASE}/info?brCd=${brCd}`, getDefaultOptions());
        
        console.log("응답 상태:", response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("게시판 정보:", data);
        
        return {
            success: true,
            ...data
        };
        
    } catch (error) {
        console.error('게시판 정보 조회 오류:', error);
        
        // 오류 시 기본 정보 반환
        return {
            success: false,
            brNm: `게시판 ${brCd.substring(1)}`,
            brCd: brCd,
            description: `게시판 ${brCd.substring(1)} 설명`,
            message: error.message
        };
    }
};

// 게시글 목록 조회
export const getBoardPosts = async (brCd, page = 1, size = 10) => {
    try {
        console.log(`게시글 목록 조회: ${brCd}, 페이지: ${page}`);
        
        const response = await fetch(
            `${BASE}/posts?brCd=${brCd}&page=${page}&size=${size}`,
            getDefaultOptions()
        );
        
        console.log("응답 상태:", response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("게시글 목록 데이터:", data);
        
        return data;
        
    } catch (error) {
        console.error('게시글 목록 조회 오류:', error);
        
        return {
            success: false,
            content: [],
            totalPages: 0,
            currentPage: page,
            totalElements: 0,
            message: error.message
        };
    }
};

// 게시글 작성
export const createBoardPost = async (postData) => {
    try {
        console.log("게시글 작성 요청:", postData);
        
        const response = await fetch(
            `${BASE}/write`,
            getDefaultOptions('POST', postData)
        );
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        console.log("게시글 작성 성공:", data);
        return data;
        
    } catch (error) {
        console.error('게시글 작성 오류:', error);
        throw error;
    }
};

// 게시글 수정
export const updateBoardPost = async (seq, postData) => {
    try {
        console.log(`게시글 ${seq} 수정 요청:`, postData);
        
        const response = await fetch(
            `${BASE}/update/${seq}`,
            getDefaultOptions('PUT', postData)
        );
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        console.log("게시글 수정 성공:", data);
        return data;
        
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        throw error;
    }
};

// 게시글 삭제
export const deleteBoardPost = async (seq) => {
    try {
        console.log(`게시글 ${seq} 삭제 요청`);
        
        const response = await fetch(
            `${BASE}/delete/${seq}`,
            getDefaultOptions('DELETE')
        );
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        console.log("게시글 삭제 성공:", data);
        return data;
        
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        throw error;
    }
};

// 게시글 상세 조회
export const getBoardDetail = async (seq) => {
    try {
        console.log(`게시글 ${seq} 상세 조회 요청`);
        
        const response = await fetch(
            `${BASE}/detail/${seq}`,
            getDefaultOptions()
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("게시글 상세 데이터:", data);
        
        return data;
        
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};