<template>
  <div class="template-editor-overlay" @click.self="$emit('close')">
    <div class="template-editor">
      <div class="editor-header">
        <h2>{{ editMode ? '編輯模板' : '創建新模板' }}</h2>
        <button class="close-btn" @click="$emit('close')" type="button">×</button>
      </div>

      <div class="editor-content">
        <!-- 模板名稱 -->
        <div class="field-group">
          <label>模板名稱</label>
          <input
            v-model="localTemplate.templateName"
            type="text"
            placeholder="輸入模板名稱..."
          />
        </div>

        <!-- 設為預設模板 -->
        <div class="field-group checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="localTemplate.is_default"
              type="checkbox"
            />
            設為預設模板
          </label>
        </div>

        <!-- 區段編輯器 -->
        <div class="sections-editor">
          <div class="sections-header">
            <h3>模板區段 (H2 標題)</h3>
            <button @click="addSection" class="btn-add-section" type="button">
              + 新增區段
            </button>
          </div>

          <div class="sections-list">
            <div
              v-for="(section, sectionIndex) in localTemplate.sections"
              :key="section.id"
              class="section-editor"
            >
              <div class="section-header">
                <div class="section-title-group">
                  <label>區段標題 (H2):</label>
                  <input
                    v-model="section.title"
                    class="section-title-input"
                    placeholder="例如：Act 1: Setup"
                  />
                </div>
                <div class="section-controls">
                  <label>佈局:</label>
                  <select v-model="section.layoutClass" class="layout-select">
                    <option value="half-width">半寬（並排）</option>
                    <option value="full-width">全寬（單行）</option>
                  </select>
                  <button
                    @click="moveSection(sectionIndex, 'up')"
                    :disabled="sectionIndex === 0"
                    class="btn-move"
                    type="button">
                    ↑
                  </button>
                  <button
                    @click="moveSection(sectionIndex, 'down')"
                    :disabled="sectionIndex === localTemplate.sections.length - 1"
                    class="btn-move"
                    type="button">
                    ↓
                  </button>
                  <button
                    @click="removeSection(sectionIndex)"
                    :disabled="localTemplate.sections.length <= 1"
                    class="btn-remove"
                    type="button">
                    刪除區段
                  </button>
                </div>
              </div>

              <!-- 欄位編輯器 -->
              <div class="fields-editor">
                <div class="fields-header">
                  <h4>欄位 (Labels & Inputs)</h4>
                  <button
                    @click="addField(sectionIndex)"
                    class="btn-add-field"
                    type="button">
                    + 新增欄位
                  </button>
                </div>

                <div class="fields-list">
                  <div
                    v-for="(field, fieldIndex) in section.fields"
                    :key="field.id"
                    class="field-editor"
                  >
                    <div class="field-controls-row">
                      <div class="field-label-group">
                        <label>欄位標籤 (Label):</label>
                        <input
                          v-model="field.label"
                          class="field-label-input"
                          placeholder="例如：Opening Scene"
                        />
                      </div>

                      <div class="field-type-group">
                        <label>輸入類型:</label>
                        <select v-model="field.type" @change="handleFieldTypeChange(field)" class="field-type-select">
                          <option value="textarea">多行文字框</option>
                          <option value="text">單行文字框</option>
                          <option value="checkbox">勾選框</option>
                          <option value="select">下拉選單</option>
                        </select>
                      </div>
                    </div>

                    <div class="field-settings">
                      <div class="field-placeholder-group">
                        <label>提示文字 (Placeholder):</label>
                        <input
                          v-model="field.placeholder"
                          class="field-placeholder-input"
                          placeholder="例如：Describe the opening scene..."
                        />
                      </div>

                      <!-- 下拉選單選項設置 -->
                      <div v-if="field.type === 'select'" class="select-options">
                        <label>選項 (每行一個):</label>
                        <textarea
                          v-model="field.optionsText"
                          @input="updateFieldOptionsFromText(field)"
                          placeholder="選項1&#10;選項2&#10;選項3"
                          rows="4"
                          cols="50"
                        ></textarea>
                      </div>

                      <div class="field-actions">
                        <label class="required-checkbox">
                          <input
                            v-model="field.required"
                            type="checkbox"
                          />
                          必填欄位
                        </label>

                        <div class="field-move-buttons">
                          <button
                            @click="moveField(sectionIndex, fieldIndex, 'up')"
                            :disabled="fieldIndex === 0"
                            class="btn-move-field"
                            type="button">
                            ↑
                          </button>
                          <button
                            @click="moveField(sectionIndex, fieldIndex, 'down')"
                            :disabled="fieldIndex === section.fields.length - 1"
                            class="btn-move-field"
                            type="button">
                            ↓
                          </button>
                        </div>

                        <button
                          @click="removeField(sectionIndex, fieldIndex)"
                          :disabled="section.fields.length <= 1"
                          class="btn-remove-field"
                          type="button">
                          刪除欄位
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="editor-footer">
        <button @click="$emit('close')" class="btn-cancel" type="button">
          取消
        </button>
        <button 
          v-if="editMode" 
          @click="deleteTemplate" 
          class="btn-delete" 
          type="button">
          刪除模板
        </button>
        <button @click="saveTemplate" class="btn-save" type="button">
          {{ editMode ? '更新模板' : '創建模板' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemplateEditor',
  props: {
    template: {
      type: Object,
      default: () => ({
        id: null,
        templateName: '',
        sections: [],
        is_default: false
      })
    }
  },
  data() {
    return {
      localTemplate: {
        id: null,
        templateName: '',
        sections: [],
        is_default: false
      }
    };
  },
  computed: {
    editMode() {
      return this.localTemplate && this.localTemplate.id && this.localTemplate.id !== null;
    }
  },
  watch: {
    template: {
      immediate: true,
      deep: true,
      handler(newTemplate) {
        console.log('TemplateEditor received template:', newTemplate);

        if (newTemplate) {
          // 深度拷貝模板數據
          this.localTemplate = JSON.parse(JSON.stringify(newTemplate));

          // 確保每個區段都有必要的屬性
          this.localTemplate.sections = this.localTemplate.sections || [];

          this.localTemplate.sections.forEach((section, index) => {
            section.id = section.id || `section_${Date.now()}_${index}`;
            section.order = section.order || index + 1;
            section.layoutClass = section.layoutClass || 'full-width';
            section.fields = section.fields || [];

            section.fields.forEach((field, fieldIndex) => {
              field.id = field.id || `field_${Date.now()}_${fieldIndex}`;
              field.order = field.order || fieldIndex + 1;
              field.required = field.required || false;
              field.placeholder = field.placeholder || '';

              // 為 select 類型確保有 options 屬性和 optionsText
              if (field.type === 'select') {
                field.options = field.options || [];
                // 初始化 optionsText 用於 textarea 綁定
                field.optionsText = field.optionsText || (field.options ? field.options.join('\n') : '');
              }
            });
          });

          // 確保模板名稱存在
          if (!this.localTemplate.templateName) {
            this.localTemplate.templateName = 'Unnamed Template';
          }

          console.log('Processed localTemplate:', this.localTemplate);
        } else {
          // 如果沒有傳入模板，創建空的結構
          this.localTemplate = {
            id: null,
            templateName: '',
            sections: [],
            is_default: false
          };
        }
      }
    }
  },
  methods: {
    // 新增區段
    addSection() {
      const newSection = {
        id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'section',
        title: '新區段',
        order: this.localTemplate.sections.length + 1,
        layoutClass: 'full-width',
        fields: [
          {
            id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'textarea',
            label: '新欄位',
            placeholder: '輸入內容...',
            required: false,
            order: 1
          }
        ]
      };
      this.localTemplate.sections.push(newSection);
    },

    // 刪除區段
    removeSection(sectionIndex) {
      if (this.localTemplate.sections.length > 1) {
        this.localTemplate.sections.splice(sectionIndex, 1);
        this.updateSectionOrders();
      }
    },

    // 移動區段位置
    moveSection(sectionIndex, direction) {
      const sections = this.localTemplate.sections;
      if (direction === 'up' && sectionIndex > 0) {
        [sections[sectionIndex], sections[sectionIndex - 1]] = [sections[sectionIndex - 1], sections[sectionIndex]];
      } else if (direction === 'down' && sectionIndex < sections.length - 1) {
        [sections[sectionIndex], sections[sectionIndex + 1]] = [sections[sectionIndex + 1], sections[sectionIndex]];
      }
      this.updateSectionOrders();
    },

    // 新增欄位
    addField(sectionIndex) {
      const section = this.localTemplate.sections[sectionIndex];
      const newField = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'textarea',
        label: '新欄位',
        placeholder: '輸入內容...',
        required: false,
        order: section.fields.length + 1,
        options: [],
        optionsText: ''
      };
      section.fields.push(newField);
    },

    // 刪除欄位
    removeField(sectionIndex, fieldIndex) {
      const section = this.localTemplate.sections[sectionIndex];
      if (section.fields.length > 1) {
        section.fields.splice(fieldIndex, 1);
        this.updateFieldOrders(section);
      }
    },

    // 移動欄位位置
    moveField(sectionIndex, fieldIndex, direction) {
      const fields = this.localTemplate.sections[sectionIndex].fields;
      if (direction === 'up' && fieldIndex > 0) {
        [fields[fieldIndex], fields[fieldIndex - 1]] = [fields[fieldIndex - 1], fields[fieldIndex]];
      } else if (direction === 'down' && fieldIndex < fields.length - 1) {
        [fields[fieldIndex], fields[fieldIndex + 1]] = [fields[fieldIndex + 1], fields[fieldIndex]];
      }
      this.updateFieldOrders(this.localTemplate.sections[sectionIndex]);
    },

    // 更新區段順序
    updateSectionOrders() {
      this.localTemplate.sections.forEach((section, index) => {
        section.order = index + 1;
      });
    },

    // 更新欄位順序
    updateFieldOrders(section) {
      section.fields.forEach((field, index) => {
        field.order = index + 1;
      });
    },

    // 獲取下拉選單選項文字
    getOptionsText(field) {
      if (field.options && Array.isArray(field.options)) {
        return field.options.join('\n');
      }
      return '';
    },

    // 更新下拉選單選項
    updateFieldOptions(field, optionsText) {
      // 按換行符分割，過濾空行但保留有內容的行
      const options = optionsText
        .split('\n')
        .map(option => option.trim())
        .filter(option => option.length > 0);

      field.options = options;
      console.log('Updated field options:', field.options);
    },

    // 新方法：從 optionsText 更新選項
    updateFieldOptionsFromText(field) {
      if (field.optionsText) {
        const options = field.optionsText
          .split('\n')
          .map(option => option.trim())
          .filter(option => option.length > 0);

        field.options = options;
        console.log('Updated field options from text:', field.options);
      } else {
        field.options = [];
      }
    },

    // 處理欄位類型變更
    handleFieldTypeChange(field) {
      if (field.type === 'select') {
        // 當變更為下拉選單時，初始化相關屬性
        field.options = field.options || [];
        field.optionsText = field.optionsText || '';
      }
    },

    // 保存模板
    saveTemplate() {
      // 驗證模板
      if (!this.localTemplate.templateName.trim()) {
        alert('請輸入模板名稱');
        return;
      }

      if (this.localTemplate.sections.length === 0) {
        alert('模板至少需要一個區段');
        return;
      }

      // 檢查所有區段都有標題和欄位
      for (const section of this.localTemplate.sections) {
        if (!section.title.trim()) {
          alert('所有區段都需要標題');
          return;
        }
        if (section.fields.length === 0) {
          alert('所有區段都至少需要一個欄位');
          return;
        }
        for (const field of section.fields) {
          if (!field.label.trim()) {
            alert('所有欄位都需要標籤');
            return;
          }
        }
      }

      // 更新順序
      this.updateSectionOrders();
      this.localTemplate.sections.forEach(section => {
        this.updateFieldOrders(section);
      });

      // 發射保存事件
      this.$emit('save', this.localTemplate);
    },

    // 刪除模板
    async deleteTemplate() {
      if (!this.localTemplate.id) {
        alert('無法刪除：模板ID不存在');
        return;
      }

      // 確認對話框
      const confirmDelete = confirm(`確定要刪除模板「${this.localTemplate.templateName}」嗎？此操作無法復原。`);
      if (!confirmDelete) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`/api/templates/${this.localTemplate.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();
        console.log('Delete result:', result);

        if (response.ok && result.success) {
          alert('模板刪除成功！');
          // 發射刪除事件，讓父組件知道模板已被刪除
          this.$emit('delete', this.localTemplate.id);
          this.$emit('close');
        } else {
          throw new Error(result.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        alert(`刪除模板失敗: ${error.message}`);
      }
    }
  }
};
</script>

<style scoped>
.template-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.template-editor {
  background: white;
  border-radius: 12px;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  width: 100%;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.editor-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #e0e0e0;
  color: #666;
}

.editor-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.field-group {
  margin-bottom: 20px;
}

.field-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.field-group input,
.field-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.field-group input:focus,
.field-group select:focus {
  outline: none;
  border-color: #4CAF50;
}

.checkbox-group {
  margin-bottom: 25px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-weight: normal !important;
  margin-bottom: 0 !important;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto !important;
  margin-right: 10px;
  transform: scale(1.2);
}

.sections-editor {
  margin-top: 30px;
}

.sections-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #4CAF50;
}

.sections-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.btn-add-section {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-section:hover {
  background-color: #45a049;
  transform: translateY(-1px);
}

.section-editor {
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-header {
  margin-bottom: 20px;
}

.section-title-group {
  margin-bottom: 15px;
}

.section-title-group label {
  font-size: 16px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
}

.section-title-input {
  font-size: 16px;
  font-weight: 600;
  border: 2px solid #4CAF50;
}

.section-controls {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.section-controls label {
  font-weight: 600;
  color: #495057;
  margin: 0;
}

.layout-select {
  min-width: 120px;
  padding: 6px 10px;
  font-size: 13px;
}

.btn-move, .btn-remove {
  padding: 6px 10px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-move {
  background-color: #2196F3;
  color: white;
}

.btn-move:hover:not(:disabled) {
  background-color: #1976D2;
}

.btn-remove {
  background-color: #dc3545;
  color: white;
}

.btn-remove:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-move:disabled, .btn-remove:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.fields-editor {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #dee2e6;
}

.fields-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.fields-header h4 {
  margin: 0;
  color: #495057;
  font-size: 16px;
  font-weight: 600;
}

.btn-add-field {
  background-color: #17a2b8;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-field:hover {
  background-color: #138496;
}

.field-editor {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.field-controls-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.field-label-group, .field-type-group {
  flex: 1;
}

.field-label-group label, .field-type-group label {
  font-size: 13px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 5px;
}

.field-label-input {
  border: 2px solid #17a2b8;
  font-weight: 600;
}

.field-type-select {
  font-size: 13px;
}

.field-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.field-placeholder-group {
  flex: 1;
}

.field-placeholder-group label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 5px;
}

.field-placeholder-input {
  font-size: 13px;
}

.select-options {
  margin: 10px 0;
}

.select-options label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 5px;
}

.select-options textarea {
  width: 100%;
  resize: vertical;
  min-height: 100px;
  max-height: 200px;
  font-size: 13px;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  box-sizing: border-box;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-y: auto;
}

.select-options textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.field-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.required-checkbox {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
}

.required-checkbox input[type="checkbox"] {
  width: auto !important;
  margin-right: 8px;
  transform: scale(1.1);
}

.field-move-buttons {
  display: flex;
  gap: 5px;
}

.btn-move-field, .btn-remove-field {
  padding: 4px 8px;
  font-size: 11px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-move-field {
  background-color: #6c757d;
  color: white;
}

.btn-move-field:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-remove-field {
  background-color: #dc3545;
  color: white;
}

.btn-remove-field:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-move-field:disabled, .btn-remove-field:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.editor-footer {
  padding: 20px 30px;
  border-top: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  border-radius: 0 0 12px 12px;
}

.btn-cancel, .btn-save, .btn-delete {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

.btn-save {
  background-color: #4CAF50;
  color: white;
}

.btn-save:hover {
  background-color: #45a049;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .template-editor-overlay {
    padding: 10px;
  }

  .template-editor {
    max-height: 95vh;
  }

  .editor-header,
  .editor-content,
  .editor-footer {
    padding: 20px;
  }

  .field-controls-row {
    flex-direction: column;
  }

  .section-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .field-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .editor-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save,
  .btn-delete {
    width: 100%;
  }
}
</style>
