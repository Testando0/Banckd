// ============================================
//  GRIMÓRIO BANK — Black Clover RPG System
// ============================================

// ---- STATE ----
let state = {
  users: [],
  transactions: [],
  shopItems: [],
  settings: { bankName: "Grimório Bank", currency: "Moedas de Ouro", fee: 0 },
  currentUser: null,
  totalSales: 0
};

// ---- SEED DATA ----
function initData() {
  const saved = localStorage.getItem('grimorioBank');
  if (saved) {
    state = JSON.parse(saved);
    return;
  }
  state.users = [
    { id: 1, name: "Asta de Hage", login: "admin", pass: "1234", role: "admin", class: "Mago Negro", grimoire: "♣ Trevo de 4 Folhas", balance: 50000, active: true },
    { id: 2, name: "Yuno de Hage", login: "yuno", pass: "1234", role: "user", class: "Cavaleiro Ouro", grimoire: "🌪️ Grimório do Vento", balance: 32000, active: true },
    { id: 3, name: "Noelle Silva", login: "noelle", pass: "1234", role: "user", class: "Cavaleiro Prata", grimoire: "🌊 Grimório do Oceano", balance: 45000, active: true },
    { id: 4, name: "Yami Sukehiro", login: "yami", pass: "1234", role: "user", class: "Cavaleiro Negro", grimoire: "🌑 Grimório das Trevas", balance: 80000, active: true },
    { id: 5, name: "Julius Novachrono", login: "julius", pass: "1234", role: "admin", class: "Cavaleiro Real", grimoire: "⏰ Grimório do Tempo", balance: 999999, active: true },
  ];
  state.shopItems = [
    { id: 1, name: "Espada das Chamas", emoji: "⚔️", desc: "Espada encantada com magia de fogo. +80 ATK, +30 MANA", cat: "arma", price: 2500, rarity: "epico", stock: 5 },
    { id: 2, name: "Grimório do Fogo", emoji: "📕", desc: "Grimório raro com feitiços de nível avançado.", cat: "grimorio", price: 8000, rarity: "lendario", stock: 2 },
    { id: 3, name: "Poção de Mana", emoji: "🧪", desc: "Restaura 500 pontos de mana instantaneamente.", cat: "pocao", price: 300, rarity: "comum", stock: 50 },
    { id: 4, name: "Armadura de Adamantium", emoji: "🛡️", desc: "Armadura forjada com mineral mágico. +200 DEF", cat: "armadura", price: 6000, rarity: "epico", stock: 3 },
    { id: 5, name: "Runa de Proteção", emoji: "🔮", desc: "Escudo mágico que absorve 30% do dano.", cat: "runa", price: 1500, rarity: "raro", stock: 10 },
    { id: 6, name: "Poção de Cura Total", emoji: "💊", desc: "Cura completamente todos os ferimentos.", cat: "pocao", price: 800, rarity: "raro", stock: 20 },
    { id: 7, name: "Lança do Raio", emoji: "⚡", desc: "Lança que canaliza o poder do trovão.", cat: "arma", price: 3500, rarity: "epico", stock: 4 },
    { id: 8, name: "Capa do Invisível", emoji: "🧥", desc: "Capa mágica que concede invisibilidade.", cat: "armadura", price: 5500, rarity: "lendario", stock: 1 },
    { id: 9, name: "Anel de Mana Infinita", emoji: "💍", desc: "Duplica a regeneração de mana.", cat: "runa", price: 12000, rarity: "lendario", stock: 1 },
    { id: 10, name: "Grimório das Sombras", emoji: "📗", desc: "Feitiços de controle mental e ilusão.", cat: "grimorio", price: 4500, rarity: "epico", stock: 3 },
    { id: 11, name: "Poção de Força", emoji: "🟠", desc: "+100 ATK por 30 minutos.", cat: "pocao", price: 500, rarity: "comum", stock: 40 },
    { id: 12, name: "Escudo Sagrado", emoji: "🛡️", desc: "Bênção divina que protege contra maldições.", cat: "armadura", price: 9000, rarity: "lendario", stock: 2 },
  ];
  state.transactions = [
    { id: 1, type: "deposit", from: "Sistema", to: "asta123", amount: 50000, desc: "Saldo inicial", date: new Date().toISOString(), status: "success" },
    { id: 2, type: "pix", from: "yuno", to: "noelle", amount: 1000, desc: "Pagamento de missão", date: new Date().toISOString(), status: "success" },
  ];
  saveState();
}

