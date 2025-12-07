
<div align="center">

# 📚 웹응용프로그래밍 텀 프로젝트 최종보고서

## <strong>BookSync – 온라인 독서 소모임 플랫폼</strong>

</div>

### 👥 6조

- 202355633 배지우
- 202255608 정의진
- 202255519 김민규

---

## 1. 프로젝트 개요

### 1.1. 프로젝트 명

**BookSync:**

**시공간의 제약 없는 온라인 독서 소모임 플랫폼.** ’Book’과 ’Synchronization’의 합성어로, **“책을 통해 사람과 생각을 연결한다(Sync)”** 는 의미를 담고 있다.

**이름에 담긴 3가지 철학**:

1. **📚 Reading Sync** (독서 동기화)
    
    각자의 속도로 책을 읽되, 같은 책을 읽는 사람들과 연결된다. 혼자 읽지만 혼자가 아닌, 비동기적 독서의 새로운 패러다임.
    
2. **💬 Communication Sync** (소통 동기화)
    
    비동기 게시판(Async)과 실시간 채팅(Sync)의 하이브리드. 깊은 사유는 게시판에, 즉각적인 대화는 채팅으로. 두 세계를 동기화(Synchronize)한다.
    
3. **🧠 Mind Sync** (생각의 동기화)
    
    서로 다른 해석과 관점이 충돌하고 융합되며, 독자들의 사고가 확장된다. 책을 매개로 생각을 동기화하고, 집단 지성을 형성한다.
    

### 1.2. 웹 서비스 주제

**“언제 어디서나, 나의 속도로 책을 읽고 생각을 연결하다.”**

BookSync는 시간과 장소에 구애받지 않고 누구나 자유롭게 독서 모임을 만들고 참여할 수 있는 **온라인 독서 커뮤니티 플랫폼**이다.

단순한 모임 관리를 넘어, **알라딘 API**를 활용한 정확한 도서 정보 검색과 **Google Gemini AI**를 활용한 ‘책 내용 요약’ 및 ‘토론 주제 추천’ 기능을 제공하여, 사용자가 독서 활동 그 자체에 깊이 몰입할 수 있는 환경을 조성하는 것을 목표로 한다. 또한 **Socket.IO 기반 실시간 채팅**을 통해 스터디원들 간의 즉각적인 소통을 가능하게 하여, 비동기적 게시판과 동기적 채팅을 모두 제공하는 하이브리드 커뮤니케이션 플랫폼이다.

### 1.3. 핵심 기능

1. **회원 인증 시스템**: bcrypt 기반 안전한 비밀번호 암호화 및 세션 관리
2. **스터디 관리**: 생성, 수정, 삭제, 검색, 멤버 관리 (LEADER/MEMBER 권한 구분)
3. **알라딘 API 연동**: 실시간 도서 검색 및 표지 이미지 제공
4. **Gemini AI API 연동**: 책 요약 및 토론 주제 자동 생성
5. **게시판 시스템**: 스터디별 독립 게시판 및 댓글 기능
6. **실시간 채팅**: Socket.IO 기반 스터디별 채팅룸
7. **개인화 대시보드**: 참여 중인 스터디 모아보기 및 생성한 스터디 관리

---

## 2. 주제 선정 배경 및 기획 의도

### 2.1. 기존 독서 모임의 한계

전통적인 독서 모임은 오프라인 중심으로 운영되어 **시간과 공간의 제약**이 크다. 직장인, 학생 등 바쁜 현대인들에게 정해진 시간과 장소에 모이는 것은 큰 부담으로 작용하며, 이로 인해 독서 모임 참여를 포기하는 경우가 많다. 또한 개인마다 독서 속도가 다름에도 불구하고 특정 날짜까지 책을 완독해야 한다는 압박감은 오히려 독서의 즐거움을 반감시킨다.

### 2.2.온라인 기반의 차별화된 가치

온라인 플랫폼은 오히려 **더 깊고 진솔한 대화**를 가능하게 한다. 대면 모임에서는 발표력이 좋은 사람이 토론을 주도하는 경향이 있지만, 텍스트 기반의 비동기 소통은 모든 참여자에게 평등한 발언 기회를 제공한다. 각자 충분히 생각을 정리한 후 의견을 공유할 수 있어 토론의 깊이와 질이 향상되며, 내성적인 성향의 사람들도 부담 없이 참여할 수 있다.

