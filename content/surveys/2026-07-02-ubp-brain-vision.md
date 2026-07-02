---
title: "Bridging the Vision-Brain Gap with an Uncertainty-Aware Blur Prior"
date: 2026-07-02
category: "Multimodal"
year: 2025
authors: "Haitao Wu, Qing Li, Changqing Zhang, Zhen He, Xiaomin Ying"
contribution: "뇌파(EEG/MEG)-이미지 검색(brain-to-image retrieval)에서 발생하는 두 종류의 정보 비대칭 — **System Gap**(시각계 vs 카메라의 해상도 차이)과 **Random Gap**(뇌 신호 자체의 변동성) — 을 통계적 불확실성 추정으로 정량화하고, 이를 이미지에 대한 동적 blur로 반영해 정렬 성능을 크게 끌어올린 방법."
reviewer: "junseong01"
paper_url: "https://arxiv.org/abs/2503.04207"
code_url: "https://github.com/HaitaoWuTJU/Uncertainty-aware-Blur-Prior"
tags: [multimodal, brain-decoding, uncertainty]
excerpt: "뇌파(EEG/MEG)-이미지 검색(brain-to-image retrieval)에서 발생하는 두 종류의 정보 비대칭 — **System Gap**(시각계 vs 카메라의 해상도 차이)과 **Random Gap**(뇌 신호 자체의 변동성) — 을 통계적 불확실성 추정으로 정량화하고, 이를 이미지에 대한 동적 blur로 반영해 정렬 성능을 크게 끌어올린 방법."
---

## 1️⃣ 한 줄 요약

> 뇌파(EEG/MEG)-이미지 검색(brain-to-image retrieval)에서 발생하는 두 종류의 정보 비대칭 — **System Gap**(시각계 vs 카메라의 해상도 차이)과 **Random Gap**(뇌 신호 자체의 변동성) — 을 통계적 불확실성 추정으로 정량화하고, 이를 이미지에 대한 동적 blur로 반영해 정렬 성능을 크게 끌어올린 방법.

---

## 2️⃣ 배경 & 동기 (Why now?)

기존 brain-to-image retrieval 연구들은 대체로 CLIP 임베딩과 EEG/MEG 신호를 대조학습(contrastive learning)으로 직접 정렬하는 데 집중해왔습니다. 문제는 이 접근이 "뇌 신호와 이미지가 애초에 같은 양의 정보를 담고 있지 않다"는 사실을 무시한다는 점입니다.

- 사람의 눈은 중심와(fovea)만 고해상도로 처리하고 주변부는 저해상도로 처리하기 때문에, 뇌 신호에는 원본 이미지의 고주파(high-frequency) 디테일이 애초에 담기지 않습니다. 이 논문은 이를 **System Gap**이라 부릅니다.
- 동일한 이미지를 보더라도 주의력 변화, 무의식적 연상, 전극 접촉 노이즈 등으로 인해 뇌 신호는 매번 다르게 나타납니다. 이를 **Random Gap**이라 부릅니다.

이 두 갭을 무시한 채 "쌍(pair)이니까 무조건 가깝게 정렬하라"는 대조학습을 강제하면, 모델이 존재하지도 않는 정보를 억지로 맞추려다 정렬 품질이 오히려 떨어집니다. 이 논문은 두 갭을 명시적으로 정의하고 정량화한 뒤, 이를 학습 신호에 반영한다는 점에서 기존 연구와 결이 다릅니다.

---

## 3️⃣ 핵심 방법론

### 기존 방식의 한계

뇌 신호-이미지 쌍을 "노이즈 없는 정답 쌍"처럼 취급하고 대조학습을 적용하는 방식은, 실제로는 신뢰도가 낮은 쌍(강한 Random Gap)까지 동일한 강도로 정렬을 강요합니다. 결과적으로 모델이 노이즈가 큰 샘플에 과적합되거나, 신뢰도가 높은 샘플의 정렬 품질까지 함께 희생됩니다.

### 주요 컴포넌트

1. **유사도 기반 불확실성 추정**: 뇌 신호-이미지 쌍의 유사도 점수가 정규분포 N(μ̂, σ̂²)를 따른다고 가정하고, 신뢰구간 [μ̂ − z_{α/2}·σ̂, μ̂ + z_{α/2}·σ̂]을 계산합니다. 이 구간 폭이 곧 해당 쌍의 "신뢰도"를 나타냅니다.
2. **Uncertainty-Aware Blur Prior (UBP)**: 추정된 신뢰도에 따라 원본 이미지에 적용하는 blur 반경을 동적으로 조절합니다.
   - 유사도 점수가 신뢰구간 안에 들어오면 기본 blur 반경 r₀ 적용
   - 신뢰구간 하한보다 낮으면(=신뢰도가 낮은 쌍) 더 약한 blur (r₀ − c)
   - 신뢰구간 상한보다 높으면(=신뢰도가 높은 쌍) 더 강한 blur (r₀ + c)
3. **정렬 학습에 반영**: 이렇게 blur 처리된 이미지를 대조학습의 타깃으로 사용해, 뇌 신호가 실제로 담고 있지 않은 고주파 정보까지 억지로 맞추도록 강요하지 않으면서 정렬을 수행합니다.

핵심 아이디어는 "뇌 신호가 표현할 수 없는 디테일을 이미지 쪽에서 미리 지워줌으로써, 두 모달리티 간 정보량을 맞춘다"는 것입니다.

---