function saveState() {
  localStorage.setItem('grimorioBank', JSON.stringify(state));
}

// ---- AUTH ----
function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  const found = state.users.find(u => u.login === user && u.pass === pass && u.active);
  if (!found) {
    showToast('❌ Usuário ou senha inválidos!', 'error');
    return;
  }
  state.currentUser = found;
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('mainApp').classList.add('active');
  document.getElementById('userAvatar').textContent = found.name[0].toUpperCase();
  document.getElementById('userName').textContent = found.name;
  document.getElementById('userRank').textContent = `${found.role === 'admin' ? '👑' : '⚔️'} ${found.class}`;
  if (found.role !== 'admin') document.getElementById('adminNav').style.display = 'none';
  refreshAll();
  showToast(`⚔️ Bem-vindo ao reino, ${found.name.split(' ')[0]}!`, 'success');
  createParticles();
}

function doLogout() {
  state.currentUser = null;
  document.getElementById('mainApp').classList.remove('active');
  document.getElementById('loginScreen').classList.add('active');
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

document.getElementById('loginUser').addEventListener('keydown', e => e.key === 'Enter' && doLogin());
document.getElementById('loginPass').addEventListener('keydown', e => e.key === 'Enter' && doLogin());

// ---- NAVIGATION ----
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const navItems = document.querySelectorAll('.nav-item');
  const labels = ['dashboard','users','pix','deposit','shop','transactions','admin'];
  const idx = labels.indexOf(id);
  if (idx >= 0 && navItems[idx]) navItems[idx].classList.add('active');
  const titles = { dashboard:'Dashboard', users:'Cavaleiros', pix:'Magia Pix', deposit:'Depósito', shop:'Loja Mágica', transactions:'Pergaminhos', admin:'Administrativo' };
  document.getElementById('pageTitle').textContent = titles[id] || id;
  refreshSection(id);
  if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('mobile-open');
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (window.innerWidth <= 768) sb.classList.toggle('mobile-open');
  else sb.classList.toggle('hidden'), document.querySelector('.main-content').classList.toggle('expanded');
}

// ---- REFRESH ----
function refreshAll() {
  updateTopBalance();
  refreshSection('dashboard');
  populateSelects();
}

function refreshSection(id) {
  if (id === 'dashboard') refreshDashboard();
  if (id === 'users') renderUsersTable();
  if (id === 'pix' || id === 'deposit') populateSelects();
  if (id === 'shop') renderShop();
  if (id === 'transactions') renderTransactions();
  if (id === 'admin') renderAdmin();
}

function updateTopBalance() {
  if (!state.currentUser) return;
  const u = state.users.find(x => x.id === state.currentUser.id);
  if (u) document.getElementById('topBalance').textContent = u.balance.toLocaleString('pt-BR');
}

