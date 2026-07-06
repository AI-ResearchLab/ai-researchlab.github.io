# 🧠 AI Research Lab

> AI 최신 트렌드 팔로업 & 연구 동향 아카이브 - [AI-ResearchLab](https://github.com/AI-ResearchLab) 팀의 공동 포트폴리오 사이트

[![Deploy](https://github.com/AI-ResearchLab/ai-researchlab.github.io/actions/workflows/pages.yml/badge.svg)](https://github.com/AI-ResearchLab/ai-researchlab.github.io/actions/workflows/pages.yml)

🔗 **[ai-researchlab.github.io](https://ai-researchlab.github.io)**

## 소개

최신 AI 논문 서베이, 연구 분야별(Computer Vision · LLM · Multimodal · VLM · VLA · World Model 등) 트렌드,
팀원 소개를 큐레이션하는 팀 포트폴리오 사이트입니다.

## Tech Stack

- **Build**: Node.js + 자체 정적 사이트 생성 스크립트 (`scripts/build.js`)
- **Markdown → HTML**: markdown-it
- **Styles**: Sass
- **Deploy**: GitHub Actions → GitHub Pages (`.github/workflows/pages.yml`)

## 프로젝트 구조

```
content/
├── posts/      # 트렌드 블로그 포스트
├── surveys/    # 논문 서베이
├── pages/      # 소개 등 고정 페이지
└── data/       # members.yml, navigation.yml
scripts/        # 빌드 스크립트
styles/         # Sass 스타일
assets/         # 이미지, JS
```

## 로컬 실행

```bash
npm install
npm run dev   # http://localhost:4000
```

## 콘텐츠 기여

팀원이 포스트/서베이를 추가하는 방법, PR 절차는 **[CONTRIBUTING.md](./CONTRIBUTING.md)** 참고.

## License

MIT
