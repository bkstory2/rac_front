// src/api/memoApi.js
const BASE_URL = "http://localhost:9999/api/memos";

// ==================== Mock 데이터 기능 (개발용) ====================
const createMockMemos = () => {
  const mockMemos = [];
  const now = new Date();
  
  for (let i = 1; i <= 8; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    mockMemos.push({
      FID: i,
      FTITLE: `테스트 메모 ${i}`,
      FCONTENT: `이것은 테스트 메모 ${i}의 내용입니다. 백엔드 서버에 연결할 수 없어서 Mock 데이터를 보여드립니다.`,
      FCREATED_AT: date.toISOString()
    });
  }
  return mockMemos;
};

const createMockResponse = (data, message = "성공") => ({
  success: true,
  content: data,
  message: message + " (Mock)"
});

const createMockError = (message = "실패") => ({
  success: false,
  message: message + " (Mock)"
});

// ==================== 공통 에러 처리 함수 ====================
const handleApiError = async (response, endpoint) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.log("에러:", e);
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch (e2) {
        console.log("에러:", e2);
        // 텍스트도 읽을 수 없는 경우
      }
    }
    
    console.error(`API 호출 실패 [${endpoint}]:`, errorMessage);
    throw new Error(errorMessage);
  }
  return response;
};

// ==================== API 함수들 ====================

/**
 * 모든 메모 조회
 * @returns {Promise<Array>} 메모 목록
 */
export const getMemos = async () => {
  try {
    console.log("메모 조회 요청...");
    
    const response = await fetch(BASE_URL);
    const processedResponse = await handleApiError(response, "getMemos");
    const result = await processedResponse.json();
    
    console.log("메모 조회 응답:", result);
    
    if (result.success) {
      return result.content || [];
    } else {
      console.warn("메모 조회 실패:", result.message);
      return [];
    }
  } catch (error) {
    console.warn("API 서버에 연결할 수 없습니다. Mock 데이터를 사용합니다.", error.message);
    
    // 로컬 스토리지에서 데이터 확인
    try {
      const localMemos = localStorage.getItem('localMemos');
      if (localMemos) {
        console.log("로컬 스토리지에서 메모 불러옴");
        return JSON.parse(localMemos);
      }
    } catch (localErr) {
      console.warn("로컬 스토리지 읽기 실패:", localErr);
    }
    
    // Mock 데이터 반환
    return createMockMemos();
  }
};

/**
 * 특정 메모 조회
 * @param {number} fid - 메모 ID
 * @returns {Promise<Object>} 메모 정보
 */
export const getMemoById = async (fid) => {
  try {
    console.log(`메모 상세 조회 요청 - FID: ${fid}`);
    
    const response = await fetch(`${BASE_URL}/${fid}`);
    const processedResponse = await handleApiError(response, "getMemoById");
    const result = await processedResponse.json();
    
    if (result.success) {
      return result.content || null;
    } else {
      console.warn("메모 상세 조회 실패:", result.message);
      return null;
    }
  } catch (error) {
    console.warn(`메모 상세 조회 실패 (FID: ${fid}). Mock 데이터 반환.`, error.message);
    
    // Mock 데이터 생성
    return {
      FID: fid,
      FTITLE: `테스트 메모 ${fid}`,
      FCONTENT: `이것은 메모 ${fid}의 Mock 내용입니다.`,
      FCREATED_AT: new Date().toISOString()
    };
  }
};

/**
 * 메모 저장 (추가/수정)
 * @param {Object} memoData - 저장할 메모 데이터
 * @param {string} memoData.ftitle - 메모 제목
 * @param {string} memoData.fcontent - 메모 내용
 * @param {number} [memoData.fid] - 메모 ID (수정시 필요)
 * @returns {Promise<Object>} 저장 결과
 */
