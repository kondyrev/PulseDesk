(function () {
  const script = document.currentScript;

  if (!script) return;

  const publicWidgetKey = script.dataset.key;

  if (!publicWidgetKey) {
    console.error("PulseDesk: data-key is required");
    return;
  }

  const apiBase = script.dataset.apiBase || "https://pulsedesk.ru";
  const storageKey = `pulsedesk-ticket-${publicWidgetKey}`;

  let widgetSettings = {
    company_name: "",
    title: "Поддержка",
    subtitle: "Обычно отвечаем в течение нескольких минут",
    primary_color: "#000000",
    position: "bottom_right",
  };

  let ticketId = localStorage.getItem(storageKey);
  let isTyping = false;
  let messagesInterval = null;

  const styles = document.createElement("style");

  styles.innerHTML = `
    .pd-widget * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .pd-launcher {
      position: fixed;
      bottom: 24px;
      width: 64px;
      height: 64px;
      border-radius: 9999px;
      border: none;
      background: #000;
      color: #fff;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 16px 40px rgba(0,0,0,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pd-panel {
      position: fixed;
      bottom: 104px;
      width: 380px;
      min-height: 0;
      background: #fff;
      border-radius: 28px;
      overflow: hidden;
      display: none;
      z-index: 999999;
      border: 1px solid rgba(0,0,0,0.06);
      box-shadow: 0 24px 70px rgba(0,0,0,0.18);
    }

    .pd-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .pd-title {
      font-size: 18px;
      font-weight: 800;
      color: #111;
    }

    .pd-subtitle {
      margin-top: 6px;
      font-size: 14px;
      color: #666;
    }

    .pd-body {
      display: flex;
      flex-direction: column;
      height: calc(100% - 82px);
      min-height: 0;
    }

    .pd-form {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .pd-input,
    .pd-textarea {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 16px;
      padding: 0 14px;
      outline: none;
      font-size: 14px;
    }

    .pd-input {
      height: 46px;
    }

    .pd-textarea {
      height: 140px;
      resize: none;
      padding-top: 14px;
    }

    .pd-send {
      height: 50px;
      border: none;
      border-radius: 18px;
      background: #000;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
    }

    .pd-chat {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    .pd-messages {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 20px;
      background: #f6f7f8;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .pd-panel-chat {
      height: 680px;
    }

    .pd-panel-form {
      height: auto;
    }

    .pd-message {
      max-width: 80%;
      padding: 14px 16px;
      border-radius: 22px;
      line-height: 1.5;
      font-size: 14px;
      white-space: pre-wrap;
    }

    .pd-message-customer {
      align-self: flex-end;
      background: #000;
      color: #fff;
      border-bottom-right-radius: 8px;
    }

    .pd-message-operator {
      align-self: flex-start;
      background: #fff;
      color: #111;
      border-bottom-left-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    }

    .pd-chat-form {
      border-top: 1px solid #eee;
      padding: 16px;
      display: flex;
      gap: 10px;
      background: #fff;
    }

    .pd-chat-input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 16px;
      padding: 0 14px;
      height: 46px;
      outline: none;
    }

    .pd-chat-send {
      border: none;
      background: #000;
      color: #fff;
      border-radius: 16px;
      padding: 0 18px;
      font-weight: 700;
      cursor: pointer;
      min-width: 110px;
    }

    .pd-state {
      padding: 20px;
      background: #f6f7f8;
      color: #333;
      font-size: 14px;
      line-height: 1.5;
    }

    .pd-new-ticket {
      margin-top: 14px;
      height: 44px;
      border: none;
      border-radius: 16px;
      background: #000;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      padding: 0 16px;
    }

    .pd-chat-send:disabled,
    .pd-send:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 520px) {
      .pd-panel {
        left: 16px !important;
        right: 16px !important;
        width: auto;
      }

      .pd-launcher {
        right: 18px !important;
        left: auto !important;
      }
    }
  `;

  document.head.appendChild(styles);

  const root = document.createElement("div");

  root.className = "pd-widget";

  root.innerHTML = `
    <button class="pd-launcher">
      💬
    </button>

    <div class="pd-panel">
      <div class="pd-header">
        <div class="pd-title">Поддержка</div>
        <div class="pd-subtitle">Обычно отвечаем в течение нескольких минут</div>
      </div>

      <div class="pd-body"></div>
    </div>
  `;

  document.body.appendChild(root);

  const launcher = root.querySelector(".pd-launcher");
  const panel = root.querySelector(".pd-panel");
  const body = root.querySelector(".pd-body");
  const titleElement = root.querySelector(".pd-title");
  const subtitleElement = root.querySelector(".pd-subtitle");

  function normalizeColor(color) {
    if (typeof color === "string" && /^#[0-9A-Fa-f]{6}$/.test(color)) {
      return color;
    }

    return "#000000";
  }

  function applyWidgetSettings() {
    const companyName = widgetSettings.company_name
      ? widgetSettings.company_name.trim()
      : "";

    const title = widgetSettings.title || "Поддержка";
    const color = normalizeColor(widgetSettings.primary_color);
    const position = widgetSettings.position || "bottom_right";

    titleElement.innerText = companyName ? `${title} ${companyName}` : title;

    subtitleElement.innerText =
      widgetSettings.subtitle || "Обычно отвечаем в течение нескольких минут";

    launcher.style.backgroundColor = color;

    root
      .querySelectorAll(".pd-send, .pd-chat-send, .pd-new-ticket")
      .forEach((button) => {
        button.style.backgroundColor = color;
      });

    root.querySelectorAll(".pd-message-customer").forEach((message) => {
      message.style.backgroundColor = color;
    });

    if (position === "bottom_left") {
      launcher.style.left = "24px";
      launcher.style.right = "auto";
      panel.style.left = "24px";
      panel.style.right = "auto";
    } else {
      launcher.style.right = "24px";
      launcher.style.left = "auto";
      panel.style.right = "24px";
      panel.style.left = "auto";
    }
  }

  function startMessagesPolling() {
    if (messagesInterval) {
      window.clearInterval(messagesInterval);
    }

    messagesInterval = window.setInterval(loadMessages, 5000);
  }

  function renderState(title, text, showNewTicketButton) {
    panel.classList.remove("pd-panel-form");
    panel.classList.add("pd-panel-chat");

    body.innerHTML = `
      <div class="pd-chat">
        <div class="pd-state">
          <strong>${title}</strong>
          <div style="margin-top: 6px;">${text}</div>
          ${
            showNewTicketButton
              ? `<button class="pd-new-ticket">Создать новое обращение</button>`
              : ""
          }
        </div>
      </div>
    `;

    applyWidgetSettings();

    const newTicketButton = body.querySelector(".pd-new-ticket");

    if (newTicketButton) {
      newTicketButton.addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        ticketId = null;
        renderForm();
      });
    }
  }

  function renderChatShell() {
    panel.classList.remove("pd-panel-form");
    panel.classList.add("pd-panel-chat");

    const existingChat = body.querySelector(".pd-chat");

    if (existingChat) return;

    body.innerHTML = `
      <div class="pd-chat">
        <div class="pd-messages"></div>

        <div class="pd-chat-form">
          <input
            class="pd-chat-input"
            placeholder="Введите сообщение..."
          />

          <button class="pd-chat-send">
            Отправить
          </button>
        </div>
      </div>
    `;

    applyWidgetSettings();

    const input = body.querySelector(".pd-chat-input");
    const sendButton = body.querySelector(".pd-chat-send");

    input.addEventListener("input", () => {
      isTyping = input.value.trim().length > 0;
    });

    input.addEventListener("blur", () => {
      isTyping = false;
    });

    sendButton.addEventListener("click", async () => {
      const text = input.value.trim();

      if (!text || !ticketId) return;

      isTyping = false;
      sendButton.disabled = true;
      sendButton.innerText = "Отправляем...";

      input.value = "";

      renderMessages([
        ...getCurrentMessagesFromDom(),
        {
          id: `local-${Date.now()}`,
          sender_type: "customer",
          content: text,
        },
      ]);

      try {
        const response = await fetch(`${apiBase}/api/widget/tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicWidgetKey,
            ticketId,
            message: text,
            pageUrl: window.location.href,
          }),
        });

        const result = await response.json();

        if (result.closed) {
          renderClosedState([]);
          return;
        }

        if (!response.ok || !result.ok) {
          renderState(
            "Не удалось отправить сообщение.",
            "Пожалуйста, попробуйте ещё раз.",
            false
          );
          return;
        }

        await loadMessages();
      } catch (error) {
        console.error("PulseDesk send message error:", error);
        renderState(
          "Не удалось отправить сообщение.",
          "Проверьте подключение и попробуйте ещё раз.",
          false
        );
      } finally {
        sendButton.disabled = false;
        sendButton.innerText = "Отправить";
      }
    });
  }

  function getCurrentMessagesFromDom() {
    const nodes = body.querySelectorAll(".pd-message");

    return Array.from(nodes).map((node, index) => ({
      id: `dom-${index}`,
      sender_type: node.classList.contains("pd-message-customer")
        ? "customer"
        : "operator",
      content: node.innerText,
    }));
  }

  function renderMessages(messages) {
    renderChatShell();

    const messagesContainer = body.querySelector(".pd-messages");

    if (!messagesContainer) return;

    messagesContainer.innerHTML = "";

    messages.forEach((message) => {
      const div = document.createElement("div");

      div.className = `
        pd-message
        ${
          message.sender_type === "customer"
            ? "pd-message-customer"
            : "pd-message-operator"
        }
      `;

      div.innerText = message.content;

      if (message.sender_type === "customer") {
        div.style.backgroundColor = normalizeColor(widgetSettings.primary_color);
      }

      messagesContainer.appendChild(div);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    applyWidgetSettings();
  }

  function renderClosedState(messages) {
    panel.classList.remove("pd-panel-form");
    panel.classList.add("pd-panel-chat");

    body.innerHTML = `
      <div class="pd-chat">
        <div class="pd-messages"></div>

        <div class="pd-state">
          <strong>Обращение закрыто.</strong>
          <div style="margin-top: 6px;">
            Если вопрос ещё актуален, создайте новое обращение.
          </div>

          <button class="pd-new-ticket">
            Создать новое обращение
          </button>
        </div>
      </div>
    `;

    const messagesContainer = body.querySelector(".pd-messages");

    messagesContainer.innerHTML = "";

    (messages || []).forEach((message) => {
      const div = document.createElement("div");

      div.className = `
        pd-message
        ${
          message.sender_type === "customer"
            ? "pd-message-customer"
            : "pd-message-operator"
        }
      `;

      div.innerText = message.content;

      if (message.sender_type === "customer") {
        div.style.backgroundColor = normalizeColor(widgetSettings.primary_color);
      }

      messagesContainer.appendChild(div);
    });

    applyWidgetSettings();

    const newTicketButton = body.querySelector(".pd-new-ticket");

    newTicketButton.addEventListener("click", () => {
      localStorage.removeItem(storageKey);
      ticketId = null;
      renderForm();
    });
  }

  async function loadWidgetSettings() {
    try {
      const response = await fetch(
        `${apiBase}/api/widget/settings?key=${publicWidgetKey}`
      );

      const data = await response.json();

      if (data.ok && data.settings) {
        widgetSettings = {
          ...widgetSettings,
          ...data.settings,
        };
      }
    } catch (error) {
      console.error("PulseDesk settings error:", error);
    }

    applyWidgetSettings();
  }

  async function loadMessages() {
    if (!ticketId || isTyping) return;

    try {
      renderChatShell();

      const response = await fetch(
        `${apiBase}/api/widget/tickets/${ticketId}/messages?key=${publicWidgetKey}`
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        localStorage.removeItem(storageKey);
        ticketId = null;
        renderForm();
        return;
      }

      if (data.closed) {
        renderClosedState(data.messages || []);
        return;
      }

      renderMessages(data.messages || []);
    } catch (error) {
      console.error("PulseDesk messages error:", error);

      renderState(
        "Не удалось загрузить диалог.",
        "Попробуйте обновить страницу или создать новое обращение.",
        true
      );
    }
  }

  function renderForm() {
    panel.classList.remove("pd-panel-chat");
    panel.classList.add("pd-panel-form");

    body.innerHTML = `
      <div class="pd-form">
        <input
          class="pd-input"
          id="pd-name"
          placeholder="Ваше имя"
        />

        <input
          class="pd-input"
          id="pd-email"
          placeholder="Email"
        />

        <textarea
          class="pd-textarea"
          id="pd-message"
          placeholder="Напишите сообщение..."
        ></textarea>

        <button class="pd-send">
          Отправить
        </button>
      </div>
    `;

    applyWidgetSettings();

    const sendButton = body.querySelector(".pd-send");

    sendButton.addEventListener("click", async () => {
      const customerName = body.querySelector("#pd-name").value.trim();
      const customerEmail = body.querySelector("#pd-email").value.trim();
      const message = body.querySelector("#pd-message").value.trim();

      if (!message) return;

      sendButton.disabled = true;
      sendButton.innerText = "Отправляем...";

      try {
        const response = await fetch(`${apiBase}/api/widget/tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicWidgetKey,
            customerName,
            customerEmail,
            message,
            pageUrl: window.location.href,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.ok || !data.ticketId) {
          renderState(
            "Не удалось создать обращение.",
            "Пожалуйста, попробуйте ещё раз.",
            false
          );
          return;
        }

        ticketId = data.ticketId;
        localStorage.setItem(storageKey, ticketId);

        renderChatShell();
        renderMessages([
          {
            id: `local-${Date.now()}`,
            sender_type: "customer",
            content: message,
          },
        ]);

        await loadMessages();
        startMessagesPolling();
      } catch (error) {
        console.error("PulseDesk create ticket error:", error);

        renderState(
          "Не удалось создать обращение.",
          "Проверьте подключение и попробуйте ещё раз.",
          false
        );
      } finally {
        sendButton.disabled = false;
        sendButton.innerText = "Отправить";
      }
    });
  }

  launcher.addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });

  loadWidgetSettings();

  if (ticketId) {
    renderChatShell();
    loadMessages();
    startMessagesPolling();
  } else {
    renderForm();
  }
})();