# 🚀 GitHub Pages 자동 빌드 & 배포 가이드

> **대상**: `AI-ResearchLab/ai-researchlab.github.io` 레포
> **방식**: GitHub Actions → GitHub Pages 자동 배포
> **결과**: 마크다운 파일 push → 자동 빌드 → `https://ai-researchlab.github.io` 반영

---

## 목차

1. [한 번만 하면 되는 초기 세팅](#1-한-번만-하면-되는-초기-세팅)
2. [GitHub 레포 설정](#2-github-레포-설정)
3. [첫 번째 Push 및 빌드 확인](#3-첫-번째-push-및-빌드-확인)
4. [팀원이 콘텐츠를 추가하는 법 (반복 작업)](#4-팀원이-콘텐츠를-추가하는-법-반복-작업)
5. [로컬에서 미리보기 하는 법](#5-로컬에서-미리보기-하는-법)
6. [자주 발생하는 문제 & 해결법](#6-자주-발생하는-문제--해결법)

---

## 1. 한 번만 하면 되는 초기 세팅

### 1-1. GitHub Organization에 레포 생성

> ⚠️ **레포 이름이 정확히 `ai-researchlab.github.io`여야 합니다** (Organization 이름 소문자 + `.github.io`)

1. [GitHub](https://github.com) → **AI-ResearchLab Organization** 페이지 이동
2. **Repositories** 탭 → **New repository** 클릭
3. 설정:
   - **Repository name**: `ai-researchlab.github.io`
   - **Visibility**: `Public` ✅ (Private이면 Pages 무료 사용 불가)
   - **Initialize with README**: 체크 해제 (로컬에서 올릴 예정)
4. **Create repository** 클릭

---

### 1-2. 로컬 폴더를 GitHub에 연결 & 첫 Push

```bash
# 1. ai-researchlab.github.io 폴더로 이동
cd "C:\Users\parkjs\Desktop\AiRLab\AI_Trend\ai-researchlab.github.io"

# 2. Git 초기화
git init

# 3. 모든 파일 스테이징
git add .

# 4. 첫 커밋
git commit -m "feat: initial site setup"

# 5. 원격 레포 연결
git remote add origin https://github.com/AI-ResearchLab/ai-researchlab.github.io.git

# 6. main 브랜치로 설정 후 Push
git branch -M main
git push -u origin main
```

---

## 2. GitHub 레포 설정

> Push 완료 후 GitHub 웹에서 아래 설정을 해주세요. **딱 한 번만** 하면 됩니다.

### 2-1. Pages 배포 소스를 "GitHub Actions"으로 변경

```
레포 페이지 → Settings (설정) 탭
→ 왼쪽 사이드바: Pages
→ Build and deployment
→ Source: Deploy from a branch  ← 이걸
→ Source: GitHub Actions        ← 이걸로 변경
```

> 💡 이 설정을 **GitHub Actions**로 변경해야 `.github/workflows/pages.yml`이 작동합니다.

### 2-2. Actions 권한 확인

```
Settings → Actions → General
→ "Workflow permissions" 섹션
→ "Read and write permissions" 선택 ✅
→ Save
```

---

## 3. 첫 번째 Push 및 빌드 확인

Push 후 약 **1~3분** 이내에 자동으로 빌드됩니다.

### 빌드 상태 확인하는 법

```
레포 페이지 → Actions 탭
→ 최신 워크플로우 실행 확인
→ 초록색 체크 ✅ = 성공
→ 빨간색 X ❌ = 실패 (로그 클릭해서 원인 확인)
```

### 사이트 접속

빌드 성공 후 → `https://ai-researchlab.github.io` 접속

---

## 4. 팀원이 콘텐츠를 추가하는 법 (반복 작업)

> **핵심**: 마크다운 파일을 추가/수정하고 `main` 브랜치에 merge되면 자동으로 사이트가 업데이트됩니다.

### 4-1. 작업 흐름 (팀원 공통)

```bash
# 1. 최신 코드 받기
git pull origin main

# 2. 작업 브랜치 생성
git checkout -b feature/내이름-작업내용
# 예: git checkout -b feature/parkjs-llm-w27

# 3. 마크다운 파일 추가/수정
# (아래 콘텐츠 유형별 상세 방법 참고)

# 4. 커밋
git add .
git commit -m "feat: add LLM weekly trends W27"

# 5. Push
git push origin feature/parkjs-llm-w27

# 6. GitHub에서 PR 생성 → 팀원 리뷰 → Merge
# → Merge 즉시 GitHub Actions 자동 빌드 시작
```

---

### 4-2. 콘텐츠 유형별 파일 추가 방법

#### 📝 블로그 포스트 (주간 트렌드, 연구 분야 동향)

**파일 위치**: `content/posts/YYYY-MM-DD-제목.md`

```
파일명 규칙: 날짜-영문제목.md
예: content/posts/2026-07-08-agent-memory-trends.md
```

Front Matter 최소 필수 항목:

```yaml
---
title: "[LLM] 제목"
date: 2026-07-08
categories: [LLM]     # LLM / Vision / Multimodal / VLM / World Model / Weekly
tags: [llm, gpt]
excerpt: "홈 페이지에 표시될 요약 문장"
---

본문 내용...
```

---

#### 📄 AI 서베이 (논문 상세 리뷰)

**파일 위치**: `content/surveys/YYYY-MM-DD-논문약어.md`

```
예: content/surveys/2026-07-15-efficient-kv-cache.md
```

Front Matter 필수 항목:

```yaml
---
title: "논문 제목 전체"
date: 2026-07-15
category: "Agent"        # survey 페이지 테이블 그룹 기준
year: 2024
authors: "저자 et al."
contribution: "핵심 기여 한 줄 요약"
reviewer: "GitHub아이디"
paper_url: "https://arxiv.org/abs/..."
code_url: "https://github.com/..."
tags: [agent, memory]
---

본문...
```

---

#### 👥 팀원 추가/수정

`content/data/members.yml` 파일에 항목 추가:

```yaml
- name: "홍길동"
  role: "역할 설명"
  github: "honggildong"
  bio: "한 줄 소개"
  interests:
    - "LLM"
    - "Agent"
  avatar: "/assets/images/members/honggildong.jpg"  # 이미지 없으면 아래 사용
  avatar_placeholder: "홍"   # 이미지 없을 때 표시
```

아바타 이미지는 `assets/images/members/` 폴더에 업로드 (JPG/PNG, 정방형 권장).

---

### 4-3. 자동 배포 타임라인

```
팀원 PR → 리뷰 완료 → main 브랜치 Merge
    ↓
GitHub Actions 자동 시작 (약 10초 이내)
    ↓
빌드 (npm run build, 약 30초 이내)
    ↓
GitHub Pages 배포 완료
    ↓
https://ai-researchlab.github.io 업데이트 (약 1분 내)
```

총 소요 시간: **merge 후 약 1~2분**

---

## 5. 로컬에서 미리보기 하는 법

> PR을 올리기 전에 내 컴퓨터에서 먼저 확인하고 싶을 때 사용합니다.

### 5-1. Node.js 설치 (처음 한 번만)

[nodejs.org](https://nodejs.org/)에서 LTS 버전(20.x 이상) 설치 후 확인:

```bash
node -v    # v20.x.x 이상
npm -v
```

### 5-2. 의존성 설치 (처음 한 번만)

```bash
cd "C:\Users\parkjs\Desktop\AiRLab\AI_Trend\ai-researchlab.github.io"
npm install
```

### 5-3. 로컬 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:4000` 접속. 파일을 수정한 뒤에는 `npm run dev`를 다시 실행하면 됩니다 (저장할 때마다 자동 새로고침되는 기능은 아직 없습니다 - 필요해지면 추가 예정).

---

## 6. 자주 발생하는 문제 & 해결법

### ❌ 페이지가 404 뜸 (`/about/`, `/members/` 등)

**원인**: `npm run build`를 실행하지 않았거나, `content/pages/` 안의 마크다운 front matter가 깨짐

**해결**: `npm run build` 출력에서 에러 로그 확인, front matter의 `---` 구분선이 정확한지 확인

---

### ❌ Actions 탭에서 빌드 실패

**확인 방법**: Actions 탭 → 실패한 워크플로우 클릭 → 빨간색 단계 클릭 → 로그 확인

**흔한 원인**:

| 원인 | 해결 |
|------|------|
| front matter YAML 문법 오류 | `title:`, `date:` 등 콜론 뒤 공백, 따옴표 짝 확인 |
| `npm ci` 실패 | `package-lock.json`이 커밋되어 있는지 확인 |
| 이미지 경로 오류 | `avatar: "/assets/images/members/..."`처럼 `/`로 시작하는지 확인 |

---

### ❌ 사이트에 변경사항이 안 보임

1. Actions 탭에서 빌드가 완료됐는지 확인
2. 브라우저 캐시 강제 새로고침: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
3. GitHub Pages CDN 전파 시간: 최대 5분 대기

---

### ❌ 한국어가 깨짐

**원인**: 파일을 UTF-8 BOM으로 저장

**해결**: VS Code에서 파일 저장 시
- 우측 하단 `UTF-8` 클릭 → `UTF-8 without BOM` 선택

---

## 워크플로우 파일 설명 (`.github/workflows/pages.yml`)

```yaml
on:
  push:
    branches: [main]     # main 브랜치 push 시 자동 실행
  workflow_dispatch:     # 수동 실행 버튼 (Actions 탭에서 클릭 가능)
```

수동으로 빌드 트리거가 필요할 때:
```
Actions 탭 → "Build & Deploy" → "Run workflow" 버튼
```

---

*문제가 해결되지 않으면 [Issues](https://github.com/AI-ResearchLab/ai-researchlab.github.io/issues)에 등록해주세요.*
