<template>
  <div class="translation-container">
    <div class="container">
      <!-- 左側導航欄 (復用主頁的導航) -->
      <div class="sidebar">
        <!-- 用戶資訊 -->
        <div class="user-info">
          <div class="user-avatar">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="User Avatar"
              class="avatar-img"
            />
            <i v-else class="fa fa-user"></i>
          </div>
          <div class="user-details">
            <h3>{{ username }}</h3>
            <button @click="goHome" class="nav-btn">Back to Home</button>
          </div>
        </div>

        <!-- 翻譯導航 -->
        <nav class="main-nav">
          <ul>
            <li class="active">
              <i class="fa fa-language"></i> Voice Script Translation
            </li>
          </ul>
        </nav>
      </div>

      <!-- 主要內容區 -->
      <div class="main-content">
        <!-- 頂部標題 -->
        <header>
          <h1>
            <i class="fas fa-language"></i>
            Voice Script Translation System
          </h1>
          <p class="subtitle">Professional multi-language voice script translation with syllable matching and context preservation</p>
        </header>

        <!-- 翻譯主界面 -->
        <div class="translation-main">
          <!-- 語言選擇和設定區域 -->
          <div class="translation-controls">
            <div class="language-selector">
              <div class="language-group">
                <label>Source Language</label>
                <select v-model="sourceLanguage" class="language-select">
                  <option value="">Select source language</option>
                  <option
                    v-for="(lang, code) in supportedLanguages"
                    :key="code"
                    :value="code"
                  >
                    {{ lang.name }} ({{ lang.englishName }})
                  </option>
                </select>
              </div>

              <div class="swap-button" @click="swapLanguages">
                <i class="fas fa-exchange-alt"></i>
              </div>

              <div class="language-group">
                <label>Target Language</label>
                <select v-model="targetLanguage" class="language-select">
                  <option value="">Select target language</option>
                  <option
                    v-for="(lang, code) in supportedLanguages"
                    :key="code"
                    :value="code"
                    :disabled="code === sourceLanguage"
                  >
                    {{ lang.name }} ({{ lang.englishName }})
                  </option>
                </select>
              </div>
            </div>

            <div class="model-selector">
              <label>Translation Model</label>
              <select v-model="selectedModel" class="model-select">
                <option
                  v-for="(model, key) in supportedModels"
                  :key="key"
                  :value="key"
                >
                  {{ model.name }} - {{ model.description }}
                </option>
              </select>
            </div>
          </div>

          <!-- 翻譯輸入輸出區域 -->
          <div class="translation-workspace">
            <div class="input-section">
              <div class="section-header">
                <h3>
                  <i class="fas fa-edit"></i>
                  Original Text
                  <span v-if="sourceLanguage" class="language-tag">
                    {{ supportedLanguages[sourceLanguage]?.name }}
                  </span>
                </h3>
                <div class="input-controls">
                  <button @click="clearInput" class="control-btn clear-btn">
                    <i class="fas fa-eraser"></i> Clear
                  </button>
                  <button @click="pasteFromClipboard" class="control-btn paste-btn">
                    <i class="fas fa-paste"></i> Paste
                  </button>
                </div>
              </div>
              <textarea
                v-model="inputText"
                placeholder="Enter the voice script content to be translated..."
                class="translation-input"
                :disabled="isTranslating"
              ></textarea>
              <div class="input-stats">
                <span>Character count: {{ inputText.length }}</span>
                <span v-if="estimatedSyllables">
                  Estimated syllables: {{ estimatedSyllables }}
                </span>
              </div>
            </div>

            <div class="translation-action">
              <button
                @click="performTranslation"
                :disabled="!canTranslate || isTranslating"
                class="translate-btn"
              >
                <i
                  :class="isTranslating ? 'fas fa-spinner fa-spin' : 'fas fa-language'"
                ></i>
                {{ isTranslating ? 'Translating...' : 'Start Translation' }}
              </button>
            </div>

            <div class="output-section">
              <div class="section-header">
                <h3>
                  <i class="fas fa-file-alt"></i>
                  Translation Result
                  <span v-if="targetLanguage" class="language-tag">
                    {{ supportedLanguages[targetLanguage]?.name }}
                  </span>
                </h3>
                <div class="output-controls" v-if="translationResult">
                  <button @click="copyResult" class="control-btn copy-btn">
                    <i class="fas fa-copy"></i> Copy
                  </button>
                  <button @click="downloadResult" class="control-btn download-btn">
                    <i class="fas fa-download"></i> Download
                  </button>
                </div>
              </div>
              <textarea
                v-model="outputText"
                placeholder="Translation results will be displayed here..."
                class="translation-output"
                readonly
              ></textarea>
              <div class="output-stats" v-if="translationResult">
                <span>Translation length: {{ outputText.length }}</span>
                <span v-if="translationResult.syllableAnalysis && translationResult.syllableAnalysis.ratio">
                  Syllable ratio: {{ translationResult.syllableAnalysis.ratio.toFixed(2) }}
                </span>
                <span v-if="translationResult.translationQuality && translationResult.translationQuality.overallScore" class="quality-score">
                  Quality score: {{ translationResult.translationQuality.overallScore }}/100
                </span>
              </div>
            </div>
          </div>

          <!-- 錯誤提示 -->
          <div v-if="error" class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            {{ error }}
          </div>

          <!-- 成功提示 -->
          <div v-if="successMessage" class="success-message">
            <i class="fas fa-check-circle"></i>
            {{ successMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/authService'
import { translationService } from '@/services/translationService'

export default {
  name: 'TranslationPage',
  data() {
    return {
      // User information
      avatarUrl: null,
      
      // Supported languages and models
      supportedLanguages: {},
      supportedModels: {},
      
      // Translation settings
      sourceLanguage: '',
      targetLanguage: '',
      selectedModel: 'gemini-2.5-flash',
      
      // Translation content
      inputText: '',
      outputText: '',
      
      // Translation status
      isTranslating: false,
      translationResult: null,
      
      // Messages
      error: '',
      successMessage: '',
    }
  },
  
  computed: {
    username() {
      const user = authService.getUser()
      return user?.username || 'Loading...'
    },
    
    canTranslate() {
      return (
        this.inputText.trim() &&
        this.sourceLanguage &&
        this.targetLanguage &&
        this.sourceLanguage !== this.targetLanguage &&
        !this.isTranslating
      )
    },
    
    estimatedSyllables() {
      if (!this.inputText.trim() || !this.sourceLanguage) return null
      
      // Simple syllable estimation
      const text = this.inputText.trim()
      switch (this.sourceLanguage) {
        case 'zh-CN':
        case 'zh-HK':
          return text.replace(/[^\u4e00-\u9fff]/g, '').length
        case 'ja':
          return Math.ceil(text.length * 0.7)
        default:
          return Math.ceil(text.split(/\s+/).join('').length / 2)
      }
    }
  },
  
  async mounted() {
    await this.loadSupportedLanguages()
    await this.loadSupportedModels()
  },
  
  methods: {
    // Load supported languages
    async loadSupportedLanguages() {
      const result = await translationService.getSupportedLanguages()
      if (result.success) {
        this.supportedLanguages = result.languages
      } else {
        this.error = result.error
      }
    },
    
    // Load supported models
    async loadSupportedModels() {
      const result = await translationService.getSupportedModels()
      if (result.success) {
        this.supportedModels = result.models
      } else {
        this.error = result.error
      }
    },
    
    // Set language pair
    setLanguagePair(source, target) {
      this.sourceLanguage = source
      this.targetLanguage = target
      this.clearMessages()
    },
    
    // Swap languages
    swapLanguages() {
      if (this.sourceLanguage && this.targetLanguage) {
        const temp = this.sourceLanguage
        this.sourceLanguage = this.targetLanguage
        this.targetLanguage = temp
        
        // Swap text and handle line breaks
        const tempText = this.inputText
        this.inputText = this.outputText
        this.outputText = tempText
        
        this.clearMessages()
      }
    },
    
    // 執行翻譯
    async performTranslation() {
      if (!this.canTranslate) return
      
      this.isTranslating = true
      this.error = ''
      this.successMessage = ''
      this.translationResult = null
      
      try {
        const result = await translationService.translateVoiceScript({
          text: this.inputText,
          sourceLanguage: this.sourceLanguage,
          targetLanguage: this.targetLanguage,
          model: this.selectedModel
        })
        
        if (result.success) {
          this.translationResult = result.translation
          // Handle line breaks, convert \n to actual line breaks
          this.outputText = result.translation.translatedText.replace(/\\n/g, '\n')
          this.successMessage = 'Translation completed!'
          
          setTimeout(() => {
            this.successMessage = ''
          }, 3000)
        } else {
          this.error = result.error
        }
      } catch (error) {
        this.error = 'Translation error occurred, please try again'
        console.error('Translation error:', error)
      } finally {
        this.isTranslating = false
      }
    },
    
    // Clear input
    clearInput() {
      this.inputText = ''
      this.outputText = ''
      this.translationResult = null
      this.clearMessages()
    },
    
    // Paste from clipboard
    async pasteFromClipboard() {
      try {
        const text = await navigator.clipboard.readText()
        this.inputText = text
        this.clearMessages()
      } catch (error) {
        this.error = 'Unable to read from clipboard'
        console.error('Clipboard error:', error)
      }
    },
    
    // Copy result
    async copyResult() {
      try {
        // Ensure copied text has correct line break format
        const textToCopy = this.outputText.replace(/\\n/g, '\n')
        await navigator.clipboard.writeText(textToCopy)
        this.successMessage = 'Translation result copied to clipboard'
        setTimeout(() => {
          this.successMessage = ''
        }, 2000)
      } catch (error) {
        this.error = 'Copy failed'
        console.error('Copy error:', error)
      }
    },
    
    // Download result
    downloadResult() {
      if (!this.translationResult) return
      
      // Handle line breaks, ensure downloaded file has correct format
      const formattedInput = this.inputText.replace(/\\n/g, '\n')
      const formattedOutput = this.outputText.replace(/\\n/g, '\n')
      
      const content = `Original Text (${this.supportedLanguages[this.sourceLanguage]?.name}):\n${formattedInput}\n\nTranslation (${this.supportedLanguages[this.targetLanguage]?.name}):\n${formattedOutput}\n\nTranslation Model: ${this.supportedModels[this.selectedModel]?.name}\nTranslated At: ${new Date().toLocaleString()}`
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `translation_result_${new Date().toISOString().slice(0, 10)}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      this.successMessage = 'Translation result downloaded'
      setTimeout(() => {
        this.successMessage = ''
      }, 2000)
    },
    
    // 清除訊息
    clearMessages() {
      this.error = ''
      this.successMessage = ''
    },
    
    // 返回主頁
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style>
@import '@/assets/Translation.css';
</style>
