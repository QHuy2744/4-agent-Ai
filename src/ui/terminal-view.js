export function renderTerminal(container) {
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;">
      <div class="terminal-output" id="term-out">Omega Terminal v1.0.0\nType 'help' for commands.\n</div>
      <div class="terminal-input-line">
        <span>user@omega:~$</span>
        <input type="text" id="term-input" autofocus>
      </div>
    </div>
  `;
  const input = container.querySelector('#term-input');
  const out = container.querySelector('#term-out');
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      out.textContent += `\nuser@omega:~$ ${cmd}\n`;
      if (cmd === 'help') out.textContent += 'Available: help, clear, pwd, ls, date, echo\n';
      else if (cmd === 'clear') out.textContent = '';
      else if (cmd === 'pwd') out.textContent += '/home/user\n';
      else if (cmd === 'ls') out.textContent += 'Documents/ Downloads/ desktop.txt\n';
      else if (cmd === 'date') out.textContent += new Date().toString() + '\n';
      else out.textContent += `Command not found: ${cmd}\n`;
      input.value = '';
      out.scrollTop = out.scrollHeight;
    }
  });
}