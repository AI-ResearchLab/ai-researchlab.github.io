# 🏗 사이트 빌드 아키텍처

이 문서는 `npm run build` 실행 시 `content/`의 마크다운 파일들이 어떻게 `dist/`의 정적 HTML로
변환되는지, 전체 파이프라인을 정리합니다.

## 전체 흐름

```
content/*.md, content/data/*.yml, site.config.yml
            │
            ▼
      scripts/build.js  (엔트리 포인트)
            │
   ┌────────┼────────────────────────────┐
   ▼        ▼                            ▼
 CSS 빌드   콘텐츠 로드                  정적 자산 복사
 (Sass)    (posts, surveys, members)    (assets/js, assets/images)
            │
            ▼
      scripts/lib/render-*.js  (HTML 생성)
            │
            ▼
      scripts/lib/util.js  (파일 쓰기 → dist/)
            │
            ▼
         dist/  ──▶  GitHub Actions ──▶  GitHub Pages
```

## 모듈별 역할

| 파일 | 역할 |
|------|------|
| `scripts/build.js` | 빌드 엔트리 포인트. `dist/` 초기화 → 설정/콘텐츠 로드 → CSS 빌드 → 각 페이지 렌더 → sitemap/feed/404 생성 |
| `scripts/serve.js` | `dist/`를 `localhost:4000`에서 정적으로 서빙 (로컬 미리보기용, `npm run dev`가 build 후 실행) |
| `scripts/lib/markdown.js` | 마크다운 파일의 front matter(YAML)와 본문을 분리하고, markdown-it으로 HTML 변환 + 목차(toc) 추출 |
| `scripts/lib/render-posts.js` | `content/posts/`, `content/surveys/`를 읽어 목록 로드, 각 글의 상세 페이지 HTML 생성 |
| `scripts/lib/render-pages.js` | 홈/소개/팀원/서베이 인덱스/카테고리 페이지 등 "고정" 페이지 HTML 생성 |
| `scripts/lib/layout.js` | 모든 페이지가 공유하는 헤더·푸터·`<head>`를 감싸는 공통 레이아웃 |
| `scripts/lib/feed.js` | `feed.xml`(Atom), `sitemap.xml` 생성 |
| `scripts/lib/util.js` | 파일/디렉토리 쓰기 유틸 (`writePage`가 URL 경로를 `dist/.../index.html`로 변환) |

## 콘텐츠 → URL 매핑

| 콘텐츠 | 경로 규칙 | 예 |
|--------|----------|-----|
| 블로그 포스트 | `content/posts/YYYY-MM-DD-슬러그.md` | `/blog/YYYY/MM/DD/슬러그/` |
| 서베이 | `content/surveys/YYYY-MM-DD-슬러그.md` | `/survey/YYYY-MM-DD-슬러그/` |
| 고정 페이지 | `content/pages/*.md` | `/about/` 등 |
| 팀원 | `content/data/members.yml` | `/members/` |
| 카테고리 | `scripts/lib/render-pages.js`의 `CATEGORIES` 상수 | `/categories/llm/` 등 |

## 배포

`main` 브랜치에 push되면 `.github/workflows/pages.yml`이 `npm ci` → `npm run build` →
`dist/`를 GitHub Pages에 업로드합니다. 자세한 절차는 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) 참고.
