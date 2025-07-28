<!-- filepath: /Users/cc/Desktop/MotionExpert_MyVersion/lab-spa/src/views/SynopsisEditorPage.vue -->
<template>
  <div class="synopsis-editor-container">
    <!-- main-content-synopsis 現在是兩欄佈局的 flex 容器 -->
    <div class="main-content-synopsis">
      <!-- 左欄：表單 -->
      <div class="form-column">
        <header class="synopsis-header">
          <h1>Synopsis Editor</h1>
          <p>Craft your story structure and generate a cohesive synopsis.</p>
        </header>

        <div class="form-sections">
          <!-- 將 Act 1 和 Act 2 放置在同一行 -->
          <div class="row">
            <!-- Act 1: Setup -->
            <section class="act-section">
              <h2>Act 1: Setup</h2>
              <div class="input-group">
                <label for="openingScene">Opening Scene</label>
                <textarea id="openingScene" v-model="formData.act1.openingScene" placeholder="Describe the opening scene..."></textarea>
              </div>
              <div class="input-group">
                <label for="initiation">Initiation</label>
                <textarea id="initiation" v-model="formData.act1.initiation" placeholder="How does the story begin for the protagonist?"></textarea>
              </div>
            </section>

            <!-- Act 2: Confrontation and Barrier -->
            <section class="act-section">
              <h2>Act 2: Confrontation and Barrier</h2>
              <div class="input-group">
                <label for="processAndAchievements">Process and Achievements</label>
                <textarea id="processAndAchievements" v-model="formData.act2.processAndAchievements" placeholder="Detail the protagonist's journey and successes..."></textarea>
              </div>
              <div class="input-group">
                <label for="obstaclesAndChallenges">Obstacles and Challenges</label>
                <textarea id="obstaclesAndChallenges" v-model="formData.act2.obstaclesAndChallenges" placeholder="What hurdles does the protagonist face?"></textarea>
              </div>
            </section>
          </div>

          <!-- 將 Act 3A 和 Act 3B 放置在同一行 -->
          <div class="row">
            <!-- Act 3A: Climax -->
            <section class="act-section">
              <h2>Act 3A: Climax</h2>
              <div class="input-group">
                <label for="turningPointAndDiscovery">Turning Point and Discovery</label>
                <textarea id="turningPointAndDiscovery" v-model="formData.act3a.turningPointAndDiscovery" placeholder="What is the major turning point or discovery?"></textarea>
              </div>
              <div class="input-group">
                <label for="inmostCave">Inmost Cave</label>
                <textarea id="inmostCave" v-model="formData.act3a.inmostCave" placeholder="Describe the protagonist's lowest point or greatest challenge..."></textarea>
              </div>
            </section>

            <!-- Act 3B: Aftermath -->
            <section class="act-section">
              <h2>Act 3B: Aftermath</h2>
              <div class="input-group">
                <label for="finalBattle">Final Battle</label>
                <textarea id="finalBattle" v-model="formData.act3b.finalBattle" placeholder="Detail the final confrontation..."></textarea>
              </div>
              <div class="input-group">
                <label for="endingScene">Ending Scene</label>
                <textarea id="endingScene" v-model="formData.act3b.endingScene" placeholder="Describe the resolution and ending..."></textarea>
                <div class="checkbox-group">
                  <input type="checkbox" id="isAntiClimax" v-model="formData.act3b.isAntiClimax" />
                  <label for="isAntiClimax" class="checkbox-label">Anti-climax</label>
                </div>
              </div>
            </section>
          </div>

          <!-- Additional Details 獨自佔據一行 -->
          <div class="full-width">
            <!-- Other Details -->
            <section class="act-section">
              <h2>Additional Details</h2>
              <div class="input-group">
                <label for="themeAndMessage">Theme and Message</label>
                <textarea id="themeAndMessage" v-model="formData.themeAndMessage" placeholder="What is the core theme or message?"></textarea>
              </div>
              <div class="input-group">
                <label for="oneLiner">One-liner</label>
                <textarea id="oneLiner" v-model="formData.oneLiner" placeholder="Summarize the story in one sentence."></textarea>
              </div>
              <div class="input-group">
                <label for="periodOfScene">Period of Scene</label>
                <textarea id="periodOfScene" v-model="formData.periodOfScene" placeholder="e.g., Present day, 1950s, Distant future"></textarea>
              </div>
              <div class="input-group">
                <label for="teasingAction">Teasing Action</label>
                <textarea id="teasingAction" v-model="formData.teasingAction" placeholder="A hint of an exciting action sequence..."></textarea>
              </div>
              <div class="input-group">
                <label for="teasingDialogue">Teasing Dialogue</label>
                <textarea id="teasingDialogue" v-model="formData.teasingDialogue" placeholder="A memorable line of dialogue..."></textarea>
              </div>
            </section>
          </div>
        </div>

        <!-- RAG Engine 選擇 -->
        <div class="input-group">
          <label for="engineSelect">Choose RAG Engine：</label>
          <select id="engineSelect" v-model="selectedEngineId">
            <option v-for="engine in userEngines" :key="engine.id" :value="engine.id">
              {{ engine.displayName || engine.name || engine.ragName }}
            </option>
          </select>
        </div>
        <button @click="submitSynopsis" class="submit-btn synopsis-action-btn main-generate-btn">
          <i class="fas fa-cogs"></i> Generate
        </button>
      </div>

      <!-- 右欄：AI 互動 -->
      <div class="ai-column">
        <div class="ai-interaction-section">
          <h2 class="ai-title">AI Interaction</h2>
          <div class="ai-response-box">
            <!-- 將 pre 標籤改為支援 Markdown 的 div -->
            <div class="markdown-content" v-html="renderedAiResponse"></div>
          </div>
          <div class="follow-up-section">
            <label for="followUpPrompt">Follow-up Instructions:</label>
            <textarea id="followUpPrompt" v-model="followUpPrompt" placeholder="Enter further requirements or modifications for the AI..."></textarea>
            <button @click="sendFollowUp" class="submit-btn synopsis-action-btn">
              <i class="fas fa-paper-plane"></i> Send Follow-up
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';

