const API_URL = '/.netlify/functions';

let SV_DATA = null;
let currentUser = { id: 5, name: 'Visitante', initials: 'VS', role: 'USER' };
let sessionId = 1;
let reactions = {};

async function loadSession() {
  try {
    console.log('Carregando sessão...');
    const res = await fetch(`${API_URL}/session`);
    console.log('Response status:', res.status);
    if (!res.ok) throw new Error('API error');
    const session = await res.json();
    console.log('Session loaded:', session?.title);
    
    const date = new Date(session.date);
    const day = date.getDate();
    const months = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
    const monthName = months[date.getMonth()];
    
    const sessionStartTime = session.startTime ? new Date(session.startTime) : date;
    const isLive = session.isLive;
    
    SV_DATA = {
      sessionTitle: session.title,
      sessionNumber: session.number,
      sessionDate: `${day} · ${monthName} · ${date.getFullYear()}`,
      sessionRuntime: session.runtime,
      sessionStartTime: sessionStartTime,
      isLive: isLive,
      messages: session.messages.map(m => ({
        side: m.side,
        author: m.user.name,
        time: m.time,
        body: m.body,
        quote: m.quote,
        likes: m.likes,
        echoes: m.echoes
      })),
      comments: session.comments.map(c => ({
        name: c.user.name,
        initials: c.user.initials,
        time: 'agora',
        body: c.body,
        ref: c.ref
      })),
      authors: session.authors.map(a => ({
        name: a.user.name,
        location: a.user.location,
        bio: a.user.bio,
        side: a.side
      }))
    };
    console.log('SV_DATA loaded, messages:', SV_DATA.messages.length);
  } catch (e) {
    console.error('Erro ao carregar sessão:', e);
    SV_DATA = getDefaultData();
  }
}

function getDefaultData() {
  return {
    sessionTitle: "Sobre o silêncio que pensa",
    sessionNumber: "Encontro nº 14",
    sessionDate: "21 · ABR · 2026",
    sessionRuntime: "00:00:00",
    sessionStartTime: new Date(),
    isLive: true,
    messages: [],
    comments: [],
    authors: []
  };
}