// ---- DASHBOARD ----
function refreshDashboard() {
  document.getElementById('statUsers').textContent = state.users.filter(u => u.active).length;
  const totalMoney = state.users.reduce((s, u) => s + u.balance, 0);
  document.getElementById('statMoney').textContent = totalMoney.toLocaleString('pt-BR');
  document.getElementById('statTrans').textContent = state.transactions.length;
  document.getElementById('statSales').textContent = state.transactions.filter(t => t.type === 'shop').length;

  const recentUsers = [...state.users].slice(-5).reverse();
  document.getElementById('recentUsers').innerHTML = recentUsers.length ? recentUsers.map(u => `
    <div class="list-item">
      <span class="list-item-icon">${u.grimoire.split(' ')[0]}</span>
      <div class="list-item-info">
        <div class="list-item-main">${u.name}</div>
        <div class="list-item-sub">${u.class}</div>
      </div>
      <span class="list-item-value">${u.balance.toLocaleString('pt-BR')} 🪙</span>
    </div>`).join('') : '<div class="empty-state"><div class="empty-icon">⚔️</div>Nenhum cavaleiro registrado</div>';

  const recentTrans = [...state.transactions].slice(-5).reverse();
  document.getElementById('recentTrans').innerHTML = recentTrans.length ? recentTrans.map(t => `
    <div class="list-item">
      <span class="list-item-icon">${t.type === 'pix' ? '⚡' : t.type === 'deposit' ? '💎' : '🏪'}</span>
      <div class="list-item-info">
        <div class="list-item-main">${t.desc}</div>
        <div class="list-item-sub">${t.from} → ${t.to}</div>
      </div>
      <span class="list-item-value">${t.amount.toLocaleString('pt-BR')} 🪙</span>
    </div>`).join('') : '<div class="empty-state"><div class="empty-icon">📜</div>Nenhuma transação</div>';
}

// ---- USERS ----
function renderUsersTable(filter = '') {
  const users = state.users.filter(u =>
    u.name.toLowerCase().includes(filter) ||
    u.login.toLowerCase().includes(filter) ||
    u.class.toLowerCase().includes(filter)
  );
  document.getElementById('usersTable').innerHTML = users.length ? users.map(u => `
    <tr>
      <td><div class="avatar-cell">${u.name[0].toUpperCase()}</div></td>
      <td><b>${u.name}</b><br><small style="color:var(--text-muted)">${u.login}</small></td>
      <td>${u.class}</td>
      <td>${u.grimoire}</td>
      <td style="color:var(--gold);font-family:var(--font-body);font-weight:700">${u.balance.toLocaleString('pt-BR')} 🪙</td>
      <td>
        <span class="badge ${u.active ? 'badge-active' : 'badge-inactive'}">${u.active ? 'Ativo' : 'Inativo'}</span>
        <span class="badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}" style="margin-left:4px">${u.role === 'admin' ? 'Admin' : 'Cavaleiro'}</span>
      </td>
      <td>
        <button class="btn-action" onclick="editUserBalance(${u.id})" title="Editar saldo">💰</button>
        <button class="btn-action ${u.active ? 'danger' : ''}" onclick="toggleUser(${u.id})">${u.active ? '🔒 Desativar' : '🔓 Ativar'}</button>
        ${state.currentUser?.role === 'admin' ? `<button class="btn-action danger" onclick="deleteUser(${u.id})" title="Remover">🗑️</button>` : ''}
      </td>
    </tr>`).join('') : `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:30px">⚔️ Nenhum cavaleiro encontrado</td></tr>`;
}

function filterUsers() {
  renderUsersTable(document.getElementById('userSearch').value.toLowerCase());
}

function editUserBalance(id) {
  const u = state.users.find(x => x.id === id);
  if (!u) return;
  const val = prompt(`💰 Novo saldo para ${u.name} (atual: ${u.balance}):`, u.balance);
  if (val === null) return;
  const n = parseInt(val);
  if (isNaN(n) || n < 0) return showToast('❌ Valor inválido', 'error');
  u.balance = n;
  saveState(); renderUsersTable(); updateTopBalance();
  showToast(`✅ Saldo de ${u.name} atualizado!`, 'success');
}

function toggleUser(id) {
  const u = state.users.find(x => x.id === id);
  if (!u || u.id === state.currentUser?.id) return showToast('❌ Você não pode desativar sua própria conta!', 'error');
  u.active = !u.active;
  saveState(); renderUsersTable();
  showToast(`${u.active ? '🔓' : '🔒'} ${u.name} ${u.active ? 'ativado' : 'desativado'}!`, u.active ? 'success' : 'error');
}

