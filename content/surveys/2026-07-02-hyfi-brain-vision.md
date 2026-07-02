---
title: "HyFI: Hyperbolic Feature Interpolation for Brain-Vision Alignment"
date: 2026-07-02
category: "Multimodal"
year: 2026
authors: "Sangmin Jo, Wootaek Jeong, Da-Woon Heo, Yoohwan Hwang, Heung-Il Suk"
contribution: "뇌파(EEG/MEG) 신호로부터 시각 이미지를 검색하는 brain-vision alignment 과제에서, semantic·perceptual 특징을 쌍곡공간(hyperbolic space)에서 보간해 정렬 성능을 개선하는 방법."
reviewer: "junseong01"
paper_url: "https://arxiv.org/abs/2603.22721"
tags: [multimodal, brain-decoding, representation-learning]
excerpt: "뇌파(EEG/MEG) 신호로부터 시각 이미지를 검색하는 brain-vision alignment 과제에서, semantic·perceptual 특징을 쌍곡공간(hyperbolic space)에서 보간해 정렬 성능을 개선하는 방법."
---

## 1️⃣  한 줄 요약

> 뇌파(EEG/MEG) 신호로부터 시각 이미지를 검색하는 brain-vision alignment 과제에서, semantic·perceptual 특징을 쌍곡공간(hyperbolic space)에서 보간해 정렬 성능을 개선하는 방법.

---

## 2️⃣  배경 & 동기 (Why now?)

사람이 이미지를 볼 때 뇌에서 발생하는 전기적 신호를 역으로 이용해 어떤 이미지를 보고 있는지 식별하는 과제를 **visual brain decoding**이라 합니다. fMRI는 공간 해상도가 높지만 장비가
크고 시간 해상도가 낮아 실생활 적용에 제약이 있습니다. HyFI는 대신 **EEG/MEG**를 채택합니다 — 밀리초 단위로 뇌 반응을 잡아낼 수 있고 장비도 훨씬 작아 실용성이 높기 때문입니다.

---

## 3️⃣  핵심 방법론

### 기존 방식의 한계

최근 연구들은 뇌 신호에서 두 종류의 시각 정보를 분리 추출하는 **dual-pathway** 구조를 씁니다.
- **Semantic feature**: CLIP 같은 비전-언어 모델로 추출 (객체 카테고리 등 의미 정보)
- **Perceptual feature**: VAE로 추출 (색상, 윤곽선, 방향 등 저수준 정보)

두 경로를 각각 뇌 신호와 병렬로 정렬하는 방식이라, semantic과 perceptual 정보 사이의 관계(거리 기하학)를 제대로 반영하지 못하는 한계가 있었습니다.

### 주요 컴포넌트

1. **Hyperbolic Feature Interpolation**: semantic과 perceptual 특징을 쌍곡공간 상에서 보간해, 두 정보 사이의 위계적·기하학적 관계를 유지한 채 뇌 신호와 정렬
2. **Brain-Vision Alignment**: EEG/MEG 신호를 보간된 특징 공간에 매핑해 이미지를 검색

---

## 4️⃣  실험 결과

### 주목할 만한 결과

- Figure 1을 통해 전체 방법론 구조(dual-pathway → hyperbolic interpolation → alignment) 제시
- 구체적인 벤치마크 수치는 원 논문(AAAI 2026) 확인 필요 — 리뷰 작성 시 참고한 블로그 글에는 수치가 포함되어 있지 않았습니다.

---

## 5️⃣  한계 & 향후 과제

### 저자들이 인정한 한계
- (원 논문 확인 필요)

### 리뷰어가 느낀 추가 한계
- 이론적 설명 위주로 정리해서, 정량적 성능 비교는 원 논문을 더 봐야 판단 가능

---

## 6️⃣  팀 인사이트 💡

### 왜 중요한가

Dual-pathway 방식에서 각 경로를 독립적으로 뇌 신호와 정렬하던 기존 접근과 달리, semantic·perceptual 정보 사이의 기하학적 관계 자체를 쌍곡공간으로 모델링했다는 점이 새롭습니다. EEG
기반 저비용 장비로 fMRI 수준의 정렬 품질에 다가가려는 BCI 흐름과 맞닿아 있습니다.

### 실무 활용 가능성

멀티모달 표현학습에서 서로 다른 정보(의미 vs. 저수준 지각)를 하나의 공간에 억지로 합치기보다, 쌍곡공간처럼 위계 구조를 보존하는 임베딩 공간을 쓰는 아이디어는 BCI 외의 멀티모달 정렬
문제에도 응용해볼 만합니다.

### 후속 행동
- [ ] 원 논문(arXiv:2603.22721) 정독 후 실험 수치 보강
- [ ] 관련 논문 추가 리뷰 예정: dual-pathway 계열 선행 연구
- [ ] `implementations/` 레포에서 직접 구현 예정: `[ ]`

---

## 7️⃣  관련 자료

| 유형 | 링크 |
|------|------|
| arXiv | [arXiv:2603.22721](https://arxiv.org/abs/2603.22721) |
| DOI | [10.1609/aaai.v40i7.37476](https://doi.org/10.1609/aaai.v40i7.37476) |
| 원 블로그 리뷰 | [준성이의 AI 개발 노트](https://junseong-ai.tistory.com/25) |

---

*이 리뷰는 [AI-ResearchLab](https://github.com/AI-ResearchLab) 팀이 작성했습니다.*
*오류나 의견은 [이슈](https://github.com/AI-ResearchLab/paper-reviews/issues)로 남겨주세요.*