### 2.3. MZ세대와 확장 가능성

MZ세대는 이미 디스코드, 오픈채팅 등 다양한 온라인 플랫폼을 통해 취미 커뮤니티를 활발히 활용하고 있다. 이러한 디지털 소통 방식에 익숙한 MZ세대에게 자기계발과 건설적인 취미생활로서의 **“독서”**만을 위한 전문 커뮤니티는 명확한 차별화 포인트가 된다.

더 나아가 AI 기반의 도서 추천, 내용 요약, 토론 주제 자동 생성 등을 통해 운영 부담을 최소화하면서도 양질의 독서 경험을 제공할 수 있다. 향후 북토크 라이브, 작가와의 온라인 만남 등 다양한 기능을 추가하여 단순 독서 모임을 넘어 **종합 독서 문화 플랫폼**으로 성장할 수 있는 높은 확장 가능성을 보유하고 있다.

---

## 3. 개발 환경 및 기술 스택

### 3.1. 백엔드 (Backend)

| 구분 | 기술 스택 |
| --- | --- |
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MySQL |
| **DB Driver** | mysql2 |
| **Template Engine** | EJS |
| **Real-time** | Socket.IO |

### 3.2. 프론트엔드 (Frontend)

| 구분 | 기술 스택 |
| --- | --- |
| **Basic** | HTML5, CSS3, JavaScript |
| **UI Framework** | Bootstrap |
| **Client-side** | Socket.IO Client |

### 3.3. 개발 도구 (Dev Tools)

| 구분 | 도구 |
| --- | --- |
| **IDE** | Visual Studio Code |
| **Version Control** | Git / GitHub |
| **Package Manager** | npm |

### 3.4. 외부 API 연동

### 3.4.1. 알라딘 OpenAPI

- 사용자가 스터디 개설 시 책 제목만 입력해도 표지, 저자, 출판사, ISBN 등 정확한 도서 정보를 자동 검색
- 고해상도 표지 이미지(500px) 자동 변환으로 시각적 품질 향상
- 실시간 검색 결과를 JSON으로 반환하여 동적 UI 구성

### 3.4.2. Google Gemini API

- **책 요약 서비스**: 긴 책의 내용을 5~7문장으로 핵심만 요약하여 제공
- **토론 주제 추천**: 책 내용 바탕으로 스터디원들이 활발하게 이야기할 수 있는 심도 있는 질문 3가지를 자동 생성
- Gemini 2.5 Flash 모델 사용으로 빠른 응답 속도와 높은 품질 보장

---

## 4. 전체 시스템 개요도

서비스는 **Express.js + MySQL + Socket.IO** 기반으로 구현되었으며,

클라이언트/서버/DB/웹소켓이 유기적으로 연결되는 형태로 구성됩니다.

### 4.1. **전체 시스템 개요도 (Architecture Diagram)**

![image.png](attachment:806744ad-781e-4e22-89dd-d369180fb054:image.png)

본 시스템은 다음과 같은 계층으로 구성됩니다:

✔ **Client Layer**

브라우저 UI로 구성되며 Home, 로그인, 스터디, 게시판, 채팅 화면을 제공한다.

✔ **Middleware Layer**

Logger: 모든 요청 로깅

Session: express-session 기반 세션 유지

Auth: 로그인 여부 검증

Error Handler: 오류 처리

✔ **Server (Routes = Controller)**

각 라우터는 실제로 컨트롤러 역할까지 수행하며
요청 처리, DB 조회, 렌더링을 모두 담당한다.

✔ **Database Layer**

MySQL 기반의 users, studies, posts, chat_messages 테이블과 연결된다.

✔ **Socket.IO Layer**

실시간 채팅 메시지를 처리하고 DB에 저장한다.

### 4.2. **전체 시스템 흐름 (Sequence Diagram)**

서비스 전반의 흐름(접속 → 로그인 → 스터디 → 게시판 → 채팅)을 하나의 플로우로 표현한 다이어그램입니다.

