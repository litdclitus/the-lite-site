require('dotenv').config({ path: '.env.local' });

async function testGroqAPI() {
  console.log('🧪 Testing Groq API Integration...\n');

  // Check if API key exists
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    console.error('❌ GROQ_API_KEY is not configured in .env.local');
    process.exit(1);
  }
  console.log('✅ GROQ_API_KEY is configured');

  // Test the API endpoint
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: 'Say "Hello from Groq!" in a short sentence.',
          },
        ],
        temperature: 0.65,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API request failed:', response.status, errorData);
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ API request successful!');
    console.log('\n📝 Response from Groq:');
    console.log(data.choices[0].message.content);
    console.log('\n✅ Groq integration is working correctly!');
    console.log('🚀 Your chatbot is ready to use llama-3.3-70b-versatile');
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    process.exit(1);
  }
}

testGroqAPI();
