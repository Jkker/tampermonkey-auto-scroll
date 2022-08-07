// ==UserScript==
// @name         Auto Scroll Button
// @namespace    https://github.com/Jkker/tampermonkey-auto-scroll
// @version      1.0
// @description  Auto scroll down the page
// @author       Jkker
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/Jkker/tampermonkey-auto-scroll/master/src/icons/Unfold.svg
// @grant        none
// ==/UserScript==

function U() {
}
function nt(t, e) {
  for (const n in e)
    t[n] = e[n];
  return t;
}
function V(t) {
  return t();
}
function O() {
  return /* @__PURE__ */ Object.create(null);
}
function D(t) {
  t.forEach(V);
}
function F(t) {
  return typeof t == "function";
}
function K(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
let w;
function H(t, e) {
  return w || (w = document.createElement("a")), w.href = e, t === w.href;
}
function rt(t) {
  return Object.keys(t).length === 0;
}
function ot(t, e, n, r) {
  if (t) {
    const s = q(t, e, n, r);
    return t[0](s);
  }
}
function q(t, e, n, r) {
  return t[1] && r ? nt(n.ctx.slice(), t[1](r(e))) : n.ctx;
}
function it(t, e, n, r) {
  if (t[2] && r) {
    const s = t[2](r(n));
    if (e.dirty === void 0)
      return s;
    if (typeof s == "object") {
      const l = [], i = Math.max(e.dirty.length, s.length);
      for (let o = 0; o < i; o += 1)
        l[o] = e.dirty[o] | s[o];
      return l;
    }
    return e.dirty | s;
  }
  return e.dirty;
}
function lt(t, e, n, r, s, l) {
  if (s) {
    const i = q(e, n, r, l);
    t.p(i, s);
  }
}
function st(t) {
  if (t.ctx.length > 32) {
    const e = [], n = t.ctx.length / 32;
    for (let r = 0; r < n; r++)
      e[r] = -1;
    return e;
  }
  return -1;
}
function ut(t, e) {
  t.appendChild(e);
}
function p(t, e, n) {
  t.insertBefore(e, n || null);
}
function m(t) {
  t.parentNode.removeChild(t);
}
function P(t) {
  return document.createElement(t);
}
function j(t) {
  return document.createTextNode(t);
}
function E() {
  return j(" ");
}
function ct(t, e, n, r) {
  return t.addEventListener(e, n, r), () => t.removeEventListener(e, n, r);
}
function S(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function ft(t) {
  return Array.from(t.childNodes);
}
function f(t, e, n, r) {
  n === null ? t.style.removeProperty(e) : t.style.setProperty(e, n, r ? "important" : "");
}
let L;
function y(t) {
  L = t;
}
const b = [], G = [], v = [], W = [], at = Promise.resolve();
let z = !1;
function dt() {
  z || (z = !0, at.then(X));
}
function Z(t) {
  v.push(t);
}
const B = /* @__PURE__ */ new Set();
let x = 0;
function X() {
  const t = L;
  do {
    for (; x < b.length; ) {
      const e = b[x];
      x++, y(e), gt(e.$$);
    }
    for (y(null), b.length = 0, x = 0; G.length; )
      G.pop()();
    for (let e = 0; e < v.length; e += 1) {
      const n = v[e];
      B.has(n) || (B.add(n), n());
    }
    v.length = 0;
  } while (b.length);
  for (; W.length; )
    W.pop()();
  z = !1, B.clear(), y(t);
}
function gt(t) {
  if (t.fragment !== null) {
    t.update(), D(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(Z);
  }
}
const A = /* @__PURE__ */ new Set();
let h;
function mt() {
  h = {
    r: 0,
    c: [],
    p: h
  };
}
function _t() {
  h.r || D(h.c), h = h.p;
}
function g(t, e) {
  t && t.i && (A.delete(t), t.i(e));
}
function $(t, e, n, r) {
  if (t && t.o) {
    if (A.has(t))
      return;
    A.add(t), h.c.push(() => {
      A.delete(t), r && (n && t.d(1), r());
    }), t.o(e);
  } else
    r && r();
}
function N(t) {
  t && t.c();
}
function M(t, e, n, r) {
  const { fragment: s, on_mount: l, on_destroy: i, after_update: o } = t.$$;
  s && s.m(e, n), r || Z(() => {
    const u = l.map(V).filter(F);
    i ? i.push(...u) : D(u), t.$$.on_mount = [];
  }), o.forEach(Z);
}
function C(t, e) {
  const n = t.$$;
  n.fragment !== null && (D(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function pt(t, e) {
  t.$$.dirty[0] === -1 && (b.push(t), dt(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function tt(t, e, n, r, s, l, i, o = [-1]) {
  const u = L;
  y(t);
  const c = t.$$ = {
    fragment: null,
    ctx: null,
    props: l,
    update: U,
    not_equal: s,
    bound: O(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (u ? u.$$.context : [])),
    callbacks: O(),
    dirty: o,
    skip_bound: !1,
    root: e.target || u.$$.root
  };
  i && i(c.root);
  let _ = !1;
  if (c.ctx = n ? n(t, e.props || {}, (a, k, ...d) => {
    const I = d.length ? d[0] : k;
    return c.ctx && s(c.ctx[a], c.ctx[a] = I) && (!c.skip_bound && c.bound[a] && c.bound[a](I), _ && pt(t, a)), k;
  }) : [], c.update(), _ = !0, D(c.before_update), c.fragment = r ? r(c.ctx) : !1, e.target) {
    if (e.hydrate) {
      const a = ft(e.target);
      c.fragment && c.fragment.l(a), a.forEach(m);
    } else
      c.fragment && c.fragment.c();
    e.intro && g(t.$$.fragment), M(t, e.target, e.anchor, e.customElement), X();
  }
  y(u);
}
class et {
  $destroy() {
    C(this, 1), this.$destroy = U;
  }
  $on(e, n) {
    const r = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return r.push(n), () => {
      const s = r.indexOf(n);
      s !== -1 && r.splice(s, 1);
    };
  }
  $set(e) {
    this.$$set && !rt(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const R = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMTZweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIiBvcGFjaXR5PSIuODciLz4KICA8cGF0aCBkPSJNMTcuNTEgMy44N0wxNS43MyAyLjEgNS44NCAxMmw5LjkgOS45IDEuNzctMS43N0w5LjM4IDEybDguMTMtOC4xM3oiLz4KPC9zdmc+", J = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTE2IDh2OEg4VjhoOG0yLTJINnYxMmgxMlY2eiIvPgo8L3N2Zz4=", Y = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTEyIDUuODNMMTUuMTcgOWwxLjQxLTEuNDFMMTIgMyA3LjQxIDcuNTkgOC44MyA5IDEyIDUuODN6bTAgMTIuMzRMOC44MyAxNWwtMS40MSAxLjQxTDEyIDIxbDQuNTktNC41OUwxNS4xNyAxNSAxMiAxOC4xN3oiLz4KPC9zdmc+";
function ht(t) {
  let e, n, r, s;
  const l = t[2].default, i = ot(l, t, t[1], null);
  return {
    c() {
      e = P("button"), i && i.c(), f(e, "height", "40px"), f(e, "padding", "8px"), f(e, "display", "flex"), f(e, "justify-content", "center"), f(e, "align-items", "center"), f(e, "border", "none"), f(e, "outline", "none"), f(e, "background", "transparent"), f(e, "cursor", "pointer");
    },
    m(o, u) {
      p(o, e, u), i && i.m(e, null), n = !0, r || (s = ct(e, "click", function() {
        F(t[0]) && t[0].apply(this, arguments);
      }), r = !0);
    },
    p(o, [u]) {
      t = o, i && i.p && (!n || u & 2) && lt(
        i,
        l,
        t,
        t[1],
        n ? it(l, t[1], u, null) : st(t[1]),
        null
      );
    },
    i(o) {
      n || (g(i, o), n = !0);
    },
    o(o) {
      $(i, o), n = !1;
    },
    d(o) {
      o && m(e), i && i.d(o), r = !1, s();
    }
  };
}
function $t(t, e, n) {
  let { $$slots: r = {}, $$scope: s } = e, { onClick: l } = e;
  return t.$$set = (i) => {
    "onClick" in i && n(0, l = i.onClick), "$$scope" in i && n(1, s = i.$$scope);
  }, [l, s, r];
}
class T extends et {
  constructor(e) {
    super(), tt(this, e, $t, ht, K, { onClick: 0 });
  }
}
function Q(t) {
  let e, n, r, s, l, i;
  return e = new T({
    props: {
      onClick: t[4]("resize"),
      $$slots: { default: [It] },
      $$scope: { ctx: t }
    }
  }), r = new T({
    props: {
      onClick: t[4]("interval", 500),
      $$slots: { default: [bt] },
      $$scope: { ctx: t }
    }
  }), l = new T({
    props: {
      onClick: t[4]("interval", 1500),
      $$slots: { default: [yt] },
      $$scope: { ctx: t }
    }
  }), {
    c() {
      N(e.$$.fragment), n = E(), N(r.$$.fragment), s = E(), N(l.$$.fragment);
    },
    m(o, u) {
      M(e, o, u), p(o, n, u), M(r, o, u), p(o, s, u), M(l, o, u), i = !0;
    },
    p(o, u) {
      const c = {};
      u & 1024 && (c.$$scope = { dirty: u, ctx: o }), e.$set(c);
      const _ = {};
      u & 1024 && (_.$$scope = { dirty: u, ctx: o }), r.$set(_);
      const a = {};
      u & 1024 && (a.$$scope = { dirty: u, ctx: o }), l.$set(a);
    },
    i(o) {
      i || (g(e.$$.fragment, o), g(r.$$.fragment, o), g(l.$$.fragment, o), i = !0);
    },
    o(o) {
      $(e.$$.fragment, o), $(r.$$.fragment, o), $(l.$$.fragment, o), i = !1;
    },
    d(o) {
      C(e, o), o && m(n), C(r, o), o && m(s), C(l, o);
    }
  };
}
function It(t) {
  let e;
  return {
    c() {
      e = j("Auto");
    },
    m(n, r) {
      p(n, e, r);
    },
    d(n) {
      n && m(e);
    }
  };
}
function bt(t) {
  let e;
  return {
    c() {
      e = j("500ms");
    },
    m(n, r) {
      p(n, e, r);
    },
    d(n) {
      n && m(e);
    }
  };
}
function yt(t) {
  let e;
  return {
    c() {
      e = j("1.5s");
    },
    m(n, r) {
      p(n, e, r);
    },
    d(n) {
      n && m(e);
    }
  };
}
function Mt(t) {
  let e, n;
  return {
    c() {
      e = P("img"), H(e.src, n = t[1] ? J : t[0] ? R : Y) || S(e, "src", n), S(e, "alt", "Logo");
    },
    m(r, s) {
      p(r, e, s);
    },
    p(r, s) {
      s & 3 && !H(e.src, n = r[1] ? J : r[0] ? R : Y) && S(e, "src", n);
    },
    d(r) {
      r && m(e);
    }
  };
}
function Ct(t) {
  let e, n, r, s, l = t[0] && Q(t);
  return r = new T({
    props: {
      onClick: t[1] ? t[3] : t[2],
      $$slots: { default: [Mt] },
      $$scope: { ctx: t }
    }
  }), {
    c() {
      e = P("div"), l && l.c(), n = E(), N(r.$$.fragment), f(e, "position", "fixed"), f(e, "bottom", "16px"), f(e, "left", "0"), f(e, "z-index", "99999999"), f(e, "background", "#333333aa"), f(e, "backdrop-filter", "blur(10px)"), f(e, "display", "flex"), f(e, "border-radius", "0 20px 20px 0");
    },
    m(i, o) {
      p(i, e, o), l && l.m(e, null), ut(e, n), M(r, e, null), s = !0;
    },
    p(i, [o]) {
      i[0] ? l ? (l.p(i, o), o & 1 && g(l, 1)) : (l = Q(i), l.c(), g(l, 1), l.m(e, n)) : l && (mt(), $(l, 1, 1, () => {
        l = null;
      }), _t());
      const u = {};
      o & 2 && (u.onClick = i[1] ? i[3] : i[2]), o & 1027 && (u.$$scope = { dirty: o, ctx: i }), r.$set(u);
    },
    i(i) {
      s || (g(l), g(r.$$.fragment, i), s = !0);
    },
    o(i) {
      $(l), $(r.$$.fragment, i), s = !1;
    },
    d(i) {
      i && m(e), l && l.d(), C(r);
    }
  };
}
function Dt(t, e, n) {
  let r = !1;
  function s() {
    n(0, r = !r);
  }
  const l = () => window.scroll({
    top: document.body.scrollHeight,
    left: 0,
    behavior: "smooth"
  }), i = new ResizeObserver(() => l());
  let o, u = !1;
  const c = (d, I = 1e3) => {
    d === "resize" ? i.observe(document.body) : d === "interval" && (o = setInterval(l, I)), n(1, u = d), n(0, r = !r);
  }, _ = (d) => {
    d === "resize" ? i.unobserve(document.body) : d === "interval" && clearInterval(o), n(1, u = !1);
  };
  return [r, u, s, () => {
    u && _(u);
  }, (d, I = 1e3) => () => {
    u ? _(d) : c(d, I);
  }];
}
class wt extends et {
  constructor(e) {
    super(), tt(this, e, Dt, Ct, K, {});
  }
}
const xt = new wt({
  target: document.body
});
export {
  xt as default
};