export const saveMemo = async (memoData) => {
  try {
    console.log("메모 저장 요청:", memoData);
    
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(memoData)
    });
    
    const processedResponse = await handleApiError(response, "saveMemo");
    const result = await processedResponse.json();
    
    console.log("메모 저장 응답:", result);
    
    if (result.success) {
      // 오프라인 모드일 경우 로컬 스토리지 업데이트
      try {
        const localMemos = localStorage.getItem('localMemos');
        if (localMemos) {
          const memos = JSON.parse(localMemos);
          if (memoData.fid) {
            // 수정
            const index = memos.findIndex(m => m.FID === memoData.fid);
            if (index !== -1) {
              memos[index] = {
                ...memos[index],
                FTITLE: memoData.ftitle || "",
                FCONTENT: memoData.fcontent || "",
                FCREATED_AT: new Date().toISOString()
              };
            }
          } else {
            // 추가
            const newMemo = {
              FID: result.fid || Date.now(),
              FTITLE: memoData.ftitle || "",
              FCONTENT: memoData.fcontent || "",
              FCREATED_AT: new Date().toISOString()
            };
            memos.unshift(newMemo);
          }
          localStorage.setItem('localMemos', JSON.stringify(memos));
        }
      } catch (localErr) {
        console.warn("로컬 스토리지 업데이트 실패:", localErr);
      }
    }
    
    return result;
  } catch (error) {
    console.warn("메모 저장 실패. Mock 응답 반환.", error.message);
    
    // 로컬 스토리지에 저장 시도
    try {
      const localMemos = localStorage.getItem('localMemos') || "[]";
      const memos = JSON.parse(localMemos);
      const newFid = memoData.fid || Date.now();
      
      if (memoData.fid) {
        // 수정
        const index = memos.findIndex(m => m.FID === memoData.fid);
        if (index !== -1) {
          memos[index] = {
            ...memos[index],
            FTITLE: memoData.ftitle || "",
            FCONTENT: memoData.fcontent || ""
          };
        }
      } else {
        // 추가
        memos.unshift({
          FID: newFid,
          FTITLE: memoData.ftitle || "",
          FCONTENT: memoData.fcontent || "",
          FCREATED_AT: new Date().toISOString()
        });
      }
      
      localStorage.setItem('localMemos', JSON.stringify(memos));
      console.log("로컬 스토리지에 메모 저장됨:", newFid);
      
      return {
        success: true,
        fid: newFid,
        message: "메모가 로컬 스토리지에 저장되었습니다. (오프라인 모드)",
        action: memoData.fid ? "update" : "insert"
      };
    } catch (localErr) {
      console.error("로컬 스토리지 저장 실패:", localErr);
    }
    
    // Mock 응답 반환
    return createMockResponse({
      fid: memoData.fid || Date.now(),
      ...memoData
    }, "메모가 저장되었습니다");
  }
};

/**
 * 메모 삭제
 * @param {number} fid - 삭제할 메모 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteMemo = async (fid) => {
  try {
    console.log(`메모 삭제 요청 - FID: ${fid}`);
    
    const response = await fetch(`${BASE_URL}/${fid}`, {
      method: "DELETE"
    });
    
    const processedResponse = await handleApiError(response, "deleteMemo");
    const result = await processedResponse.json();
    
    console.log("메모 삭제 응답:", result);
    
    if (result.success) {
      // 로컬 스토리지에서도 삭제
      try {
        const localMemos = localStorage.getItem('localMemos');
        if (localMemos) {
          const memos = JSON.parse(localMemos);
          const updatedMemos = memos.filter(m => m.FID !== fid);
          localStorage.setItem('localMemos', JSON.stringify(updatedMemos));
        }
      } catch (localErr) {
        console.warn("로컬 스토리지 삭제 실패:", localErr);
      }
    }
    
    return result;
  } catch (error) {
    console.warn(`메모 삭제 실패 (FID: ${fid}). Mock 응답 반환.`, error.message);
    
    // 로컬 스토리지에서 삭제 시도
    try {
      const localMemos = localStorage.getItem('localMemos');
      if (localMemos) {
        const memos = JSON.parse(localMemos);
        const updatedMemos = memos.filter(m => m.FID !== fid);
        localStorage.setItem('localMemos', JSON.stringify(updatedMemos));
        
        return {
          success: true,
          fid: fid,
          message: "메모가 로컬 스토리지에서 삭제되었습니다. (오프라인 모드)"
        };
      }
    } catch (localErr) {
      console.error("로컬 스토리지 삭제 실패:", localErr);
    }
    
    return createMockResponse({ fid }, "메모가 삭제되었습니다");
  }
};

/**
 * 메모 검색
 * @param {string} keyword - 검색 키워드
 * @returns {Promise<Array>} 검색 결과
 */