function deleteUser(id) {
  const u = state.users.find(x => x.id === id);
  if (!u || u.id === state.currentUser?.id) return showToast('❌ Não é possível remover sua própria conta!', 'error');
  if (!confirm(`Remover ${u.name}? Esta ação não pode ser desfeita.`)) return;
  state.users = state.users.filter(x => x.id !== id);
  saveState(); renderUsersTable(); populateSelects();
  showToast(`🗑️ ${u.name} removido do reino`, 'error');
}

function createUser() {
  const name = document.getElementById('newUserName').value.trim();
  const login = document.getElementById('newUserLogin').value.trim();
  const pass = document.getElementById('newUserPass').value.trim();
  const cls = document.getElementById('newUserClass').value;
  const grimoire = document.getElementById('newUserGrimoire').value;
  const balance = parseInt(document.getElementById('newUserBalance').value) || 0;
  const role = document.getElementById('newUserRole').value;
  if (!name || !login || !pass) return showToast('❌ Preencha todos os campos obrigatórios!', 'error');
  if (state.users.find(u => u.login === login)) return showToast('❌ Login já existe no reino!', 'error');
  const newUser = {
    id: Date.now(), name, login, pass, class: cls,
    grimoire, balance, role, active: true
  };
  state.users.push(newUser);
  addTransaction('deposit', 'Sistema', login, balance, 'Saldo inicial do cavaleiro');
  saveState(); closeModal('createUserModal');
  renderUsersTable(); populateSelects(); refreshDashboard();
  document.getElementById('newUserName').value = '';
  document.getElementById('newUserLogin').value = '';
  document.getElementById('newUserPass').value = '';
  document.getElementById('newUserBalance').value = '';
  showToast(`⚔️ ${name} registrado no reino com sucesso!`, 'success');
}

// ---- PIX ----
function doPix() {
  const fromLogin = document.getElementById('pixFrom').value;
  const toLogin = document.getElementById('pixTo').value;
  const amount = parseInt(document.getElementById('pixAmount').value);
  const key = document.getElementById('pixKey').value.trim();
  const desc = document.getElementById('pixDesc').value.trim() || 'Transferência Pix';
  const resultEl = document.getElementById('pixResult');

  if (!fromLogin || !toLogin) return showResult(resultEl, '❌ Selecione remetente e destinatário!', 'error');
  if (fromLogin === toLogin) return showResult(resultEl, '❌ Não pode transferir para si mesmo!', 'error');
  if (!amount || amount <= 0) return showResult(resultEl, '❌ Valor inválido!', 'error');
  if (!key) return showResult(resultEl, '❌ Informe a chave Pix!', 'error');

  const from = state.users.find(u => u.login === fromLogin);
  const to = state.users.find(u => u.login === toLogin);
  if (!from || !to) return showResult(resultEl, '❌ Usuário não encontrado!', 'error');

  const fee = Math.floor(amount * (state.settings.fee / 100));
  const total = amount + fee;
  if (from.balance < total) return showResult(resultEl, `❌ Saldo insuficiente! Necessário: ${total.toLocaleString('pt-BR')} 🪙 (incluindo taxa de ${fee})`, 'error');

  from.balance -= total;
  to.balance += amount;
  addTransaction('pix', fromLogin, toLogin, amount, desc);
  saveState(); populateSelects(); updateTopBalance(); refreshDashboard();

  showResult(resultEl, `⚡ PIX ENVIADO COM SUCESSO!<br>
    De: <b>${from.name}</b> → Para: <b>${to.name}</b><br>
    Valor: <b>${amount.toLocaleString('pt-BR')} 🪙</b>${fee > 0 ? ` (+ ${fee} de taxa)` : ''}<br>
    Chave: <b>${key}</b>`, 'success');
  showToast(`⚡ Pix de ${amount.toLocaleString('pt-BR')} 🪙 enviado!`, 'success');
  document.getElementById('pixAmount').value = '';
  document.getElementById('pixKey').value = '';
  document.getElementById('pixDesc').value = '';
}

