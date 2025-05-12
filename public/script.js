const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let conversationHistory = [];  // 用来保存上下文的对话历史

sendButton.addEventListener('click', sendMessage);

function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, 'user-message');
    userInput.value = '';

    // 将用户消息添加到对话历史中
    conversationHistory.push({ role: 'user', content: userMessage });

    fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: conversationHistory })  // 发送整个对话历史
    })
    .then(response => response.json())
    .then(data => {
        addMessage(data.reply, 'bot-message');

        // 将机器人的回复添加到对话历史中
        conversationHistory.push({ role: 'bot', content: data.reply });
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage('Error: Unable to connect to the server.', 'bot-message');
    });
}

function addMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.textContent = text;
    messageElement.className = `message ${className}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
