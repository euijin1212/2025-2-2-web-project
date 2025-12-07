# 📚 독서 스터디 웹 플랫폼 — 시스템 개요 및 흐름 보고서

본 문서는 독서 스터디 웹 플랫폼의 전체 시스템 구조와 동작 흐름을 설명합니다.  
서비스는 **Express.js + MySQL + Socket.IO** 기반으로 구현되었으며,  
클라이언트/서버/DB/웹소켓이 유기적으로 연결되는 형태로 구성됩니다.

---

# 📘 1. 전체 시스템 개요도 (Architecture Diagram)

아래 다이어그램은 본 서비스의 전체 구조를 나타낸 것입니다.

<p align="center">
<img width="2675" height="1483" alt="Untitled diagram-2025-12-04-075107"       src="https://github.com/user-attachments/assets/fc8485e8-6332-46f5-bf92-c032c2e1e983" />
</p>

# 📘 시스템 개요도 설명

본 시스템은 다음과 같은 계층으로 구성됩니다:

✔ Client Layer

브라우저 UI로 구성되며 Home, 로그인, 스터디, 게시판, 채팅 화면을 제공한다.

✔ Middleware Layer

Logger: 모든 요청 로깅

Session: express-session 기반 세션 유지

Auth: 로그인 여부 검증

Error Handler: 오류 처리

✔ Server (Routes = Controller)

각 라우터는 실제로 컨트롤러 역할까지 수행하며
요청 처리, DB 조회, 렌더링을 모두 담당한다.

✔ Database Layer

MySQL 기반의 users, studies, posts, chat_messages 테이블과 연결된다.

✔ Socket.IO Layer

실시간 채팅 메시지를 처리하고 DB에 저장한다.

# 📘 2. 전체 시스템 흐름 Sequence Diagram

서비스 전반의 흐름(접속 → 로그인 → 스터디 → 게시판 → 채팅)을 하나의 플로우로 표현한 다이어그램입니다.

<p align="center">
<img width="2802" height="4298" alt="Untitled diagram-2025-12-04-075446" src="https://github.com/user-attachments/assets/c141bbcc-7343-4588-9186-360777626ca1" />
</p>


## 3. 데이터베이스 구조 (Database Schema)

본 프로젝트는 MySQL을 사용하며, 사용자 관리, 스터디 관리, 게시판, 댓글, 채팅, 세션 관리를 위해 아래와 같은 테이블들을 사용합니다.

### 3.1 테이블 목록

- `users` : 회원 정보 및 로그인용 계정 데이터
- `studies` : 스터디 기본 정보 및 연계 도서 정보
- `study_members` : 스터디 참여자 및 역할(리더/멤버) 정보
- `study_posts` : 스터디별 게시글 정보
- `study_comments` : 게시글에 작성된 댓글 정보
- `study_chat_messages` : 스터디별 실시간 채팅 메시지 저장
- `sessions` : express-session을 위한 세션 데이터 저장

---

### 3.2 테이블 상세 구조

#### 3.2.1 `users`

| 컬럼명         | 타입           | 제약조건                     | 설명                    |
|---------------|----------------|------------------------------|-------------------------|
| id            | BIGINT         | PK, AUTO_INCREMENT           | 사용자 고유 ID          |
| email         | VARCHAR(255)   | NOT NULL, UNIQUE             | 로그인용 이메일         |
| password_hash | VARCHAR(255)   | NOT NULL                     | 암호화된 비밀번호       |
| nickname      | VARCHAR(100)   | NOT NULL                     | 닉네임                  |
| created_at    | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP    | 가입 시각               |

---

#### 3.2.2 `studies`

| 컬럼명        | 타입            | 제약조건                           | 설명                          |
|--------------|-----------------|------------------------------------|-------------------------------|
| id           | BIGINT          | PK, AUTO_INCREMENT                 | 스터디 고유 ID                |
| title        | VARCHAR(255)    | NOT NULL                           | 스터디 이름                   |
| description  | TEXT            | NOT NULL                           | 스터디 소개                   |
| max_members  | INT             | NOT NULL, DEFAULT 10               | 최대 인원 수                  |
| day          | VARCHAR(10)     | NOT NULL                           | 진행 요일                     |
| book_isbn    | VARCHAR(32)     | NULL 가능                          | 연계 도서 ISBN                |
| book_title   | VARCHAR(255)    | NULL 가능                          | 연계 도서 제목                |
| book_cover_url | VARCHAR(1024) | NULL 가능                          | 도서 표지 이미지 URL         |
| book_author  | VARCHAR(255)    | NULL 가능                          | 도서 저자                     |
| creator_id   | BIGINT          | NOT NULL                           | 스터디 생성자(users.id)      |
| created_at   | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP| 생성 시각                     |