function formatRuntime(startTime) {
  const now = new Date();
  const diff = Math.floor((now - startTime) / 1000);
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateRuntime() {
  if (!SV_DATA || !SV_DATA.sessionStartTime || !SV_DATA.isLive) return;
  
  const runtimeEl = $('#session-runtime');
  if (runtimeEl) {
    runtimeEl.textContent = formatRuntime(SV_DATA.sessionStartTime);
  }
}

function $(sel) {
  return document.querySelector(sel);
}

function $$(sel) {
  return document.querySelectorAll(sel);
}

function createSynapseSpine() {
  return `
<svg viewBox="0 0 120 1200" preserveAspectRatio="none" style="width:100%;height:100%;display:block">
  <g stroke="var(--blue)" fill="none" stroke-linecap="round" opacity="0.55">
    <path d="M 60 0 C 58 80, 64 140, 60 210 C 56 280, 66 340, 60 420 C 54 500, 66 560, 60 640 C 54 720, 64 780, 60 860 C 56 940, 66 1000, 60 1080 C 57 1140, 62 1180, 60 1200" stroke-width="1" />
    <path d="M 60 110 C 50 115, 35 118, 22 130" stroke-width="0.7" opacity="0.6" />
    <path d="M 60 120 C 70 125, 86 130, 100 140" stroke-width="0.7" opacity="0.6" />
    <path d="M 60 280 C 48 284, 30 288, 14 304" stroke-width="0.7" opacity="0.6" />
    <path d="M 60 295 C 72 298, 90 304, 108 318" stroke-width="0.7" opacity="0.6" />
    <path d="M 60 470 C 52 475, 40 482, 26 498" stroke-width="0.7" opacity="0.6" />
    <path d="M 60 490 C 68 494, 82 500, 96 514" stroke-width="0.7" opacity="0.6" />
    <path d="M 60 660 C 50 664, 34 670, 18 684" stroke-width="0.7" opacity="0.6" />
    <path d="M 60 678 C 72 682, 90 688, 108 702" stroke-width="0.7" opacity="0.6" />
    <path d="M 60 860 C 52 864, 40 870, 26 884" stroke-width="0.7" opacity="0.6" />
    <path d="M 60 876 C 68 880, 84 886, 100 900" stroke-width="0.7" opacity="0.6" />
    <path d="M 22 130 C 18 134, 14 140, 10 148" stroke-width="0.5" opacity="0.5" />
    <path d="M 100 140 C 104 146, 108 150, 112 154" stroke-width="0.5" opacity="0.5" />
    <path d="M 14 304 C 10 308, 8 314, 6 320" stroke-width="0.5" opacity="0.5" />
    <path d="M 108 318 C 112 314, 114 310, 116 306" stroke-width="0.5" opacity="0.5" />
    <path d="M 26 498 C 22 502, 18 508, 14 516" stroke-width="0.5" opacity="0.5" />
    <path d="M 96 514 C 100 518, 104 522, 108 526" stroke-width="0.5" opacity="0.5" />
  </g>
  <g fill="var(--blue)">
    <circle cx="60" cy="210" r="2" opacity="0.6" />
    <circle cx="60" cy="420" r="2" opacity="0.6" />
    <circle cx="60" cy="640" r="2" opacity="0.6" />
    <circle cx="60" cy="860" r="2" opacity="0.6" />
    <circle cx="22" cy="130" r="1.4" opacity="0.5" />
    <circle cx="100" cy="140" r="1.4" opacity="0.5" />
    <circle cx="14" cy="304" r="1.4" opacity="0.5" />
    <circle cx="108" cy="318" r="1.4" opacity="0.5" />
    <circle cx="26" cy="498" r="1.4" opacity="0.5" />
    <circle cx="96" cy="514" r="1.4" opacity="0.5" />
  </g>
</svg>`;
}

function createSynapseCorner() {
  return `
<svg viewBox="0 0 80 80" style="width:80px;height:80px;display:block">
  <g stroke="var(--blue)" fill="none" stroke-linecap="round" opacity="0.5">
    <path d="M 0 40 C 10 40, 20 36, 30 30 C 40 24, 50 18, 60 12" stroke-width="0.7" />
    <path d="M 30 30 C 28 22, 24 16, 18 10" stroke-width="0.5" opacity="0.7" />
    <path d="M 45 21 C 50 18, 56 16, 62 16" stroke-width="0.5" opacity="0.7" />
    <path d="M 45 21 C 44 28, 42 34, 38 40" stroke-width="0.5" opacity="0.7" />
  </g>
  <circle cx="30" cy="30" r="1.6" fill="var(--blue)" opacity="0.8" />
  <circle cx="45" cy="21" r="1.2" fill="var(--blue)" opacity="0.6" />
</svg>`;
}

function createDot(delay) {
  return `<span style="width:5px;height:5px;border-radius:50%;background:var(--blue);opacity:0.3;animation:dot-pulse 1.4s ${delay}ms infinite;display:inline-block"></span>`;
}

function createPlatformShell() {
  return `
<div class="shell" id="platform">
  <header class="topbar">
    <div class="brand">
      <div class="brand-mark">SINAPSES DOS VENTOS</div>
      <div class="brand-sub">Plataforma de diálogo filosófico</div>
    </div>
    <nav class="nav">
      <a class="active">Ao vivo</a>
      <a>Arquivo</a>
      <a>Autores</a>
      <a>Sobre</a>
    </nav>
    <div style="display:flex;gap:14px;align-items:center">
      <span class="live-badge"><span class="live-dot"></span> Transmitindo</span>
    </div>
  </header>

  <div class="session-bar">
    <div class="session-left">
      <div class="author-pill">
        <img class="author-mono" src="/images/angelica.jpg" alt="Angélica Sátiro">
        <div>
          <div class="author-name">Angélica Sátiro</div>
          <div class="author-loc">Barcelona</div>
        </div>
      </div>
    </div>
    <div class="session-meta">
      <div id="session-runtime">${SV_DATA.sessionRuntime}</div>
      <div class="session-title">${SV_DATA.sessionTitle}</div>
    </div>
    <div class="session-right">
      <div class="author-pill" style="flex-direction:row-reverse">
        <img class="author-mono" src="/images/paulo.png" alt="Paulo Volker">
        <div style="text-align:right">
          <div class="author-name">Paulo Volker</div>
          <div class="author-loc">Brasília</div>
        </div>
      </div>
    </div>
  </div>

  <div class="main">
    <section class="dialogue">
      <div class="spine">${createSynapseSpine()}</div>
      <div id="messages-container"></div>
      <div class="authors-strip">
        <div class="author-card">
          <img class="author-portrait" src="/images/angelica.jpg" alt="Angélica Sátiro">
          <h4>Angélica Sátiro</h4>
          <div class="loc">Filósofa · Barcelona</div>
          <p>Doutora em Filosofia pela Universidade Autônoma de Barcelona. Fundadora do projeto Crearmundos. Autora de livros sobre pensamento criativo, filosofia para crianças e processos de transformação pela linguagem.</p>
        </div>
        <div class="connector" style="padding-top:44px">${createSynapseCorner()}</div>
        <div class="author-card right">
          <img class="author-portrait" src="/images/paulo.png" alt="Paulo Volker">
          <h4>Paulo Volker</h4>
          <div class="loc">Brasília · Filósofo</div>
          <p>Filósofo e ensaísta. Professor convidado em programas de pós-graduação no Brasil e na Europa. Pesquisa a relação entre silêncio, tempo e linguagem no pensamento contemporâneo. Vive em Brasília desde 2008.</p>
        </div>
      </div>
    </section>

    <aside class="comments">
      <div class="comments-head">
        <div class="comments-title">Comentários</div>
        <div class="comments-count" id="comments-count">${SV_DATA.comments.length} · ao vivo</div>
      </div>
      <div class="comments-list" id="comments-list"></div>
      <form class="comment-compose" id="comment-form">
        <textarea placeholder="Escrever um comentário… respeite os intervalos." rows="2" id="comment-input"></textarea>
        <div class="cc-row">
          <span>↵ para enviar</span>
          <button type="submit" class="btn btn-primary" style="padding:8px 16px">Publicar</button>
        </div>
      </form>
    </aside>
  </div>

  <footer class="footer">
    <div>© 2026 · Sinapses dos Ventos</div>
    <div class="footer-center">Um encontro contemplativo entre dois pensadores</div>
    <div>Angélica Sátiro · Paulo Volker</div>
  </footer>
</div>`;
}

function createPlatform() {
  return createPlatformShell();
}

function createMobileShell() {
  return `
<div class="mobile-shell">
    <div class="mobile-top">
      <div class="brand-mark">SINAPSES DOS VENTOS</div>
      <span class="live-badge" style="font-size:9px;padding:4px 8px">
        <span class="live-dot"></span> Live
      </span>
    </div>
    <div class="mobile-tabs">
      <span class="active">Diálogo</span>
      <span>Comentários · ${SV_DATA.comments.length}</span>
      <span>Autores</span>
    </div>
    <div class="mobile-stream" id="mobile-messages"></div>
    <div class="mobile-bottom">
      <input placeholder="Comentar…" id="mobile-input" />
      <button class="btn btn-primary" style="padding:8px 14px" id="mobile-submit">Enviar</button>
    </div>
  </div>`;
}

function renderMessage(m, index, align) {
  const r = reactions[index] || {};
  const isFilled = r.liked || r.echoed;

  return `
<div class="row">
  ${m.side === 'left' ? `
    <div class="msg">
      <div class="msg-meta">
        <span class="msg-author">${m.author}</span>
        <span class="msg-time">${m.time}</span>
      </div>
      <div class="msg-body">${m.body}</div>
      ${m.quote ? `<div class="quote">"${m.quote}"</div>` : ''}
      <div class="msg-reactions">
        <span class="reaction ${r.liked ? 'active' : ''}" data-msg="${index}" data-type="liked">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="${r.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.2">
            <path d="M6 10.5 L2 6.5 C0.5 5, 1.5 2.5, 3.5 2.5 C4.5 2.5, 5.5 3, 6 4 C6.5 3, 7.5 2.5, 8.5 2.5 C10.5 2.5, 11.5 5, 10 6.5 Z" />
          </svg>
          <span class="reaction-count">${m.likes + (r.liked ? 1 : 0)}</span>
          ressonar
        </span>
        <span class="reaction ${r.echoed ? 'active' : ''}" data-msg="${index}" data-type="echoed">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="6" cy="6" r="1.5" />
            <circle cx="6" cy="6" r="3.5" />
            <circle cx="6" cy="6" r="5.5" />
          </svg>
          <span class="reaction-count">${m.echoes + (r.echoed ? 1 : 0)}</span>
          ecoar
        </span>
        <span class="reaction" data-msg="${index}" data-type="cite">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M2 3 L10 3 L10 8 L7 8 L5 10.5 L5 8 L2 8 Z" />
          </svg>
          citar
        </span>
      </div>
    </div>
    <div class="connector"><span class="node ${isFilled ? 'filled' : ''}"></span></div>
    <div></div>
  ` : `
    <div></div>
    <div class="connector"><span class="node ${isFilled ? 'filled' : ''}"></span></div>
    <div class="msg right">
      <div class="msg-meta">
        <span class="msg-author">${m.author}</span>
        <span class="msg-time">${m.time}</span>
      </div>
      <div class="msg-body">${m.body}</div>
      ${m.quote ? `<div class="quote">"${m.quote}"</div>` : ''}
      <div class="msg-reactions">
        <span class="reaction ${r.liked ? 'active' : ''}" data-msg="${index}" data-type="liked">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="${r.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.2">
            <path d="M6 10.5 L2 6.5 C0.5 5, 1.5 2.5, 3.5 2.5 C4.5 2.5, 5.5 3, 6 4 C6.5 3, 7.5 2.5, 8.5 2.5 C10.5 2.5, 11.5 5, 10 6.5 Z" />
          </svg>
          <span class="reaction-count">${m.likes + (r.liked ? 1 : 0)}</span>
          ressonar
        </span>
        <span class="reaction ${r.echoed ? 'active' : ''}" data-msg="${index}" data-type="echoed">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="6" cy="6" r="1.5" />
            <circle cx="6" cy="6" r="3.5" />
            <circle cx="6" cy="6" r="5.5" />
          </svg>
          <span class="reaction-count">${m.echoes + (r.echoed ? 1 : 0)}</span>
          ecoar
        </span>
        <span class="reaction" data-msg="${index}" data-type="cite">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M2 3 L10 3 L10 8 L7 8 L5 10.5 L5 8 L2 8 Z" />
          </svg>
          citar
        </span>
      </div>
    </div>
  `}
</div>`;
}

function renderComment(c, index) {
  return `
<div class="comment">
  <div class="comment-head">
    <div class="comment-avatar">${c.initials}</div>
    <div class="comment-name">${c.name}</div>
    <div class="comment-meta">${c.time}</div>
  </div>
  <div class="comment-body">${c.body}</div>
  ${c.ref ? `<div class="comment-ref">em resposta a: "${c.ref}"</div>` : ''}
</div>`;
}

function renderMobileMessage(m, index) {
  return `
<div class="mobile-msg ${m.side}">
  <div class="msg-meta">
    <span class="msg-author">${m.author.split(' ')[0]}</span>
    <span class="msg-time">${m.time}</span>
  </div>
  <div class="msg-body" style="font-size:13.5px">${m.body}</div>
  ${m.quote ? `<div class="quote" style="font-size:14px;padding:10px 12px;margin:10px 0 4px">"${m.quote}"</div>` : ''}
</div>`;
}

function renderMessages(data) {
  const container = $('#messages-container');
  if (!container) return;

  const html = data.messages.map((m, i) => renderMessage(m, i)).join('');
  
  const composingRow = `
<div class="row">
  <div></div>
  <div class="connector"><span class="node"></span></div>
  <div class="msg">
    <div class="msg-meta">
      <span class="msg-author">Paulo Volker</span>
      <span class="msg-time">compondo…</span>
    </div>
    <div style="display:flex;gap:4px;margin-top:6px">
      ${createDot(0)}${createDot(200)}${createDot(400)}
    </div>
  </div>
</div>`;
  
  container.innerHTML = html + composingRow;
}

function renderComments(data) {
  const list = $('#comments-list');
  if (!list) return;
  list.innerHTML = data.comments.map((c, i) => renderComment(c, i)).join('');
  
  const count = $('#comments-count');
  if (count) count.textContent = `${data.comments.length} · ao vivo`;
}

function renderMobileMessages(data) {
  const container = $('#mobile-messages');
  if (!container) return;

  const titleHtml = `
<div style="font-family:'Archivo',sans-serif;font-stretch:75%;font-weight:800;font-size:20px;line-height:1.1;margin-bottom:4px">${data.sessionTitle}</div>
<div style="font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);margin-bottom:24px">${data.sessionNumber} · ${data.sessionDate}</div>`;

  const messagesHtml = data.messages.slice(0, 5).map((m, i) => renderMobileMessage(m, i)).join('');
  
  container.innerHTML = titleHtml + messagesHtml;
}

function attachEventListeners() {
  const commentForm = $('#comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = $('#comment-input');
      if (!input.value.trim()) return;
      
      const body = input.value.trim();
      input.value = '';
      
      try {
        const res = await fetch(`${API_URL}/comment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 1,
            userId: currentUser.id,
            body: body,
            ref: null
          })
        });
        
        if (res.ok) {
          const comment = await res.json();
          SV_DATA.comments.unshift({
            name: comment.user.name,
            initials: comment.user.initials,
            time: 'agora',
            body: comment.body,
            ref: comment.ref
          });
        }
      } catch (e) {
        console.error('Erro ao enviar comentário:', e);
      }
      
      renderComments(SV_DATA);
    });
  }

  $$('.reaction').forEach(el => {
    el.addEventListener('click', () => {
      const msgIndex = parseInt(el.dataset.msg);
      const type = el.dataset.type;
      
      if (!reactions[msgIndex]) reactions[msgIndex] = {};
      reactions[msgIndex][type] = !reactions[msgIndex][type];
      renderMessages(SV_DATA);
      renderMobileMessages(SV_DATA);
      attachEventListeners();
    });
  });

  const mobileSubmit = $('#mobile-submit');
  const mobileInput = $('#mobile-input');
  if (mobileSubmit && mobileInput) {
    mobileSubmit.addEventListener('click', async () => {
      if (!mobileInput.value.trim()) return;
      
      const body = mobileInput.value.trim();
      mobileInput.value = '';
      
      try {
        const res = await fetch(`${API_URL}/comment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 1,
            userId: currentUser.id,
            body: body,
            ref: null
          })
        });
        
        if (res.ok) {
          const comment = await res.json();
          SV_DATA.comments.unshift({
            name: comment.user.name,
            initials: comment.user.initials,
            time: 'agora',
            body: comment.body,
            ref: comment.ref
          });
        }
      } catch (e) {
        console.error('Erro ao enviar comentário:', e);
      }
      
      renderMobileMessages(SV_DATA);
    });
  }
}

