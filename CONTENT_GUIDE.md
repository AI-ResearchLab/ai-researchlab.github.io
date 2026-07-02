# 📝 콘텐츠 작성 가이드 — 연구분야·서베이 카테고리 원리

이 문서는 팀원이 글을 쓸 때 "왜 이렇게 써야 카테고리에 뜨는지"를 이해하기 위한 가이드입니다.
파일 하나 추가하는 절차뿐 아니라, 그 파일이 어떤 규칙으로 카테고리 페이지에 나타나는지까지 정리합니다.

## 콘텐츠 타입은 두 가지뿐입니다

| 타입 | 저장 위치 | 성격 | 분류 필드 |
|------|----------|------|-----------|
| **블로그 포스트** | `content/posts/` | 짧은 트렌드/동향 글. 상단 내비 "연구 분야" 메뉴와 연결됨 | `categories` (배열, 복수 가능) |
| **AI 서베이** | `content/surveys/` | 논문 딥다이브 리뷰. 상단 내비 "AI Survey" 메뉴와 연결됨 | `category` (문자열, 단수 하나) |

**포스트는 `categories`(복수형 배열), 서베이는 `category`(단수형 문자열)** — 필드명과 타입이 서로 다릅니다.
헷갈려서 반대로 쓰면 카테고리 페이지에 안 뜨니 주의하세요.

---

## 1. "연구 분야" 카테고리가 생기는 원리 (포스트)

### 1-1. 카테고리는 코드에 고정된 5개뿐입니다

`scripts/lib/render-pages.js`에 다음과 같이 하드코딩되어 있습니다:

```js
const CATEGORIES = [
  { slug: 'llm', emoji: '🧠', title: 'LLM' },
  { slug: 'vision', emoji: '👁️', title: 'Vision' },
  { slug: 'multimodal', emoji: '🎨', title: 'Multimodal' },
  { slug: 'vlm', emoji: '🤖', title: 'VLM' },
  { slug: 'world-model', emoji: '🌍', title: 'World Model' },
];
```

이 5개가 곧 `content/data/navigation.yml`의 "연구 분야" 드롭다운 메뉴 항목이고,
`/categories/llm/`, `/categories/vision/` 같은 개별 카테고리 페이지가 빌드됩니다.
**즉, 여기 없는 이름(예: "RAG", "Agent")으로 분류하면 전용 카테고리 페이지 자체가 없습니다.**
새 분야를 추가하려면 이 배열과 `navigation.yml`을 함께 수정해야 합니다.

### 1-2. 포스트가 특정 카테고리 페이지에 뜨는 조건

`renderCategoryPages()`가 하는 일:

```js
const matched = posts.filter((p) => (p.data.categories || []).includes(cat.title));
```

포스트 front matter의 `categories` 배열 안에 `'LLM'`, `'Vision'` 같은 **문자열이 정확히 일치**해야 합니다.
대소문자·띄어쓰기가 다르면(`'llm'`, `'LLm '` 등) 매칭되지 않아 카테고리 페이지에 나타나지 않습니다.

```yaml
categories:
  - LLM      # ✅ /categories/llm/ 에 뜸
  - Weekly   # ⚠️ CATEGORIES 목록에 없는 이름 — 전용 페이지는 없지만 아래 "전체 보기"에는 뜸
```

### 1-3. "카테고리 전체 보기"(`/categories/`)는 다르게 동작합니다

`renderCategoriesIndex()`는 5개 고정 목록을 쓰지 않고, **실제 포스트들의 `categories` 값을 그대로 그룹 이름으로 사용**합니다.

```js
posts.forEach((p) => {
  (p.data.categories || []).forEach((cat) => {
    (byCategory[cat] = byCategory[cat] || []).push(p);
  });
});
```

그래서 오타로 `'llm'`이라고 쓰면 `/categories/` 페이지엔 "llm"이라는 별도 그룹이 새로 생기지만,
정작 `/categories/llm/` 상세 페이지(1-2번 규칙)에는 뜨지 않는 **불일치가 발생**할 수 있습니다.
반드시 `LLM / Vision / Multimodal / VLM / World Model` 중 하나를 **철자 그대로** 쓰세요.

