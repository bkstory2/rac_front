// src/api/memoApi.js
const BASE = "http://localhost:9999/api/memos";

// 모든 메모 조회
export const getMemos = () =>
  fetch(BASE)
    .then(res => res.json())
    .then(data => {
      console.log("API 응답 데이터:", data);
      console.log("첫 번째 항목의 키:", data[0] ? Object.keys(data[0]) : "없음");
      return data;
    })
    .catch(error => {
      console.error("API 호출 에러:", error);
      return []; // 에러 시 빈 배열 반환
    });

// 메모 저장 (추가/수정)
export const saveMemo = (memo) =>
  fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(memo)
  })
  .then(res => {
    console.log("저장 응답 상태:", res.status);
    if (!res.ok) {
      return res.text().then(text => {
        console.error("저장 실패 응답:", text);
        throw new Error(`HTTP error! status: ${res.status}, message: ${text}`);
      });
    }
    return res.json();
  })
  .then(data => {
    console.log("저장 성공 응답 데이터:", data);
    return data;
  });

// 메모 삭제
export const deleteMemo = (fid) =>
  fetch(`${BASE}/${fid}`, { 
    method: "DELETE" 
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.text();
  });