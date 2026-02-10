// Test Gemini API and list available models
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

async function listModels() {
  console.log('🔍 Checking available Gemini models...\n');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`,
      { method: 'GET' }
    );
    
    const data = await response.json();
    
    if (data.error) {
      console.error('❌ API Error:', data.error.message);
      console.log('\n💡 Suggestions:');
      console.log('1. Check if your API key is correct in .env.local');
      console.log('2. Generate new API key at: https://makersuite.google.com/app/apikey');
      console.log('3. Make sure you enabled Gemini API in your Google Cloud Console');
      return;
    }
    
    console.log('✅ Available models:\n');
    
    const supportedModels = data.models
      .filter(model => 
        model.supportedGenerationMethods?.includes('generateContent') ||
        model.supportedGenerationMethods?.includes('streamGenerateContent')
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    
    supportedModels.forEach(model => {
      const modelName = model.name.replace('models/', '');
      const methods = model.supportedGenerationMethods?.join(', ') || 'N/A';
      console.log(`📦 ${modelName}`);
      console.log(`   Methods: ${methods}`);
      console.log('');
    });
    
    console.log('\n🎯 RECOMMENDED MODELS FOR CHAT:');
    const recommended = supportedModels
      .filter(m => m.name.includes('gemini') && !m.name.includes('embedding'))
      .slice(0, 3);
    
    recommended.forEach(model => {
      const modelName = model.name.replace('models/', '');
      console.log(`✨ google('${modelName}')`);
    });
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.log('\n💡 Check your internet connection and try again.');
  }
}

async function testModel(modelName) {
  console.log(`\n🧪 Testing model: ${modelName}\n`);
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: 'Hello! Say hi in 3 words.' }] }
          ]
        })
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Error:', data.error.message);
      return false;
    }
    
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('✅ Success! Response:', reply);
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Main execution
(async () => {
  if (!API_KEY) {
    console.error('❌ GOOGLE_GENERATIVE_AI_API_KEY not found in .env.local');
    console.log('\n💡 Add this to your .env.local file:');
    console.log('GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here');
    process.exit(1);
  }
  
  console.log('API Key:', API_KEY.substring(0, 10) + '...' + API_KEY.substring(API_KEY.length - 4));
  console.log('');
  
  await listModels();
  
  // Test most common models
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TESTING COMMON MODELS');
  console.log('='.repeat(60));
  
  const modelsToTest = [
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-pro'
  ];
  
  for (const model of modelsToTest) {
    const success = await testModel(model);
    if (success) {
      console.log(`\n🎉 WORKING MODEL FOUND: ${model}`);
      console.log(`\n📝 Update your route.ts to use:`);
      console.log(`model: google('${model}')`);
      break;
    }
  }
})();