---

## 2. AI 서베이(논문 리뷰) 카테고리 원리

서베이는 포스트와 달리 고정 목록이 없습니다. `renderSurveyIndex()`가 하는 일:

```js
const cat = s.data.category || '기타';
(byCategory[cat] = byCategory[cat] || []).push(s);
```

front matter의 `category`(단수) 문자열을 **그대로 테이블 그룹 제목**으로 사용합니다.
즉 `category: "Agent"`라고 쓰면 `/survey/` 페이지에 "Agent"라는 그룹이 생기고,
같은 문자열을 쓴 서베이끼리 같은 표에 모입니다. 고정된 값 목록이 없으므로 팀 내에서
쓰는 카테고리 이름(`Agent`, `RAG`, `LLM`, `Vision` 등)을 미리 맞춰두는 게 좋습니다.

---

## 3. 파일명 규칙과 파싱 원리

`scripts/lib/render-posts.js`의 정규식이 파일명을 파싱합니다:

```js
const FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;
```

- 파일명은 반드시 `YYYY-MM-DD-슬러그.md` 형식이어야 날짜/슬러그가 정상 추출됩니다.
- 규칙에 안 맞는 파일명이어도 빌드는 되지만(`slug`가 파일명 전체로 대체), URL(`/blog/.../슬러그/`)과 정렬(날짜순)이 의도한 대로 동작하지 않습니다.
- 정렬은 파일명이 아니라 **front matter의 `date` 값** 기준입니다 (`loadCollection`의 `.sort()` 참고).

---

## 4. 실제로 글 하나 추가하는 절차

### 4-1. 연구 분야 블로그 포스트

1. `content/posts/YYYY-MM-DD-영문슬러그.md` 파일 생성
2. front matter 작성:
   ```yaml
   ---
   title: "[LLM] 제목"
   date: 2026-07-08
   categories: [LLM]     # 위 5개 중 정확한 철자로
   tags: [llm, gpt]
   excerpt: "홈/목록 페이지에 표시될 한 줄 요약"
   ---
   본문...
   ```
3. `npm run build` (또는 `npm run dev`)로 로컬 확인:
   - `/categories/llm/` 에 카드가 뜨는지
   - `/categories/` 전체 보기에도 뜨는지
   - `/blog/2026/07/08/영문슬러그/` 상세 페이지가 열리는지

### 4-2. AI 서베이(논문 리뷰)

1. `content/surveys/YYYY-MM-DD-논문약어.md` 파일 생성
2. front matter 작성:
   ```yaml
   ---
   title: "논문 제목 전체"
   date: 2026-07-15
   category: "Agent"        # 서베이 그룹 제목 (단수!)
   year: 2024
   authors: "저자 et al."
   contribution: "핵심 기여 한 줄 요약"
   reviewer: "GitHub아이디"
   paper_url: "https://arxiv.org/abs/..."
   code_url: "https://github.com/..."
   tags: [agent, memory]
   excerpt: "목록 페이지에 표시될 요약"
   ---
   본문...
   ```
3. `npm run build` 후 `/survey/`에서 "Agent" 그룹 아래 표에 한 행이 추가됐는지, 상세 페이지가 정상 렌더되는지 확인.

---

## 5. 자주 하는 실수 체크리스트

- [ ] 포스트는 `categories`(복수, 배열) / 서베이는 `category`(단수, 문자열) — 서로 헷갈리지 않기
- [ ] 포스트 `categories` 값은 `LLM / Vision / Multimodal / VLM / World Model / Weekly` 철자 그대로 (대소문자 포함)
- [ ] 파일명은 `YYYY-MM-DD-슬러그.md` 형식 지키기
- [ ] 새 연구 분야를 추가하고 싶다면 `scripts/lib/render-pages.js`의 `CATEGORIES` 배열 + `content/data/navigation.yml` 둘 다 수정
