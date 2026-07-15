/* ============================================================
   脳科学ゼミナール 事前学習サイト - アプリ本体
   ハッシュルーティングで動く軽量SPA（ビルド不要・GitHub Pages対応）
   ============================================================ */

const app = document.getElementById("app");
const termById = (id) => TERMS.find((t) => t.id === id);

/* ---------- ユーティリティ ---------- */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function relatedChips(ids) {
  if (!ids || !ids.length) return "";
  return `<div class="chip-row">${ids
    .map((id) => {
      const t = termById(id);
      if (!t) return "";
      return `<a class="chip" href="#/term/${t.id}">${escapeHtml(t.term)}</a>`;
    })
    .join("")}</div>`;
}

function categoryLabel(cat) {
  return cat === "neuro" ? "脳科学" : "臨床心理";
}

/* ---------- SVGイラスト ---------- */
const SVG = {
  brainDiagram: (highlight = "") => `
  <svg viewBox="0 0 360 300" class="brain-diagram" role="img" aria-label="脳の模式図">
    <defs>
      <linearGradient id="brainGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="var(--accent-2)"/>
        <stop offset="1" stop-color="var(--accent-1)"/>
      </linearGradient>
    </defs>
    <path d="M60 150 C40 90 90 40 160 35 C185 15 240 20 265 55 C310 65 330 110 315 150
             C335 180 320 225 285 235 C275 265 230 275 200 258
             C170 275 120 268 105 240 C65 235 45 195 60 150 Z"
          fill="url(#brainGrad)" opacity="0.18" stroke="var(--accent-1)" stroke-width="2"/>
    <g class="region" data-term="prefrontal-cortex" tabindex="0" role="button" aria-label="前頭前野">
      <circle cx="105" cy="110" r="34" class="${highlight === "prefrontal-cortex" ? "on" : ""}"/>
      <text x="105" y="114" text-anchor="middle">前頭前野</text>
    </g>
    <g class="region" data-term="amygdala" tabindex="0" role="button" aria-label="扁桃体">
      <circle cx="195" cy="168" r="24" class="${highlight === "amygdala" ? "on" : ""}"/>
      <text x="195" y="172" text-anchor="middle">扁桃体</text>
    </g>
    <g class="region" data-term="hippocampus" tabindex="0" role="button" aria-label="海馬">
      <circle cx="235" cy="150" r="26" class="${highlight === "hippocampus" ? "on" : ""}"/>
      <text x="235" y="154" text-anchor="middle">海馬</text>
    </g>
    <g class="region" data-term="cerebellum" tabindex="0" role="button" aria-label="小脳">
      <circle cx="255" cy="215" r="30" class="${highlight === "cerebellum" ? "on" : ""}"/>
      <text x="255" y="219" text-anchor="middle">小脳</text>
    </g>
  </svg>`,

  neuronSynapse: () => `
  <svg viewBox="0 0 400 220" class="illus" role="img" aria-label="ニューロンとシナプスの模式図">
    <g stroke="var(--accent-1)" stroke-width="2" fill="none" opacity="0.9">
      <path d="M20 110 C 60 60, 90 60, 120 100"/>
      <path d="M20 110 C 60 160, 90 160, 120 120"/>
      <path d="M20 110 C 50 100, 70 90, 100 95"/>
      <path d="M20 110 C 50 120, 70 130, 100 125"/>
    </g>
    <circle cx="10" cy="110" r="14" fill="var(--accent-2)"/>
    <path d="M120 110 L260 110" stroke="var(--accent-1)" stroke-width="4" opacity="0.85"/>
    <g class="pulse">
      <circle cx="140" cy="110" r="5" fill="var(--accent-3)"/>
    </g>
    <g stroke="var(--accent-1)" stroke-width="2" fill="none" opacity="0.9">
      <path d="M260 110 C 300 70, 330 70, 370 95"/>
      <path d="M260 110 C 300 150, 330 150, 370 125"/>
      <path d="M260 110 C 290 100, 320 95, 350 100"/>
    </g>
    <circle cx="270" cy="110" r="16" fill="var(--accent-2)"/>
    <text x="140" y="30" text-anchor="middle" class="illus-label">軸索</text>
    <text x="20" y="150" text-anchor="middle" class="illus-label">樹状突起</text>
    <text x="270" y="150" text-anchor="middle" class="illus-label">シナプス</text>
  </svg>`,

  therapyIllus: () => `
  <svg viewBox="0 0 400 200" class="illus" role="img" aria-label="対話と回復のイメージ">
    <circle cx="120" cy="110" r="42" fill="var(--accent-2)" opacity="0.7"/>
    <circle cx="280" cy="110" r="42" fill="var(--accent-3)" opacity="0.55"/>
    <path d="M160 100 Q200 70 240 100" stroke="var(--accent-1)" stroke-width="3" fill="none"/>
    <path d="M160 120 Q200 150 240 120" stroke="var(--accent-1)" stroke-width="3" fill="none" opacity="0.6"/>
    <circle cx="120" cy="95" r="6" fill="var(--ink)"/>
    <circle cx="280" cy="95" r="6" fill="var(--ink)"/>
    <text x="200" y="30" text-anchor="middle" class="illus-label">対話・表現を通した回復</text>
  </svg>`,

  mriIllus: () => `
  <svg viewBox="0 0 300 200" class="illus" role="img" aria-label="脳画像のイメージ">
    <rect x="10" y="10" width="280" height="180" rx="14" fill="var(--ink)" opacity="0.05"/>
    <ellipse cx="150" cy="100" rx="95" ry="75" fill="none" stroke="var(--accent-1)" stroke-width="3"/>
    <ellipse cx="150" cy="100" rx="65" ry="50" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-dasharray="6 4"/>
    <ellipse cx="130" cy="95" rx="20" ry="14" fill="var(--accent-3)" opacity="0.7"/>
    <ellipse cx="175" cy="110" rx="16" ry="11" fill="var(--accent-2)" opacity="0.8"/>
    <text x="150" y="185" text-anchor="middle" class="illus-label">MRI／fMRIによる脳の可視化イメージ</text>
  </svg>`,

  avatarPlaceholder: (initial) => `
  <svg viewBox="0 0 120 120" class="avatar" role="img" aria-label="教授の写真プレースホルダー">
    <circle cx="60" cy="60" r="60" fill="var(--accent-2)"/>
    <circle cx="60" cy="48" r="22" fill="var(--surface)"/>
    <path d="M20 105 C20 78 40 68 60 68 C80 68 100 78 100 105 Z" fill="var(--surface)"/>
    <text x="60" y="118" text-anchor="middle" class="avatar-mark">${escapeHtml(initial)}</text>
  </svg>`
};

