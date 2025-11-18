# 2025-2-2-Web_Project


## 전체적인 구조 
/project
  app.js                ← 서버의 메인 엔트리
  /routes
      auth.js           ← 로그인/회원가입
      studies.js        ← 스터디 생성/수정/삭제/상세/검색
  /views
      studies.ejs       ← 스터디 목록
      studies-detail.ejs← 스터디 상세
      study-form.ejs    ← 생성/수정 폼
      login.ejs         ← 로그인 페이지
      mypage.ejs        ← 마이페이지
      partials/header.ejs
      partials/footer.ejs
  /public               ← CSS, 이미지, JS (정적 파일)
  db.js                 ← MySQL 연결 풀


## 모든 스터디 기능은 studies.js 에 구현 했습니다
GET /studies	스터디 목록(검색 포함)
GET /studies/new	스터디 만들기 폼
POST /studies/create	새 스터디 생성
GET /studies/:id	스터디 상세 페이지
GET /studies/:id/edit	수정 폼
POST /studies/:id/update	수정 처리
ALL /studies/:id/delete	삭제 처리