![image.png](attachment:2aef258e-ddb6-4998-abe7-b044875d92c4:d4572ddf-b824-4c1e-95c7-2769541fb48a.png)

![image.png](attachment:0dda6c73-fb60-4d43-b6cc-11315c83bcae:1ff0c299-4f91-4d99-aa4d-12e8df231b10.png)

---

## 5. 데이터베이스 구조 (Database Schema)

본 프로젝트는 MySQL을 사용하며, 사용자 관리, 스터디 관리, 게시판, 댓글, 채팅, 세션 관리를 위해 아래와 같은 테이블들을 사용합니다.

### 5.1. 테이블 목록

- `users` : 회원 정보 및 로그인용 계정 데이터
- `studies` : 스터디 기본 정보 및 연계 도서 정보
- `study_members` : 스터디 참여자 및 역할(리더/멤버) 정보
- `study_posts` : 스터디별 게시글 정보
- `study_comments` : 게시글에 작성된 댓글 정보
- `study_chat_messages` : 스터디별 실시간 채팅 메시지 저장
- `sessions` : express-session을 위한 세션 데이터 저장

---

### 5.2. 테이블 상세 구조

### 5.2.1. `users`

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | 사용자 고유 ID |
| email | VARCHAR(255) | NOT NULL, UNIQUE | 로그인용 이메일 |
| password_hash | VARCHAR(255) | NOT NULL | 암호화된 비밀번호 |
| nickname | VARCHAR(100) | NOT NULL | 닉네임 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 가입 시각 |

### 5.2.2. `studies`

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | 스터디 고유 ID |
| title | VARCHAR(255) | NOT NULL | 스터디 이름 |
| description | TEXT | NOT NULL | 스터디 소개 |
| max_members | INT | NOT NULL, DEFAULT 10 | 최대 인원 수 |
| day | VARCHAR(10) | NOT NULL | 진행 요일 |
| book_isbn | VARCHAR(32) | NULL 가능 | 연계 도서 ISBN |
| book_title | VARCHAR(255) | NULL 가능 | 연계 도서 제목 |
| book_cover_url | VARCHAR(1024) | NULL 가능 | 도서 표지 이미지 URL |
| book_author | VARCHAR(255) | NULL 가능 | 도서 저자 |
| creator_id | BIGINT | NOT NULL | 스터디 생성자(users.id) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성 시각 |

인덱스:
- `idx_studies_creator (creator_id)`

### 5.2.3. `study_members`

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | 스터디 멤버 레코드 ID |
| study_id | BIGINT | NOT NULL | 스터디 ID (studies.id) |
| user_id | BIGINT | NOT NULL | 사용자 ID (users.id) |
| role | ENUM(…) | DEFAULT ‘MEMBER’ | ‘LEADER’ 또는 ‘MEMBER’ |
| joined_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 스터디 가입 시각 |

인덱스:
- `idx_study_members_study (study_id)`
- `idx_study_members_user (user_id)`

### 5.2.4. `study_posts`

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | 게시글 ID |
| study_id | BIGINT | NOT NULL | 스터디 ID (studies.id) |
| user_id | BIGINT | NOT NULL | 작성자 ID (users.id) |
| title | VARCHAR(255) | NOT NULL | 게시글 제목 |
| content | TEXT | NOT NULL | 게시글 내용 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 작성 시각 |

인덱스:
- `idx_posts_study (study_id)`
- `idx_posts_user (user_id)`

### 5.2.5. `study_comments`

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | 댓글 ID |
| study_id | BIGINT | NULL 가능 | 스터디 ID (옵션, studies.id) |
| post_id | BIGINT | NOT NULL | 게시글 ID (study_posts.id) |
| user_id | BIGINT | NOT NULL | 작성자 ID (users.id) |
| content | TEXT | NOT NULL | 댓글 내용 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 작성 시각 |

인덱스:
- `idx_comments_post (post_id)`
- `idx_comments_user (user_id)`

### 5.2.6. `study_chat_messages`

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | 채팅 메시지 ID |
| study_id | BIGINT | NOT NULL | 스터디 ID (studies.id) |
| user_id | BIGINT | NOT NULL | 보낸 사람 ID (users.id) |
| message | TEXT | NOT NULL | 채팅 메시지 내용 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 전송 시각 |

