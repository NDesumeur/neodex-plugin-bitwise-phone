// Bitwise : manipuler le binaire, l'hexadécimal, l'octal et l'ASCII, voir chaque bit, faire les opérations bit à bit et décortiquer un nombre à virgule.
// Les nombres sont des BigInt : 8, 16, 32 ou 64 bits, non signés ou en complément à deux.
const CSS = `
.bwTabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.bwRow{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:6px 0}
.bwField{display:grid;grid-template-columns:150px 1fr 40px;gap:8px;align-items:center;margin:5px 0}
.bwField .f{font-family:monospace;font-size:19px;width:100%;box-sizing:border-box}
.bwField .f.bad{outline:2px solid #e05a5a}
.bwBits{display:flex;flex-direction:column;gap:6px;margin-top:10px}
.bwLine{display:flex;gap:10px;flex-wrap:wrap}
.bwNib{display:flex;gap:2px}
.bwBit{width:30px;height:42px;padding:0;border:2px solid var(--line);background:var(--bg0);color:var(--muted);font:20px monospace;cursor:var(--cp,pointer);display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
.bwBit i{font-style:normal;font-size:11px;color:var(--muted);margin-top:2px}
.bwBit.on{background:rgba(var(--pkr),.35);border-color:var(--magenta);color:#fff}
.bwBit.sign{box-shadow:inset 0 -3px 0 #e0b04a}
.bwBit.exp{box-shadow:inset 0 -3px 0 #4ab0e0}
.bwBit.man{box-shadow:inset 0 -3px 0 #6ad06a}
.bwInfo{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px 18px;margin-top:12px;font-size:16px}
.bwInfo b{color:#fff}
.bwOps{display:flex;gap:4px;flex-wrap:wrap}
.bwOps .btn{min-width:54px}
.bwScroll{overflow-x:auto}
.bwTable{font-family:monospace;font-size:19px;border-collapse:collapse;margin-top:10px}
.bwTable td,.bwTable th{padding:3px 8px;text-align:right;white-space:pre}
.bwTable th{color:var(--muted);font-weight:normal;text-align:left}
.bwTable td.r1{color:#fff}
.bwDigit{display:inline-block;width:15px;text-align:center}
.bwDigit.sl{animation:bwSl .3s ease-out}.bwDigit.sr{animation:bwSr .3s ease-out}
@keyframes bwSl{from{transform:translateX(15px);opacity:.4}}@keyframes bwSr{from{transform:translateX(-15px);opacity:.4}}
.bwDigit.on{color:#fff;background:rgba(var(--pkr),.35)}
.bwAscii{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:4px;margin-top:10px}
.bwAscii button{display:grid;grid-template-columns:54px 1fr;gap:2px 8px;text-align:left;padding:8px;border:2px solid var(--line);background:var(--bg0);color:var(--lilac);font:15px monospace;cursor:var(--cp,pointer)}
.bwAscii button b{grid-row:span 2;font-size:22px;color:#fff;text-align:center;align-self:center}
.bwAscii button:hover{border-color:var(--magenta)}
.bwText{width:100%;min-height:100px;box-sizing:border-box;font-family:monospace;font-size:17px}
.bwOut{font-family:monospace;font-size:17px;word-break:break-all;white-space:pre-wrap;color:#fff;background:var(--bg0);border:2px solid var(--line);padding:8px;min-height:24px}
.bwFormula{font-family:monospace;font-size:17px;color:#fff;margin-top:10px;line-height:1.6}
.bwLegend span{margin-right:14px}
.bwLegend i{display:inline-block;width:14px;height:14px;margin-right:4px;vertical-align:-1px}
.bwMask{margin-top:14px;border-top:2px dashed var(--line);padding-top:10px}
.bwMask .f{width:80px;font:18px monospace}
.bwMaskOut{font:17px/1.6 monospace;color:#fff;white-space:pre-wrap}
.bwMaskOut em{font-style:normal;color:var(--lilac);font-family:inherit}
.appWrap .hint,.appWrap p.hint{font-size:15px!important;line-height:1.5}
/*PHONE*/
/* téléphone : étiquette courte, champ large ; bits un peu plus petits ; table ASCII sur deux colonnes */
@media (max-width:600px){
.bwField{grid-template-columns:minmax(0,1fr) 40px;gap:2px 6px}
.bwField>:first-child{grid-column:1/-1}
.bwField .f{font-size:15px;min-width:0}
.bwBit{width:26px;height:40px;font-size:18px}
.bwLine{gap:6px}
.bwAscii{grid-template-columns:repeat(2,minmax(0,1fr))}
.bwAscii button{grid-template-columns:40px 1fr;font-size:13px;padding:6px}
.bwInfo{grid-template-columns:minmax(0,1fr);font-size:15px}
.bwTable{font-size:15px}
}
/*/PHONE*/
`;
const W = [8, 16, 32, 64];
// les masques prêts à l'emploi : le calcul, ce qu'il fait, et pourquoi ça marche
const MASKS = [
  ['set', 'Allumer', 'x | (1 << n)', (v, m) => v | m, 'OR avec un masque qui n\'a que le bit n à 1 : ce bit passe à 1, les autres ne bougent pas (x OR 0 = x).'],
  ['clear', 'Éteindre', 'x & ~(1 << n)', (v, m, all) => v & (all ^ m), 'AND avec le masque inversé (tout à 1 sauf le bit n) : ce bit passe à 0, les autres restent (x AND 1 = x).'],
  ['flip', 'Basculer', 'x ^ (1 << n)', (v, m) => v ^ m, 'XOR avec le masque : le bit n s\'inverse, les autres restent (x XOR 0 = x).'],
  ['test', 'Tester', '(x & (1 << n)) != 0', v => v, 'AND avec le masque : tout s\'efface sauf le bit n. Le résultat est 0 si le bit est éteint, autre chose s\'il est allumé.'],
  ['low', 'Garder les n bits du bas', 'x & ((1 << n) - 1)', (v, m) => v & (m - 1n), '(1 << n) − 1 donne n bits à 1 en bas : AND garde ces n bits et efface tout ce qui est au-dessus.'],
];
const CTRL = ['NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', 'BS', 'TAB', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI', 'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB', 'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US'];
const OPS = {
  and: ['AND', 'AND : le bit vaut 1 seulement si les deux bits sont à 1. Sert à garder certains bits (un masque).'],
  or: ['OR', 'OR : le bit vaut 1 si au moins un des deux est à 1. Sert à allumer des bits.'],
  xor: ['XOR', 'XOR : le bit vaut 1 si les deux bits sont différents. Deux XOR avec la même clé redonnent le nombre de départ.'],
  nand: ['NAND', 'NAND : l\'inverse de AND. Avec NAND seul, on peut construire tous les circuits logiques.'],
  nor: ['NOR', 'NOR : l\'inverse de OR, 1 seulement si les deux bits sont à 0.'],
  xnor: ['XNOR', 'XNOR : 1 quand les deux bits sont égaux.'],
  shl: ['<<', '<< : décale les bits vers la gauche de B cases (multiplie par 2 à chaque case), les bits qui sortent sont perdus.'],
  shr: ['>>', '>> : décale vers la droite en recopiant le bit de signe (division par 2 qui garde le signe).'],
  ushr: ['>>>', '>>> : décale vers la droite en faisant entrer des 0 (division par 2 sans signe).'],
  rol: ['ROL', 'ROL : rotation à gauche, les bits qui sortent à gauche reviennent à droite.'],
  ror: ['ROR', 'ROR : rotation à droite, les bits qui sortent à droite reviennent à gauche.'],
  add: ['+', '+ : addition binaire avec retenue ; ce qui dépasse la largeur est perdu (débordement).'],
  sub: ['−', '− : soustraction ; en complément à deux, A − B est A + (NOT B + 1).'],
  mul: ['×', '× : multiplication ; seuls les bits de poids faible tiennent dans la largeur choisie.'],
};
export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const { el, toast } = ctx.host;
  ctx.host.addStyle(CSS);
  let saved = null; try { saved = await ctx.folder.read('bitwise'); } catch {}
  const big = (v, d) => { try { return BigInt(v); } catch { return d; } };
  const st = {w: W.includes(saved?.w) ? saved.w : 32, signed: !!saved?.signed, v: big(saved?.v, 42n), a: big(saved?.a, 12n), b: big(saved?.b, 10n), op: OPS[saved?.op] ? saved.op : 'and',
    tab: saved?.tab || 'num', maskN: Number.isInteger(saved?.maskN) ? saved.maskN : 3, text: saved?.text ?? 'Bonjour !', fv: saved?.fv ?? '-6.25', f64: !!saved?.f64};
  let saveT = 0;
  const save = () => { clearTimeout(saveT); saveT = setTimeout(() => ctx.folder.write('bitwise', {...st, v: String(st.v), a: String(st.a), b: String(st.b)}).catch(() => {}), 400); };

  // ---------- les nombres ----------
  const mask = () => (1n << BigInt(st.w)) - 1n, norm = v => v & mask();
  const signedOf = v => v >= 1n << BigInt(st.w - 1) ? v - (1n << BigInt(st.w)) : v;
  function parse(s, base) {  // un texte -> nombre ramené à la largeur, ou null s'il n'est pas valable
    s = String(s).trim().replace(/[\s_']/g, ''); if (!s) return null;
    let neg = false; if (s[0] === '-') { neg = true; s = s.slice(1); }
    const pre = s.slice(0, 2).toLowerCase();
    if (pre === '0x') { base = 16; s = s.slice(2); } else if (pre === '0b') { base = 2; s = s.slice(2); } else if (pre === '0o') { base = 8; s = s.slice(2); }
    const ok = {2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^\d+$/, 16: /^[\da-f]+$/i}[base];
    if (!ok.test(s)) return null;
    const v = BigInt(base === 10 ? s : (base === 16 ? '0x' : base === 8 ? '0o' : '0b') + s);
    return norm(neg ? -v : v);
  }
  const bin = (v, w = st.w) => norm(v).toString(2).padStart(w, '0');
  const group = (s, n) => s.replace(new RegExp(`(.{${n}})(?=.)`, 'g'), '$1 ');
  const hex = v => norm(v).toString(16).toUpperCase().padStart(st.w / 4, '0');
  const chars = v => { const out = []; for (let i = st.w - 8; i >= 0; i -= 8) { const c = Number((v >> BigInt(i)) & 255n); out.push(c >= 32 && c < 127 ? String.fromCharCode(c) : '·'); } return out.join(''); };
  const fromChars = s => { if (!s.length || s.length > st.w / 8) return null; let v = 0n; for (const ch of s) { const c = ch.charCodeAt(0); if (c > 255) return null; v = (v << 8n) | BigInt(c); } return v; };
  const dec = v => String(st.signed ? signedOf(norm(v)) : norm(v));
  const pop = v => bin(v).split('').filter(c => c === '1').length;
  const rot = (v, n, left) => { const w = BigInt(st.w); n = ((BigInt(n) % w) + w) % w; v = norm(v); return norm(left ? v << n | v >> (w - n) : v >> n | v << (w - n)); };
  function apply(op, a, b) {
    a = norm(a); b = norm(b); const n = Number(b > 64n ? 64n : b), w = st.w;
    switch (op) {
      case 'and': return a & b; case 'or': return a | b; case 'xor': return a ^ b;
      case 'nand': return norm(~(a & b)); case 'nor': return norm(~(a | b)); case 'xnor': return norm(~(a ^ b));
      case 'shl': return n >= w ? 0n : norm(a << BigInt(n));
      case 'shr': return n >= w ? (signedOf(a) < 0n ? mask() : 0n) : norm(signedOf(a) >> BigInt(n));
      case 'ushr': return n >= w ? 0n : a >> BigInt(n);
      case 'rol': return rot(a, n, true); case 'ror': return rot(a, n, false);
      case 'add': return norm(a + b); case 'sub': return norm(a - b); case 'mul': return norm(a * b);
    }
  }
  // vérification : les opérations sur quelques cas connus
  { const w0 = st.w; st.w = 8;
    console.assert(apply('and', 12n, 10n) === 8n && apply('xor', 12n, 10n) === 6n && apply('nand', 255n, 1n) === 254n && apply('shl', 129n, 1n) === 2n && apply('shr', 128n, 1n) === 192n
      && apply('ushr', 128n, 1n) === 64n && apply('rol', 129n, 1n) === 3n && apply('ror', 1n, 1n) === 128n && apply('sub', 0n, 1n) === 255n && parse('-1', 10) === 255n && parse('0x1F', 10) === 31n
      && parse('12a', 10) === null && fromChars('A') === 65n, 'bitwise : opérations');
    st.w = w0; }

  // ---------- la page ----------
  view.innerHTML = '';
  const wrap = el('div', 'appWrap wide'), head = el('div', 'agHead'), tabs = el('div', 'bwTabs'), body = el('div');
  head.append(el('span', 'label', 'Bitwise · binaire, hexadécimal, ASCII et opérations bit à bit'));
  wrap.append(head, tabs, body); view.append(wrap);
  const TABS = [['num', 'Nombre'], ['ops', 'Opérations'], ['text', 'Texte'], ['ascii', 'Table ASCII'], ['float', 'Virgule flottante']];
  const widthRow = () => {
    const r = el('div', 'bwRow');
    r.append(el('span', 'hint', 'Largeur :'));
    for (const w of W) { const b = el('button', 'btn px' + (st.w === w ? ' main' : ''), w + ' bits'); b.onclick = () => { st.w = w; st.v = norm(st.v); st.a = norm(st.a); st.b = norm(st.b); save(); show(); }; r.append(b); }
    const sg = el('button', 'btn px' + (st.signed ? ' main' : ''), st.signed ? 'Signé (complément à deux)' : 'Non signé');
    sg.title = 'Lire le bit de gauche comme un signe moins'; sg.onclick = () => { st.signed = !st.signed; save(); show(); };
    r.append(sg); return r;
  };
  function bitGrid(get, set, kind) {  // les bits cliquables, par paquets de 4, 32 par ligne
    const box = el('div', 'bwBits'), v = get(), w = kind?.w || st.w, s = v.toString(2).padStart(w, '0');
    for (let line = 0; line < w; line += 32) {
      const l = el('div', 'bwLine');
      for (let n = line; n < Math.min(w, line + 32); n += 4) {
        const nib = el('div', 'bwNib');
        for (let k = n; k < n + 4; k++) {
          const idx = w - 1 - k, b = el('button', 'bwBit' + (s[k] === '1' ? ' on' : '') + (kind?.cls ? ' ' + kind.cls(idx) : (st.signed && idx === w - 1 ? ' sign' : '')));
          b.append(s[k], el('i', '', String(idx))); b.title = 'bit ' + idx + ' · valeur ' + (1n << BigInt(idx));
          b.onclick = () => set(v ^ (1n << BigInt(idx)));
          nib.append(b);
        }
        l.append(nib);
      }
      box.append(l);
    }
    return box;
  }

  function showNum() {
    const card = el('div', 'sysCard px'), fields = {};
    card.append(widthRow());
    const F = [['dec', 'Décimal', 10], ['hex', 'Hexadécimal', 16], ['bin', 'Binaire', 2], ['oct', 'Octal', 8], ['chr', 'Caractères', 0]];
    const fill = except => {
      for (const [k] of F) if (k !== except) {
        fields[k].value = k === 'dec' ? dec(st.v) : k === 'hex' ? group(hex(st.v), 4) : k === 'bin' ? group(bin(st.v), 4) : k === 'oct' ? norm(st.v).toString(8) : chars(st.v);
        fields[k].classList.remove('bad');
      }
      grid.replaceWith(grid = bitGrid(() => norm(st.v), setV)); info.replaceWith(info = infos());
    };
    const setV = v => { st.v = norm(v); save(); fill(); };
    for (const [k, label, base] of F) {
      const row = el('div', 'bwField'), f = el('input', 'f'), copy = el('button', 'btn px', '⧉');
      f.spellcheck = false; f.id = 'bw_' + k; copy.title = 'Copier';
      copy.onclick = () => { navigator.clipboard.writeText(f.value.replace(k === 'chr' ? /$^/ : /\s/g, '')).then(() => toast('Copié'), () => {}); };
      f.oninput = () => { const v = base ? parse(f.value, base) : fromChars(f.value); f.classList.toggle('bad', v == null); if (v != null) { st.v = v; save(); fill(k); } };
      fields[k] = f; row.append(el('span', 'hint', label), f, copy); card.append(row);
    }
    let grid = el('div'), info = el('div');
    card.append(grid, info);
    const acts = el('div', 'bwRow');
    for (const [t, tip, fn] of [['NOT', 'Inverser tous les bits', v => ~v], ['<< 1', 'Décaler à gauche', v => v << 1n], ['>> 1', 'Décaler à droite', v => norm(v) >> 1n], ['ROL', 'Rotation à gauche', v => rot(v, 1, true)],
      ['ROR', 'Rotation à droite', v => rot(v, 1, false)], ['−x', 'Opposé (complément à deux)', v => -v], ['Octets ⇄', 'Inverser l\'ordre des octets (petit / grand boutiste)', v => { let r = 0n; for (let i = 0; i < st.w; i += 8) r = (r << 8n) | ((norm(v) >> BigInt(i)) & 255n); return r; }],
      ['0', 'Tout à zéro', () => 0n], ['Max', 'Tous les bits à 1', () => mask()]]) {
      const b = el('button', 'btn px', t); b.title = tip; b.onclick = () => setV(fn(st.v)); acts.append(b);
    }
    card.append(acts);
    {  // masques prêts à l'emploi
      const box = el('div', 'bwMask'), row = el('div', 'bwRow'), nIn = el('input', 'f'), out = el('div', 'bwMaskOut');
      nIn.type = 'number'; nIn.min = 0; nIn.id = 'bw_maskN'; nIn.value = Math.min(st.maskN ?? 3, st.w - 1); out.id = 'bw_maskOut';
      row.append(el('span', 'hint', 'Bit n ='), nIn);
      for (const [k, t, expr, fn, why] of MASKS) {
        const b = el('button', 'btn px', t); b.dataset.mask = k; b.title = expr;
        b.onclick = () => {
          const n = Math.max(0, Math.min(st.w - 1, Math.floor(+nIn.value) || 0)); nIn.value = n; st.maskN = n;
          const m = 1n << BigInt(n), v = norm(st.v), r = norm(fn(v, m, mask())), shown = k === 'low' ? m - 1n : k === 'clear' ? norm(mask() ^ m) : m;
          const lines = [expr + '   (n = ' + n + ')', 'x       = ' + group(bin(v), 4), 'masque  = ' + group(bin(shown), 4)];
          lines.push(k === 'test' ? 'x & m   = ' + group(bin(v & m), 4) + '  →  ' + (v & m ? 'le bit ' + n + ' est allumé' : 'le bit ' + n + ' est éteint') : 'résultat = ' + group(bin(r), 4));
          out.replaceChildren(el('div', '', lines.join('\n')), el('em', '', why));
          if (k !== 'test') setV(r); else save();
        };
        row.append(b);
      }
      box.append(el('span', 'label', 'Masques prêts à l\'emploi'), row, out); card.append(box);
    }
    const infos = () => {
      const v = norm(st.v), d = el('div', 'bwInfo'), hi = v ? v.toString(2).length - 1 : -1;
      const add = (k, val) => { const x = el('span', 'hint', k + ' '); x.append(el('b', '', String(val))); d.append(x); };
      add('Bits à 1 :', pop(v)); add('Bit le plus haut :', hi < 0 ? '—' : hi); add('Puissance de 2 :', v && !(v & (v - 1n)) ? 'oui' : 'non');
      add('Parité :', v & 1n ? 'impair' : 'pair'); add('Non signé :', String(v)); add('Signé :', String(signedOf(v)));
      add('Plage :', st.signed ? String(-(1n << BigInt(st.w - 1))) + ' à ' + String((1n << BigInt(st.w - 1)) - 1n) : '0 à ' + String(mask()));
      return d;
    };
    fill();
    return card;
  }

  function showOps() {
    const card = el('div', 'sysCard px');
    card.append(widthRow());
    const fa = el('input', 'f'), fb = el('input', 'f'), ops = el('div', 'bwOps'), out = el('div', 'bwScroll'), why = el('p', 'hint');
    fa.id = 'bw_a'; fb.id = 'bw_b'; fa.value = dec(st.a); fb.value = dec(st.b);
    const rowA = el('div', 'bwField'), rowB = el('div', 'bwField');
    rowA.append(el('span', 'hint', 'A'), fa, el('span')); rowB.append(el('span', 'hint', 'B'), fb, el('span'));
    const read = f => { const s = f.value.trim(); return /^-?0[xbo]/i.test(s) ? parse(s, 10) : /^[01]{9,}$/.test(s.replace(/\s/g, '')) ? parse(s, 2) : parse(s, 10); };
    for (const f of [fa, fb]) f.oninput = () => { const v = read(f); f.classList.toggle('bad', v == null); if (v != null) { st[f === fa ? 'a' : 'b'] = v; save(); draw(); } };
    for (const [k, [sym]] of Object.entries(OPS)) { const b = el('button', 'btn px' + (st.op === k ? ' main' : ''), sym); b.dataset.op = k; b.onclick = () => { clearInterval(anim); st.op = k; save(); for (const x of ops.children) x.classList.toggle('main', x.dataset.op === k); draw(); }; ops.append(b); }
    const use = el('button', 'btn px', 'Résultat → A'); use.onclick = () => { st.a = apply(st.op, st.a, st.b); fa.value = dec(st.a); save(); draw(); };
    const toNum = el('button', 'btn px', 'Ouvrir dans Nombre'); toNum.onclick = () => { st.v = apply(st.op, st.a, st.b); st.tab = 'num'; save(); show(); };
    let anim = 0;
    function draw(step) {
      const r = step == null ? apply(st.op, st.a, st.b) : apply(st.op, st.a, BigInt(step)), shift = ['shl', 'shr', 'ushr', 'rol', 'ror'].includes(st.op), t = el('table', 'bwTable');
      const slide = step ? (['shl', 'rol'].includes(st.op) ? ' sl' : ' sr') : '';
      const line = (name, v, hl) => {
        const tr = el('tr'), td = el('td'), s = bin(v);
        tr.append(el('th', '', name)); for (let i = 0; i < s.length; i++) { td.append(el('span', 'bwDigit' + (hl && s[i] === '1' ? ' on' : '') + (hl ? slide : ''), s[i])); if (i % 4 === 3 && i < s.length - 1) td.append(' '); }
        tr.append(td, el('td', 'r1', dec(v)), el('td', '', '0x' + hex(v))); return tr;
      };
      t.append(line('A', st.a), shift ? (() => { const tr = el('tr'); tr.append(el('th', '', 'B'), el('td', '', 'de ' + Number(norm(st.b) > 64n ? 64n : norm(st.b)) + ' case(s)'), el('td'), el('td')); return tr; })() : line('B', st.b), line('= ' + OPS[st.op][0], r, true));
      why.textContent = OPS[st.op][1] + (step != null ? '  —  case ' + step + ' / ' + Math.min(64, Number(norm(st.b))) : '');
      out.replaceChildren(t); out.dataset.step = step ?? '';
      play.hidden = !shift;
    }
    // les bits qui glissent : le décalage case par case, une case toutes les 0,4 s
    const play = el('button', 'btn px', '▶ Voir les bits glisser'); play.id = 'bw_anim';
    play.onclick = () => { clearInterval(anim); const n = Math.min(st.w, Number(norm(st.b))); let k = 0; draw(0); if (!n) return; anim = setInterval(() => { draw(++k); if (k >= n) { clearInterval(anim); setTimeout(() => { if (out.isConnected) draw(); }, 600); } }, 400); };
    card.append(rowA, rowB, ops, out, why, el('div', 'bwRow')); card.lastChild.append(play, use, toNum);
    draw(); return card;
  }

  function showText() {
    const card = el('div', 'sysCard px'), ta = el('textarea', 'f bwText'), fmts = el('div', 'bwRow'), out = el('div', 'bwOut'), back = el('textarea', 'f bwText'), backOut = el('div', 'bwOut');
    ta.value = st.text; ta.id = 'bw_text'; out.id = 'bw_textOut'; out.translate = false; backOut.translate = false; let fmt = 'hex';
    const enc = new TextEncoder(), decd = new TextDecoder('utf-8', {fatal: true});
    const draw = () => {
      const bytes = [...enc.encode(ta.value)];
      out.textContent = fmt === 'hex' ? bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ') : fmt === 'bin' ? bytes.map(b => b.toString(2).padStart(8, '0')).join(' ')
        : fmt === 'dec' ? bytes.join(' ') : btoa(String.fromCharCode(...bytes));
      cnt.textContent = [...ta.value].length + ' caractère(s) · ' + bytes.length + ' octet(s) en UTF-8';
    };
    const cnt = el('p', 'hint');
    for (const [k, t] of [['hex', 'Hexadécimal'], ['bin', 'Binaire'], ['dec', 'Décimal'], ['b64', 'Base64']]) { const b = el('button', 'btn px' + (fmt === k ? ' main' : ''), t); b.onclick = () => { fmt = k; for (const x of fmts.children) x.classList.toggle('main', x === b); draw(); }; fmts.append(b); }
    ta.oninput = () => { st.text = ta.value; save(); draw(); };
    back.placeholder = 'Colle ici des octets (hexadécimal, binaire ou Base64) pour retrouver le texte'; back.id = 'bw_back';
    back.oninput = () => {
      const s = back.value.trim(); let bytes = null;
      if (/^([01]{8}\s*)+$/.test(s)) bytes = s.match(/[01]{8}/g).map(x => parseInt(x, 2));
      else if (/^(0x)?([\da-f]{2}[\s,]*)+$/i.test(s)) bytes = s.replace(/0x/gi, '').match(/[\da-f]{2}/gi).map(x => parseInt(x, 16));
      else if (/^[A-Za-z\d+/]+=*$/.test(s)) try { bytes = [...atob(s)].map(c => c.charCodeAt(0)); } catch {}
      if (!s) return backOut.textContent = '';
      try { backOut.textContent = bytes ? decd.decode(new Uint8Array(bytes)) : 'Je ne reconnais pas ce format.'; } catch { backOut.textContent = 'Ces octets ne forment pas un texte UTF-8 valable.'; }
    };
    card.append(el('span', 'label', 'Texte → octets'), ta, cnt, fmts, out, el('span', 'label', 'Octets → texte'), back, backOut);
    draw(); return card;
  }

  function showAscii() {
    const card = el('div', 'sysCard px'), grid = el('div', 'bwAscii');
    card.append(el('p', 'hint', 'Les 128 caractères ASCII. Touche-en un pour l\'ouvrir dans Nombre.'));
    for (let c = 0; c < 128; c++) {
      const b = el('button'); b.append(el('b', '', c < 32 ? CTRL[c] : c === 32 ? '␠' : c === 127 ? 'DEL' : String.fromCharCode(c)), el('span', '', c + ' · 0x' + c.toString(16).toUpperCase().padStart(2, '0')), el('span', '', c.toString(2).padStart(8, '0')));
      b.onclick = () => { st.v = BigInt(c); st.tab = 'num'; save(); show(); };
      grid.append(b);
    }
    card.append(grid); return card;
  }

  function showFloat() {
    const card = el('div', 'sysCard px'), f = el('input', 'f'), row = el('div', 'bwField'), wr = el('div', 'bwRow'), host = el('div');
    f.value = st.fv; f.id = 'bw_float';
    for (const [k, t] of [[false, 'float (32 bits)'], [true, 'double (64 bits)']]) { const b = el('button', 'btn px' + (st.f64 === k ? ' main' : ''), t); b.onclick = () => { st.f64 = k; save(); show(); }; wr.append(b); }
    row.append(el('span', 'hint', 'Nombre'), f, el('span'));
    const E = () => st.f64 ? {w: 64, e: 11, m: 52, bias: 1023} : {w: 32, e: 8, m: 23, bias: 127};
    const bitsOf = x => { const dv = new DataView(new ArrayBuffer(8)); if (st.f64) { dv.setFloat64(0, x); return dv.getBigUint64(0); } dv.setFloat32(0, x); return BigInt(dv.getUint32(0)); };
    const valOf = b => { const dv = new DataView(new ArrayBuffer(8)); if (st.f64) { dv.setBigUint64(0, b); return dv.getFloat64(0); } dv.setUint32(0, Number(b)); return dv.getFloat32(0); };
    const draw = bits => {
      const {w, e, m, bias} = E(), s = Number(bits >> BigInt(w - 1)), ex = Number((bits >> BigInt(m)) & ((1n << BigInt(e)) - 1n)), man = bits & ((1n << BigInt(m)) - 1n), x = valOf(bits);
      const grid = bitGrid(() => bits, nb => { f.value = String(valOf(nb)); st.fv = f.value; save(); draw(nb); }, {w, cls: i => i === w - 1 ? 'sign' : i >= m ? 'exp' : 'man'});
      const fr = el('div', 'bwFormula'), frac = Number(man) / 2 ** m;
      const kind = ex === 0 && man === 0n ? 'zéro' : ex === (1 << e) - 1 ? (man ? 'NaN (pas un nombre)' : 'infini') : ex === 0 ? 'dénormalisé (très proche de zéro)' : 'normal';
      fr.append(el('div', '', 'signe ' + s + ' · exposant ' + ex + ' − ' + bias + ' = ' + (ex - bias) + ' · mantisse ' + (ex ? '1' : '0') + '.' + man.toString(2).padStart(m, '0').replace(/0+$/, '') ),
        el('div', '', kind === 'normal' ? '(−1)^' + s + ' × ' + (1 + frac) + ' × 2^' + (ex - bias) + ' = ' + x : 'Cas spécial : ' + kind),
        el('div', '', 'Valeur vraiment stockée : ' + (Number.isFinite(x) ? x.toPrecision(st.f64 ? 17 : 9) : String(x))),
        el('div', '', 'Hexadécimal : 0x' + bits.toString(16).toUpperCase().padStart(w / 4, '0')));
      const leg = el('p', 'hint bwLegend'); for (const [c, t] of [['#e0b04a', 'signe'], ['#4ab0e0', 'exposant'], ['#6ad06a', 'mantisse']]) { const sp = el('span'), i = el('i'); i.style.background = c; sp.append(i, t); leg.append(sp); }
      host.replaceChildren(leg, grid, fr);
    };
    f.oninput = () => { const x = Number(f.value.replace(',', '.').trim()); const ok = f.value.trim() !== '' && (!Number.isNaN(x) || /^nan$/i.test(f.value.trim())); f.classList.toggle('bad', !ok); if (ok) { st.fv = f.value; save(); draw(bitsOf(x)); } };
    card.append(wr, row, host, el('p', 'hint', 'Un nombre à virgule est rangé en trois morceaux : le signe, l\'exposant (la puissance de 2) et la mantisse (les chiffres). Clique sur un bit pour voir ce qu\'il change. Exemple : 0,1 ne tombe jamais juste en binaire.'));
    draw(bitsOf(Number(String(st.fv).replace(',', '.')) || 0));
    return card;
  }

  function show() {
    tabs.replaceChildren(...TABS.map(([k, t]) => { const b = el('button', 'btn px' + (st.tab === k ? ' main' : ''), t); b.dataset.tab = k; b.onclick = () => { st.tab = k; save(); show(); }; return b; }));
    body.replaceChildren(({num: showNum, ops: showOps, text: showText, ascii: showAscii, float: showFloat}[st.tab] || showNum)());
  }
  show();
}