// ---- DEPOSIT ----
function doDeposit() {
  const login = document.getElementById('depositUser').value;
  const amount = parseInt(document.getElementById('depositAmount').value);
  const origin = document.getElementById('depositOrigin').value;
  const note = document.getElementById('depositNote').value.trim();
  const resultEl = document.getElementById('depositResult');

  if (!login) return showResult(resultEl, '❌ Selecione o cavaleiro!', 'error');
  if (!amount || amount <= 0) return showResult(resultEl, '❌ Valor inválido!', 'error');

  const user = state.users.find(u => u.login === login);
  if (!user) return showResult(resultEl, '❌ Cavaleiro não encontrado!', 'error');

  user.balance += amount;
  addTransaction('deposit', 'Tesouraria Real', login, amount, `${origin}${note ? ' — ' + note : ''}`);
  saveState(); updateTopBalance(); refreshDashboard(); populateSelects();

  showResult(resultEl, `💎 DEPÓSITO REALIZADO COM SUCESSO!<br>
    Cavaleiro: <b>${user.name}</b><br>
    Valor: <b>+${amount.toLocaleString('pt-BR')} 🪙</b><br>
    Origem: <b>${origin}</b><br>
    Novo saldo: <b>${user.balance.toLocaleString('pt-BR')} 🪙</b>`, 'success');
  showToast(`💎 Depósito de ${amount.toLocaleString('pt-BR')} 🪙 realizado!`, 'success');
  document.getElementById('depositAmount').value = '';
  document.getElementById('depositNote').value = '';
}

// ---- SHOP ----
let shopFilter = 'all';

function renderShop() {
  const items = shopFilter === 'all' ? state.shopItems : state.shopItems.filter(i => i.cat === shopFilter);
  populateShopBuyer();
  document.getElementById('shopGrid').innerHTML = items.map(item => `
    <div class="shop-card rarity-${item.rarity}">
      <div class="rarity-bar"></div>
      <div class="shop-card-header">
        <span class="shop-card-emoji">${item.emoji}</span>
        <div class="shop-card-name">${item.name}</div>
      </div>
      <div class="shop-card-body">
        <div class="shop-card-desc">${item.desc}</div>
        <div style="margin-bottom:10px">
          <span class="badge badge-${item.rarity}">${item.rarity.toUpperCase()}</span>
        </div>
        <div class="shop-card-footer">
          <div>
            <div class="shop-card-price">${item.price.toLocaleString('pt-BR')} 🪙</div>
            <div class="shop-card-stock">Estoque: ${item.stock}</div>
          </div>
          <button class="shop-card-buy" ${item.stock === 0 ? 'disabled' : ''} onclick="buyItem(${item.id})">
            ${item.stock === 0 ? 'ESGOTADO' : '🛒 COMPRAR'}
          </button>
        </div>
      </div>
    </div>`).join('');
}

function filterShop(cat, btn) {
  shopFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderShop();
}

function populateShopBuyer() {
  const sel = document.getElementById('shopBuyer');
  const cur = sel.value;
  sel.innerHTML = state.users.filter(u => u.active).map(u => `<option value="${u.login}">${u.name} (${u.balance.toLocaleString('pt-BR')} 🪙)</option>`).join('');
  if (cur) sel.value = cur;
  if (!sel.value && state.currentUser) sel.value = state.currentUser.login;
}

