const translationService = {
  // 獲取支援的語言列表
  async getSupportedLanguages() {
    try {
      const response = await fetch('/api/translation/languages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        return { success: true, languages: data.supportedLanguages }
      } else {
        return { success: false, error: data.error || '獲取語言列表失敗' }
      }
    } catch (error) {
      console.error('獲取語言列表錯誤:', error)
      return { success: false, error: '網絡錯誤' }
    }
  },

  // 獲取支援的模型列表
  async getSupportedModels() {
    try {
      const response = await fetch('/api/translation/models', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        return { success: true, models: data.supportedModels }
      } else {
        return { success: false, error: data.error || '獲取模型列表失敗' }
      }
    } catch (error) {
      console.error('獲取模型列表錯誤:', error)
      return { success: false, error: '網絡錯誤' }
    }
  },

  // 翻譯配音稿
  async translateVoiceScript({ text, sourceLanguage, targetLanguage, model = 'gemini-2.5-flash' }) {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        return { success: false, error: '請先登錄' }
      }

      const response = await fetch('/api/translation/voice-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
          model,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        return { 
          success: true, 
          translation: data.translation,
          metadata: data.metadata 
        }
      } else {
        return { success: false, error: data.error || '翻譯失敗' }
      }
    } catch (error) {
      console.error('翻譯錯誤:', error)
      return { success: false, error: '網絡錯誤' }
    }
  },

  // 批量翻譯
  async translateVoiceScriptBatch({ texts, sourceLanguage, targetLanguage, model = 'gemini-2.5-flash' }) {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        return { success: false, error: '請先登錄' }
      }

      const response = await fetch('/api/translation/voice-script/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          texts,
          sourceLanguage,
          targetLanguage,
          model,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        return { 
          success: true, 
          batchTranslation: data.batchTranslation,
          metadata: data.metadata 
        }
      } else {
        return { success: false, error: data.error || '批量翻譯失敗' }
      }
    } catch (error) {
      console.error('批量翻譯錯誤:', error)
      return { success: false, error: '網絡錯誤' }
    }
  },

  // 檢查翻譯品質
  async checkTranslationQuality({ originalText, translatedText, sourceLanguage, targetLanguage }) {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        return { success: false, error: '請先登錄' }
      }

      const response = await fetch('/api/translation/quality-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalText,
          translatedText,
          sourceLanguage,
          targetLanguage,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        return { 
          success: true, 
          qualityReport: data.qualityReport,
          metadata: data.metadata 
        }
      } else {
        return { success: false, error: data.error || '品質檢測失敗' }
      }
    } catch (error) {
      console.error('品質檢測錯誤:', error)
      return { success: false, error: '網絡錯誤' }
    }
  }
}

export { translationService }
