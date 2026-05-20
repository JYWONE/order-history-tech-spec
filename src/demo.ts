export function demoPageHtml() {
  return String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Order History Console</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #111615;
        --muted: #5f6b65;
        --quiet: #eef2ef;
        --line: #d9e0db;
        --panel: #ffffff;
        --field: #f8faf8;
        --accent: #1f7a5a;
        --accent-strong: #14533e;
        --lime: #c8ea62;
        --coral: #e36d4f;
        --blue: #4d6edb;
        --amber: #b96a13;
        --danger: #b42318;
        --shadow: 0 18px 60px rgba(17, 22, 21, 0.12);
      }

      * {
        box-sizing: border-box;
      }

      html {
        min-height: 100%;
        background: #f4f7f4;
      }

      body {
        min-height: 100%;
        margin: 0;
        color: var(--ink);
        background:
          linear-gradient(120deg, rgba(200, 234, 98, 0.16), transparent 30%),
          linear-gradient(180deg, #f7f9f7 0%, #eef3ef 100%);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", sans-serif;
      }

      button,
      input,
      select {
        font: inherit;
      }

      button {
        border: 0;
        cursor: pointer;
      }

      .shell {
        display: grid;
        min-height: 100svh;
        grid-template-rows: auto 1fr;
      }

      .topbar {
        display: grid;
        grid-template-columns: minmax(220px, 1fr) auto auto;
        gap: 18px;
        align-items: center;
        padding: 18px 24px;
        border-bottom: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.84);
        backdrop-filter: blur(16px);
        position: sticky;
        top: 0;
        z-index: 5;
      }

      .brand {
        display: flex;
        gap: 12px;
        align-items: center;
        min-width: 0;
      }

      .mark {
        display: grid;
        width: 36px;
        height: 36px;
        place-items: center;
        border-radius: 8px;
        color: #f7fff7;
        background: linear-gradient(145deg, var(--accent), #263f36);
        box-shadow: 0 8px 22px rgba(31, 122, 90, 0.26);
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        font-size: clamp(20px, 2.2vw, 30px);
        line-height: 1.05;
        letter-spacing: 0;
      }

      .subtitle {
        margin-top: 3px;
        color: var(--muted);
        font-size: 13px;
      }

      .status-strip {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: flex-end;
        min-width: 0;
        color: var(--muted);
        font-size: 13px;
      }

      .pulse {
        width: 9px;
        height: 9px;
        border-radius: 999px;
        background: var(--accent);
        box-shadow: 0 0 0 0 rgba(31, 122, 90, 0.38);
        animation: pulse 2s infinite;
      }

      .primary-action,
      .secondary-action {
        min-height: 40px;
        border-radius: 8px;
        padding: 0 14px;
        font-weight: 750;
        transition:
          transform 160ms ease,
          box-shadow 160ms ease,
          background 160ms ease;
      }

      .primary-action {
        color: #ffffff;
        background: var(--accent);
        box-shadow: 0 10px 24px rgba(31, 122, 90, 0.22);
      }

      .secondary-action {
        color: var(--accent-strong);
        background: #e6f1eb;
      }

      .primary-action:hover,
      .secondary-action:hover {
        transform: translateY(-1px);
      }

      .workspace {
        display: grid;
        grid-template-columns: 288px minmax(0, 1fr) 354px;
        gap: 0;
        min-height: 0;
      }

      .rail,
      .inspector {
        min-height: 0;
        padding: 22px;
        overflow: auto;
      }

      .rail {
        border-right: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.58);
      }

      .inspector {
        border-left: 1px solid var(--line);
        background: #fbfcfb;
      }

      .main {
        min-width: 0;
        padding: 24px;
        overflow: auto;
      }

      .section + .section {
        margin-top: 26px;
      }

      .section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .section-title h2,
      .section-title h3 {
        font-size: 13px;
        font-weight: 820;
        text-transform: uppercase;
        color: #29332f;
        letter-spacing: 0;
      }

      .hint {
        color: var(--muted);
        font-size: 12px;
      }

      .field-stack {
        display: grid;
        gap: 12px;
      }

      label {
        display: grid;
        gap: 6px;
        color: #2d3934;
        font-size: 12px;
        font-weight: 760;
      }

      input,
      select {
        width: 100%;
        min-height: 40px;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 0 11px;
        color: var(--ink);
        background: var(--field);
        outline: none;
        transition:
          border-color 150ms ease,
          box-shadow 150ms ease,
          background 150ms ease;
      }

      input:focus,
      select:focus {
        border-color: rgba(31, 122, 90, 0.72);
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(31, 122, 90, 0.12);
      }

      .segmented {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 3px;
        gap: 3px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--quiet);
      }

      .segmented button {
        min-height: 34px;
        border-radius: 6px;
        color: var(--muted);
        background: transparent;
        font-size: 13px;
        font-weight: 800;
        transition:
          color 150ms ease,
          background 150ms ease,
          box-shadow 150ms ease;
      }

      .segmented button[aria-pressed="true"] {
        color: var(--ink);
        background: #ffffff;
        box-shadow: 0 5px 16px rgba(17, 22, 21, 0.08);
      }

      .query-actions {
        display: grid;
        gap: 10px;
        margin-top: 16px;
      }

      .window-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .mini-button {
        min-height: 36px;
        border: 1px solid var(--line);
        border-radius: 8px;
        color: #33403b;
        background: #ffffff;
        font-size: 12px;
        font-weight: 760;
        transition:
          border-color 150ms ease,
          transform 150ms ease,
          background 150ms ease;
      }

      .mini-button:hover {
        transform: translateY(-1px);
        border-color: rgba(31, 122, 90, 0.45);
      }

      .metric-row {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 18px;
      }

      .metric {
        min-height: 94px;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 14px;
        background: var(--panel);
        box-shadow: 0 10px 34px rgba(17, 22, 21, 0.06);
        transition: transform 180ms ease;
      }

      .metric:hover {
        transform: translateY(-2px);
      }

      .metric span {
        display: block;
        color: var(--muted);
        font-size: 12px;
        font-weight: 760;
      }

      .metric strong {
        display: block;
        margin-top: 8px;
        font-size: clamp(22px, 2.6vw, 34px);
        line-height: 1;
        letter-spacing: 0;
      }

      .hero-surface {
        position: relative;
        min-height: 230px;
        margin-bottom: 18px;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 8px;
        background:
          linear-gradient(135deg, rgba(31, 122, 90, 0.14), transparent 42%),
          linear-gradient(180deg, #ffffff, #f5f8f6);
        box-shadow: var(--shadow);
      }

      .hero-copy {
        position: relative;
        z-index: 2;
        max-width: 620px;
        padding: 28px;
      }

      .eyebrow {
        color: var(--accent-strong);
        font-size: 12px;
        font-weight: 850;
        text-transform: uppercase;
        letter-spacing: 0;
      }

      .hero-copy h2 {
        margin-top: 10px;
        font-size: clamp(30px, 5vw, 64px);
        line-height: 0.95;
        letter-spacing: 0;
      }

      .hero-copy p {
        max-width: 500px;
        margin-top: 14px;
        color: var(--muted);
        font-size: 15px;
        line-height: 1.55;
      }

      .partition-map {
        position: absolute;
        right: 24px;
        bottom: 24px;
        display: grid;
        width: min(460px, 48%);
        gap: 9px;
      }

      .partition-line {
        display: grid;
        grid-template-columns: 72px 1fr 48px;
        gap: 10px;
        align-items: center;
        color: #2e3b36;
        font-size: 12px;
        font-weight: 780;
      }

      .track {
        height: 12px;
        overflow: hidden;
        border-radius: 999px;
        background: #dce5df;
      }

      .track span {
        display: block;
        height: 100%;
        width: var(--w);
        border-radius: inherit;
        background: linear-gradient(90deg, var(--accent), var(--lime));
        animation: fillTrack 900ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }

      .table-wrap {
        overflow: auto;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        box-shadow: 0 12px 36px rgba(17, 22, 21, 0.07);
      }

      table {
        width: 100%;
        min-width: 860px;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 13px 14px;
        border-bottom: 1px solid var(--line);
        text-align: left;
        font-size: 13px;
      }

      th {
        color: var(--muted);
        background: #f8faf8;
        font-size: 11px;
        font-weight: 860;
        text-transform: uppercase;
        letter-spacing: 0;
      }

      tr:last-child td {
        border-bottom: 0;
      }

      tbody tr {
        transition:
          background 150ms ease,
          transform 150ms ease;
      }

      tbody tr:hover {
        background: #f2f8f4;
      }

      .order-link {
        color: var(--accent-strong);
        background: transparent;
        padding: 0;
        font-weight: 820;
        text-align: left;
      }

      .chip {
        display: inline-flex;
        min-height: 24px;
        align-items: center;
        border-radius: 999px;
        padding: 0 9px;
        background: #e7f2ec;
        color: var(--accent-strong);
        font-size: 12px;
        font-weight: 820;
        white-space: nowrap;
      }

      .chip.refunded,
      .chip.cancelled,
      .chip.disputed {
        color: var(--danger);
        background: #fae9e7;
      }

      .chip.active {
        color: #253f9c;
        background: #e9edff;
      }

      .source-note {
        display: flex;
        gap: 8px;
        align-items: center;
        color: var(--muted);
        font-size: 13px;
      }

      .source-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: var(--amber);
      }

      .source-dot.live {
        background: var(--accent);
      }

      .empty {
        padding: 34px;
        color: var(--muted);
        text-align: center;
      }

      .check-list {
        display: grid;
        gap: 8px;
      }

      .check {
        display: grid;
        grid-template-columns: 22px 1fr;
        gap: 10px;
        align-items: start;
        padding: 11px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #ffffff;
        transition:
          border-color 170ms ease,
          transform 170ms ease,
          background 170ms ease;
      }

      .check[data-state="running"] {
        border-color: rgba(77, 110, 219, 0.42);
        background: #f3f5ff;
      }

      .check[data-state="pass"] {
        border-color: rgba(31, 122, 90, 0.3);
      }

      .check[data-state="warn"] {
        border-color: rgba(185, 106, 19, 0.32);
      }

      .check[data-state="fail"] {
        border-color: rgba(180, 35, 24, 0.32);
      }

      .check:hover {
        transform: translateY(-1px);
      }

      .check-mark {
        display: grid;
        width: 22px;
        height: 22px;
        place-items: center;
        border-radius: 999px;
        color: #ffffff;
        background: #93a099;
        font-size: 12px;
        font-weight: 900;
      }

      .check[data-state="pass"] .check-mark {
        background: var(--accent);
      }

      .check[data-state="warn"] .check-mark {
        background: var(--amber);
      }

      .check[data-state="fail"] .check-mark {
        background: var(--danger);
      }

      .check[data-state="running"] .check-mark {
        background: var(--blue);
        animation: spin 850ms linear infinite;
      }

      .check strong {
        display: block;
        font-size: 13px;
      }

      .check span {
        display: block;
        margin-top: 3px;
        color: var(--muted);
        font-size: 12px;
        line-height: 1.35;
      }

      .detail {
        display: grid;
        gap: 12px;
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #ffffff;
      }

      .detail h3 {
        font-size: 17px;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .detail-grid div {
        min-width: 0;
        padding: 9px;
        border-radius: 8px;
        background: #f5f8f6;
      }

      .detail-grid span {
        display: block;
        color: var(--muted);
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0;
      }

      .detail-grid strong {
        display: block;
        margin-top: 4px;
        overflow-wrap: anywhere;
        font-size: 12px;
      }

      .line-items {
        display: grid;
        gap: 8px;
      }

      .line-item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        padding: 9px 0;
        border-top: 1px solid var(--line);
        font-size: 13px;
      }

      .guardrails {
        display: grid;
        gap: 9px;
      }

      .guardrail {
        padding-left: 12px;
        border-left: 3px solid var(--accent);
        color: #35423d;
        font-size: 13px;
        line-height: 1.45;
      }

      .json-view {
        max-height: 210px;
        overflow: auto;
        margin: 0;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 12px;
        color: #25312d;
        background: #f6f8f6;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
        font-size: 12px;
        line-height: 1.5;
        white-space: pre-wrap;
      }

      @keyframes pulse {
        70% {
          box-shadow: 0 0 0 9px rgba(31, 122, 90, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(31, 122, 90, 0);
        }
      }

      @keyframes fillTrack {
        from {
          width: 0;
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 1180px) {
        .workspace {
          grid-template-columns: 260px minmax(0, 1fr);
        }

        .inspector {
          grid-column: 1 / -1;
          border-left: 0;
          border-top: 1px solid var(--line);
        }

        .partition-map {
          position: relative;
          right: auto;
          bottom: auto;
          width: auto;
          padding: 0 28px 24px;
        }
      }

      @media (max-width: 760px) {
        .topbar {
          grid-template-columns: 1fr;
          align-items: start;
          padding: 16px;
        }

        .status-strip {
          justify-content: flex-start;
        }

        .workspace {
          grid-template-columns: 1fr;
        }

        .rail {
          border-right: 0;
          border-bottom: 1px solid var(--line);
        }

        .main,
        .rail,
        .inspector {
          padding: 16px;
        }

        .metric-row {
          grid-template-columns: 1fr 1fr;
        }

        .hero-copy {
          padding: 22px;
        }

        .hero-copy h2 {
          font-size: 36px;
        }

        .partition-line {
          grid-template-columns: 56px 1fr 40px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 1ms !important;
          animation-iteration-count: 1 !important;
          scroll-behavior: auto !important;
          transition-duration: 1ms !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <div class="mark">OH</div>
          <div>
            <h1>Order History Console</h1>
            <p class="subtitle">Scoped lookup, partition-aware reads, and demo-safe smoke checks.</p>
          </div>
        </div>
        <div class="status-strip" aria-live="polite">
          <span class="pulse" aria-hidden="true"></span>
          <span id="serviceStatus">Checking service</span>
        </div>
        <button class="primary-action" id="runChecksTop" type="button">Run checks</button>
      </header>

      <div class="workspace">
        <aside class="rail">
          <section class="section">
            <div class="section-title">
              <h2>Principal</h2>
              <span class="hint">Header-scoped</span>
            </div>
            <div class="segmented" aria-label="Actor type">
              <button type="button" data-actor="customer" aria-pressed="true">Customer</button>
              <button type="button" data-actor="store" aria-pressed="false">Store</button>
            </div>
          </section>

          <section class="section">
            <div class="section-title">
              <h2>Query</h2>
              <span class="hint">No unbounded reads</span>
            </div>
            <div class="field-stack">
              <label>
                Customer ID
                <input id="customerId" value="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" spellcheck="false" />
              </label>
              <label>
                Store scope
                <input id="storeIds" value="11111111-1111-4111-8111-111111111111" spellcheck="false" />
              </label>
              <label>
                Store filter
                <input id="storeFilter" value="11111111-1111-4111-8111-111111111111" spellcheck="false" />
              </label>
              <label>
                Status
                <select id="statusFilter">
                  <option value="">Any status</option>
                  <option value="delivered">Delivered</option>
                  <option value="out_for_delivery">Out for delivery</option>
                  <option value="refunded">Refunded</option>
                </select>
              </label>
              <label>
                Limit
                <select id="limit">
                  <option value="2">2</option>
                  <option value="5" selected>5</option>
                  <option value="10">10</option>
                </select>
              </label>
            </div>
          </section>

          <section class="section">
            <div class="section-title">
              <h2>Date window</h2>
            </div>
            <div class="window-grid">
              <button class="mini-button" type="button" data-window="latest">Latest 90d</button>
              <button class="mini-button" type="button" data-window="may">May 2026</button>
              <button class="mini-button" type="button" data-window="spring">Apr-May</button>
              <button class="mini-button" type="button" data-window="wide">Too wide</button>
            </div>
            <div class="query-actions">
              <button class="primary-action" id="runQuery" type="button">Run API query</button>
              <button class="secondary-action" id="useSample" type="button">Use sample data</button>
            </div>
          </section>
        </aside>

        <main class="main">
          <section class="hero-surface" aria-labelledby="demoHeading">
            <div class="hero-copy">
              <p class="eyebrow">MVP lookup contract</p>
              <h2 id="demoHeading">Find the right order without scanning the world.</h2>
              <p>
                The demo shows customer and store-scoped history, bounded windows,
                keyset pagination, UUIDv7 detail routing, and the deferred paths
                called out in the spec.
              </p>
            </div>
            <div class="partition-map" aria-label="Partition activity">
              <div class="partition-line">
                <span>Apr 2026</span>
                <div class="track"><span style="--w: 42%"></span></div>
                <span>cold</span>
              </div>
              <div class="partition-line">
                <span>May 2026</span>
                <div class="track"><span style="--w: 86%"></span></div>
                <span>hot</span>
              </div>
              <div class="partition-line">
                <span>Jun 2026</span>
                <div class="track"><span style="--w: 18%"></span></div>
                <span>next</span>
              </div>
            </div>
          </section>

          <section class="metric-row" aria-label="Demo metrics">
            <div class="metric">
              <span>Orders shown</span>
              <strong id="metricOrders">0</strong>
            </div>
            <div class="metric">
              <span>Total value</span>
              <strong id="metricValue">$0</strong>
            </div>
            <div class="metric">
              <span>Window</span>
              <strong id="metricWindow">90d</strong>
            </div>
            <div class="metric">
              <span>Next cursor</span>
              <strong id="metricCursor">No</strong>
            </div>
          </section>

          <section>
            <div class="section-title">
              <h2>Results</h2>
              <div class="source-note">
                <span class="source-dot" id="sourceDot"></span>
                <span id="sourceLabel">Presentation sample</span>
              </div>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Created</th>
                    <th>Actor scope</th>
                    <th>Store</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody id="ordersBody"></tbody>
              </table>
              <div class="empty" id="emptyState" hidden>No rows for this query.</div>
            </div>
          </section>
        </main>

        <aside class="inspector">
          <section class="section">
            <div class="section-title">
              <h2>Live checks</h2>
              <span class="hint" id="lastChecked">Not run</span>
            </div>
            <div class="check-list" id="checkList">
              <div class="check" data-check="health" data-state="idle">
                <span class="check-mark">-</span>
                <div><strong>Health endpoint</strong><span>/health returns 200.</span></div>
              </div>
              <div class="check" data-check="auth" data-state="idle">
                <span class="check-mark">-</span>
                <div><strong>Auth boundary</strong><span>Unauthenticated history returns 401.</span></div>
              </div>
              <div class="check" data-check="scoped" data-state="idle">
                <span class="check-mark">-</span>
                <div><strong>Scoped history</strong><span>Customer or store headers return a bounded page.</span></div>
              </div>
              <div class="check" data-check="guard" data-state="idle">
                <span class="check-mark">-</span>
                <div><strong>Date guard</strong><span>One-sided windows are rejected.</span></div>
              </div>
              <div class="check" data-check="item" data-state="idle">
                <span class="check-mark">-</span>
                <div><strong>Deferred item search</strong><span>item_id filter returns 501 for MVP.</span></div>
              </div>
              <div class="check" data-check="cursor" data-state="idle">
                <span class="check-mark">-</span>
                <div><strong>Keyset pagination</strong><span>Cursor advances without OFFSET.</span></div>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="section-title">
              <h2>Selected order</h2>
            </div>
            <div class="detail" id="detailPanel"></div>
          </section>

          <section class="section">
            <div class="section-title">
              <h2>Spec guardrails</h2>
            </div>
            <div class="guardrails">
              <p class="guardrail">Actor scope comes from headers, not request body fields.</p>
              <p class="guardrail">Every list read uses a bounded recent or explicit time window.</p>
              <p class="guardrail">Pagination uses created_at plus order_id keysets, never OFFSET.</p>
              <p class="guardrail">Address and payment values stay tokenized references.</p>
              <p class="guardrail">Support, courier, and item search paths remain deferred.</p>
            </div>
          </section>

          <section class="section">
            <div class="section-title">
              <h2>Last response</h2>
            </div>
            <pre class="json-view" id="responseView">{}</pre>
          </section>
        </aside>
      </div>
    </div>

    <script>
      const SEEDED_CUSTOMER = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
      const SEEDED_STORE = "11111111-1111-4111-8111-111111111111";
      const SEEDED_STORE_2 = "22222222-2222-4222-8222-222222222222";
      const SAMPLE_ROWS = [
        {
          orderId: "0196d0f3-bd40-7000-8000-000000000101",
          createdAt: "2026-05-15T18:30:00.000Z",
          userId: SEEDED_CUSTOMER,
          storeId: SEEDED_STORE,
          deliveryPersonId: "77777777-7777-4777-8777-777777777777",
          status: "delivered",
          totalCents: 1450,
          currency: "USD",
          shipAddressRef: "addr_tok_customer_a_1",
          paymentTokenRef: "pay_tok_visa_4242",
          items: [{ lineNo: 1, nameSnapshot: "Pad Thai", quantity: 1, priceCents: 1450, currency: "USD" }]
        },
        {
          orderId: "0196c0fb-8a20-7000-8000-000000000102",
          createdAt: "2026-05-12T12:05:00.000Z",
          userId: SEEDED_CUSTOMER,
          storeId: SEEDED_STORE,
          deliveryPersonId: null,
          status: "delivered",
          totalCents: 3200,
          currency: "USD",
          shipAddressRef: "addr_tok_customer_a_2",
          paymentTokenRef: "pay_tok_visa_4242",
          items: [{ lineNo: 1, nameSnapshot: "Green Curry", quantity: 2, priceCents: 1600, currency: "USD" }]
        },
        {
          orderId: "0196b161-7300-7000-8000-000000000103",
          createdAt: "2026-05-10T13:20:00.000Z",
          userId: SEEDED_CUSTOMER,
          storeId: SEEDED_STORE_2,
          deliveryPersonId: null,
          status: "delivered",
          totalCents: 1100,
          currency: "USD",
          shipAddressRef: "addr_tok_customer_a_3",
          paymentTokenRef: "pay_tok_amex_1001",
          items: [{ lineNo: 1, nameSnapshot: "Latte", quantity: 2, priceCents: 550, currency: "USD" }]
        },
        {
          orderId: "0196ab8b-4a80-7000-8000-000000000104",
          createdAt: "2026-05-08T20:10:00.000Z",
          userId: SEEDED_CUSTOMER,
          storeId: SEEDED_STORE,
          deliveryPersonId: "77777777-7777-4777-8777-777777777777",
          status: "refunded",
          totalCents: 1800,
          currency: "USD",
          shipAddressRef: "addr_tok_customer_a_4",
          paymentTokenRef: "pay_tok_refund_3002",
          items: [{ lineNo: 1, nameSnapshot: "Spring Roll", quantity: 3, priceCents: 600, currency: "USD" }]
        },
        {
          orderId: "01964f41-5e00-7000-8000-000000000105",
          createdAt: "2026-04-22T19:00:00.000Z",
          userId: SEEDED_CUSTOMER,
          storeId: SEEDED_STORE,
          deliveryPersonId: null,
          status: "delivered",
          totalCents: 900,
          currency: "USD",
          shipAddressRef: "addr_tok_customer_a_5",
          paymentTokenRef: "pay_tok_master_0007",
          items: [{ lineNo: 1, nameSnapshot: "Mango Sticky Rice", quantity: 1, priceCents: 900, currency: "USD" }]
        }
      ];

      const state = {
        actor: "customer",
        selectedWindow: "latest",
        rows: [],
        source: "sample",
        page: { nextCursor: null, limit: 5 },
        selectedOrder: SAMPLE_ROWS[0]
      };

      const $ = (id) => document.getElementById(id);
      const currency = (cents) => "$" + (cents / 100).toFixed(2);
      const shortId = (value) => value ? value.slice(0, 8) + "..." + value.slice(-4) : "None";
      const fmtDate = (value) => new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }).format(new Date(value));

      function headersForQuery() {
        if (state.actor === "customer") {
          return {
            "x-actor-type": "customer",
            "x-user-id": $("customerId").value.trim()
          };
        }

        return {
          "x-actor-type": "store",
          "x-store-ids": $("storeIds").value.trim()
        };
      }

      function queryParams(extra) {
        const params = new URLSearchParams();
        const status = $("statusFilter").value;
        const storeFilter = $("storeFilter").value.trim();
        params.set("limit", $("limit").value);

        if (status) {
          params.set("status", status);
        }

        if (storeFilter) {
          params.set("store_id", storeFilter);
        }

        if (state.selectedWindow === "may") {
          params.set("from", "2026-05-01T00:00:00.000Z");
          params.set("to", "2026-06-01T00:00:00.000Z");
        }

        if (state.selectedWindow === "spring") {
          params.set("from", "2026-04-01T00:00:00.000Z");
          params.set("to", "2026-06-01T00:00:00.000Z");
        }

        if (state.selectedWindow === "wide") {
          params.set("from", "2025-01-01T00:00:00.000Z");
          params.set("to", "2026-06-01T00:00:00.000Z");
        }

        if (extra) {
          Object.entries(extra).forEach(([key, value]) => {
            if (value) {
              params.set(key, value);
            }
          });
        }

        return params;
      }

      async function api(path, options) {
        const response = await fetch(path, options || {});
        let body = null;
        try {
          body = await response.json();
        } catch {
          body = {};
        }
        return { status: response.status, ok: response.ok, body };
      }

      function sampleRows() {
        const status = $("statusFilter").value;
        const storeFilter = $("storeFilter").value.trim();
        let rows = SAMPLE_ROWS.slice();

        if (state.actor === "store") {
          const storeScope = $("storeIds").value.split(",").map((value) => value.trim());
          rows = rows.filter((row) => storeScope.includes(row.storeId));
        } else {
          rows = rows.filter((row) => row.userId === $("customerId").value.trim());
        }

        if (storeFilter) {
          rows = rows.filter((row) => row.storeId === storeFilter);
        }

        if (status) {
          rows = rows.filter((row) => row.status === status);
        }

        if (state.selectedWindow === "may") {
          rows = rows.filter((row) => row.createdAt >= "2026-05-01" && row.createdAt < "2026-06-01");
        }

        if (state.selectedWindow === "spring") {
          rows = rows.filter((row) => row.createdAt >= "2026-04-01" && row.createdAt < "2026-06-01");
        }

        if (state.selectedWindow === "wide") {
          rows = [];
        }

        return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }

      function statusClass(status) {
        if (["placed", "confirmed", "preparing", "picked_up", "out_for_delivery"].includes(status)) {
          return "chip active";
        }
        if (["refunded", "cancelled", "disputed"].includes(status)) {
          return "chip " + status;
        }
        return "chip";
      }

      function renderRows() {
        const rows = state.rows;
        $("ordersBody").innerHTML = rows.map((order) => {
          return "<tr>" +
            "<td><button class=\"order-link\" type=\"button\" data-order-id=\"" + order.orderId + "\">" + shortId(order.orderId) + "</button></td>" +
            "<td>" + fmtDate(order.createdAt) + "</td>" +
            "<td>" + shortId(order.userId) + "</td>" +
            "<td>" + shortId(order.storeId) + "</td>" +
            "<td><span class=\"" + statusClass(order.status) + "\">" + order.status.replaceAll("_", " ") + "</span></td>" +
            "<td>" + currency(order.totalCents) + "</td>" +
          "</tr>";
        }).join("");

        $("emptyState").hidden = rows.length > 0;
        $("metricOrders").textContent = String(rows.length);
        $("metricValue").textContent = currency(rows.reduce((sum, row) => sum + Number(row.totalCents || 0), 0));
        $("metricWindow").textContent = state.selectedWindow === "latest" ? "90d" : state.selectedWindow;
        $("metricCursor").textContent = state.page.nextCursor ? "Yes" : "No";
        $("sourceLabel").textContent = state.source === "live" ? "Live API data" : "Presentation sample";
        $("sourceDot").className = "source-dot" + (state.source === "live" ? " live" : "");

        document.querySelectorAll("[data-order-id]").forEach((button) => {
          button.addEventListener("click", () => selectOrder(button.dataset.orderId));
        });

        if (rows[0] && (!state.selectedOrder || !rows.some((row) => row.orderId === state.selectedOrder.orderId))) {
          state.selectedOrder = rows[0];
        }
        renderDetail();
      }

      async function selectOrder(orderId) {
        const existing = state.rows.find((row) => row.orderId === orderId) || SAMPLE_ROWS.find((row) => row.orderId === orderId);
        state.selectedOrder = existing;

        if (state.source === "live") {
          const result = await api("/v1/orders/" + encodeURIComponent(orderId), { headers: headersForQuery() });
          $("responseView").textContent = JSON.stringify(result.body, null, 2);
          if (result.ok && result.body.data) {
            state.selectedOrder = result.body.data;
          }
        }

        renderDetail();
      }

      function renderDetail() {
        const order = state.selectedOrder || SAMPLE_ROWS[0];
        const items = order.items || [];
        $("detailPanel").innerHTML =
          "<h3>" + shortId(order.orderId) + "</h3>" +
          "<div class=\"detail-grid\">" +
            "<div><span>Status</span><strong>" + order.status.replaceAll("_", " ") + "</strong></div>" +
            "<div><span>Total</span><strong>" + currency(order.totalCents) + "</strong></div>" +
            "<div><span>Address ref</span><strong>" + (order.shipAddressRef || "detail only") + "</strong></div>" +
            "<div><span>Payment ref</span><strong>" + (order.paymentTokenRef || "detail only") + "</strong></div>" +
          "</div>" +
          "<div class=\"line-items\">" +
            (items.length ? items.map((item) => {
              return "<div class=\"line-item\"><span>" + item.quantity + " x " + item.nameSnapshot + "</span><strong>" + currency(item.priceCents * item.quantity) + "</strong></div>";
            }).join("") : "<div class=\"line-item\"><span>Items hydrate through the detail endpoint.</span><strong></strong></div>") +
          "</div>";
      }

      function setCheck(id, stateName, message) {
        const el = document.querySelector("[data-check=\"" + id + "\"]");
        el.dataset.state = stateName;
        el.querySelector(".check-mark").textContent =
          stateName === "pass" ? "ok" : stateName === "warn" ? "!" : stateName === "fail" ? "x" : stateName === "running" ? "/" : "-";
        if (message) {
          el.querySelector("span:last-child").textContent = message;
        }
      }

      async function runLiveQuery() {
        $("serviceStatus").textContent = "Querying API";
        const params = queryParams();
        const result = await api("/v1/orders?" + params.toString(), { headers: headersForQuery() });
        $("responseView").textContent = JSON.stringify(result.body, null, 2);

        if (result.ok && result.body.data && result.body.data.length) {
          state.rows = result.body.data;
          state.source = "live";
          state.page = result.body.page || { nextCursor: null, limit: Number($("limit").value) };
        } else {
          state.rows = sampleRows();
          state.source = "sample";
          state.page = result.body.page || { nextCursor: null, limit: Number($("limit").value) };
        }

        $("serviceStatus").textContent = result.ok ? "Service reachable" : "Sample mode";
        renderRows();
        if (state.source === "live" && state.rows[0]) {
          await selectOrder(state.rows[0].orderId);
        }
      }

      async function runChecks() {
        $("lastChecked").textContent = "Running";
        ["health", "auth", "scoped", "guard", "item", "cursor"].forEach((id) => setCheck(id, "running"));

        const health = await api("/health");
        setCheck("health", health.status === 200 && health.body.ok ? "pass" : "fail", "/health returned " + health.status + ".");

        const auth = await api("/v1/orders");
        setCheck("auth", auth.status === 401 ? "pass" : "fail", "Unauthenticated request returned " + auth.status + ".");

        const scoped = await api("/v1/orders?" + queryParams({ limit: "2" }).toString(), { headers: headersForQuery() });
        setCheck("scoped", scoped.status === 200 ? "pass" : "fail", "Scoped request returned " + scoped.status + ".");
        $("responseView").textContent = JSON.stringify(scoped.body, null, 2);

        const guard = await api("/v1/orders?from=2026-05-01T00%3A00%3A00.000Z", { headers: headersForQuery() });
        setCheck("guard", guard.status === 400 ? "pass" : "fail", "One-sided date window returned " + guard.status + ".");

        const item = await api("/v1/orders?item_id=77777777-7777-4777-8777-777777777777", { headers: headersForQuery() });
        setCheck("item", item.status === 501 ? "pass" : "fail", "Deferred item search returned " + item.status + ".");

        if (scoped.status === 200 && scoped.body.page && scoped.body.page.nextCursor) {
          const second = await api("/v1/orders?" + queryParams({ limit: "2", cursor: scoped.body.page.nextCursor }).toString(), { headers: headersForQuery() });
          setCheck("cursor", second.status === 200 ? "pass" : "fail", "Second cursor page returned " + second.status + ".");
        } else {
          setCheck("cursor", "warn", "Needs at least three live rows to produce a next cursor.");
        }

        $("lastChecked").textContent = new Date().toLocaleTimeString();
      }

      document.querySelectorAll("[data-actor]").forEach((button) => {
        button.addEventListener("click", () => {
          state.actor = button.dataset.actor;
          document.querySelectorAll("[data-actor]").forEach((entry) => {
            entry.setAttribute("aria-pressed", String(entry === button));
          });
          runLiveQuery();
        });
      });

      document.querySelectorAll("[data-window]").forEach((button) => {
        button.addEventListener("click", () => {
          state.selectedWindow = button.dataset.window;
          runLiveQuery();
        });
      });

      $("runQuery").addEventListener("click", runLiveQuery);
      $("runChecksTop").addEventListener("click", runChecks);
      $("useSample").addEventListener("click", () => {
        state.rows = sampleRows();
        state.source = "sample";
        state.page = { nextCursor: null, limit: Number($("limit").value) };
        $("responseView").textContent = JSON.stringify({ mode: "presentation sample", rows: state.rows.length }, null, 2);
        renderRows();
      });
      ["customerId", "storeIds", "storeFilter", "statusFilter", "limit"].forEach((id) => {
        $(id).addEventListener("change", runLiveQuery);
      });

      renderRows();
      runLiveQuery();
      runChecks();
    </script>
  </body>
</html>`;
}
