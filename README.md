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



## 팀원들 받으면 해야할 것 

개발할 때는 로컬 MySQL DB 를 사용하기때문에 
각자 DB는 만들어야합니다.

1) MySQL Server 설치

Windows: MySQL Installer

macOS: Homebrew (brew install mysql)

Linux: apt/yum (sudo apt install mysql-server)

2) studydb 생성
CREATE DATABASE studydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

3) DB 계정 생성 (README에 넣을 내용)
CREATE USER 'study_user'@'localhost' IDENTIFIED BY 'study_pass';
GRANT ALL PRIVILEGES ON studydb.* TO 'study_user'@'localhost';
FLUSH PRIVILEGES;

4) 테이블 생성


🔹 users 테이블
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

🔹 studies 테이블
CREATE TABLE studies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  max_members INT DEFAULT 10,
  day VARCHAR(10),
  book_isbn VARCHAR(50),
  book_title VARCHAR(255),
  book_cover_url TEXT,
  book_author VARCHAR(255),
  creator_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

npm install 의존성 설치 

DB 내용은 올리면 안되기 때문에 .env.example

env 파일 예시로 올려놨으니 이거를 env 로 복붙해서 사용

npm start
로 서버실행