/* ---------- ヘッダー／下部ナビ ---------- */
function renderChrome() {
  document.getElementById("nav").innerHTML = `
    <a href="#/" class="nav-item" data-route="/"><span>🏠</span>Home</a>
    <a href="#/search" class="nav-item" data-route="/search"><span>🔍</span>検索</a>
    <a href="#/chat" class="nav-item" data-route="/chat"><span>💬</span>AI</a>
    <a href="#/memo" class="nav-item" data-route="/memo"><span>📝</span>メモ</a>
    <a href="#/more" class="nav-item" data-route="/more"><span>☰</span>その他</a>
  `;
}

function setActiveNav(path) {
  const top = "/" + (path.split("/")[1] || "");
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.route === top);
  });
}

/* ---------- ページ描画 ---------- */
function renderHome() {
  return `
    <section class="hero">
      <p class="eyebrow">京都女子高等学校 × 東山高等学校　脳科学ゼミナール</p>
      <h1>講演アシスタントへ<br>ようこそ</h1>
      <p class="hero-lead">紙のレジュメだけでは伝えきれない内容を、予習・当日・復習の3つの場面でサポートします。</p>
      <div class="event-card glass">
        <div class="event-row"><span class="label">日時</span><span>2026年7月18日（土）14:00〜17:00</span></div>
        <div class="event-row"><span class="label">場所</span><span>京都女子高等学校</span></div>
        <div class="event-row"><span class="label">講演①</span><span>見学 美根子 教授（京都大学高等研究院）— 脳発生のメカニズム</span></div>
        <div class="event-row"><span class="label">講演②</span><span>吉 沅洪 教授（立命館大学）— 臨床心理学　トラウマケアと脳</span></div>
      </div>
    </section>

    <section class="stepper">
      <div class="step">
        <div class="step-num">予習</div>
        <p>専門用語や教授の研究内容を、講演前にチェック。</p>
      </div>
      <div class="step-line"></div>
      <div class="step">
        <div class="step-num">当日</div>
        <p>知らない言葉が出てきたら、その場で検索・AIに質問。</p>
      </div>
      <div class="step-line"></div>
      <div class="step">
        <div class="step-num">復習</div>
        <p>メモを見返して、学んだ内容を自分の言葉で整理。</p>
      </div>
    </section>

    <section class="quick-grid">
      ${quickCard("✨", "ゼミナールとは", "開催の目的とスケジュール", "#/about")}
      ${quickCard("👤", "教授紹介", "研究内容を知る", "#/professors")}
      ${quickCard("🧠", "トラウマとは", "心のケガのしくみ", "#/page/trauma")}
      ${quickCard("🔬", "脳の仕組み", "ニューロンから脳全体まで", "#/page/brain")}
      ${quickCard("📖", "専門用語辞典", "", "#/glossary", true)}
      ${quickCard("💡", "心理療法", "CBT・EMDR・精神分析を比較", "#/page/therapy")}
      ${quickCard("🎯", "講演を見るポイント", "当日、注目したいこと", "#/page/viewpoints")}
      ${quickCard("📚", "参考文献", "情報の出どころ", "#/page/references")}
    </section>

    <section class="lecture-toggle-card glass">
      <div>
        <strong>講演中モード</strong>
        <p>文字を大きく、装飾を減らして、検索を最優先の表示に切り替えます。</p>
      </div>
      <button id="lecture-toggle-btn" class="toggle-btn">${state.lectureMode ? "解除する" : "ONにする"}</button>
    </section>
  `;
}

