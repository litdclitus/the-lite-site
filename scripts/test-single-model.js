// Quick test for a single model
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const MODEL = process.argv[2] || 'gemini-2.0-flash';

async function testModel() {
  console.log(`🧪 Testing: ${MODEL}\n`);
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: 'Say "Hello World" in 3 words' }] }
          ],
          systemInstruction: {
            parts: [{ text: 'You are a helpful assistant. Be friendly and concise.' }]
          }
        })
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Error:', data.error.message);
      process.exit(1);
    }
    
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('✅ SUCCESS!');
    console.log('📝 Response:', reply);
    console.log('\n🎉 Model is working! Update your route.ts:');
    console.log(`model: google('${MODEL}')`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testModel();
