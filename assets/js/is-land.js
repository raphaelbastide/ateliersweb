!(function () {
  "use strict";
  class e extends HTMLElement {
    static tagName = "is-land";
    static prefix = "is-land--";
    static attr = {
      template: "data-island",
      ready: "ready",
      defer: "defer-hydration",
    };
    static onceCache = new Map();
    static onReady = new Map();
    static fallback = {
      ":not(is-land,:defined,[defer-hydration])": (e, t, a) => {
        let i = document.createElement(a + t.localName);
        for (let e of t.getAttributeNames())
          i.setAttribute(e, t.getAttribute(e));
        let r = t.shadowRoot;
        if (!r) {
          let e = t.querySelector(
            ":scope > template:is([shadowrootmode], [shadowroot])"
          );
          if (e) {
            let a =
              e.getAttribute("shadowrootmode") ||
              e.getAttribute("shadowroot") ||
              "closed";
            (r = t.attachShadow({ mode: a })),
              r.appendChild(e.content.cloneNode(!0));
          }
        }
        return (
          r && i.attachShadow({ mode: r.mode }).append(...r.childNodes),
          i.append(...t.childNodes),
          t.replaceWith(i),
          e.then(() => {
            i.shadowRoot && t.shadowRoot.append(...i.shadowRoot.childNodes),
              t.append(...i.childNodes),
              i.replaceWith(t);
          })
        );
      },
    };
    constructor() {
      super(),
        (this.ready = new Promise((e) => {
          this.readyResolve = e;
        }));
    }
    static getParents(a, i = !1) {
      let r = [];
      for (; a; ) {
        if (a.matches && a.matches(e.tagName)) {
          if (i && a === i) break;
          t.hasConditions(a) && r.push(a);
        }
        a = a.parentNode;
      }
      return r;
    }
    static async ready(t, a) {
      if ((a || (a = e.getParents(t)), 0 === a.length)) return;
      let i = await Promise.all(a.map((e) => e.wait()));
      return i.length ? i[0] : void 0;
    }
    forceFallback() {
      window.Island && Object.assign(e.fallback, window.Island.fallback);
      for (let t in e.fallback) {
        let a = Array.from(this.querySelectorAll(t)).reverse();
        for (let i of a) {
          if (!i.isConnected) continue;
          let a = e.getParents(i);
          if (1 === a.length) {
            let r = e.ready(i, a);
            e.fallback[t](r, i, e.prefix);
          }
        }
      }
    }
    wait() {
      return this.ready;
    }
    async connectedCallback() {
      t.hasConditions(this) && this.forceFallback(), await this.hydrate();
    }
    getTemplates() {
      return this.querySelectorAll(`template[${e.attr.template}]`);
    }
    replaceTemplates(t) {
      for (let a of t) {
        if (e.getParents(a, this).length > 0) continue;
        let t = a.getAttribute(e.attr.template);
        if ("replace" === t) {
          let e = Array.from(this.childNodes);
          for (let t of e) this.removeChild(t);
          this.appendChild(a.content);
          break;
        }
        {
          let i = a.innerHTML;
          if ("once" === t && i) {
            if (e.onceCache.has(i)) return void a.remove();
            e.onceCache.set(i, !0);
          }
          a.replaceWith(a.content);
        }
      }
    }
    async hydrate() {
      let a = [];
      this.parentNode && a.push(e.ready(this.parentNode));
      let i = t.getConditions(this);
      for (let e in i) t.map[e] && a.push(t.map[e](i[e], this));
      await Promise.all(a), this.replaceTemplates(this.getTemplates());
      for (let t of e.onReady.values()) await t.call(this, e);
      this.readyResolve(),
        this.setAttribute(e.attr.ready, ""),
        this.querySelectorAll(`[${e.attr.defer}]`).forEach((t) =>
          t.removeAttribute(e.attr.defer)
        );
    }
  }
  class t {
    static map = {
      visible: t.visible,
      idle: t.idle,
      interaction: t.interaction,
      media: t.media,
      "save-data": t.saveData,
    };
    static hasConditions(e) {
      return Object.keys(t.getConditions(e)).length > 0;
    }
    static getConditions(e) {
      let a = {};
      for (let i of Object.keys(t.map))
        e.hasAttribute(`on:${i}`) && (a[i] = e.getAttribute(`on:${i}`));
      return a;
    }
    static visible(e, t) {
      if ("IntersectionObserver" in window)
        return new Promise((e) => {
          let a = new IntersectionObserver((t) => {
            let [i] = t;
            i.isIntersecting && (a.unobserve(i.target), e());
          });
          a.observe(t);
        });
    }
    static idle() {
      let e = new Promise((e) => {
        "complete" !== document.readyState
          ? window.addEventListener("load", () => e(), { once: !0 })
          : e();
      });
      return "requestIdleCallback" in window
        ? Promise.all([
            new Promise((e) => {
              requestIdleCallback(() => {
                e();
              });
            }),
            e,
          ])
        : e;
    }
    static interaction(e, t) {
      let a = ["click", "touchstart"];
      return (
        e && (a = (e || "").split(",").map((e) => e.trim())),
        new Promise((e) => {
          function i(r) {
            e();
            for (let e of a) t.removeEventListener(e, i);
          }
          for (let e of a) t.addEventListener(e, i, { once: !0 });
        })
      );
    }
    static media(e) {
      let t = { matches: !0 };
      if (
        (e && "matchMedia" in window && (t = window.matchMedia(e)), !t.matches)
      )
        return new Promise((e) => {
          t.addListener((t) => {
            t.matches && e();
          });
        });
    }
    static saveData(e) {
      if (
        "connection" in navigator &&
        navigator.connection.saveData !== ("false" !== e)
      )
        return new Promise(() => {});
    }
  }
  "customElements" in window &&
    (window.customElements.define(e.tagName, e), (window.Island = e)),
    e.ready;
})();