function quickCard(icon, title, desc, href, isGlossary) {
  const count = isGlossary ? TERMS.length : null;
  return `
    <a class="quick-card glass" href="${href}">
      <span class="quick-icon">${icon}</span>
      <span class="quick-title">${title}</span>
      <span class="quick-desc">${isGlossary ? `${count}語を収録` : desc}</span>
    </a>`;
}

function professorKeywordChips(p) {
  return relatedChips(p.keywords.map((kw) => (TERMS.find(t => t.term === kw) || {}).id).filter(Boolean));
}

function renderProfessors() {
  const primary = PROFESSORS.find((p) => p.primary) || PROFESSORS[0];
  const others = PROFESSORS.filter((p) => p !== primary);

  return `
    <section class="page-head">
      <h1>教授紹介</h1>
      <p>当日ご講演いただく先生方の研究テーマと、これまでの歩みを紹介します。</p>
    </section>

    <article class="professor-card glass">
      <div class="professor-top">
        ${SVG.avatarPlaceholder(primary.name.charAt(0))}
        <div>
          <h2>${escapeHtml(primary.name)}</h2>
          <p class="professor-affil">${escapeHtml(primary.affiliation)}</p>
          <p class="professor-theme">講演テーマ：${escapeHtml(primary.theme)}</p>
          <p class="photo-note">📷 ${escapeHtml(primary.photoNote)}</p>
        </div>
      </div>

      ${primary.profile ? `
        <div class="profile-fields">
          ${Object.entries(primary.profile).map(([k, v]) => `
            <div class="profile-field"><span class="pf-label">${escapeHtml(k)}</span><span class="pf-value">${escapeHtml(v)}</span></div>
          `).join("")}
        </div>` : ""}

      <h3 class="sub-heading">プロフィール・経歴</h3>
      ${primary.bio.map((b) => `<p class="professor-bio">${escapeHtml(b)}</p>`).join("")}

      ${primary.approach ? `<h3 class="sub-heading">研究アプローチ</h3><p class="professor-bio">${escapeHtml(primary.approach)}</p>` : ""}
      ${primary.notableWork ? `<h3 class="sub-heading">代表的な研究・取り組み</h3><p class="professor-bio">${escapeHtml(primary.notableWork)}</p>` : ""}
      ${primary.why ? `<h3 class="sub-heading">なぜこの研究を行っているのか</h3><p class="professor-bio">${escapeHtml(primary.why)}</p>` : ""}

      <p class="keyword-label">関連する専門用語</p>
      ${professorKeywordChips(primary)}
    </article>

    ${others.length ? `<div class="section-divider">同日のもう1つの講演</div>` : ""}
    ${others.map((p) => `
      <article class="professor-card secondary glass">
        <div class="professor-top">
          ${SVG.avatarPlaceholder(p.name.charAt(0))}
          <div>
            <h2>${escapeHtml(p.name)}</h2>
            <p class="professor-affil">${escapeHtml(p.affiliation)}</p>
            <p class="professor-theme">講演テーマ：${escapeHtml(p.theme)}</p>
          </div>
        </div>
        ${p.bio.map((b) => `<p class="professor-bio">${escapeHtml(b)}</p>`).join("")}
        <p class="keyword-label">関連する専門用語</p>
        ${professorKeywordChips(p)}
      </article>
    `).join("")}
  `;
}