function buyItem(itemId) {
  const item = state.shopItems.find(i => i.id === itemId);
  const buyerLogin = document.getElementById('shopBuyer').value;
  const buyer = state.users.find(u => u.login === buyerLogin);
  const resultEl = document.getElementById('shopResult');

  if (!item || !buyer) return showResult(resultEl, '❌ Erro ao processar compra!', 'error');
  if (item.stock === 0) return showResult(resultEl, '❌ Item esgotado!', 'error');
  if (buyer.balance < item.price) return showResult(resultEl, `❌ Saldo insuficiente! Você precisa de ${item.price.toLocaleString('pt-BR')} 🪙`, 'error');

  buyer.balance -= item.price;
  item.stock--;
  state.totalSales++;
  addTransaction('shop', buyerLogin, 'Loja Mágica', item.price, `Compra: ${item.emoji} ${item.name}`);
  saveState(); renderShop(); updateTopBalance(); refreshDashboard();

  showResult(resultEl, `🏪 COMPRA REALIZADA!<br>
    Item: <b>${item.emoji} ${item.name}</b><br>
    Valor pago: <b>${item.price.toLocaleString('pt-BR')} 🪙</b><br>
    Novo saldo: <b>${buyer.balance.toLocaleString('pt-BR')} 🪙</b>`, 'success');
  showToast(`🏪 ${item.emoji} ${item.name} adquirido!`, 'success');
}

function addShopItem() {
  const name = document.getElementById('newItemName').value.trim();
  const desc = document.getElementById('newItemDesc').value.trim();
  const cat = document.getElementById('newItemCat').value;
  const price = parseInt(document.getElementById('newItemPrice').value);
  const rarity = document.getElementById('newItemRarity').value;
  const stock = parseInt(document.getElementById('newItemStock').value) || 0;
  const emoji = document.getElementById('newItemEmoji').value.trim() || '⚔️';

  if (!name || !price) return showToast('❌ Preencha nome e preço!', 'error');

  state.shopItems.push({ id: Date.now(), name, desc, cat, price, rarity, stock, emoji });
  saveState(); closeModal('addItemModal');
  renderShop();
  document.getElementById('newItemName').value = '';
  document.getElementById('newItemDesc').value = '';
  document.getElementById('newItemPrice').value = '';
  document.getElementById('newItemStock').value = '';
  document.getElementById('newItemEmoji').value = '';
  showToast(`🏪 ${emoji} ${name} adicionado à loja!`, 'success');
}

// ---- TRANSACTIONS ----
let transFilter = { type: 'all', search: '' };

function renderTransactions() {
  let txs = [...state.transactions].reverse();
  if (transFilter.type !== 'all') txs = txs.filter(t => t.type === transFilter.type);
  if (transFilter.search) txs = txs.filter(t =>
    t.from.toLowerCase().includes(transFilter.search) ||
    t.to.toLowerCase().includes(transFilter.search) ||
    t.desc.toLowerCase().includes(transFilter.search)
  );

  document.getElementById('transTable').innerHTML = txs.length ? txs.map(t => `
    <tr>
      <td style="color:var(--text-secondary);font-size:0.75rem">${new Date(t.date).toLocaleString('pt-BR')}</td>
      <td><span class="badge badge-${t.type}">${t.type === 'pix' ? '⚡ Pix' : t.type === 'deposit' ? '💎 Depósito' : '🏪 Loja'}</span></td>
      <td>${t.from}</td>
      <td>${t.to}</td>
      <td style="color:var(--gold);font-family:var(--font-body);font-weight:700">${t.amount.toLocaleString('pt-BR')} 🪙</td>
      <td style="color:var(--text-secondary);font-size:0.8rem">${t.desc}</td>
      <td><span class="badge badge-active">✓ Sucesso</span></td>
    </tr>`).join('') : `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:30px">📜 Nenhuma transação encontrada</td></tr>`;
}

function filterTransactions() {
  transFilter.type = document.getElementById('transFilter').value;
  transFilter.search = document.getElementById('transSearch').value.toLowerCase();
  renderTransactions();
}