export const searchMemos = async (keyword) => {
  try {
    console.log(`메모 검색 요청 - 키워드: "${keyword}"`);
    
    const response = await fetch(`${BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
    const processedResponse = await handleApiError(response, "searchMemos");
    const result = await processedResponse.json();
    
    if (result.success) {
      return result.content || [];
    } else {
      console.warn("메모 검색 실패:", result.message);
      return [];
    }
  } catch (error) {
    console.warn(`메모 검색 실패. Mock 검색 결과 반환.`, error.message);
    
    // 로컬 스토리지에서 검색
    try {
      const localMemos = localStorage.getItem('localMemos');
      if (localMemos) {
        const memos = JSON.parse(localMemos);
        const keywordLower = keyword.toLowerCase();
        const searchResults = memos.filter(memo => 
          (memo.FTITLE && memo.FTITLE.toLowerCase().includes(keywordLower)) ||
          (memo.FCONTENT && memo.FCONTENT.toLowerCase().includes(keywordLower))
        );
        return searchResults;
      }
    } catch (localErr) {
      console.warn("로컬 스토리지 검색 실패:", localErr);
    }
    
    // Mock 검색 결과
    const mockMemos = createMockMemos();
    const keywordLower = keyword.toLowerCase();
    return mockMemos.filter(memo => 
      memo.FTITLE.toLowerCase().includes(keywordLower) ||
      memo.FCONTENT.toLowerCase().includes(keywordLower)
    );
  }
};

/**
 * 메모 통계 정보 조회
 * @returns {Promise<Object>} 통계 정보
 */
export const getMemoStats = async () => {
  try {
    console.log("메모 통계 요청");
    
    const response = await fetch(`${BASE_URL}/stats`);
    const processedResponse = await handleApiError(response, "getMemoStats");
    const result = await processedResponse.json();
    
    if (result.success) {
      return result;
    } else {
      console.warn("메모 통계 조회 실패:", result.message);
      return createMockError("통계 조회 실패");
    }
  } catch (error) {
    console.warn("메모 통계 조회 실패. Mock 통계 반환.", error.message);
    
    // 로컬 스토리지 통계
    try {
      const localMemos = localStorage.getItem('localMemos');
      if (localMemos) {
        const memos = JSON.parse(localMemos);
        const total = memos.length;
        const titled = memos.filter(m => m.FTITLE && m.FTITLE.trim()).length;
        const content = memos.filter(m => m.FCONTENT && m.FCONTENT.trim()).length;
        const recent = memos.slice(0, 5);
        
        return {
          success: true,
          totalMemos: total,
          titledMemos: titled,
          contentMemos: content,
          recentMemos: recent,
          message: "로컬 스토리지 통계 (오프라인 모드)"
        };
      }
    } catch (localErr) {
      console.warn("로컬 스토리지 통계 실패:", localErr);
    }
    
    // Mock 통계
    const mockMemos = createMockMemos();
    return {
      success: true,
      totalMemos: mockMemos.length,
      titledMemos: mockMemos.length,
      contentMemos: mockMemos.length,
      recentMemos: mockMemos.slice(0, 5),
      message: "Mock 통계 데이터"
    };
  }
};

/**
 * 로컬 스토리지 초기화
 */
export const clearLocalMemos = () => {
  try {
    localStorage.removeItem('localMemos');
    console.log("로컬 스토리지 초기화 완료");
    return { success: true, message: "로컬 스토리지 초기화 완료" };
  } catch (error) {
    console.error("로컬 스토리지 초기화 실패:", error);
    return { success: false, message: "초기화 실패: " + error.message };
  }
};

/**
 * 로컬 스토리지 백업/복원
 */
export const backupLocalMemos = () => {
  try {
    const memos = localStorage.getItem('localMemos');
    return {
      success: true,
      data: memos,
      timestamp: new Date().toISOString(),
      count: memos ? JSON.parse(memos).length : 0
    };
  } catch (error) {
    console.error("로컬 스토리지 백업 실패:", error);
    return { success: false, message: "백업 실패: " + error.message };
  }
};

/**
 * API 연결 상태 확인
 * @returns {Promise<boolean>} 연결 상태
 */
export const checkApiConnection = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: "HEAD",
      cache: "no-cache"
    });
    return response.ok;
  } catch (error) {
     console.error("로컬 스토리지 백업 실패:", error);  
    return false;
  }
};