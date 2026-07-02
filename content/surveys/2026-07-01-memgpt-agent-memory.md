---
# ================================================================
# [템플릿] AI 서베이 논문 리뷰
# 파일명 규칙: YYYY-MM-DD-논문약어.md
# 저장 위치: _surveys/
# ================================================================

title: "MemGPT: Towards LLMs as Operating Systems"
date: 2026-07-01
last_modified_at: 2026-07-01

# ── 서베이 메타데이터 ───────────────────────────────────────────
category: "Agent"          # survey.md 인덱스 페이지의 테이블 그룹으로 사용됨
year: 2023
authors: "Charles Packer, Vivian Fang, Shishir G. Patil et al."
contribution: "LLM의 컨텍스트 윈도우를 가상 메모리처럼 관리해 무한 대화 기억 구현"
reviewer: "member1"        # 리뷰어 GitHub 아이디

# ── 논문 링크 ──────────────────────────────────────────────────
paper_url: "https://arxiv.org/abs/2310.08560"
code_url: "https://github.com/cpacker/MemGPT"
project_url: "https://memgpt.ai"

# ── 태그 ───────────────────────────────────────────────────────
tags: [agent, memory, llm, long-context]

# ── 레이아웃 ───────────────────────────────────────────────────
layout: single
classes: wide
toc: true
toc_label: "목차"
toc_icon: "list"
toc_sticky: true
author_profile: false
read_time: true
show_date: true

# ── 리뷰 깊이 ──────────────────────────────────────────────────
# review_depth: "빠른 스캔" / "표준 리뷰" / "딥다이브"
review_depth: "딥다이브"

# ── 홈·목록 페이지 발췌 ─────────────────────────────────────────
excerpt: "LLM의 컨텍스트 윈도우를 OS의 가상 메모리처럼 관리해 무한 대화 기억을 구현. AI 에이전트 메모리 연구의 이정표."
---

## 📌 한 줄 요약

> LLM의 한정된 컨텍스트 윈도우를 **OS의 가상 메모리 계층**처럼 관리해, 이론적으로 무제한의 대화 기억을 가능하게 한다.

---

## 📊 논문 정보