function renderPage(pageId) {
  const data = PAGES_CONTENT[pageId];
  if (!data) return `<p>ページが見つかりませんでした。</p>`;
  const illus = {
    trauma: SVG.mriIllus(),
    brain: SVG.neuronSynapse(),
    therapy: SVG.therapyIllus(),
    viewpoints: "",
    references: ""
  }[pageId];
  const showBrainDiagram = pageId === "brain";
  const relatedTerms = TERMS.filter((t) => t.pages && t.pages.includes(pageId));

  return `
    <section class="page-head">
      <h1>${escapeHtml(data.title)}</h1>
      <p>${escapeHtml(data.lead)}</p>
    </section>
    ${illus ? `<div class="illus-wrap glass">${illus}</div>` : ""}
    ${showBrainDiagram ? `<div class="illus-wrap glass"><p class="tap-hint">部位をタップすると説明が表示されます</p>${SVG.brainDiagram()}<div id="brain-tap-result"></div></div>` : ""}
    ${data.sections.map((s) => `
      <article class="content-block glass">
        <h2>${escapeHtml(s.heading)}</h2>
        <p>${escapeHtml(s.body)}</p>
      </article>
    `).join("")}
    ${pageId === "therapy" ? renderComparisonTable() : ""}
    ${relatedTerms.length ? `
      <section class="related-terms-section">
        <p class="keyword-label">このページに関連する専門用語</p>
        <div class="term-card-grid">
          ${relatedTerms.map(termCardHtml).join("")}
        </div>
      </section>` : ""}
  `;
}

