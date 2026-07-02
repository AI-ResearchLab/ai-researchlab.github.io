# 기여 가이드 — ai-researchlab.github.io

## 팀원이 콘텐츠를 추가하는 법

### 1. 블로그 포스트 (연구 분야별 트렌드)

**저장 위치**: `content/posts/YYYY-MM-DD-제목.md`

```yaml
---
title: "[LLM] 제목"
date: YYYY-MM-DD
categories: [LLM]         # LLM / Vision / Multimodal / VLM / World Model / Weekly
tags: [llm, gpt]
excerpt: "홈 페이지에 표시될 요약"
---
본문...
```

### 2. 논문 서베이

**저장 위치**: `content/surveys/YYYY-MM-DD-논문약어.md`
**샘플**: `content/surveys/2026-07-01-memgpt-agent-memory.md` 참고

```yaml
---
title: "논문 제목"
category: "Agent"          # 서베이 인덱스 페이지의 그룹으로 사용됨
year: 2024
authors: "저자 et al."
contribution: "핵심 기여 한 줄 요약"
reviewer: "GitHub아이디"
paper_url: "https://arxiv.org/abs/..."
code_url: "https://github.com/..."
date: YYYY-MM-DD
tags: [agent, memory]
---
본문...
```

### 3. 팀원 추가

`content/data/members.yml` 파일에 항목 추가 후 PR.

### 4. PR 절차

```
1. feature/이름-설명 브랜치 생성
2. 마크다운 파일 추가/수정
3. PR 생성 → 팀원 1명 리뷰
4. 머지 → GitHub Actions 자동 빌드·배포
5. https://ai-researchlab.github.io 에서 확인
```

## 로컬 개발 환경

```bash
# 의존성 설치 (Node.js 20+ 필요)
npm install

# 빌드 (dist/ 생성)
npm run build

# 빌드 + 로컬 서버 실행 (http://localhost:4000)
npm run dev
```

## 카테고리 목록

| 카테고리 | 내용 |
|---------|------|
| `LLM` | 대형 언어 모델 관련 |
| `Vision` | 컴퓨터 비전 |
| `Multimodal` | 멀티모달 |
| `VLM` | Vision-Language Model |
| `World Model` | 세계 모델·환경 시뮬레이션 |
| `Weekly` | 주간 트렌드 요약 |
