(function () {
  const script = document.currentScript;

  if (!script) return;

  const publicWidgetKey = script.dataset.key;

  if (!publicWidgetKey) {
    console.error("PulseDesk: data-key is required");
    return;
  }

  const apiUrl =
    script.dataset.apiUrl || "http://localhost:3000/api/widget/tickets";

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
      transition: transform .2s ease, box-shadow .2s ease;
    }

    .pd-launcher:hover {
      transform: translateY(-2px);
      box-shadow: 0 22px 50px rgba(0,0,0,0.22);
    }

    .pd-launcher svg {
      width: 28px;
      height: 28px;
    }

    .pd-panel {
      position: fixed;
      right: 24px;
      bottom: 104px;
      width: 360px;
      background: #fff;
      border-radius: 28px;
      box-shadow: 0 24px 70px rgba(0,0,0,0.18);
      overflow: hidden;
      display: none;
      z-index: 999999;
      border: 1px solid rgba(0,0,0,0.06);
    }

    .pd-header {
      padding: 22px;
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
      line-height: 1.4;
    }

    .pd-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .pd-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .pd-input,
    .pd-textarea {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 16px;
      padding: 0 14px;
      outline: none;
      font-size: 14px;
      transition: border-color .2s ease, box-shadow .2s ease;
    }

    .pd-input {
      height: 46px;
    }

    .pd-textarea {
      height: 130px;
      padding-top: 14px;
      resize: none;
    }

    .pd-input:focus,
    .pd-textarea:focus {
      border-color: #111;
      box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
    }

    .pd-error .pd-input,
    .pd-error .pd-textarea {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
    }

    .pd-error-text {
      display: none;
      font-size: 12px;
      color: #ef4444;
      padding-left: 4px;
    }

    .pd-error .pd-error-text {
      display: block;
    }

    .pd-form-error {
      display: none;
      border-radius: 16px;
      background: #fef2f2;
      color: #dc2626;
      padding: 12px 14px;
      font-size: 13px;
      line-height: 1.4;
    }

    .pd-form-error-visible {
      display: block;
    }

    .pd-send {
      height: 50px;
      border: none;
      border-radius: 18px;
      background: #000;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      transition: opacity .2s ease, transform .2s ease;
    }

    .pd-send:hover {
      opacity: .9;
    }

    .pd-send:active {
      transform: scale(.98);
    }

    .pd-send:disabled {
      opacity: .55;
      cursor: not-allowed;
    }

    .pd-success {
      padding: 34px;
      text-align: center;
    }

    .pd-success-icon {
      width: 54px;
      height: 54px;
      border-radius: 20px;
      background: #dcfce7;
      color: #16a34a;
      margin: 0 auto 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 800;
    }

    .pd-success-title {
      font-size: 20px;
      font-weight: 800;
      color: #111;
    }

    .pd-success-text {
      margin-top: 10px;
      color: #666;
      line-height: 1.5;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      .pd-panel {
        left: 16px;
        right: 16px;
        bottom: 96px;
        width: auto;
      }

      .pd-launcher {
        right: 18px;
        bottom: 18px;
      }
    }
  `;

  document.head.appendChild(styles);

  const root = document.createElement("div");
  root.className = "pd-widget";

  root.innerHTML = `
    <button class="pd-launcher" aria-label="Открыть поддержку">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12.5C5 8.91 8.134 6 12 6s7 2.91 7 6.5S15.866 19 12 19c-.73 0-1.436-.104-2.1-.298L6 20l1.204-3.008C5.82 15.82 5 14.236 5 12.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="pd-panel">
      <div class="pd-header">
        <div class="pd-title">PulseDesk Support</div>
        <div class="pd-subtitle">Обычно отвечаем в течение нескольких минут</div>
      </div>

      <div class="pd-body">
        <div class="pd-form-error" id="pd-form-error"></div>

        <div class="pd-field" id="pd-name-field">
          <input class="pd-input" id="pd-name" placeholder="Ваше имя" />
          <div class="pd-error-text">Укажите имя</div>
        </div>

        <div class="pd-field" id="pd-email-field">
          <input class="pd-input" id="pd-email" placeholder="Email" type="email" />
          <div class="pd-error-text">Укажите корректный email</div>
        </div>

        <div class="pd-field" id="pd-message-field">
          <textarea class="pd-textarea" id="pd-message" placeholder="Напишите сообщение..."></textarea>
          <div class="pd-error-text">Напишите сообщение</div>
        </div>

        <button class="pd-send" id="pd-send">Отправить</button>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  const launcher = root.querySelector(".pd-launcher");
  const panel = root.querySelector(".pd-panel");
  const sendButton = root.querySelector("#pd-send");

  const nameInput = root.querySelector("#pd-name");
  const emailInput = root.querySelector("#pd-email");
  const messageInput = root.querySelector("#pd-message");

  const nameField = root.querySelector("#pd-name-field");
  const emailField = root.querySelector("#pd-email-field");
  const messageField = root.querySelector("#pd-message-field");
  const formError = root.querySelector("#pd-form-error");

  launcher.addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });

  function setFormError(message) {
    if (!message) {
      formError.classList.remove("pd-form-error-visible");
      formError.innerText = "";
      return;
    }

    formError.innerText = message;
    formError.classList.add("pd-form-error-visible");
  }

  function clearErrors() {
    nameField.classList.remove("pd-error");
    emailField.classList.remove("pd-error");
    messageField.classList.remove("pd-error");
    setFormError("");
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

  function validate() {
    clearErrors();

    let valid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
      nameField.classList.add("pd-error");
      valid = false;
    }

    if (!email || !isValidEmail(email)) {
      emailField.classList.add("pd-error");
      valid = false;
    }

    if (!message) {
      messageField.classList.add("pd-error");
      valid = false;
    }

    if (!valid) {
      setFormError("Проверьте поля формы и попробуйте еще раз.");
    }

    return valid;
  }

  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("input", clearErrors);
  });

  sendButton.addEventListener("click", async () => {
    if (!validate()) return;

    sendButton.disabled = true;
    sendButton.innerText = "Отправляем...";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          publicWidgetKey,
          customerName: nameInput.value.trim(),
          customerEmail: emailInput.value.trim(),
          message: messageInput.value.trim(),
          pageUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Не удалось отправить сообщение");
      }

      panel.innerHTML = `
        <div class="pd-success">
          <div class="pd-success-icon">✓</div>
          <div class="pd-success-title">Сообщение отправлено</div>
          <div class="pd-success-text">
            Мы получили ваше обращение и скоро ответим.
          </div>
        </div>
      `;
    } catch (error) {
      console.error("PulseDesk widget error:", error);

      sendButton.disabled = false;
      sendButton.innerText = "Отправить";

      setFormError(
        error && error.message
          ? error.message
          : "Не удалось отправить сообщение. Попробуйте позже."
      );
    }
  });
})();