export default {
  name: 'SynopsisEditorPage',
  data() {
    return {
      formData: {
        act1: { openingScene: '', initiation: '' },
        act2: { processAndAchievements: '', obstaclesAndChallenges: '' },
        act3a: { turningPointAndDiscovery: '', inmostCave: '' },
        act3b: { finalBattle: '', endingScene: '', isAntiClimax: false },
        additionalDetails: {
          logline: '',
          theme: '',
          targetAudience: '',
          comparableTitles: ''
        },
        periodOfScene: '',
        teasingAction: '',
        teasingDialogue: '',
      },
      generatedSynopsisString: '',
      aiResponse: 'AI response will appear here once you generate the synopsis.',
      followUpPrompt: '',
      selectedEngineId: '',
      userEngines: [],
    };
  },
  computed: {
    // 計算屬性來渲染 Markdown
    renderedAiResponse() {
      if (!this.aiResponse) {
        return '<p class="placeholder-text">AI response will appear here once you generate the synopsis.</p>';
      }

      // 配置 marked 選項
      marked.setOptions({
        breaks: true, // 支援換行
        gfm: true, // 支援 GitHub Flavored Markdown
      });

      return marked(this.aiResponse);
    }
  },
  mounted() {
    this.loadUserEngines();
  },
  methods: {
    // 提交劇情概要，合併輸入並呼叫後端 API
    async submitSynopsis() {
      let parts = [];
      parts.push("Act 1: Setup");
      parts.push(`  Opening Scene: ${this.formData.act1.openingScene || 'N/A'}`);
      parts.push(`  Initiation: ${this.formData.act1.initiation || 'N/A'}`);

      parts.push("\nAct 2: Confrontation and Barrier");
      parts.push(`  Process and Achievements: ${this.formData.act2.processAndAchievements || 'N/A'}`);
      parts.push(`  Obstacles and Challenges: ${this.formData.act2.obstaclesAndChallenges || 'N/A'}`);

      parts.push("\nAct 3A: Climax");
      parts.push(`  Turning Point and Discovery: ${this.formData.act3a.turningPointAndDiscovery || 'N/A'}`);
      parts.push(`  Inmost Cave: ${this.formData.act3a.inmostCave || 'N/A'}`);

      parts.push("\nAct 3B: Aftermath");
      parts.push(`  Final Battle: ${this.formData.act3b.finalBattle || 'N/A'}`);
      parts.push(`  Ending Scene: ${this.formData.act3b.endingScene || 'N/A'}`);
      if (this.formData.act3b.isAntiClimax) {
        parts.push("    (Anti-climax)");
      }

      parts.push("\nAdditional Details:");
      parts.push(`  Theme and Message: ${this.formData.themeAndMessage || 'N/A'}`);
      parts.push(`  One-liner: ${this.formData.oneLiner || 'N/A'}`);
      parts.push(`  Period of Scene: ${this.formData.periodOfScene || 'N/A'}`);
      parts.push(`  Teasing Action: ${this.formData.teasingAction || 'N/A'}`);
      parts.push(`  Teasing Dialogue: ${this.formData.teasingDialogue || 'N/A'}`);

      this.generatedSynopsisString = parts.join('\n');
      this.aiResponse = `Sending synopsis to backend...\n\n--- Generated String Sent to Backend ---\n${this.generatedSynopsisString}`;

      if (!this.selectedEngineId) {
        this.aiResponse = '請先選擇 RAG Engine';
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/msw-with-file/askai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            synopsisString: this.generatedSynopsisString,
            engineId: this.selectedEngineId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
        }

        const backendResponse = await response.json();
        this.aiResponse = `Backend Response: ${backendResponse.message}\n\nAI Processed Output (from backend):\n${backendResponse.aiProcessedOutput || 'No AI output received.'}`;

      } catch (error) {
        console.error('Error submitting synopsis to backend:', error);
        this.aiResponse = `Error submitting synopsis: ${error.message}. Check console for details.`;
      }
    },
    // 載入用戶 RAG engine 列表
    async loadUserEngines() {
      const token = localStorage.getItem('token');
      // 改用 authService.getUser() 取得 userId
      let userId = null;
      try {
        // 動態載入 authService
        const authService = (await import('@/services/authService')).authService;
        const user = authService.getUser();
        userId = user?.userid || user?.userId || null;
      // eslint-disable-next-line no-unused-vars

      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        userId = localStorage.getItem('userId');
      }
      console.log('userId:', userId, 'token:', token);
      if (!userId) return;
      const response = await fetch(`/api/rag/users/${userId}/engines`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('engine list response:', data);
      if (data.success) {
        this.userEngines = data.engines || [];
        if (this.userEngines.length > 0) {
          this.selectedEngineId = this.userEngines[0].id;
        }
      }
    },
    // 發送後續指令給 AI (此部分可以類似地修改為呼叫後端)
    async sendFollowUp() {
      if (!this.followUpPrompt.trim()) {
        alert('Please enter a follow-up prompt.');
        return;
      }
      const previousAIResponse = this.aiResponse;

      this.aiResponse = `${previousAIResponse}\n\n--- User Follow-up ---\n${this.followUpPrompt}\n\nSending follow-up to backend...`;
      const token = localStorage.getItem('token');
      try {
        // 假設有一個 /api/synopsis/follow-up 端點
        const response = await fetch('/api/synopsis/follow-up', { // 您需要在後端新增此路由
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            followUpString: this.followUpPrompt // 修改此处以匹配后端期望
            // 可以選擇性地傳送其他上下文，但後端目前只使用 followUpString
            // previousSynopsis: currentSynopsisContext,
            // previousAIResponse: previousAIResponse,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
        }
        const backendFollowUpResponse = await response.json();
        // 修改此處以讀取後端回傳的 aiProcessedOutput
        this.aiResponse = `Backend Follow-up Response:\n${backendFollowUpResponse.message}\n\nAI Processed Output (from backend):\n${backendFollowUpResponse.aiProcessedOutput || 'No AI output received.'}`;
        this.followUpPrompt = ''; // 清空輸入框
      } catch (error) {
        console.error('Error sending follow-up to backend:', error);
        this.aiResponse = `${this.aiResponse}\n\nError processing follow-up: ${error.message}.`;
      }
    },
    handleFileChange(event) {
      this.file = event.target.files[0] || null;
    },
  }
}
</script>

<style>
@import '@/assets/SynopsisEditorPage.css';
</style>
