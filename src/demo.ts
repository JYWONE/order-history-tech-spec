export function demoPageHtml() {
  return String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Order History Console</title>
    <link rel="icon" href="data:," />
    <style>
      :root {
        color-scheme: light;
        --ink: #111615;
        --muted: #66736d;
        --line: #dbe2dd;
        --soft: #f3f6f3;
        --panel: #ffffff;
        --accent: #1f7a5a;
        --accent-strong: #14533e;
        --blue: #405fd6;
        --amber: #b96a13;
        --danger: #b42318;
        --shadow: 0 18px 54px rgba(17, 22, 21, 0.11);
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
          linear-gradient(135deg, rgba(31, 122, 90, 0.12), transparent 30%),
          linear-gradient(180deg, #fbfcfb 0%, #eef3ef 100%);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", sans-serif;
      }

      button,
      input {
        font: inherit;
      }

      button {
        border: 0;
        cursor: pointer;
      }

      .app {
        display: grid;
        min-height: 100svh;
        grid-template-rows: auto 1fr auto;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 18px 28px;
        border-bottom: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.88);
        backdrop-filter: blur(14px);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .mark {
        display: grid;
        width: 36px;
        height: 36px;
        place-items: center;
        border-radius: 8px;
        color: #ffffff;
        background: linear-gradient(145deg, var(--accent), #283d35);
        font-size: 13px;
        font-weight: 850;
      }

      h1,
      h2,
      p {
        margin: 0;
      }

      h1 {
        font-size: clamp(20px, 2.2vw, 30px);
        line-height: 1.05;
        letter-spacing: 0;
      }

      .subtle {
        color: var(--muted);
        font-size: 13px;
      }

      .contract-badge {
        display: inline-flex;
        min-height: 34px;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(31, 122, 90, 0.24);
        border-radius: 999px;
        padding: 0 12px;
        color: var(--accent-strong);
        background: #eaf4ee;
        font-size: 13px;
        font-weight: 800;
        white-space: nowrap;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: var(--accent);
        box-shadow: 0 0 0 0 rgba(31, 122, 90, 0.36);
        animation: pulse 2s infinite;
      }

      main {
        width: min(1220px, calc(100vw - 40px));
        margin: 0 auto;
        padding: 28px 0 24px;
      }

      .lookup-panel {
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 24px;
        background: var(--panel);
        box-shadow: var(--shadow);
      }

      .lookup-heading {
        display: grid;
        gap: 8px;
        margin-bottom: 18px;
        text-align: center;
      }

      .lookup-heading h2 {
        max-width: 900px;
        margin: 0 auto;
        font-size: clamp(30px, 3.4vw, 46px);
        line-height: 1;
        letter-spacing: 0;
        overflow-wrap: anywhere;
      }

      .lookup-heading p {
        max-width: 720px;
        margin: 0 auto;
        color: var(--muted);
        font-size: 15px;
        line-height: 1.5;
      }

      .lookup-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px;
        width: min(780px, 100%);
        margin: 0 auto;
      }

      .lookup-helper {
        max-width: 780px;
        margin: 10px auto 0;
        color: var(--muted);
        font-size: 13px;
        line-height: 1.45;
        text-align: center;
      }

      .scenario-strip {
        display: grid;
        gap: 8px;
        width: min(980px, 100%);
        margin: 16px auto 0;
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
        padding: 13px 0;
      }

      .scenario-head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px 14px;
      }

      .scenario-head strong {
        font-size: 15px;
      }

      .scenario-kicker {
        color: var(--muted);
        font-size: 12px;
        font-weight: 850;
        text-transform: uppercase;
      }

      .scenario-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
      }

      .scenario-pills span {
        display: inline-flex;
        min-height: 26px;
        align-items: center;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 0 9px;
        color: #35423d;
        background: #f8faf8;
        font-size: 12px;
        font-weight: 780;
      }

      .scenario-description {
        color: var(--muted);
        font-size: 13px;
        line-height: 1.45;
      }

      .lookup-input {
        min-height: 48px;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 0 14px;
        color: var(--ink);
        background: #f8faf8;
        outline: none;
      }

      .lookup-input:focus {
        border-color: rgba(31, 122, 90, 0.7);
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(31, 122, 90, 0.12);
      }

      .primary,
      .secondary,
      .chip,
      .ghost {
        min-height: 38px;
        border-radius: 8px;
        padding: 0 13px;
        font-weight: 800;
        transition:
          transform 150ms ease,
          border-color 150ms ease,
          background 150ms ease;
      }

      .primary {
        min-height: 48px;
        color: #ffffff;
        background: var(--accent);
        box-shadow: 0 10px 24px rgba(31, 122, 90, 0.22);
      }

      .secondary,
      .ghost {
        border: 1px solid var(--line);
        color: #33403b;
        background: #ffffff;
      }

      .chip {
        display: grid;
        min-height: 62px;
        align-content: center;
        gap: 3px;
        border: 1px solid var(--line);
        color: #26332f;
        background: #ffffff;
        font-size: 13px;
        text-align: left;
      }

      .chip[data-active="true"] {
        border-color: rgba(31, 122, 90, 0.42);
      }

      .chip[data-kind="guard"] {
        background: #fffdf8;
      }

      .chip strong {
        display: block;
        color: inherit;
        font-size: 14px;
        line-height: 1.2;
      }

      .chip span {
        color: var(--muted);
        font-size: 12px;
        font-weight: 650;
        line-height: 1.25;
      }

      .primary:hover,
      .secondary:hover,
      .ghost:hover,
      .chip:hover {
        transform: translateY(-1px);
      }

      .preset-grid {
        display: grid;
        gap: 14px;
        margin-top: 18px;
      }

      .preset-section {
        display: grid;
        gap: 8px;
      }

      .preset-title {
        color: var(--muted);
        font-size: 12px;
        font-weight: 850;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .preset-buttons {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 9px;
      }

      .timing-strip {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 14px;
        align-items: center;
        margin: 16px 0;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 13px 14px;
        background: #111615;
        color: #ffffff;
      }

      .timing-primary {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        font-size: 13px;
        font-weight: 780;
      }

      .timing-primary span {
        display: inline-flex;
        min-height: 25px;
        align-items: center;
        border-radius: 999px;
        padding: 0 9px;
        background: rgba(255, 255, 255, 0.11);
        white-space: nowrap;
      }

      .timing-primary .ok {
        background: rgba(31, 122, 90, 0.78);
      }

      .timing-primary .fail {
        background: rgba(180, 35, 24, 0.84);
      }

      .timing-detail {
        margin-top: 7px;
        color: rgba(255, 255, 255, 0.72);
        font-size: 12px;
      }

      .timing-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
      }

      .timing-actions button {
        min-height: 34px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 8px;
        padding: 0 10px;
        color: #ffffff;
        background: rgba(255, 255, 255, 0.08);
        font-size: 12px;
        font-weight: 800;
      }

      .grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 330px;
        gap: 16px;
      }

      .surface {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        overflow: hidden;
      }

      .surface-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--line);
        background: #f8faf8;
      }

      .surface-head h2 {
        font-size: 13px;
        font-weight: 850;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .table-wrap {
        overflow: auto;
      }

      table {
        width: 100%;
        min-width: 840px;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 12px 14px;
        border-bottom: 1px solid var(--line);
        text-align: left;
        font-size: 13px;
      }

      th {
        color: var(--muted);
        font-size: 11px;
        font-weight: 860;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      tr:last-child td {
        border-bottom: 0;
      }

      tbody tr {
        transition: background 140ms ease;
      }

      tbody tr:hover {
        background: #f3f8f5;
      }

      .row-button,
      .copy-id {
        color: var(--accent-strong);
        background: transparent;
        padding: 0;
        font-weight: 820;
        text-align: left;
      }

      .copy-id {
        color: var(--muted);
        font-size: 12px;
      }

      .status {
        display: inline-flex;
        min-height: 24px;
        align-items: center;
        border-radius: 999px;
        padding: 0 9px;
        color: var(--accent-strong);
        background: #e7f2ec;
        font-size: 12px;
        font-weight: 820;
        white-space: nowrap;
      }

      .status.active {
        color: #253f9c;
        background: #e9edff;
      }

      .status.problem {
        color: var(--danger);
        background: #fae9e7;
      }

      .empty {
        padding: 34px;
        color: var(--muted);
        text-align: center;
      }

      .side-stack {
        display: grid;
        gap: 16px;
        align-content: start;
      }

      .panel {
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 15px;
        background: var(--panel);
      }

      .panel h2 {
        margin-bottom: 9px;
        font-size: 13px;
        font-weight: 850;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .scale-list,
      .proof-list {
        display: grid;
        gap: 8px;
      }

      .scale-list div,
      .proof-list div {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 8px;
        align-items: baseline;
        color: #36433e;
        font-size: 13px;
      }

      .scale-list strong {
        min-width: 78px;
        font-size: 17px;
      }

      .proof-list strong {
        color: var(--accent-strong);
      }

      details {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
      }

      summary {
        cursor: pointer;
        padding: 13px 15px;
        color: #26332f;
        font-size: 13px;
        font-weight: 850;
      }

      .checks {
        display: grid;
        gap: 7px;
        padding: 0 15px 15px;
      }

      .check {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        border-top: 1px solid var(--line);
        padding-top: 8px;
        color: var(--muted);
        font-size: 12px;
      }

      .check strong {
        color: var(--ink);
      }

      .drawer {
        position: fixed;
        inset: 0;
        z-index: 30;
        display: none;
      }

      .drawer[aria-hidden="false"] {
        display: block;
      }

      .drawer-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(17, 22, 21, 0.35);
      }

      .drawer-panel {
        position: absolute;
        top: 0;
        right: 0;
        display: grid;
        width: min(460px, 100vw);
        height: 100%;
        grid-template-rows: auto 1fr;
        background: #ffffff;
        box-shadow: -20px 0 70px rgba(17, 22, 21, 0.2);
      }

      .drawer-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 18px;
        border-bottom: 1px solid var(--line);
      }

      .drawer-body {
        overflow: auto;
        padding: 18px;
      }

      .kv {
        display: grid;
        grid-template-columns: 118px 1fr;
        gap: 8px;
        padding: 9px 0;
        border-bottom: 1px solid var(--line);
        font-size: 13px;
      }

      .kv span {
        color: var(--muted);
      }

      .line-item {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid var(--line);
        font-size: 13px;
      }

      .modal {
        border: 0;
        border-radius: 8px;
        padding: 0;
        width: min(820px, calc(100vw - 36px));
        max-height: min(720px, calc(100vh - 36px));
        box-shadow: var(--shadow);
      }

      .modal::backdrop {
        background: rgba(17, 22, 21, 0.35);
      }

      .modal-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 18px;
        border-bottom: 1px solid var(--line);
      }

      pre {
        max-height: 460px;
        overflow: auto;
        margin: 0;
        padding: 16px 18px;
        color: #26332f;
        background: #f8faf8;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
        font-size: 12px;
        line-height: 1.5;
        white-space: pre-wrap;
      }

      footer {
        width: min(1220px, calc(100vw - 40px));
        margin: 0 auto 24px;
        color: var(--muted);
        font-size: 12px;
      }

      @keyframes pulse {
        70% {
          box-shadow: 0 0 0 9px rgba(31, 122, 90, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(31, 122, 90, 0);
        }
      }

      @media (max-width: 920px) {
        .topbar,
        .lookup-row,
        .grid {
          grid-template-columns: 1fr;
        }

        .topbar {
          align-items: flex-start;
        }

         .preset-grid {
           grid-template-columns: 1fr;
         }

          .preset-buttons {
            grid-template-columns: 1fr;
          }

          .scenario-head {
            display: grid;
          }

        .timing-strip {
          grid-template-columns: 1fr;
        }

        .timing-actions {
          justify-content: flex-start;
        }
      }
    </style>
  </head>
  <body>
    <div class="app">
      <header class="topbar">
        <div class="brand">
          <div class="mark">OH</div>
          <div>
            <h1>Order History Console</h1>
            <p class="subtle">Speed-first demo for scoped historical lookup at 10M orders/week.</p>
          </div>
        </div>
        <div class="contract-badge"><span class="dot" aria-hidden="true"></span><span id="contractState">contract proven</span></div>
      </header>

      <main>
        <section class="lookup-panel" aria-labelledby="lookupTitle">
          <div class="lookup-heading">
            <h2 id="lookupTitle">Fast scoped order lookup.</h2>
            <p>Start with a working preset, then copy an order ID from the results to test the direct UUIDv7 lookup path.</p>
          </div>

          <div class="lookup-row">
            <input class="lookup-input" id="lookupInput" spellcheck="false" value="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" aria-label="Lookup ID" />
            <button class="primary" id="lookupButton" type="button">Look up</button>
          </div>
          <p class="lookup-helper">Seeded demo IDs are already wired in: Ava Chen customer, Nori Thai store, and generated order IDs in the table. The guardrail buttons intentionally return errors.</p>

          <div class="scenario-strip" aria-live="polite">
            <div class="scenario-head">
              <div>
                <div class="scenario-kicker">Current demo path</div>
                <strong id="scenarioTitle">Ava Chen - May history</strong>
              </div>
              <div class="scenario-pills" id="scenarioPills"></div>
            </div>
            <p class="scenario-description" id="scenarioDescription">Use a fast demo button below, or edit the field for manual lookup.</p>
          </div>

          <div class="preset-grid" id="presetGrid" aria-label="Demo presets"></div>
        </section>

        <section class="timing-strip" aria-live="polite">
          <div>
            <div class="timing-primary" id="timingPrimary"></div>
            <div class="timing-detail" id="timingDetail">Run a preset to measure lookup time.</div>
          </div>
          <div class="timing-actions">
            <button id="requestButton" type="button">Show request</button>
            <button id="curlButton" type="button">Copy as curl</button>
            <button id="explainButton" type="button">Explain plan</button>
          </div>
        </section>

        <div class="grid">
          <section class="surface" aria-labelledby="resultsTitle">
            <div class="surface-head">
              <h2 id="resultsTitle">Results</h2>
              <span class="subtle" id="resultSource">Live API</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Created</th>
                    <th>Customer</th>
                    <th>Store</th>
                    <th>Delivery</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody id="ordersBody"></tbody>
              </table>
              <div class="empty" id="emptyState">Run a preset to load live order history.</div>
            </div>
          </section>

          <aside class="side-stack">
            <section class="panel">
              <h2>Scale math</h2>
              <div class="scale-list">
                <div><strong>10M/wk</strong><span>baseline order volume</span></div>
                <div><strong>16.5/s</strong><span>average ingest rate</span></div>
                <div><strong>45k</strong><span>active orders at 45 min</span></div>
                <div><strong>129M</strong><span>orders online at 90 days</span></div>
                <div><strong>480 GB</strong><span>estimated 90-day hot storage</span></div>
              </div>
            </section>

            <section class="panel">
              <h2>Lookup bound</h2>
              <div class="proof-list">
                <div><strong>1</strong><span>actor scope from auth headers</span></div>
                <div><strong>2</strong><span>bounded date window</span></div>
                <div><strong>3</strong><span>monthly partition pruning</span></div>
                <div><strong>4</strong><span>composite history index</span></div>
                <div><strong>5</strong><span>keyset cursor, no OFFSET</span></div>
              </div>
            </section>

            <details id="guardrailDetails">
              <summary>Guardrails: auth - scope - date - deferred</summary>
              <div class="checks" id="checksList"></div>
            </details>
          </aside>
        </div>
      </main>

      <footer>
        Proof posture: access contract is implemented and timed on seeded data; 100M-row p95/p99 benchmark remains a separate benchmark.
      </footer>
    </div>

    <div class="drawer" id="drawer" aria-hidden="true">
      <div class="drawer-backdrop" id="drawerBackdrop"></div>
      <div class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
        <div class="drawer-head">
          <div>
            <h2 id="drawerTitle">Order detail</h2>
            <p class="subtle" id="drawerSubtitle">UUIDv7 month-routed lookup</p>
          </div>
          <button class="ghost" id="drawerClose" type="button">Close</button>
        </div>
        <div class="drawer-body" id="drawerBody"></div>
      </div>
    </div>

    <dialog class="modal" id="infoModal">
      <div class="modal-head">
        <div>
          <h2 id="modalTitle">Request</h2>
          <p class="subtle" id="modalSubtitle">Same request used by the live demo.</p>
        </div>
        <button class="ghost" id="modalClose" type="button">Close</button>
      </div>
      <pre id="modalBody"></pre>
    </dialog>

    <script>
      const IDS = {
        ava: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        mia: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        nori: "11111111-1111-4111-8111-111111111111",
        bean: "22222222-2222-4222-8222-222222222222",
        item: "77777777-7777-4777-8777-777777777777"
      };

      const PEOPLE = {
        [IDS.ava]: "Ava Chen",
        [IDS.mia]: "Mia Park"
      };

      const STORES = {
        [IDS.nori]: "Nori Thai - Midtown",
        [IDS.bean]: "Bean & Batch"
      };

      const PRESETS = [
        {
          id: "ava-may",
          group: "working",
          label: "Ava Chen - May history",
          help: "Recommended first: rows, DB timing, one May partition, cursor",
          inputLabel: "Customer ID",
          inputValue: IDS.ava,
          actorLabel: "customer Ava Chen",
          endpointLabel: "GET /v1/orders",
          expectedLabel: "200 rows",
          description: "Fast demo path: list Ava Chen's May order history through the customer-scoped index and one monthly partition.",
          requestFromInput: (value) => listRequest({
            headers: customerHeaders(value || IDS.ava),
            params: { from: "2026-05-01T00:00:00.000Z", to: "2026-06-01T00:00:00.000Z", limit: "8" }
          }),
          request: () => listRequest({
            headers: customerHeaders(IDS.ava),
            params: { from: "2026-05-01T00:00:00.000Z", to: "2026-06-01T00:00:00.000Z", limit: "8" }
          })
        },
        {
          id: "nori-store",
          group: "working",
          label: "Store lookup: Nori",
          help: "Store-scoped cross-customer history",
          inputLabel: "Store ID",
          inputValue: IDS.nori,
          actorLabel: "store Nori Thai",
          endpointLabel: "GET /v1/orders",
          expectedLabel: "200 rows",
          description: "Shows how a store sees its own history across customers without accepting an arbitrary store scope.",
          requestFromInput: (value) => listRequest({ headers: storeHeaders(value || IDS.nori), params: { limit: "8" } }),
          request: () => listRequest({ headers: storeHeaders(IDS.nori), params: { limit: "8" } })
        },
        {
          id: "active-store",
          group: "working",
          label: "Active store orders",
          help: "Partial active-status index path",
          inputLabel: "Store ID",
          inputValue: IDS.nori,
          actorLabel: "store Nori Thai",
          endpointLabel: "GET /v1/orders?status=out_for_delivery",
          expectedLabel: "200 active rows",
          description: "Shows the active-order path, which is backed by the partial index for currently moving orders.",
          requestFromInput: (value) => listRequest({ headers: storeHeaders(value || IDS.nori), params: { status: "out_for_delivery", limit: "8" } }),
          request: () => listRequest({ headers: storeHeaders(IDS.nori), params: { status: "out_for_delivery", limit: "8" } })
        },
        {
          id: "page-2",
          group: "working",
          label: "Page 2 cursor",
          help: "Keyset cursor, no OFFSET",
          inputLabel: "Customer ID",
          inputValue: IDS.ava,
          actorLabel: "customer Ava Chen",
          endpointLabel: "GET /v1/orders?cursor=...",
          expectedLabel: "200 page 2",
          description: "Runs page 1, takes the returned cursor, then fetches page 2 without OFFSET.",
          run: runPageTwoPreset
        },
        {
          id: "direct",
          group: "working",
          label: "Direct order ID",
          help: "UUIDv7 routes to the month partition",
          inputLabel: "Order ID",
          inputValue: () => state.selectedOrder?.orderId ?? "",
          actorLabel: "customer Ava Chen",
          endpointLabel: "GET /v1/orders/:orderId",
          expectedLabel: "200 detail",
          description: "Uses a UUIDv7 order ID to derive the month partition, then hydrates line items for the detail view.",
          run: runDirectPreset
        },
        {
          id: "cross-store",
          group: "guard",
          label: "Denied: cross-store",
          help: "Expected 403 when Store A asks for Store B",
          inputLabel: "Target store ID",
          inputValue: IDS.bean,
          actorLabel: "store Nori Thai",
          endpointLabel: "GET /v1/orders?store_id=...",
          expectedLabel: "403 expected",
          description: "Proves IDOR protection: Nori Thai cannot ask the API for Bean & Batch's store history.",
          expectedStatus: 403,
          requestFromInput: (value) => listRequest({ headers: storeHeaders(IDS.nori), params: { store_id: value || IDS.bean, limit: "8" } }),
          request: () => listRequest({ headers: storeHeaders(IDS.nori), params: { store_id: IDS.bean, limit: "8" } })
        },
        {
          id: "wide-window",
          group: "guard",
          label: "Rejected: window > 93d",
          help: "Expected 400 for a 17-month date window",
          inputLabel: "Customer ID",
          inputValue: IDS.ava,
          actorLabel: "customer Ava Chen",
          endpointLabel: "GET /v1/orders?from=2025-01-01&to=2026-06-01",
          expectedLabel: "400 expected",
          description: "This intentionally asks for about 17 months. The API rejects it because broad history reads must be split into bounded windows.",
          expectedStatus: 400,
          requestFromInput: (value) => listRequest({
            headers: customerHeaders(value || IDS.ava),
            params: { from: "2025-01-01T00:00:00.000Z", to: "2026-06-01T00:00:00.000Z", limit: "8" }
          }),
          request: () => listRequest({
            headers: customerHeaders(IDS.ava),
            params: { from: "2025-01-01T00:00:00.000Z", to: "2026-06-01T00:00:00.000Z", limit: "8" }
          })
        },
        {
          id: "item-search",
          group: "guard",
          label: "Deferred: item search",
          help: "Expected 501 because item search is a future index",
          inputLabel: "Item ID",
          inputValue: IDS.item,
          actorLabel: "customer Ava Chen",
          endpointLabel: "GET /v1/orders?item_id=...",
          expectedLabel: "501 expected",
          description: "Shows the product boundary: item data is stored for detail, but item-history search needs a separate index later.",
          expectedStatus: 501,
          requestFromInput: (value) => listRequest({ headers: customerHeaders(IDS.ava), params: { item_id: value || IDS.item, limit: "8" } }),
          request: () => listRequest({ headers: customerHeaders(IDS.ava), params: { item_id: IDS.item, limit: "8" } })
        }
      ];

      const state = {
        activePreset: "",
        rows: [],
        selectedOrder: null,
        lastRequest: null,
        lastListRequest: null,
        lastResponse: null,
        lastTiming: null,
        checks: []
      };

      const $ = (id) => document.getElementById(id);
      const money = (cents) => "$" + (Number(cents || 0) / 100).toFixed(2);
      const shortId = (value) => value ? value.slice(0, 8) + "..." + value.slice(-4) : "None";
      const uuidV7 = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
      const uuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

      function customerHeaders(userId) {
        return { "x-actor-type": "customer", "x-user-id": userId };
      }

      function storeHeaders(storeId) {
        return { "x-actor-type": "store", "x-store-ids": storeId };
      }

      function listRequest({ headers, params }) {
        return { method: "GET", path: "/v1/orders", headers, params: params || {} };
      }

      function detailRequest(orderId, headers) {
        return { method: "GET", path: "/v1/orders/" + encodeURIComponent(orderId), headers, params: {} };
      }

      function requestUrl(request, extraParams) {
        const params = new URLSearchParams(request.params || {});
        if (extraParams) {
          Object.entries(extraParams).forEach(([key, value]) => params.set(key, value));
        }
        const query = params.toString();
        return request.path + (query ? "?" + query : "");
      }

      function externalUrl(request, extraParams) {
        return window.location.origin + requestUrl(request, extraParams);
      }

      function parseServerTiming(header) {
        const timing = {};
        if (!header) return timing;
        header.split(",").forEach((part) => {
          const [name, ...attrs] = part.trim().split(";");
          const durAttr = attrs.find((attr) => attr.trim().startsWith("dur="));
          if (name && durAttr) timing[name.trim()] = Number(durAttr.split("=")[1]);
        });
        return timing;
      }

      async function api(request, extraParams) {
        const startedAt = performance.now();
        const response = await fetch(requestUrl(request, extraParams), { headers: request.headers });
        const rttMs = Math.round((performance.now() - startedAt) * 100) / 100;
        let body = {};
        try {
          body = await response.json();
        } catch {
          body = {};
        }
        return {
          status: response.status,
          ok: response.ok,
          body,
          rttMs,
          serverTiming: parseServerTiming(response.headers.get("Server-Timing"))
        };
      }

      async function runRequest(request, options) {
        const opts = options || {};
        setBusy(true);
        state.lastRequest = request;
        if (request.path === "/v1/orders" && !opts.skipListMemory) state.lastListRequest = request;
        try {
          const result = await api(request);
          state.lastResponse = result;
          state.lastTiming = timingFrom(result);
          if (result.ok && Array.isArray(result.body.data)) {
            state.rows = result.body.data;
            state.selectedOrder = result.body.data[0] || null;
          } else if (result.ok && result.body.data) {
            state.rows = [result.body.data];
            state.selectedOrder = result.body.data;
          } else {
            state.rows = [];
            state.selectedOrder = null;
          }
          renderAll();
          if (result.ok && state.selectedOrder && request.path === "/v1/orders") {
            await loadDetail(state.selectedOrder.orderId, request.headers, { quiet: true });
          }
        } catch (error) {
          state.lastResponse = { status: "network", ok: false, body: { error: String(error) }, rttMs: 0, serverTiming: {} };
          state.rows = [];
          state.selectedOrder = null;
          renderAll();
        } finally {
          setBusy(false);
        }
      }

      function timingFrom(result) {
        const meta = result.body && result.body.meta ? result.body.meta : {};
        return {
          status: result.status,
          rows: Array.isArray(result.body.data) ? result.body.data.length : result.body.data ? 1 : 0,
          dbMs: typeof meta.lookupMs === "number" ? meta.lookupMs : result.serverTiming.db,
          appMs: result.serverTiming.app,
          rttMs: result.rttMs,
          cursor: Boolean(result.body.page && result.body.page.nextCursor),
          partitionWindow: meta.partitionWindow || null
        };
      }

      function setBusy(isBusy) {
        $("lookupButton").textContent = isBusy ? "Looking..." : "Look up";
        $("lookupButton").disabled = isBusy;
      }

      function renderPresets() {
        const grid = $("presetGrid");
        grid.replaceChildren();
        [
          ["working", "Fast demo buttons"],
          ["guard", "Guardrail checks"]
        ].forEach(([group, title]) => {
          const section = document.createElement("div");
          section.className = "preset-section";
          const heading = document.createElement("div");
          heading.className = "preset-title";
          heading.textContent = title;
          const buttons = document.createElement("div");
          buttons.className = "preset-buttons";
          PRESETS.filter((preset) => preset.group === group).forEach((preset) => {
            const button = document.createElement("button");
            button.className = "chip";
            button.type = "button";
            button.dataset.active = String(state.activePreset === preset.id);
            button.dataset.kind = preset.kind || preset.group;
            button.dataset.preset = preset.id;
            button.title = preset.help;
            const label = document.createElement("strong");
            label.textContent = preset.label;
            const help = document.createElement("span");
            help.textContent = preset.help;
            button.append(label, help);
            buttons.append(button);
          });
          section.append(heading, buttons);
          grid.append(section);
        });
      }

      function renderScenario() {
        const preset = activePreset();
        const value = $("lookupInput").value.trim();
        $("scenarioTitle").textContent = preset ? preset.label : "Manual lookup";

        const pills = $("scenarioPills");
        pills.replaceChildren();
        scenarioPills(preset, value).forEach((text) => {
          const pill = document.createElement("span");
          pill.textContent = text;
          pills.append(pill);
        });

        $("scenarioDescription").textContent = preset
          ? preset.description
          : manualScenarioDescription(value);
      }

      function scenarioPills(preset, value) {
        if (!preset) {
          if (uuidV7(value)) return ["Order ID", "GET /v1/orders/:orderId", "200 detail"];
          if (uuid(value)) return ["Customer ID", "GET /v1/orders", "200 rows"];
          return ["Paste an ID", "customer UUID or UUIDv7 order ID", "manual"];
        }

        return [
          preset.inputLabel + ": " + shortId(value || presetInputValue(preset) || "not set"),
          preset.actorLabel,
          preset.endpointLabel,
          preset.expectedLabel
        ];
      }

      function manualScenarioDescription(value) {
        if (uuidV7(value)) return "Manual direct lookup: the UUIDv7 timestamp routes the request to the order's month partition.";
        if (uuid(value)) return "Manual customer lookup: the ID is treated as a customer ID and uses the bounded latest history window.";
        return "Edit the field to run a manual lookup. Use a customer UUID for history or a UUIDv7 order ID for direct detail.";
      }

      function presetInputValue(preset) {
        return typeof preset.inputValue === "function" ? preset.inputValue() : preset.inputValue;
      }

      function setInputForPreset(preset) {
        const value = presetInputValue(preset);
        if (value) $("lookupInput").value = value;
      }

      function requestForPreset(preset, value) {
        if (preset.requestFromInput) return preset.requestFromInput(value);
        if (preset.request) return preset.request();
        return null;
      }

      function renderTiming() {
        const primary = $("timingPrimary");
        primary.replaceChildren();
        const timing = state.lastTiming;
        if (!timing) {
          addTimingPill("Ready", "ok");
          $("timingDetail").textContent = "Pick a preset or paste an ID to run a live lookup.";
          return;
        }
        const preset = activePreset();
        const expectedGuardrail = Boolean(preset && preset.expectedStatus === Number(timing.status));
        const ok = (Number(timing.status) >= 200 && Number(timing.status) < 300) || expectedGuardrail;
        addTimingPill(expectedGuardrail ? String(timing.status) + " expected" : String(timing.status), ok ? "ok" : "fail");
        addTimingPill(timing.rows + " rows");
        addTimingPill("DB " + formatMs(timing.dbMs));
        addTimingPill("API " + formatMs(timing.appMs));
        addTimingPill("RTT " + formatMs(timing.rttMs));
        addTimingPill("cursor: " + (timing.cursor ? "yes" : "no"));

        const window = timing.partitionWindow;
        if (expectedGuardrail) {
          $("timingDetail").textContent = "Expected guardrail: " + preset.help + ". This proves the API rejects unsafe lookup shapes instead of scanning.";
        } else if (!ok) {
          $("timingDetail").textContent = "Unexpected API response: " + ((state.lastResponse.body && state.lastResponse.body.error) || "request failed") + ". Try Start here: Ava May.";
        } else {
          $("timingDetail").textContent = window
            ? "Partition window " + window.from.slice(0, 10) + " -> " + window.to.slice(0, 10) + " (" + window.monthsSpanned + " month" + (window.monthsSpanned === 1 ? "" : "s") + "). DB time is separated from Render/network round trip."
            : "DB time is shown when the endpoint returns lookup metadata. Render/network time is the browser RTT.";
        }

        function addTimingPill(text, tone) {
          const pill = document.createElement("span");
          if (tone) pill.className = tone;
          pill.textContent = text;
          primary.append(pill);
        }
      }

      function formatMs(value) {
        return typeof value === "number" && Number.isFinite(value) ? value.toFixed(value < 10 ? 2 : 1) + "ms" : "-";
      }

      function renderRows() {
        const body = $("ordersBody");
        body.replaceChildren();
        state.rows.forEach((order) => {
          const row = document.createElement("tr");
          row.append(
            cellWithOrder(order),
            textCell(formatDate(order.createdAt)),
            textCell(nameFor(PEOPLE, order.userId)),
            textCell(nameFor(STORES, order.storeId)),
            textCell(order.deliveryPersonId ? shortId(order.deliveryPersonId) : "None"),
            statusCell(order.status),
            textCell(money(order.totalCents))
          );
          body.append(row);
        });
        $("emptyState").style.display = state.rows.length ? "none" : "block";
        $("emptyState").textContent = emptyMessage();
      }

      function cellWithOrder(order) {
        const td = document.createElement("td");
        const open = document.createElement("button");
        open.className = "row-button";
        open.type = "button";
        open.textContent = shortId(order.orderId);
        open.addEventListener("click", () => openOrder(order));
        const copy = document.createElement("button");
        copy.className = "copy-id";
        copy.type = "button";
        copy.textContent = " copy";
        copy.title = "Copy order ID";
        copy.addEventListener("click", (event) => {
          event.stopPropagation();
          copyText(order.orderId, copy);
        });
        td.append(open, copy);
        return td;
      }

      function textCell(text) {
        const td = document.createElement("td");
        td.textContent = text;
        return td;
      }

      function statusCell(status) {
        const td = document.createElement("td");
        const span = document.createElement("span");
        span.className = "status";
        if (["placed", "confirmed", "preparing", "picked_up", "out_for_delivery"].includes(status)) span.classList.add("active");
        if (["refunded", "cancelled", "disputed"].includes(status)) span.classList.add("problem");
        span.textContent = status.replaceAll("_", " ");
        td.append(span);
        return td;
      }

      function emptyMessage() {
        const response = state.lastResponse;
        if (!response) return "Run a preset to load live order history.";
        const preset = activePreset();
        if (preset && preset.expectedStatus === Number(response.status)) {
          return "Expected guardrail result: " + ((response.body && response.body.error) || preset.help);
        }
        if (response.ok) return "Live API returned 0 rows for this filter. Try Start here: Ava May or Store lookup: Nori.";
        return "Unexpected live API response " + response.status + ": " + ((response.body && response.body.error) || "request failed");
      }

      function formatDate(value) {
        return new Intl.DateTimeFormat("en", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit"
        }).format(new Date(value));
      }

      function nameFor(map, id) {
        return map[id] || shortId(id);
      }

      function renderChecks() {
        const list = $("checksList");
        list.replaceChildren();
        const checks = state.checks.length ? state.checks : [
          { label: "auth", value: "not run" },
          { label: "scope", value: "not run" },
          { label: "date", value: "not run" },
          { label: "deferred", value: "not run" }
        ];
        $("guardrailDetails").querySelector("summary").textContent = state.checks.length
          ? "Guardrails: " + checks.map((check) => check.label + " " + check.value).join(" - ")
          : "Guardrails: expand to run auth - scope - date - deferred";
        checks.forEach((check) => {
          const row = document.createElement("div");
          row.className = "check";
          const label = document.createElement("strong");
          label.textContent = check.label;
          const value = document.createElement("span");
          value.textContent = check.detail || check.value;
          row.append(label, value);
          list.append(row);
        });
      }

      function renderAll() {
        renderPresets();
        renderScenario();
        renderTiming();
        renderRows();
        renderChecks();
        const preset = activePreset();
        const expectedGuardrail = Boolean(state.lastResponse && preset && preset.expectedStatus === Number(state.lastResponse.status));
        $("resultSource").textContent = expectedGuardrail ? "Expected guardrail" : state.lastResponse ? "Live API - no sample swap" : "Live API";
      }

      function activePreset() {
        return PRESETS.find((preset) => preset.id === state.activePreset) || null;
      }

      async function openOrder(order) {
        state.activePreset = "direct";
        $("lookupInput").value = order.orderId;
        await loadDetail(order.orderId, state.lastRequest ? state.lastRequest.headers : customerHeaders(IDS.ava), { quiet: false });
        openDrawer();
      }

      async function loadDetail(orderId, headers, options) {
        const result = await api(detailRequest(orderId, headers));
        if (result.ok && result.body.data) {
          state.selectedOrder = result.body.data;
          if (!options || !options.quiet) {
            state.lastRequest = detailRequest(orderId, headers);
            state.lastResponse = result;
            state.lastTiming = timingFrom(result);
            renderAll();
          }
          renderDrawer();
        }
      }

      function renderDrawer() {
        const order = state.selectedOrder;
        const body = $("drawerBody");
        body.replaceChildren();
        if (!order) {
          body.textContent = "No order selected.";
          return;
        }
        [
          ["Order ID", order.orderId],
          ["Created", formatDate(order.createdAt)],
          ["Customer", nameFor(PEOPLE, order.userId)],
          ["Store", nameFor(STORES, order.storeId)],
          ["Delivery", order.deliveryPersonId ? shortId(order.deliveryPersonId) : "None"],
          ["Status", order.status.replaceAll("_", " ")],
          ["Total", money(order.totalCents)],
          ["Address ref", order.shipAddressRef || "tokenized ref"],
          ["Payment ref", order.paymentTokenRef || "tokenized ref"]
        ].forEach(([label, value]) => {
          const row = document.createElement("div");
          row.className = "kv";
          const key = document.createElement("span");
          key.textContent = label;
          const val = document.createElement("strong");
          val.textContent = value;
          row.append(key, val);
          body.append(row);
        });
        const title = document.createElement("h2");
        title.textContent = "Line items";
        title.style.margin = "18px 0 4px";
        body.append(title);
        (order.items || []).forEach((item) => {
          const row = document.createElement("div");
          row.className = "line-item";
          const left = document.createElement("span");
          left.textContent = item.quantity + " x " + item.nameSnapshot;
          const right = document.createElement("strong");
          right.textContent = money(item.quantity * item.priceCents);
          row.append(left, right);
          body.append(row);
        });
      }

      function openDrawer() {
        $("drawer").setAttribute("aria-hidden", "false");
      }

      function closeDrawer() {
        $("drawer").setAttribute("aria-hidden", "true");
      }

      async function runPreset(id) {
        const preset = PRESETS.find((entry) => entry.id === id);
        if (!preset) return;
        state.activePreset = id;
        setInputForPreset(preset);
        renderPresets();
        renderScenario();
        history.replaceState(null, "", "?preset=" + encodeURIComponent(id));
        if (preset.run) {
          await preset.run($("lookupInput").value.trim());
        } else {
          const request = requestForPreset(preset, $("lookupInput").value.trim());
          if (request) await runRequest(request);
        }
      }

      async function runPageTwoPreset(userId) {
        const ava = PRESETS.find((preset) => preset.id === "ava-may");
        const base = ava.requestFromInput(userId || IDS.ava);
        const first = await api(base);
        const cursor = first.body && first.body.page && first.body.page.nextCursor;
        if (!cursor) {
          state.lastRequest = base;
          state.lastResponse = first;
          state.lastTiming = timingFrom(first);
          state.rows = first.body.data || [];
          renderAll();
          return;
        }
        await runRequest({ ...base, params: { ...base.params, cursor } });
      }

      async function runDirectPreset(value) {
        let orderId = uuidV7(value) ? value : state.selectedOrder && state.selectedOrder.orderId;
        if (!orderId) {
          const base = PRESETS.find((preset) => preset.id === "ava-may").request();
          const first = await api(base);
          orderId = first.body.data && first.body.data[0] && first.body.data[0].orderId;
        }
        if (orderId) {
          $("lookupInput").value = orderId;
          await runRequest(detailRequest(orderId, customerHeaders(IDS.ava)));
          openDrawer();
        }
      }

      async function runLookupInput() {
        const value = $("lookupInput").value.trim();
        history.replaceState(null, "", window.location.pathname);
        const preset = activePreset();
        if (preset) {
          if (preset.run) {
            await preset.run(value);
          } else {
            const request = requestForPreset(preset, value);
            if (request) await runRequest(request);
          }
          return;
        }

        if (uuidV7(value)) {
          const headers = state.lastRequest ? state.lastRequest.headers : customerHeaders(IDS.ava);
          await runRequest(detailRequest(value, headers));
          openDrawer();
        } else if (uuid(value)) {
          await runRequest(listRequest({ headers: customerHeaders(value), params: { limit: "8" } }));
        } else {
          state.lastResponse = { status: "input", ok: false, body: { error: "Paste a UUID customer ID or UUIDv7 order ID." }, rttMs: 0, serverTiming: {} };
          state.rows = [];
          state.lastTiming = null;
          renderAll();
        }
      }

      async function runGuardrails() {
        const auth = await api(listRequest({ headers: {}, params: {} }));
        const scope = await api(PRESETS.find((preset) => preset.id === "cross-store").request());
        const date = await api(listRequest({ headers: customerHeaders(IDS.ava), params: { from: "2026-05-01T00:00:00.000Z", limit: "8" } }));
        const deferred = await api(PRESETS.find((preset) => preset.id === "item-search").request());
        state.checks = [
          { label: "auth", value: auth.status === 401 ? "ok" : "fail", detail: "unauthenticated read returned " + auth.status },
          { label: "scope", value: scope.status === 403 ? "ok" : "fail", detail: "cross-store read returned " + scope.status },
          { label: "date", value: date.status === 400 ? "ok" : "fail", detail: "one-sided date returned " + date.status },
          { label: "deferred", value: deferred.status === 501 ? "ok" : "fail", detail: "item search returned " + deferred.status }
        ];
        renderChecks();
      }

      function curlFor(request) {
        const parts = ["curl"];
        Object.entries(request.headers || {}).forEach(([key, value]) => {
          parts.push("-H " + quote(key + ": " + value));
        });
        parts.push(quote(externalUrl(request)));
        return parts.join(" \\\n  ");
      }

      function quote(value) {
        return "'" + String(value).replaceAll("'", "'\\''") + "'";
      }

      function copyText(value, button) {
        navigator.clipboard?.writeText(value);
        const previous = button.textContent;
        button.textContent = "copied";
        setTimeout(() => {
          button.textContent = previous;
        }, 900);
      }

      async function showExplain() {
        if (!state.lastListRequest) {
          showModal("Explain plan", "Run a list preset first.", "No list request is available yet.");
          return;
        }
        const result = await api(state.lastListRequest, { _explain: "true" });
        if (!result.ok || !result.body || !result.body.explain) {
          showModal("Explain plan", "EXPLAIN was not available for this request.", JSON.stringify(result.body, null, 2));
          return;
        }
        const summary = summarizeExplain(result.body.explain);
        showModal("Explain plan", "Partition pruning and index evidence from EXPLAIN ANALYZE.", summary + "\n\nRaw plan:\n" + JSON.stringify(result.body, null, 2));
      }

      function summarizeExplain(explain) {
        let plan = explain;
        if (typeof explain === "string") {
          try {
            plan = JSON.parse(explain);
          } catch {
            plan = explain;
          }
        }
        const text = JSON.stringify(plan);
        const partitions = Array.from(new Set(text.match(/orders_[0-9]{4}_[0-9]{2}/g) || []));
        const indexes = Array.from(new Set(text.match(/idx_[a-z0-9_]+/gi) || []));
        const execution = Array.isArray(plan) && plan[0] && typeof plan[0]["Execution Time"] === "number"
          ? plan[0]["Execution Time"].toFixed(3) + "ms"
          : "-";
        return [
          "Execution time: " + execution,
          "Partitions touched: " + (partitions.length ? partitions.join(", ") : "not surfaced by plan"),
          "Indexes surfaced: " + (indexes.length ? indexes.join(", ") : "not surfaced by plan"),
          "Expected access path: actor scope + date window + monthly partition + composite history index + keyset cursor"
        ].join("\n");
      }

      function showRequest() {
        if (!state.lastRequest) {
          showModal("Request", "No request yet.", "Run a preset first.");
          return;
        }
        showModal("Request", "Headers and URL used by the live demo.", JSON.stringify({
          method: state.lastRequest.method,
          url: requestUrl(state.lastRequest),
          headers: state.lastRequest.headers
        }, null, 2) + "\n\nLast response:\n" + JSON.stringify(state.lastResponse && state.lastResponse.body, null, 2));
      }

      function showModal(title, subtitle, body) {
        $("modalTitle").textContent = title;
        $("modalSubtitle").textContent = subtitle;
        $("modalBody").textContent = body;
        $("infoModal").showModal();
      }

      function init() {
        renderAll();
        renderPresets();
        $("lookupInput").focus();
        $("presetGrid").addEventListener("click", (event) => {
          const button = event.target.closest("[data-preset]");
          if (button) runPreset(button.dataset.preset);
        });
        $("lookupButton").addEventListener("click", runLookupInput);
        $("lookupInput").addEventListener("keydown", (event) => {
          if (event.key === "Enter") runLookupInput();
        });
        $("lookupInput").addEventListener("input", () => {
          state.activePreset = "";
          renderPresets();
          renderScenario();
        });
        $("requestButton").addEventListener("click", showRequest);
        $("curlButton").addEventListener("click", () => {
          if (state.lastRequest) copyText(curlFor(state.lastRequest), $("curlButton"));
        });
        $("explainButton").addEventListener("click", showExplain);
        $("drawerClose").addEventListener("click", closeDrawer);
        $("drawerBackdrop").addEventListener("click", closeDrawer);
        $("modalClose").addEventListener("click", () => $("infoModal").close());
        $("guardrailDetails").addEventListener("toggle", () => {
          if ($("guardrailDetails").open && !state.checks.length) runGuardrails();
        });

        const presetFromUrl = new URLSearchParams(window.location.search).get("preset") || "ava-may";
        runPreset(presetFromUrl);
      }

      init();
    </script>
  </body>
</html>`;
}