## 4️⃣ 실험 결과

### 주요 벤치마크 (THINGS-EEG, zero-shot brain-to-image retrieval)

| 벤치마크 | 기존 SOTA (VE-SDN) | 이 논문 (UBP) | 개선폭 |
|---------|----------|--------|-------|
| Top-1 Accuracy | 37.2% | 50.9% | +13.7 |
| Top-5 Accuracy | 69.9% | 79.7% | +9.8 |

### 주목할 만한 결과

- THINGS-EEG 기준 baseline 전체 비교: BraVL (Top-1 5.8% / Top-5 17.5%) → NICE (16.1% / 43.6%) → ATM-S (28.5% / 60.4%) → VE-SDN (37.2% / 69.9%) → **UBP (50.9% / 79.7%)** 순으로, 최근 SOTA(VE-SDN) 대비로도 두 자릿수 개선폭을 보입니다.
- THINGS-MEG 데이터셋(4명, 학습 1854개 개념 / 테스트 200개 개념)에서도 실험을 진행했지만, 구체적 수치는 이번 리뷰에서 확보하지 못했습니다 — 원 논문 표 확인이 필요합니다.
- 별도의 학습 가능한 모듈 없이 통계적 신뢰구간 계산만으로 blur 강도를 조절하는 방식임에도 baseline 대비 큰 폭의 개선을 보였다는 점이 인상적입니다.

---

## 5️⃣ 한계 & 향후 과제

### 저자들이 인정한 한계

- UBP는 blur라는 단순한 prior로 고주파 정보 손실을 근사할 뿐이라, 완전한 모델은 아님을 인정하고 있습니다. 저자들은 "더 발전된 학습 기반(learnable) 방법이 이 근사를 개선해 일반화 성능을 높일 수 있을 것"이라 언급합니다.
- 지각·인지 과정의 복잡성 때문에, 불확실성 정량화 자체가 실제 신뢰도를 정확히 반영하지 못할 가능성도 인정하고 있습니다.

### 리뷰어가 느낀 추가 한계

- blur 반경(r₀, c)과 신뢰수준(α) 등 하이퍼파라미터가 고정된 파라메트릭 방식이라, 데이터셋이나 모달리티(EEG ↔ MEG)가 바뀔 때마다 재튜닝이 필요할 가능성이 있습니다.
- 참고한 블로그 글에서도 지적된 부분인데, "두 갭을 정의했다"는 문제 설정의 참신함에 비해 UBP 자체의 수식·절차에 대한 설명은 원 논문에서도 상대적으로 간결한 편이라, 재현 시 세부 구현(신뢰구간 추정 주기, 배치 단위 재계산 여부 등)을 코드에서 직접 확인할 필요가 있습니다.

---

## 6️⃣ 팀 인사이트 💡

### 왜 중요한가

기존 brain-vision alignment 연구 다수가 "정렬 모델 구조를 어떻게 더 정교하게 만들 것인가"에 집중했다면, 이 논문은 그 이전 단계로 돌아가 "애초에 두 모달리티 사이에 왜 정렬이 어려운가"를 System Gap / Random Gap이라는 두 축으로 진단하고, 그 진단을 그대로 통계적 처방(불확실성 기반 blur)으로 연결했다는 점에서 진단과 해법이 일관됩니다. 같은 도메인을 기하학적 임베딩 구조로 접근한 [HyFI 리뷰](./2026-07-02-hyfi-brain-vision.md)와 비교하면, brain-vision alignment 문제를 (1) 임베딩 공간의 기하학적 구조를 바꾸는 접근과 (2) 데이터 자체의 노이즈·신뢰도를 다루는 접근, 두 갈래로 나눠볼 수 있어 흥미롭습니다.

### 실무 활용 가능성

- 페어링된 멀티모달 데이터의 신뢰도가 샘플마다 다른 상황(weak supervision, 약한 라벨링, 센서 노이즈가 큰 데이터 등)에서 "샘플별 불확실성 추정 → augmentation/loss 강도 조절"이라는 패턴은 brain decoding 외의 대조학습 파이프라인에도 그대로 적용해볼 수 있습니다.
- 별도의 학습 가능한 모듈 없이 통계적 신뢰구간만으로 구현 가능해, 기존 contrastive learning 파이프라인에 비교적 가볍게 plug-in할 수 있다는 점도 실무 적용 관점에서 매력적입니다.

### 후속 행동
- [ ] 공식 코드 탐색: [GitHub](https://github.com/HaitaoWuTJU/Uncertainty-aware-Blur-Prior)
- [ ] 관련 논문 추가 리뷰 예정: HyFI 등 dual-pathway/기하학적 정렬 계열과의 비교 리뷰
- [ ] `implementations/` 레포에서 직접 구현 예정: `[ ]`

---

## 7️⃣ 관련 자료

| 유형 | 링크 |
|------|------|
| 공식 코드 | [GitHub](https://github.com/HaitaoWuTJU/Uncertainty-aware-Blur-Prior) |
| arXiv | [arXiv:2503.04207](https://arxiv.org/abs/2503.04207) |
| 원 블로그 리뷰 | [준성이의 AI 개발 노트](https://junseong-ai.tistory.com/26) |

---

*이 리뷰는 [AI-ResearchLab](https://github.com/AI-ResearchLab) 팀이 작성했습니다.*
*오류나 의견은 [이슈](https://github.com/AI-ResearchLab/paper-reviews/issues)로 남겨주세요.*
