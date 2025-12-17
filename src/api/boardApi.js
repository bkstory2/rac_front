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
        const response = await fetch(`${BASE}/info?brCd=${brCd}`, getDefaultOptions());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('게시판 정보 조회 오류:', error);
        return {
            brNm: `게시판 ${brCd}`,
            brCd: brCd,
            description: `${brCd} 게시판입니다.`,
            totalPosts: 0
        };
    }
};

// 게시글 목록 조회
export const getBoardPosts = async (brCd, page = 1, size = 10) => {
    try {
        const response = await fetch(
            `${BASE}/posts?brCd=${brCd}&page=${page}&size=${size}`,
            getDefaultOptions()
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
        
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

// 게시글 상세 조회
export const getBoardDetail = async (seq) => {
    try {
        const response = await fetch(
            `${BASE}/detail/${seq}`,
            getDefaultOptions()
        );
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('게시글을 찾을 수 없습니다.');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 게시글 작성
export const createBoardPost = async (postData) => {
    try {
        // 백엔드 형식에 맞게 변환
        const apiData = {
            br_cd: postData.brCd,
            br_title: postData.title,
            br_content: postData.content,
            br_reg_id: postData.author || "user"
        };
        
        const response = await fetch(
            `${BASE}/write`,
            getDefaultOptions('POST', apiData)
        );
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
        
    } catch (error) {
        console.error('게시글 작성 오류:', error);
        throw error;
    }
};

// 게시글 수정
export const updateBoardPost = async (seq, postData) => {
    try {
        const apiData = {
            br_title: postData.title,
            br_content: postData.content
        };
        
        const response = await fetch(
            `${BASE}/update/${seq}`,
            getDefaultOptions('PUT', apiData)
        );
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
        
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        throw error;
    }
};

// 게시글 삭제
export const deleteBoardPost = async (seq) => {
    try {
        const response = await fetch(
            `${BASE}/delete/${seq}`,
            getDefaultOptions('DELETE')
        );
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
        
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        throw error;
    }
};

// 게시글 검색
export const searchBoardPosts = async (brCd, keyword, page = 1, size = 10) => {
    try {
        const response = await fetch(
            `${BASE}/search?brCd=${brCd}&keyword=${keyword}&page=${page}&size=${size}`,
            getDefaultOptions()
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('게시글 검색 오류:', error);
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