function exportTransactions() {
  const csv = ['Data,Tipo,De,Para,Valor,Descrição,Status',
    ...state.transactions.map(t => `${new Date(t.date).toLocaleString('pt-BR')},${t.type},${t.from},${t.to},${t.amount},${t.desc},Sucesso`)
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'transacoes_grimorio_bank.csv'; a.click();
  showToast('📥 Exportação realizada!', 'success');
}

// ---- ADMIN ----
function renderAdmin() {
  const stats = [
    { k: 'Total de Cavaleiros', v: state.users.length },
    { k: 'Cavaleiros Ativos', v: state.users.filter(u => u.active).length },
    { k: 'Total em Transações', v: state.transactions.length },
    { k: 'Total Circulando', v: state.users.reduce((s,u) => s+u.balance, 0).toLocaleString('pt-BR') + ' 🪙' },
    { k: 'Itens na Loja', v: state.shopItems.length },
    { k: 'Vendas na Loja', v: state.transactions.filter(t => t.type === 'shop').length },
  ];
  document.getElementById('adminStats').innerHTML = stats.map(s => `
    <div class="admin-stat-row">
      <span class="admin-stat-key">${s.k}</span>
      <span class="admin-stat-val">${s.v}</span>
    </div>`).join('');

  document.getElementById('bankName').value = state.settings.bankName;
  document.getElementById('bankCurrency').value = state.settings.currency;
  document.getElementById('bankFee').value = state.settings.fee;

  document.getElementById('adminUsersList').innerHTML = state.users.map(u => `
    <div class="admin-user-row">
      <div class="admin-avatar">${u.name[0].toUpperCase()}</div>
      <div style="flex:1">
        <div style="font-size:0.85rem;font-weight:600">${u.name}</div>
        <div style="font-size:0.7rem;color:var(--text-secondary)">${u.login} · ${u.class}</div>
      </div>
      <span style="color:var(--gold);font-family:var(--font-body);font-size:0.85rem;font-weight:700;margin-right:12px">${u.balance.toLocaleString('pt-BR')} 🪙</span>
      <span class="badge ${u.active ? 'badge-active' : 'badge-inactive'}">${u.active ? 'Ativo' : 'Inativo'}</span>
      <span class="badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}" style="margin-left:6px">${u.role}</span>
    </div>`).join('');
}

function saveSettings() {
  state.settings.bankName = document.getElementById('bankName').value;
  state.settings.currency = document.getElementById('bankCurrency').value;
  state.settings.fee = parseFloat(document.getElementById('bankFee').value) || 0;
  saveState();
  showToast('💾 Configurações salvas!', 'success');
}

// ---- HELPERS ----
function addTransaction(type, from, to, amount, desc) {
  state.transactions.push({ id: Date.now(), type, from, to, amount, desc, date: new Date().toISOString(), status: 'success' });
}

function populateSelects() {
  const active = state.users.filter(u => u.active);
  ['pixFrom','pixTo','depositUser'].forEach(id => {
    const sel = document.getElementById(id);
    const cur = sel.value;
    sel.innerHTML = active.map(u => `<option value="${u.login}">${u.name} (${u.balance.toLocaleString('pt-BR')} 🪙)</option>`).join('');
    if (cur) sel.value = cur;
    if (!sel.value && state.currentUser) sel.value = state.currentUser.login;
  });
}

function showResult(el, msg, type) {
  el.className = `result-box ${type}`;
  el.innerHTML = msg;
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
function closeModalOutside(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

let toastTimeout;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.className = `toast ${type}`;
  t.innerHTML = msg;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.add('hidden'), 3500);
}

function showResult(el, msg, type) {
  el.className = `result-box ${type}`;
  el.innerHTML = msg;
}

// ---- PARTICLES ----
function createParticles() {
  const container = document.getElementById('particles');
  container.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 15 + 8}s;
      animation-delay:${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}

// ---- INIT ----
initData();
createParticles();