인덱스:
- `idx_studies_creator (creator_id)`

---

#### 3.2.3 `study_members`

| 컬럼명    | 타입       | 제약조건                     | 설명                               |
|----------|------------|------------------------------|------------------------------------|
| id       | BIGINT     | PK, AUTO_INCREMENT           | 스터디 멤버 레코드 ID              |
| study_id | BIGINT     | NOT NULL                     | 스터디 ID (studies.id)            |
| user_id  | BIGINT     | NOT NULL                     | 사용자 ID (users.id)              |
| role     | ENUM(...)  | DEFAULT 'MEMBER'             | 'LEADER' 또는 'MEMBER'            |
| joined_at| TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP    | 스터디 가입 시각                   |

인덱스:
- `idx_study_members_study (study_id)`
- `idx_study_members_user (user_id)`

---

#### 3.2.4 `study_posts`

| 컬럼명    | 타입         | 제약조건                     | 설명                                 |
|----------|--------------|------------------------------|--------------------------------------|
| id       | BIGINT       | PK, AUTO_INCREMENT           | 게시글 ID                             |
| study_id | BIGINT       | NOT NULL                     | 스터디 ID (studies.id)              |
| user_id  | BIGINT       | NOT NULL                     | 작성자 ID (users.id)                |
| title    | VARCHAR(255) | NOT NULL                     | 게시글 제목                          |
| content  | TEXT         | NOT NULL                     | 게시글 내용                          |
| created_at | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP    | 작성 시각                            |

인덱스:
- `idx_posts_study (study_id)`
- `idx_posts_user (user_id)`

---

#### 3.2.5 `study_comments`

| 컬럼명    | 타입      | 제약조건                     | 설명                                      |
|----------|-----------|------------------------------|-------------------------------------------|
| id       | BIGINT    | PK, AUTO_INCREMENT           | 댓글 ID                                   |
| study_id | BIGINT    | NULL 가능                    | 스터디 ID (옵션, studies.id)             |
| post_id  | BIGINT    | NOT NULL                     | 게시글 ID (study_posts.id)               |
| user_id  | BIGINT    | NOT NULL                     | 작성자 ID (users.id)                     |
| content  | TEXT      | NOT NULL                     | 댓글 내용                                 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP  | 작성 시각                                 |

인덱스:
- `idx_comments_post (post_id)`
- `idx_comments_user (user_id)`

---

#### 3.2.6 `study_chat_messages`

| 컬럼명    | 타입      | 제약조건                     | 설명                                   |
|----------|-----------|------------------------------|----------------------------------------|
| id       | BIGINT    | PK, AUTO_INCREMENT           | 채팅 메시지 ID                         |
| study_id | BIGINT    | NOT NULL                     | 스터디 ID (studies.id)                |
| user_id  | BIGINT    | NOT NULL                     | 보낸 사람 ID (users.id)               |
| message  | TEXT      | NOT NULL                     | 채팅 메시지 내용                       |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP  | 전송 시각                              |

인덱스:
- `idx_chat_study (study_id)`
- `idx_chat_user (user_id)`

---

#### 3.2.7 `sessions`

| 컬럼명     | 타입          | 제약조건            | 설명                                  |
|-----------|---------------|---------------------|---------------------------------------|
| session_id| VARCHAR(128)  | PK                  | 세션 식별자                           |
| expires   | INT UNSIGNED  | NOT NULL            | 만료 시간 (Unix timestamp 등)        |
| data      | MEDIUMTEXT    |                     | 세션 데이터(JSON 직렬화된 문자열 등) |

> `sessions` 테이블은 `express-session` + MySQLStore를 사용하기 위한 세션 저장용 테이블입니다.