인덱스:
- `idx_chat_study (study_id)`
- `idx_chat_user (user_id)`

### 5.2.7. `sessions`

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| session_id | VARCHAR(128) | PK | 세션 식별자 |
| expires | INT UNSIGNED | NOT NULL | 만료 시간 (Unix timestamp 등) |
| data | MEDIUMTEXT |  | 세션 데이터(JSON 직렬화된 문자열 등) |

> sessions 테이블은 express-session + MySQLStore를 사용하기 위한 세션 저장용 테이블입니다.
> 

---

## 6. 실행 방법 (schema.sql 제공)

```markdown
### 6.1. 사전 준비

```bash
# Node.js 18+ 설치 확인
node --version

# MySQL 설치 및 실행 확인
mysql --version
```

---

### 6.2. 프로젝트 설정

```bash
# 1. 저장소 클론
git clone https://github.com/euijin1212/2025-2-2-web-project.git
cd 2025-2-2-web-project
git checkout main

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.example .env
# .env 파일을 열어 DB 정보 및 API 키 설정
# 예시)
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=비밀번호
# DB_NAME=studydb
# ALADIN_API_KEY=...
# GEMINI_API_KEY=...

> ⚠️ 주의 사항  
> 보안상의 이유로 실제 알라딘 API 키와 Gemini API 키는 저장소 및 보고서에 포함하지 않았습니다.  
> 해당 기능을 사용하려면 각자 계정으로 API 키를 발급받아 `.env` 파일에 `ALADIN_API_KEY`, `GEMINI_API_KEY` 값을 직접 설정해야 합니다.
```

---

### 6.3. 데이터베이스 및 테이블 생성

### 6.3.1. 데이터베이스 생성

터미널에서 MySQL 콘솔에 접속합니다.

```bash
mysql -u root -p
```

MySQL 프롬프트에서 아래 명령을 실행합니다.

```sql
CREATE DATABASE IF NOT EXISTS studydb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE studydb;
```

### 6.3.2. 테이블 생성 (`schema.sql` 사용)

프로젝트 루트에 `schema.sql` 파일이 포함되어 있으며,

모든 테이블(users, studies, study_members, study_posts, study_comments, study_chat_messages, sessions)이 이 파일에 정의되어 있습니다.

**방법 1) MySQL 콘솔에서 SOURCE 사용**

```sql
SOURCE /프로젝트/경로/schema.sql;
```

**방법 2) 터미널에서 바로 실행**

```bash
mysql -u root -p studydb < schema.sql
```

---

### 6.4. 서버 실행

```bash
npm start
# 또는
node app.js
```

브라우저에서 아래 주소로 접속합니다.

```
http://localhost:3000
```

## 7. 향후 개선 방향

### 7.1. 기능 확장

- [ ]  독서 진행률 트래커 (페이지 단위 기록)
- [ ]  스터디 일정 캘린더 (읽기 계획 수립)
- [ ]  알림 시스템 (새 댓글, 채팅 멘션 등)
- [ ]  파일 첨부 기능 (독서 노트, 발췌문 공유)
- [ ]  좋아요/북마크 기능
- [ ]  사용자 프로필 커스터마이징

### 7.2. 성능 개선

### 7.3. UX 개선

- [ ]  반응형 디자인 강화 (모바일 최적화)
- [ ]  다크 모드 지원
- [ ]  로딩 애니메이션

---

## 8. 팀 구성 및 역할 분담

| 이름 | 역할 |
| --- | --- |
| **배지우** | 팀장 / 프론트
메인 UI 설계 및 구현
스터디 등록·검색 페이지 개발 |
| **김민규** | PM
개발계획서·결과보고서·발표
회의록·일정·GitHub 관리
세부 페이지 UI 구현 |
| **정의진** | 백엔드
전체 프로그램 설계
서버-클라이언트 API 통신 구현
기능별 단위 테스트 및 통합 테스트 |

---

**프로젝트 저장소**: https://github.com/euijin1212/2025-2-2-web-project (main 브랜치)
