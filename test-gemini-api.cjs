/**
 * Gemini API Key 验证脚本
 * 使用方法: node test-gemini-api.cjs YOUR_API_KEY
 * 或者设置环境变量: set GEMINI_API_KEY=your_key && node test-gemini-api.cjs
 */

const https = require('https');

// 获取 API Key
const apiKey = process.argv[2] || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ 错误: 未提供 API Key');
  console.log('\n使用方法:');
  console.log('  node test-gemini-api.cjs YOUR_API_KEY');
  console.log('  或者: set GEMINI_API_KEY=your_key && node test-gemini-api.cjs');
  process.exit(1);
}

console.log('🔍 正在验证 Gemini API Key...');
console.log(`📝 API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);

// 构建请求数据
const requestData = JSON.stringify({
  contents: [{
    parts: [{
      text: '你好，请用一句话介绍你自己。'
    }]
  }]
});

// API 请求选项
const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestData)
  }
};

// 发送请求
const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (res.statusCode === 200 && response.candidates) {
        console.log('✅ API Key 验证成功!\n');
        console.log('📊 响应信息:');
        console.log(`   模型: gemini-2.0-flash-exp`);
        console.log(`   状态码: ${res.statusCode}`);
        
        if (response.candidates[0]?.content?.parts[0]?.text) {
          console.log('\n💬 AI 回复:');
          console.log(`   ${response.candidates[0].content.parts[0].text}\n`);
        }
        
        console.log('✨ 你的 API Key 可以正常使用!');
      } else {
        console.error('❌ API Key 验证失败\n');
        console.log('📊 响应详情:');
        console.log(`   状态码: ${res.statusCode}`);
        console.log(`   响应: ${JSON.stringify(response, null, 2)}`);
        
        if (response.error) {
          console.log(`\n⚠️  错误信息: ${response.error.message}`);
        }
      }
    } catch (error) {
      console.error('❌ 解析响应失败:', error.message);
      console.log('原始响应:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ 请求失败:', error.message);
  console.log('\n可能的原因:');
  console.log('  - 网络连接问题');
  console.log('  - API Key 无效');
  console.log('  - 防火墙阻止了请求');
});

req.write(requestData);
req.end();
