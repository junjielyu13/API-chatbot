import sys
import google.generativeai as genai
import json

if len(sys.argv) < 2:
    print("No input provided")
    sys.exit(1)

# 获取对话历史
conversation_history = json.loads(sys.argv[1])

Token = "AIzaSyCAHToUqHhbicFwniR5HZIFVpsd6AQsWeY"
# 配置 API 密钥
genai.configure(api_key=Token)

# 使用生成模型
model = genai.GenerativeModel('gemini-2.0-flash')

# 拼接对话历史
context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation_history])

# 生成响应
response = model.generate_content(context)

# 输出机器人的回复
print(response.text.strip())