async function init() {
  const root = $('#root');
  if (!root) return;

  root.innerHTML = '<div style="padding:40px;text-align:center;color:#666">Carregando...</div>';

  if (!SV_DATA) {
    await loadSession();
  }

  if (!SV_DATA || !SV_DATA.messages) {
    root.innerHTML = '<div style="padding:40px;text-align:center;color:red">Erro ao carregar dados</div>';
    return;
  }

  const isMobile = window.innerWidth < 800;
  
  if (isMobile) {
    root.innerHTML = `
    <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#E4E1DB;padding:40px">
      <div style="width:390px;height:780px;background:#ECEAE6;box-shadow:0 20px 60px rgba(0,0,0,.18);border-radius:38px;overflow:hidden;position:relative;border:8px solid #0A0E1A">
        ${createMobileShell()}
      </div>
    </div>`;
    renderMobileMessages(SV_DATA);
  } else {
    root.innerHTML = createPlatform();
    renderMessages(SV_DATA);
    renderComments(SV_DATA);
  }
  
  attachEventListeners();
  
  // Navegação do menu
  $$('.nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const text = link.textContent.trim();
      if (text === 'Arquivo') {
        window.location.href = '/arquivo.html';
      } else if (text === 'Autores') {
        window.location.href = '/autores.html';
      } else if (text === 'Sobre') {
        window.location.href = '/sobre.html';
      }
    });
  });

  // Atualizar runtime a cada segundo
  if (SV_DATA.isLive) {
    setInterval(updateRuntime, 1000);
  }
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', init);