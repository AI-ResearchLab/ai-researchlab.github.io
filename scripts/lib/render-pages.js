const { readContentFile, renderMarkdown } = require('./markdown');
const { renderDocument } = require('./layout');
const { writePage } = require('./util');

function memberCard(member) {
  const avatar = member.avatar
    ? `<img class="member-card__avatar" src="${member.avatar}" alt="${member.name}">`
    : `<div class="member-card__avatar--placeholder">${member.avatar_placeholder || ''}</div>`;
  const tags = (member.interests || []).map((i) => `<span class="tag-pill">#${i}</span>`).join('');
  return `
<div class="card member-card">
  ${avatar}
  <h3 class="card__title">${member.name}</h3>
  <p class="member-card__role">${member.role}</p>
  <p class="member-card__bio">${member.bio || ''}</p>
  <div>${tags}</div>
  <a class="member-card__github" href="https://github.com/${member.github}" target="_blank" rel="noopener">@${member.github}</a>
</div>`;
}

function surveyCard(survey) {
  return `
<a class="card" href="${survey.url}" style="text-decoration:none;color:inherit;display:block;">
  <p class="card__meta">${survey.data.category} · ${survey.data.year}</p>
  <h3 class="card__title">${survey.data.title}</h3>
  <p class="card__excerpt">${survey.data.excerpt || ''}</p>
</a>`;
}

function renderHome(outDir, config, { members }) {
  const featureCards = [
    {
      title: 'Weekly Trends',
      desc: '매주 arXiv·Papers with Code·HN·GitHub·Hugging Face에서 AI 최신 논문·트렌드(LLM·CV·VLM·VLA·Multimodal·World Model 등)를 자동 수집·요약하고, 팀원이 수동으로 팔로업한 논문을 한곳에 모읍니다. 눈에 띄는 논문은 딥다이브 서베이로 이어집니다.',
      url: '/weekly-trends/',
    },
    {
      title: 'Paper Reviews',
      desc: '단순 요약을 넘어 "왜 중요한가·실무 활용" 관점이 담긴 논문 딥다이브 리뷰. 팀원 로테이션으로 격주 1편씩 발행합니다.',
      url: '/survey/',
    },
  ];

  const featureHtml = featureCards
    .map(
      (f) => `
<a class="card" href="${f.url}" style="text-decoration:none;color:inherit;display:block;">
  <h3 class="card__title">${f.title}</h3>
  <p class="card__excerpt">${f.desc}</p>
</a>`
    )
    .join('');

  const teamHtml = members.map(memberCard).join('');

  const body = `
<section class="hero">
  <div class="hero__inner">
    <h1 class="hero__title">${config.title}</h1>
    <p class="hero__lead">arXiv · HN · GitHub Trending · Hugging Face에서 매일 AI/ML 최신 동향을 수집하고, <strong>팀의 인사이트로 큐레이션</strong>합니다.</p>
  </div>
</section>

<div class="wrap">
  <section class="section">
    <div class="card-grid">${featureHtml}</div>
  </section>

  <section class="section">
    <h2 class="section__title">이번 주 AI 트렌드</h2>
    <p>자세한 내용은 <a href="/weekly-trends/">Weekly Trends 페이지</a>에서 확인하세요.</p>
    <table>
      <thead><tr><th>분야</th><th>핵심 동향</th></tr></thead>
      <tbody>
        <tr><td>LLM</td><td>오픈소스 모델의 GPT-4 수준 성능 근접 (Qwen2.5, Mistral)</td></tr>
        <tr><td>Vision</td><td>SAM2 확장 및 실시간 세그멘테이션 연구 활발</td></tr>
        <tr><td>Multimodal</td><td>Any-to-Any 모델 연구 가속화, 오디오·비디오 통합</td></tr>
        <tr><td>VLM</td><td>GPT-4V 경쟁 소형 VLM 등장 (InternVL2, Qwen-VL)</td></tr>
        <tr><td>World Model</td><td>로봇에서 World Model 기반 계획 수립 연구 급증</td></tr>
      </tbody>
    </table>
  </section>

  <section class="section">
    <h2 class="section__title">팀원</h2>
    <div class="card-grid">${teamHtml}</div>
  </section>
</div>`;

  const html = renderDocument({
    title: '',
    description: config.description,
    url: '/',
    bodyHtml: body,
    config,
  });
  writePage(outDir, '/', html);
}

function renderAbout(outDir, config) {
  const { data, body } = readContentFile(require('path').join(__dirname, '../../content/pages/about.md'));
  const { html } = renderMarkdown(body, data);
  const page = `
<div class="page">
  <div class="page__header">
    <h1 class="page__title">${data.title}</h1>
  </div>
  ${html}
</div>`;
  const doc = renderDocument({ title: data.title, url: '/about/', bodyHtml: page, config });
  writePage(outDir, '/about/', doc);
}