function renderComparisonTable() {
  const { headers, rows } = THERAPY_COMPARISON;
  return `
    <h2 class="compare-heading">CBT・EMDR・精神分析　比較表</h2>
    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((r) => `
            <tr><th>${escapeHtml(r[0])}</th>${r.slice(1).map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAbout() {
  const a = ABOUT_SEMINAR;
  return `
    <section class="page-head">
      <h1>脳科学ゼミナールとは</h1>
      <p>このゼミナールがどんな目的で、どのように開催されているのかを紹介します。</p>
    </section>

    <div class="about-hero glass">
      <span class="theme-badge">🧭 ${escapeHtml(a.theme)}</span>
      <p>${escapeHtml(a.intro)}</p>
    </div>

    ${a.purpose.map((s) => `
      <article class="content-block glass">
        <h2>${escapeHtml(s.h)}</h2>
        <p>${escapeHtml(s.b)}</p>
      </article>
    `).join("")}

    <h2 class="compare-heading">講演スケジュール</h2>
    <div class="timeline glass" style="padding:18px 20px;">
      ${a.schedule.map((item) => `
        <div class="timeline-item">
          <div class="tl-time">${escapeHtml(item.time)}</div>
          <div class="tl-title">${escapeHtml(item.title)}</div>
          ${item.desc ? `<p class="tl-desc">${escapeHtml(item.desc)}</p>` : ""}
        </div>
      `).join("")}
    </div>

    <h2 class="compare-heading">参加するメリット</h2>
    <div class="benefit-grid">
      ${a.benefits.map((b) => `
        <div class="benefit-item glass">
          <span class="b-icon">${b.icon}</span>
          <p>${escapeHtml(b.text)}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function termCardHtml(t) {
  return `
    <a class="term-card glass" href="#/term/${t.id}">
      <span class="term-cat cat-${t.category}">${categoryLabel(t.category)}</span>
      <h3>${escapeHtml(t.term)}</h3>
      <p>${escapeHtml(t.short)}</p>
    </a>`;
}

function renderGlossary(filterCat = "all", query = "") {
  const list = TERMS.filter((t) => {
    const catOk = filterCat === "all" || t.category === filterCat;
    const q = query.trim();
    const qOk = !q || matchesQuery(t, q);
    return catOk && qOk;
  });

  return `
    <section class="page-head">
      <h1>専門用語辞典</h1>
      <p>全${TERMS.length}語。脳科学・臨床心理学の用語をタップで詳しく解説します。</p>
    </section>
    <div class="filter-row">
      <button class="filter-chip ${filterCat === "all" ? "active" : ""}" data-cat="all">すべて</button>
      <button class="filter-chip ${filterCat === "neuro" ? "active" : ""}" data-cat="neuro">脳科学</button>
      <button class="filter-chip ${filterCat === "clinical" ? "active" : ""}" data-cat="clinical">臨床心理</button>
    </div>
    <div class="term-card-grid" id="glossary-grid">
      ${list.length ? list.map(termCardHtml).join("") : `<p class="empty-msg">該当する用語が見つかりませんでした。</p>`}
    </div>
  `;
}

function renderTermDetail(id) {
  const t = termById(id);
  if (!t) return `<p>用語が見つかりませんでした。</p>`;
  return `
    <a href="#/glossary" class="back-link">← 辞典に戻る</a>
    <article class="term-detail glass">
      <span class="term-cat cat-${t.category}">${categoryLabel(t.category)}</span>
      <h1>${escapeHtml(t.term)}</h1>
      <p class="term-reading">読み：${escapeHtml(t.reading)}</p>
      <p class="term-detail-body">${escapeHtml(t.detail)}</p>
      <p class="keyword-label">関連用語</p>
      ${relatedChips(t.related)}
      ${t.pages && t.pages.length ? `
        <p class="keyword-label">関連ページ</p>
        <div class="chip-row">
          ${t.pages.map((p) => `<a class="chip chip-page" href="#/page/${p}">${escapeHtml(PAGES_CONTENT[p] ? PAGES_CONTENT[p].title : p)}</a>`).join("")}
        </div>` : ""}
    </article>
  `;
}

function matchesQuery(t, q) {
  const norm = (s) => (s || "").toLowerCase();
  const nq = norm(q);
  return (
    norm(t.term).includes(nq) ||
    norm(t.reading).includes(nq) ||
    norm(t.short).includes(nq) ||
    norm(t.detail).includes(nq)
  );
}

function renderSearch(query = "") {
  const results = query.trim() ? TERMS.filter((t) => matchesQuery(t, query)) : [];
  return `
    <section class="page-head">
      <h1>専門用語検索</h1>
      <p>気になる言葉をその場で検索できます。あいまいな読み方でもOK。</p>
    </section>
    <div class="search-bar-wrap">
      <input id="search-input" type="search" inputmode="search" placeholder="例：PTSD／扁桃体／フロイト" value="${escapeHtml(query)}" autofocus>
    </div>
    <div id="search-results">
      ${query.trim() ? renderSearchResults(results) : `<p class="empty-msg">上の検索バーに用語を入力してください。</p>`}
    </div>
  `;
}

function renderSearchResults(results) {
  if (!results.length) return `<p class="empty-msg">見つかりませんでした。別のキーワードでお試しください。</p>`;
  return `<div class="term-card-grid">${results.map(termCardHtml).join("")}</div>`;
}

function renderMemo() {
  const memos = getMemos();
  return `
    <section class="page-head">
      <h1>講演中メモ</h1>
      <p>気づいたことをその場で記録。自動保存され、あとから見返せます。</p>
    </section>
    <div class="memo-editor glass">
      <textarea id="memo-textarea" placeholder="ここにメモを入力…">${escapeHtml(state.currentMemoDraft)}</textarea>
      <div class="memo-toolbar">
        <span id="memo-count" class="memo-count">0文字</span>
        <button id="memo-save-btn" class="toggle-btn">保存する</button>
      </div>
    </div>
    <div class="memo-list">
      ${memos.length ? memos.map(memoItemHtml).join("") : `<p class="empty-msg">まだメモがありません。</p>`}
    </div>
    ${memos.length ? `
      <div class="memo-actions">
        <button id="memo-export-btn" class="link-btn">すべてコピーしてエクスポート</button>
        <button id="memo-clear-btn" class="link-btn danger">すべて削除</button>
      </div>` : ""}
  `;
}

function memoItemHtml(m) {
  return `
    <article class="memo-item glass" data-id="${m.id}">
      <p class="memo-time">${new Date(m.time).toLocaleString("ja-JP")}</p>
      <p class="memo-text">${escapeHtml(m.text)}</p>
      <div class="memo-item-actions">
        <button class="link-btn small" data-copy="${m.id}">コピー</button>
        <button class="link-btn small danger" data-del="${m.id}">削除</button>
      </div>
    </article>`;
}

function renderChat() {
  return `
    <section class="page-head">
      <h1>AIチャット</h1>
      <p>このサイトの内容を優先して回答し、辞典にない場合は分かる範囲で一般的な説明を補足します（ブラウザだけで動く軽量版）。</p>
    </section>
    <div class="chat-window glass" id="chat-window"></div>
    <form id="chat-form" class="chat-form">
      <input id="chat-input" type="text" placeholder="例：PTSDって何？" autocomplete="off">
      <button type="submit" class="toggle-btn">送る</button>
    </form>
    <div class="chat-suggestions">
      ${["PTSDって何？", "EMDRとは？", "教授の研究内容は？", "フロイトって？", "トラウマとは？"]
        .map((q) => `<button class="chip suggestion-chip" data-q="${escapeHtml(q)}">${q}</button>`).join("")}
    </div>
  `;
}

function renderMore() {
  return `
    <section class="page-head">
      <h1>その他</h1>
      <p>サイト内のすべてのページにアクセスできます。</p>
    </section>
    <div class="more-list">
      <a class="more-item glass" href="#/">🏠 ホーム</a>
      <a class="more-item glass" href="#/about">✨ 脳科学ゼミナールとは</a>
      <a class="more-item glass" href="#/professors">👤 教授紹介</a>
      <a class="more-item glass" href="#/page/trauma">🧠 トラウマとは</a>
      <a class="more-item glass" href="#/page/brain">🔬 脳の仕組み</a>
      <a class="more-item glass" href="#/glossary">📖 専門用語辞典</a>
      <a class="more-item glass" href="#/page/therapy">💡 心理療法</a>
      <a class="more-item glass" href="#/page/viewpoints">🎯 講演を見るポイント</a>
      <a class="more-item glass" href="#/page/references">📚 参考文献</a>
      <a class="more-item glass" href="#/memo">📝 講演中メモ</a>
    </div>
    <div class="more-toggle glass">
      <div>
        <strong>ダークモード</strong>
        <p>目の負担を減らす暗い配色に切り替えます。</p>
      </div>
      <button id="dark-toggle-btn" class="toggle-btn">${state.dark ? "OFFにする" : "ONにする"}</button>
    </div>
    <div class="more-toggle glass">
      <div>
        <strong>講演中モード</strong>
        <p>文字を大きく、検索を最優先の表示にします。</p>
      </div>
      <button id="lecture-toggle-btn-2" class="toggle-btn">${state.lectureMode ? "解除する" : "ONにする"}</button>
    </div>
  `;
}

/* ---------- ルーター ---------- */
const state = {
  dark: localStorage.getItem("bs-dark") === "1",
  lectureMode: localStorage.getItem("bs-lecture") === "1",
  currentMemoDraft: localStorage.getItem("bs-memo-draft") || ""
};

function applyModes() {
  document.body.classList.toggle("dark", state.dark);
  document.body.classList.toggle("lecture", state.lectureMode);
}

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const parts = hash.split("/").filter(Boolean);
  setActiveNav("/" + hash.split("/").filter(Boolean)[0] ? "/" + parts[0] : "/");

  let html = "";
  if (parts.length === 0) {
    html = renderHome();
  } else if (parts[0] === "about") {
    html = renderAbout();
  } else if (parts[0] === "professors") {
    html = renderProfessors();
  } else if (parts[0] === "page" && parts[1]) {
    html = renderPage(parts[1]);
  } else if (parts[0] === "glossary") {
    html = renderGlossary();
  } else if (parts[0] === "term" && parts[1]) {
    html = renderTermDetail(parts[1]);
  } else if (parts[0] === "search") {
    html = renderSearch(new URLSearchParams(location.hash.split("?")[1]).get("q") || "");
  } else if (parts[0] === "memo") {
    html = renderMemo();
  } else if (parts[0] === "chat") {
    html = renderChat();
  } else if (parts[0] === "more") {
    html = renderMore();
  } else {
    html = `<p class="empty-msg">ページが見つかりませんでした。<a href="#/">ホームに戻る</a></p>`;
  }

  app.innerHTML = html;
  window.scrollTo(0, 0);
  bindPageEvents(parts);
  if (parts[0] === "chat") renderChatHistory();
}

/* ---------- メモ機能 ---------- */
function getMemos() {
  try { return JSON.parse(localStorage.getItem("bs-memos") || "[]"); }
  catch (e) { return []; }
}
function saveMemos(list) { localStorage.setItem("bs-memos", JSON.stringify(list)); }

/* ---------- チャット履歴（セッション中のみ保持） ---------- */
let chatHistory = [];
function renderChatHistory() {
  const win = document.getElementById("chat-window");
  if (!win) return;
  if (!chatHistory.length) {
    win.innerHTML = `<p class="chat-empty">聞きたい専門用語や、教授の研究について質問してみてください。</p>`;
    return;
  }
  win.innerHTML = chatHistory.map((m) => `
    <div class="chat-bubble ${m.role}">${m.html}</div>
  `).join("");
  win.scrollTop = win.scrollHeight;
}

function answerChat(text) {
  const norm = text.trim();
  if (!norm) return null;

  // 教授の研究内容
  if (/教授|研究内容|研究テーマ/.test(norm)) {
    const list = PROFESSORS.map((p) => `<strong>${escapeHtml(p.name)}</strong>（${escapeHtml(p.affiliation)}）：${escapeHtml(p.theme)}`).join("<br>");
    return `${list}<br><br>詳しくは<a href="#/professors">教授紹介ページ</a>をご覧ください。`;
  }

  // キーワード一致
  for (const intent of CHAT_INTENTS) {
    if (intent.keys.some((k) => norm.toLowerCase().includes(k.toLowerCase()))) {
      const t = termById(intent.termId);
      if (t) {
        return `<strong>${escapeHtml(t.term)}</strong><br>${escapeHtml(t.detail)}<br><br>` +
          `関連用語：${(t.related || []).map((id) => termById(id)).filter(Boolean).map((rt) => `<a href="#/term/${rt.id}">${escapeHtml(rt.term)}</a>`).join("、") || "なし"}<br>` +
          `関連ページ：${(t.pages || []).map((p) => `<a href="#/page/${p}">${escapeHtml(PAGES_CONTENT[p].title)}</a>`).join("、") || "なし"}`;
      }
    }
  }

  // 用語名の部分一致で全辞典を検索
  const found = TERMS.find((t) => norm.includes(t.term.split("（")[0]));
  if (found) {
    return `<strong>${escapeHtml(found.term)}</strong><br>${escapeHtml(found.detail)}<br><br>` +
      `<a href="#/term/${found.id}">詳しく見る →</a>`;
  }

  return `ごめんなさい、うまく見つけられませんでした。<a href="#/glossary">専門用語辞典</a>や<a href="#/search">検索</a>から探してみてください。`;
}

/* ---------- イベントバインド ---------- */
function bindPageEvents(parts) {
  // ホーム：講演中モードトグル
  const lectureBtn = document.getElementById("lecture-toggle-btn");
  if (lectureBtn) lectureBtn.addEventListener("click", toggleLecture);
  const lectureBtn2 = document.getElementById("lecture-toggle-btn-2");
  if (lectureBtn2) lectureBtn2.addEventListener("click", toggleLecture);
  const darkBtn = document.getElementById("dark-toggle-btn");
  if (darkBtn) darkBtn.addEventListener("click", toggleDark);

  // 脳の図タップ
  document.querySelectorAll(".region").forEach((el) => {
    const handler = () => {
      const id = el.dataset.term;
      const t = termById(id);
      const box = document.getElementById("brain-tap-result");
      if (box && t) {
        box.innerHTML = `
          <div class="tap-card glass">
            <h3>${escapeHtml(t.term)}</h3>
            <p>${escapeHtml(t.short)}</p>
            <a href="#/term/${t.id}">詳しく見る →</a>
          </div>`;
      }
    };
    el.addEventListener("click", handler);
    el.addEventListener("keypress", (e) => { if (e.key === "Enter") handler(); });
  });

  // 辞典フィルタ
  const filterChips = document.querySelectorAll(".filter-chip");
  if (filterChips.length) {
    filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const cat = chip.dataset.cat;
        app.innerHTML = renderGlossary(cat, document.getElementById("glossary-search")?.value || "");
        bindPageEvents(parts);
      });
    });
  }

  // 検索
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value;
      document.getElementById("search-results").innerHTML =
        q.trim() ? renderSearchResults(TERMS.filter((t) => matchesQuery(t, q))) : `<p class="empty-msg">上の検索バーに用語を入力してください。</p>`;
    });
  }

  // メモ
  const memoTextarea = document.getElementById("memo-textarea");
  const memoCount = document.getElementById("memo-count");
  if (memoTextarea) {
    const updateCount = () => { memoCount.textContent = `${memoTextarea.value.length}文字`; };
    updateCount();
    memoTextarea.addEventListener("input", () => {
      state.currentMemoDraft = memoTextarea.value;
      localStorage.setItem("bs-memo-draft", state.currentMemoDraft);
      updateCount();
    });
  }
  const memoSaveBtn = document.getElementById("memo-save-btn");
  if (memoSaveBtn) {
    memoSaveBtn.addEventListener("click", () => {
      const text = memoTextarea.value.trim();
      if (!text) return;
      const memos = getMemos();
      memos.unshift({ id: Date.now().toString(36), text, time: Date.now() });
      saveMemos(memos);
      state.currentMemoDraft = "";
      localStorage.removeItem("bs-memo-draft");
      app.innerHTML = renderMemo();
      bindPageEvents(parts);
    });
  }
  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.del;
      saveMemos(getMemos().filter((m) => m.id !== id));
      app.innerHTML = renderMemo();
      bindPageEvents(parts);
    });
  });
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.copy;
      const m = getMemos().find((x) => x.id === id);
      if (m) navigator.clipboard?.writeText(m.text);
    });
  });
  const exportBtn = document.getElementById("memo-export-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const all = getMemos().map((m) => `[${new Date(m.time).toLocaleString("ja-JP")}]\n${m.text}`).join("\n\n");
      navigator.clipboard?.writeText(all);
      exportBtn.textContent = "コピーしました！";
      setTimeout(() => { exportBtn.textContent = "すべてコピーしてエクスポート"; }, 1500);
    });
  }
  const clearBtn = document.getElementById("memo-clear-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("すべてのメモを削除しますか？")) {
        saveMemos([]);
        app.innerHTML = renderMemo();
        bindPageEvents(parts);
      }
    });
  }

  // チャット
  const chatForm = document.getElementById("chat-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-input");
      const text = input.value.trim();
      if (!text) return;
      chatHistory.push({ role: "user", html: escapeHtml(text) });
      chatHistory.push({ role: "bot", html: answerChat(text) });
      input.value = "";
      renderChatHistory();
    });
    document.querySelectorAll(".suggestion-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const q = chip.dataset.q;
        chatHistory.push({ role: "user", html: escapeHtml(q) });
        chatHistory.push({ role: "bot", html: answerChat(q) });
        renderChatHistory();
      });
    });
  }
}

function toggleLecture() {
  state.lectureMode = !state.lectureMode;
  localStorage.setItem("bs-lecture", state.lectureMode ? "1" : "0");
  applyModes();
  route();
}
function toggleDark() {
  state.dark = !state.dark;
  localStorage.setItem("bs-dark", state.dark ? "1" : "0");
  applyModes();
  route();
}

/* ---------- 初期化 ---------- */
window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  applyModes();
  route();
});
