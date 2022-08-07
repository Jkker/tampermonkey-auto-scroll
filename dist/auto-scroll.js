// ==UserScript==
// @name         Auto Scroll Button
// @namespace    https://github.com/Jkker/tampermonkey-auto-scroll
// @version      1.0.1
// @description  Adds a button to scroll down the page when new content is loaded or by a certain interval
// @author       Jkker
// @license      MIT
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/Jkker/tampermonkey-auto-scroll/master/src/icons/Unfold.svg
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Jkker/tampermonkey-auto-scroll/master/dist/auto-scroll.umd.cjs
// @downloadURL  https://raw.githubusercontent.com/Jkker/tampermonkey-auto-scroll/master/dist/auto-scroll.umd.cjs
// @supportURL   https://github.com/Jkker/tampermonkey-auto-scroll/issues
// ==/UserScript==

const app = "";
function noop() {
}
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
  if (!src_url_equal_anchor) {
    src_url_equal_anchor = document.createElement("a");
  }
  src_url_equal_anchor.href = url;
  return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
const ArrowBackIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMTZweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIiBvcGFjaXR5PSIuODciLz4KICA8cGF0aCBkPSJNMTcuNTEgMy44N0wxNS43MyAyLjEgNS44NCAxMmw5LjkgOS45IDEuNzctMS43N0w5LjM4IDEybDguMTMtOC4xM3oiLz4KPC9zdmc+";
const StopIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTE2IDh2OEg4VjhoOG0yLTJINnYxMmgxMlY2eiIvPgo8L3N2Zz4=";
const AutoScrollIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTEyIDUuODNMMTUuMTcgOWwxLjQxLTEuNDFMMTIgMyA3LjQxIDcuNTkgOC44MyA5IDEyIDUuODN6bTAgMTIuMzRMOC44MyAxNWwtMS40MSAxLjQxTDEyIDIxbDQuNTktNC41OUwxNS4xNyAxNSAxMiAxOC4xN3oiLz4KPC9zdmc+";
function create_fragment$1(ctx) {
  let button;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[1], null);
  return {
    c() {
      button = element("button");
      if (default_slot)
        default_slot.c();
      set_style(button, "height", "40px");
      set_style(button, "padding", "8px");
      set_style(button, "display", "flex");
      set_style(button, "justify-content", "center");
      set_style(button, "align-items", "center");
      set_style(button, "border", "none");
      set_style(button, "outline", "none");
      set_style(button, "background", "transparent");
      set_style(button, "cursor", "pointer");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if (default_slot) {
        default_slot.m(button, null);
      }
      current = true;
      if (!mounted) {
        dispose = listen(button, "click", function() {
          if (is_function(ctx[0]))
            ctx[0].apply(this, arguments);
        });
        mounted = true;
      }
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx,
            ctx[1],
            !current ? get_all_dirty_from_scope(ctx[1]) : get_slot_changes(default_slot_template, ctx[1], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(button);
      if (default_slot)
        default_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { onClick } = $$props;
  $$self.$$set = ($$props2) => {
    if ("onClick" in $$props2)
      $$invalidate(0, onClick = $$props2.onClick);
    if ("$$scope" in $$props2)
      $$invalidate(1, $$scope = $$props2.$$scope);
  };
  return [onClick, $$scope, slots];
}
class Button extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, { onClick: 0 });
  }
}
function create_if_block(ctx) {
  let button0;
  let t0;
  let button1;
  let t1;
  let button2;
  let current;
  button0 = new Button({
    props: {
      onClick: ctx[4]("resize"),
      $$slots: { default: [create_default_slot_3] },
      $$scope: { ctx }
    }
  });
  button1 = new Button({
    props: {
      onClick: ctx[4]("interval", 500),
      $$slots: { default: [create_default_slot_2] },
      $$scope: { ctx }
    }
  });
  button2 = new Button({
    props: {
      onClick: ctx[4]("interval", 1500),
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(button0.$$.fragment);
      t0 = space();
      create_component(button1.$$.fragment);
      t1 = space();
      create_component(button2.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button0, target, anchor);
      insert(target, t0, anchor);
      mount_component(button1, target, anchor);
      insert(target, t1, anchor);
      mount_component(button2, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty & 1024) {
        button0_changes.$$scope = { dirty, ctx: ctx2 };
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty & 1024) {
        button1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      button1.$set(button1_changes);
      const button2_changes = {};
      if (dirty & 1024) {
        button2_changes.$$scope = { dirty, ctx: ctx2 };
      }
      button2.$set(button2_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      transition_in(button2.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      transition_out(button2.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button0, detaching);
      if (detaching)
        detach(t0);
      destroy_component(button1, detaching);
      if (detaching)
        detach(t1);
      destroy_component(button2, detaching);
    }
  };
}
function create_default_slot_3(ctx) {
  let t;
  return {
    c() {
      t = text("Auto");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_2(ctx) {
  let t;
  return {
    c() {
      t = text("500ms");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_1(ctx) {
  let t;
  return {
    c() {
      t = text("1.5s");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      if (!src_url_equal(img.src, img_src_value = ctx[1] ? StopIcon : ctx[0] ? ArrowBackIcon : AutoScrollIcon))
        attr(img, "src", img_src_value);
      attr(img, "alt", "Logo");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 3 && !src_url_equal(img.src, img_src_value = ctx2[1] ? StopIcon : ctx2[0] ? ArrowBackIcon : AutoScrollIcon)) {
        attr(img, "src", img_src_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(img);
    }
  };
}
function create_fragment(ctx) {
  let div;
  let t;
  let button;
  let current;
  let if_block = ctx[0] && create_if_block(ctx);
  button = new Button({
    props: {
      onClick: ctx[1] ? ctx[3] : ctx[2],
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      div = element("div");
      if (if_block)
        if_block.c();
      t = space();
      create_component(button.$$.fragment);
      set_style(div, "position", "fixed");
      set_style(div, "bottom", "16px");
      set_style(div, "left", "0");
      set_style(div, "z-index", "99999999");
      set_style(div, "background", "#333333aa");
      set_style(div, "backdrop-filter", "blur(10px)");
      set_style(div, "display", "flex");
      set_style(div, "border-radius", "0 20px 20px 0");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (if_block)
        if_block.m(div, null);
      append(div, t);
      mount_component(button, div, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[0]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div, t);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      const button_changes = {};
      if (dirty & 2)
        button_changes.onClick = ctx2[1] ? ctx2[3] : ctx2[2];
      if (dirty & 1027) {
        button_changes.$$scope = { dirty, ctx: ctx2 };
      }
      button.$set(button_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block)
        if_block.d();
      destroy_component(button);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let open = false;
  function toggleMenu() {
    $$invalidate(0, open = !open);
  }
  const scroll = () => window.scroll({
    top: document.body.scrollHeight,
    left: 0,
    behavior: "smooth"
  });
  const resizeObserver = new ResizeObserver(() => scroll());
  let intervalId;
  let scrolling = false;
  const startScroll = (type, interval = 1e3) => {
    if (type === "resize")
      resizeObserver.observe(document.body);
    else if (type === "interval")
      intervalId = setInterval(scroll, interval);
    $$invalidate(1, scrolling = type);
    $$invalidate(0, open = !open);
  };
  const cancelScroll = (type) => {
    if (type === "resize")
      resizeObserver.unobserve(document.body);
    else if (type === "interval")
      clearInterval(intervalId);
    $$invalidate(1, scrolling = false);
  };
  const cancelCurrentScroll = () => {
    if (scrolling)
      cancelScroll(scrolling);
  };
  const toggleScroll = (type, intervalSecond = 1e3) => () => {
    if (scrolling) {
      cancelScroll(type);
    } else {
      startScroll(type, intervalSecond);
    }
  };
  return [open, scrolling, toggleMenu, cancelCurrentScroll, toggleScroll];
}
class App extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
const main = new App({
  target: document.body
});
export {
  main as default
};