| 항목 | 내용 |
|------|------|
| **제목** | MemGPT: Towards LLMs as Operating Systems |
| **arXiv** | [2310.08560](https://arxiv.org/abs/2310.08560) |
| **저자** | Charles Packer, Vivian Fang, Shishir G. Patil et al. |
| **소속** | UC Berkeley |
| **발표** | NeurIPS 2023 Workshop / arXiv 2023-10 |
| **코드** | [cpacker/MemGPT](https://github.com/cpacker/MemGPT) ⭐ 11.2k |
| **리뷰어** | @{{ page.reviewer }} |
| **리뷰 날짜** | {{ page.date | date: "%Y-%m-%d" }} |

---

## 2️⃣ 배경 & 동기

### 기존 LLM의 핵심 한계

LLM은 고정된 **컨텍스트 윈도우(Context Window)** 안에서만 정보를 처리할 수 있습니다.
GPT-4의 경우 최대 128K 토큰이지만, 이는 장시간 대화나 방대한 문서 처리에 여전히 부족합니다.

```
문제: 대화 길이 > 컨텍스트 윈도우 → 초반 내용 망각
결과: 에이전트의 일관성 붕괴, 장기 프로젝트 수행 불가
```

### 핵심 아이디어의 출발점

저자들은 이 문제를 **OS의 가상 메모리 문제**와 동일하게 바라봤습니다.
OS는 물리 RAM이 부족할 때 디스크를 보조 메모리로 활용합니다. MemGPT는 이 아이디어를 LLM에 적용합니다.

---

## 3️⃣ 핵심 방법론

### 메모리 계층 구조

```
┌─────────────────────────────┐
│   Main Context (Fast)       │ ← 현재 작업 중인 정보 (컨텍스트 윈도우)
├─────────────────────────────┤
│   External Storage (Slow)   │ ← 벡터 DB, 파일 시스템 (무제한)
└─────────────────────────────┘
```

MemGPT는 두 계층 사이에서 **LLM이 직접 메모리를 관리**하도록 합니다.

### 주요 컴포넌트

1. **Main Context**: LLM의 실제 컨텍스트 윈도우. 현재 대화와 핵심 메모리 포함
2. **Archival Storage**: 벡터 DB 기반 장기 기억 저장소. LLM이 함수 호출로 접근
3. **Memory Functions**: `core_memory_append()`, `archival_memory_search()` 등 메모리 조작 함수
4. **Pagination Controller**: 컨텍스트 초과 시 자동으로 메모리 교체

---

## 4️⃣ 실험 결과

### 주요 벤치마크

| 태스크 | 기존 GPT-4 | MemGPT | 개선폭 |
|-------|-----------|--------|-------|
| 장기 대화 일관성 (1000턴) | 31.2% | **72.4%** | +41.2%p |
| 문서 Q&A (100페이지) | 45.8% | **89.1%** | +43.3%p |
| 다중 세션 태스크 완료율 | 12.3% | **61.7%** | +49.4%p |

### 주목할 만한 발견

- 메모리 함수 호출 오버헤드: 평균 응답 속도 **~15% 감소** (허용 범위)
- 컨텍스트 초과 상황에서도 **핵심 정보 유지율 94.2%**

---

## 5️⃣ 한계 & 향후 과제

### 저자들이 인정한 한계
- 메모리 함수 호출 판단은 여전히 LLM에 의존 → 간헐적 실수 발생
- 실시간 처리에서 외부 저장소 접근 지연 문제

### 리뷰어가 느낀 추가 한계
- 벡터 검색의 정확도가 전체 성능의 병목이 될 수 있음
- 오픈소스 LLM에서의 함수 호출 안정성 검증 부족

---

## 6️⃣ 팀 인사이트 💡

### AI 연구 흐름에서의 위치

MemGPT는 "에이전트 메모리" 연구의 이정표 논문입니다.
이후 등장한 **LangMem, Zep, MemoryOS** 등 모두 이 논문의 영향을 받았습니다.

### 실무 활용 가능성

```python
# MemGPT (현재 Letta로 리브랜딩) 사용 예시
from letta import create_client

client = create_client()
agent = client.create_agent(
    name="my-persistent-agent",
    memory=ChatMemory(
        human="사용자는 백엔드 개발자입니다.",
        persona="나는 AI 코딩 어시스턴트입니다."
    )
)
```

> **우리 팀 프로젝트 활용**: `implementations/` 레포의 에이전트 메모리 실험에 MemGPT 아키텍처를 참고

### 후속 행동
- [x] 공식 코드 탐색: [cpacker/MemGPT](https://github.com/cpacker/MemGPT)
- [ ] 관련 논문 추가 리뷰 예정: ReadAgent (2024), MemoryOS (2025)
- [ ] `implementations/` 에서 경량 버전 직접 구현 예정

---

## 7️⃣ 관련 자료

| 유형 | 링크 |
|------|------|
| 공식 코드 (Letta) | [cpacker/MemGPT](https://github.com/cpacker/MemGPT) |
| 프로젝트 페이지 | [letta.ai](https://www.letta.com/) |
| 설명 블로그 | [MemGPT 핵심 정리](https://lilianweng.github.io/) |
| 관련 논문: ReadAgent | [arXiv 2402.09727](https://arxiv.org/abs/2402.09727) |
| 관련 논문: MemoryOS | [arXiv 2506.06926](https://arxiv.org/abs/2506.06926) |

---

*이 리뷰는 [AI-ResearchLab](https://github.com/AI-ResearchLab) 팀이 작성했습니다. 오류나 의견은 [이슈](https://github.com/AI-ResearchLab/paper-reviews/issues)로 남겨주세요.*