function renderMembers(outDir, config, members) {
  const cardsHtml = members.map(memberCard).join('');
  const body = `
<div class="page" style="max-width:var(--max-width);">
  <div class="page__header">
    <h1 class="page__title">팀원 소개</h1>
    <p class="page__meta">AI-ResearchLab 팀을 소개합니다. 각 팀원은 AI/ML의 서로 다른 분야를 깊이 탐구하며 협업합니다.</p>
  </div>
  <div class="card-grid">${cardsHtml}</div>
</div>`;
  const doc = renderDocument({ title: '팀원 소개', url: '/members/', bodyHtml: body, config });
  writePage(outDir, '/members/', doc);
}

function renderSurveyIndex(outDir, config, surveys) {
  const byCategory = {};
  surveys.forEach((s) => {
    const cat = s.data.category || '기타';
    (byCategory[cat] = byCategory[cat] || []).push(s);
  });

  const groupsHtml = Object.keys(byCategory)
    .map((cat) => {
      const rows = byCategory[cat]
        .map(
          (s) => `<tr>
            <td><a href="${s.url}">${s.data.title}</a></td>
            <td>${s.data.year}</td>
            <td>${s.data.authors}</td>
            <td>${s.data.contribution}</td>
            <td>@${s.data.reviewer}</td>
          </tr>`
        )
        .join('');
      return `
<div class="category-group">
  <h3 class="category-group__title">${cat}</h3>
  <table>
    <thead><tr><th>제목</th><th>연도</th><th>저자</th><th>핵심 기여</th><th>리뷰어</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>`;
    })
    .join('');

  const recentHtml = surveys.slice(0, 6).map(surveyCard).join('');

  const body = `
<div class="page" style="max-width:var(--max-width);">
  <div class="page__header">
    <h1 class="page__title">Paper Reviews - 논문 서베이 &amp; 연구 동향</h1>
    <p class="page__meta">팀원들이 직접 읽고 정리한 AI/ML 논문 서베이 &amp; 연구 동향 아카이브입니다.</p>
  </div>
  <p>새로운 서베이 추가는 <code>content/surveys/</code> 폴더에 마크다운 파일을 추가하고 PR을 올려주세요.</p>

  <h2 class="section__title">전체 서베이 목록</h2>
  ${groupsHtml || '<p>아직 등록된 서베이가 없습니다.</p>'}

  <h2 class="section__title">최근 추가된 서베이</h2>
  <div class="card-grid">${recentHtml}</div>
</div>`;
  const doc = renderDocument({ title: 'Paper Reviews', url: '/survey/', bodyHtml: body, config });
  writePage(outDir, '/survey/', doc);
}

function watchlistColumn(title, items) {
  const itemsHtml = items.length
    ? items
        .map(
          (item) => `
      <li class="wt-item">
        <div class="wt-item__head">
          <span class="wt-item__status wt-item__status--${item.reviewed ? 'done' : 'todo'}">${item.reviewed ? '완료' : '예정'}</span>
          <a class="wt-item__title" href="${item.url}" target="_blank" rel="noopener">${item.title}</a>
        </div>
        ${item.date ? `<div class="wt-item__meta">${item.date}</div>` : ''}
        ${item.note ? `<p class="wt-item__note">${item.note}</p>` : ''}
      </li>`
        )
        .join('')
    : '<li class="wt-empty">아직 등록된 논문이 없습니다.</li>';

  // data-paginate: 10개 초과 시 클라이언트 스크립트가 하단에 페이지 버튼을 렌더한다.
  return `
<section class="wt-col">
  <h2 class="section__title">${title}</h2>
  <ul class="wt-list" data-paginate data-page-size="10">${itemsHtml}</ul>
  <nav class="wt-pager" aria-label="${title} 페이지 넘김" hidden></nav>
</section>`;
}

function renderWeeklyTrends(outDir, config, watchlist) {
  const manual = (watchlist && watchlist.manual) || [];
  const auto = (watchlist && watchlist.auto) || [];

  const body = `
<div class="page" style="max-width:var(--max-width);">
  <div class="page__header">
    <h1 class="page__title">Weekly Trends</h1>
    <p class="page__meta">매주 arXiv·Papers with Code·HN·GitHub·Hugging Face에서 AI가 자동으로 수집·요약한 최신 논문과 트렌드(LLM·CV·VLM·VLA·Multimodal·World Model 등)와, 팀원이 직접 팔로업한 논문을 한곳에 모았습니다. 눈에 띄는 논문은 <a href="/survey/">Paper Reviews</a>의 딥다이브 리뷰로 이어집니다.</p>
  </div>
  <p>이 목록은 <a href="https://github.com/AI-ResearchLab/weekly-trends" target="_blank" rel="noopener">weekly-trends</a> 파이프라인이 자동으로 갱신하며, 등록된 지 30일이 지난 논문은 자동으로 목록에서 정리됩니다.</p>

  <div class="wt-grid">
    ${watchlistColumn('팀원 수동 팔로업', manual)}
    ${watchlistColumn('AI 자동 수집·요약', auto)}
  </div>
</div>`;
  const doc = renderDocument({ title: 'Weekly Trends', url: '/weekly-trends/', bodyHtml: body, config });
  writePage(outDir, '/weekly-trends/', doc);
}

module.exports = {
  renderHome,
  renderAbout,
  renderMembers,
  renderSurveyIndex,
  renderWeeklyTrends,
};
