(function () {
  const script = document.currentScript;

  if (!script) return;

  const publicWidgetKey = script.dataset.key;

  if (!publicWidgetKey) {
    console.error("PulseDesk: data-key is required");
    return;
  }

  const apiBase = script.dataset.apiBase || "https://pulsedesk.ru";

  let widgetSettings = {
    company_name: "",
    title: "Поддержка",
    subtitle: "Обычно отвечаем в течение нескольких минут",
  };

  const styles = document.createElement("style");

  styles.innerHTML = `
    .pd-widget * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .pd-launcher {
      position: fixed;
      right: 24px;
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
      right: 24px;
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

    .pd-closed {
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

  function applyWidgetSettings() {
    const companyName = widgetSettings.company_name
      ? widgetSettings.company_name.trim()
      : "";

    const title = widgetSettings.title || "Поддержка";

    titleElement.innerText = companyName ? `${title} ${companyName}` : title;

    subtitleElement.innerText =
      widgetSettings.subtitle || "Обычно отвечаем в течение нескольких минут";
  }

  async function loadWidgetSettings() {
    try {
      const response = await fetch(
        `${apiBase}/api/widget/settings?key=${publicWidgetKey}`
      );

      const data = await response.json();

      if (!data.ok || !data.settings) {
        applyWidgetSettings();
        return;
      }

      widgetSettings = {
        ...widgetSettings,
        ...data.settings,
      };

      applyWidgetSettings();
    } catch (error) {
      console.error("PulseDesk settings error:", error);
      applyWidgetSettings();
    }
  }

  launcher.addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });

  let ticketId = localStorage.getItem(`pulsedesk-ticket-${publicWidgetKey}`);

  let isTyping = false;

  function renderMessages(messages) {
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

      messagesContainer.appendChild(div);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function renderClosedState(messages) {
    panel.classList.remove("pd-panel-form");
    panel.classList.add("pd-panel-chat");

    body.innerHTML = `
      <div class="pd-chat">
        <div class="pd-messages"></div>

        <div class="pd-closed">
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

    renderMessages(messages || []);

    const newTicketButton = body.querySelector(".pd-new-ticket");

    newTicketButton.addEventListener("click", () => {
      localStorage.removeItem(`pulsedesk-ticket-${publicWidgetKey}`);
      ticketId = null;
      renderForm();
    });
  }

  async function loadMessages() {
    if (!ticketId || isTyping) return;

    const response = await fetch(
      `${apiBase}/api/widget/tickets/${ticketId}/messages?key=${publicWidgetKey}`
    );

    const data = await response.json();

    if (!data.ok) {
      localStorage.removeItem(`pulsedesk-ticket-${publicWidgetKey}`);

      ticketId = null;

      renderForm();

      return;
    }

    if (data.closed) {
      renderClosedState(data.messages || []);
      return;
    }

    panel.classList.remove("pd-panel-form");
    panel.classList.add("pd-panel-chat");

    const existingChat = body.querySelector(".pd-chat");

    if (!existingChat) {
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

        if (!text) return;

        isTyping = false;

        sendButton.disabled = true;
        sendButton.innerText = "Отправляем...";

        const optimisticMessages = [
          ...data.messages,
          {
            sender_type: "customer",
            content: text,
          },
        ];

        renderMessages(optimisticMessages);

        input.value = "";

        const request = await fetch(`${apiBase}/api/widget/tickets`, {
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

        const result = await request.json();

        sendButton.disabled = false;
        sendButton.innerText = "Отправить";

        if (result.closed) {
          renderClosedState(data.messages || []);
          return;
        }

        if (!result.ok) return;

        loadMessages();
      });
    }

    renderMessages(data.messages);
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

    const sendButton = body.querySelector(".pd-send");

    sendButton.addEventListener("click", async () => {
      const customerName = body.querySelector("#pd-name").value;
      const customerEmail = body.querySelector("#pd-email").value;
      const message = body.querySelector("#pd-message").value;

      if (!message.trim()) return;

      sendButton.disabled = true;
      sendButton.innerText = "Отправляем...";

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

      sendButton.disabled = false;
      sendButton.innerText = "Отправить";

      if (!data.ok) return;

      ticketId = data.ticketId;

      localStorage.setItem(`pulsedesk-ticket-${publicWidgetKey}`, ticketId);

      loadMessages();

      setInterval(loadMessages, 5000);
    });
  }

  loadWidgetSettings();

  if (ticketId) {
    loadMessages();

    setInterval(loadMessages, 5000);
  } else {
    renderForm();
  }
})();