<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';

const router = useRouter();
const users = ref([]);
const ragEngines = ref([]);
const loading = ref(true);
const error = ref('');
const activeTab = ref('dashboard'); // 'dashboard', 'users', 'rag', or 'links'

// Pagination State
const itemsPerPage = ref(10);
const userPage = ref(1);
const ragPage = ref(1);

// Search State
const userSearchQuery = ref('');
const ragSearchQuery = ref('');

// Computed Properties for Filtering and Pagination
const filteredUsers = computed(() => {
  if (!userSearchQuery.value) return users.value;
  const query = userSearchQuery.value.toLowerCase();
  return users.value.filter(user =>
    user.username.toLowerCase().includes(query)
  );
});

const paginatedUsers = computed(() => {
  const start = (userPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const totalUserPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));

const filteredRagEngines = computed(() => {
  if (!ragSearchQuery.value) return ragEngines.value;
  const query = ragSearchQuery.value.toLowerCase();
  return ragEngines.value.filter(rag =>
    rag.ragname.toLowerCase().includes(query)
  );
});

const paginatedRagEngines = computed(() => {
  const start = (ragPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredRagEngines.value.slice(start, end);
});

const totalRagPages = computed(() => Math.ceil(filteredRagEngines.value.length / itemsPerPage.value));

// Reset page when search query or itemsPerPage changes
import { watch } from 'vue';
watch([userSearchQuery, itemsPerPage], () => userPage.value = 1);
watch([ragSearchQuery, itemsPerPage], () => ragPage.value = 1);

// Modal State
const showModal = ref(false);
const modalMode = ref('add'); // 'add' or 'edit'
const currentItem = ref({}); // Holds the user or rag object being edited

// Form Data
const userForm = ref({
  username: '',
  password: ''
});

const ragForm = ref({
  ragname: '',
  visibility: 'Private',
  userid: '' // Admin needs to assign an owner
});

const API_URL = '/api/admin';

const token = authService.getToken();
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

onMounted(async () => {
  await fetchUsers();
  await fetchRagEngines();
});

const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, { headers });
    const data = await response.json();
    if (data.success) {
      users.value = data.users;
    } else {
      error.value = data.message;
    }
  } catch (err) {
    error.value = "Failed to load users";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchRagEngines = async () => {
  try {
    const response = await fetch(`${API_URL}/rag`, { headers });
    const data = await response.json();
    if (data.success) {
      ragEngines.value = data.engines;
    } else {
      console.error("Failed to load RAG engines:", data.message);
    }
  } catch (err) {
    console.error("Error loading RAG engines:", err);
  }
};

// --- User Actions ---
const openAddUserModal = () => {
  modalMode.value = 'add';
  userForm.value = { username: '', password: '' };
  showModal.value = true;
};

const openEditUserModal = (user) => {
  modalMode.value = 'edit';
  currentItem.value = user;
  userForm.value = { username: user.username, password: '' }; // Password empty for security
  showModal.value = true;
};

const deleteUser = async (userId) => {
  if (!confirm("Are you sure you want to delete this user?")) return;
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers
    });
    const data = await response.json();
    if (data.success) {
      fetchUsers();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Error deleting user");
  }
};

// --- RAG Actions ---
const openAddRagModal = () => {
  modalMode.value = 'add';
  ragForm.value = { ragname: '', visibility: 'Private', userid: '' };
  showModal.value = true;
};

const openEditRagModal = (rag) => {
  modalMode.value = 'edit';
  currentItem.value = rag;
  ragForm.value = { ragname: rag.ragname, visibility: rag.visibility, userid: rag.userid };
  showModal.value = true;
};

const deleteRag = async (ragId) => {
  if (!confirm("Are you sure you want to delete this RAG Engine?")) return;
  try {
    const response = await fetch(`${API_URL}/rag/${ragId}`, {
      method: 'DELETE',
      headers
    });
    const data = await response.json();
    if (data.success) {
      fetchRagEngines();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Error deleting RAG Engine");
  }
};

// --- Submit Handler ---
const handleSubmit = async () => {
  if (activeTab.value === 'users') {
    await handleUserSubmit();
  } else {
    await handleRagSubmit();
  }
};

const handleUserSubmit = async () => {
  const url = modalMode.value === 'add' ? `${API_URL}/users` : `${API_URL}/users/${currentItem.value.userid}`;
  const method = modalMode.value === 'add' ? 'POST' : 'PUT';

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(userForm.value)
    });
    const data = await response.json();
    if (data.success) {
      showModal.value = false;
      fetchUsers();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Operation failed");
  }
};

const handleRagSubmit = async () => {
  const url = modalMode.value === 'add' ? `${API_URL}/rag` : `${API_URL}/rag/${currentItem.value.ragid}`;
  const method = modalMode.value === 'add' ? 'POST' : 'PUT';

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(ragForm.value)
    });
    const data = await response.json();
    if (data.success) {
      showModal.value = false;
      fetchRagEngines();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Operation failed");
  }
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="admin-container">
    <div class="admin-dashboard">
      <header class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button @click="router.push('/')" class="back-btn">Back to Home</button>
      </header>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else class="content">
        <!-- Tabs -->
        <div class="tabs">
          <button
            :class="{ active: activeTab === 'dashboard' }"
            @click="activeTab = 'dashboard'"
          >
            Dashboard
          </button>
          <button
            :class="{ active: activeTab === 'users' }"
            @click="activeTab = 'users'"
          >
            User Management
          </button>
          <button
            :class="{ active: activeTab === 'rag' }"
            @click="activeTab = 'rag'"
          >
            RAG Engine Management
          </button>
          <button
            :class="{ active: activeTab === 'links' }"
            @click="activeTab = 'links'"
          >
            Useful Links
          </button>
        </div>

        <!-- Dashboard Overview Tab -->
        <div v-if="activeTab === 'dashboard'" class="tab-content">
          <div class="stats-grid">
            <div class="stat-card" @click="activeTab = 'users'">
              <h3>Total Users</h3>
              <p class="stat-number">{{ users.length }}</p>
              <p class="stat-label">Registered Accounts</p>
            </div>
            <div class="stat-card" @click="activeTab = 'rag'">
              <h3>Total RAG Engines</h3>
              <p class="stat-number">{{ ragEngines.length }}</p>
              <p class="stat-label">Active Knowledge Bases</p>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'" class="tab-content">
          <div class="actions-bar">
            <h2>Users List</h2>
            <div class="actions-right">
              <select v-model="itemsPerPage" class="items-per-page-select">
                <option :value="10">10 / page</option>
                <option :value="25">25 / page</option>
                <option :value="50">50 / page</option>
              </select>
              <input
                v-model="userSearchQuery"
                placeholder="Search users..."
                class="search-input"
              />
              <button @click="openAddUserModal" class="add-btn">Add New User</button>
            </div>
          </div>

          <table class="data-table">
            <colgroup>
              <col style="width: 20%">
              <col style="width: 30%">
              <col style="width: 25%">
              <col style="width: 25%">
            </colgroup>
            <thead>
              <tr>
                <th title="ID">ID</th>
                <th title="Username">Username</th>
                <th title="Created At">Created At</th>
                <th title="Actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.userid">
                <td class="truncate-cell" :title="user.userid">{{ user.userid }}</td>
                <td class="truncate-cell" :title="user.username">{{ user.username }}</td>
                <td :title="new Date(user.created_at).toLocaleDateString()">{{ new Date(user.created_at).toLocaleDateString() }}</td>
                <td class="actions-cell">
                  <button @click="openEditUserModal(user)" class="edit-btn">Edit</button>
                  <button @click="deleteUser(user.userid)" class="delete-btn">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- User Pagination Controls -->
          <div class="pagination" v-if="totalUserPages > 1">
            <button
              :disabled="userPage === 1"
              @click="userPage--"
              class="page-btn"
            >
              Previous
            </button>
            <span class="page-info">Page {{ userPage }} of {{ totalUserPages }}</span>
            <button
              :disabled="userPage === totalUserPages"
              @click="userPage++"
              class="page-btn"
            >
              Next
            </button>
          </div>
        </div>

        <!-- RAG Engines Tab -->
        <div v-if="activeTab === 'rag'" class="tab-content">
          <div class="actions-bar">
            <h2>RAG Engines List</h2>
            <div class="actions-right">
              <select v-model="itemsPerPage" class="items-per-page-select">
                <option :value="10">10 / page</option>
                <option :value="25">25 / page</option>
                <option :value="50">50 / page</option>
              </select>
              <input
                v-model="ragSearchQuery"
                placeholder="Search RAG engines..."
                class="search-input"
              />
              <button @click="openAddRagModal" class="add-btn">Add New RAG Engine</button>
            </div>
          </div>

          <table class="data-table">
            <colgroup>
              <col style="width: 15%">
              <col style="width: 20%">
              <col style="width: 20%">
              <col style="width: 15%">
              <col style="width: 15%">
              <col style="width: 15%">
            </colgroup>
            <thead>
              <tr>
                <th title="ID">ID</th>
                <th title="Name">Name</th>
                <th title="Owner">Owner</th>
                <th title="Visibility">Visibility</th>
                <th title="Created At">Created At</th>
                <th title="Actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rag in paginatedRagEngines" :key="rag.ragid">
                <td class="truncate-cell" :title="rag.ragid">{{ rag.ragid }}</td>
                <td class="truncate-cell" :title="rag.ragname">{{ rag.ragname }}</td>
                <td class="truncate-cell" :title="rag.username || rag.userid">{{ rag.username || rag.userid }}</td>
                <td class="truncate-cell" :title="rag.visibility">{{ rag.visibility }}</td>
                <td :title="new Date(rag.created_at).toLocaleDateString()">{{ new Date(rag.created_at).toLocaleDateString() }}</td>
                <td class="actions-cell">
                  <button @click="openEditRagModal(rag)" class="edit-btn">Edit</button>
                  <button @click="deleteRag(rag.ragid)" class="delete-btn">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- RAG Pagination Controls -->
          <div class="pagination" v-if="totalRagPages > 1">
            <button
              :disabled="ragPage === 1"
              @click="ragPage--"
              class="page-btn"
            >
              Previous
            </button>
            <span class="page-info">Page {{ ragPage }} of {{ totalRagPages }}</span>
            <button
              :disabled="ragPage === totalRagPages"
              @click="ragPage++"
              class="page-btn"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Useful Links Tab -->
        <div v-if="activeTab === 'links'" class="tab-content">
          <div class="links-container">
            <div class="info-box">
              <p><strong>Note:</strong> The admin account credentials for Google Cloud can be found in the system documentation, which details the system architecture and guidelines.</p>
            </div>

            <div class="links-grid">
              <div class="link-card">
                <h3>Google Cloud Platform</h3>
                <ul>
                  <li><a href="https://console.cloud.google.com/billing" target="_blank">Billing Management</a></li>
                  <li><a href="https://console.cloud.google.com/sql" target="_blank">Cloud SQL (Database)</a></li>
                  <li><a href="https://console.cloud.google.com/storage" target="_blank">Cloud Storage (Buckets)</a></li>
                  <li><a href="https://console.cloud.google.com/welcome" target="_blank">Console Dashboard</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h3>{{ modalMode === 'add' ? 'Add' : 'Edit' }} {{ activeTab === 'users' ? 'User' : 'RAG Engine' }}</h3>

          <form @submit.prevent="handleSubmit">
            <!-- User Form Fields -->
            <div v-if="activeTab === 'users'">
              <div class="form-group">
                <label>Username:</label>
                <input v-model="userForm.username" required />
              </div>
              <div class="form-group">
                <label>Password:</label>
                <input v-model="userForm.password" type="password" :placeholder="modalMode === 'edit' ? 'Leave blank to keep current' : ''" />
              </div>
            </div>

            <!-- RAG Form Fields -->
            <div v-if="activeTab === 'rag'">
              <div class="form-group">
                <label>RAG Name:</label>
                <input v-model="ragForm.ragname" required />
              </div>
              <div class="form-group">
                <label>Visibility:</label>
                <select v-model="ragForm.visibility">
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Friend">Friend</option>
                </select>
              </div>
              <div class="form-group" v-if="modalMode === 'add'">
                <label>Owner (User ID):</label>
                <select v-model="ragForm.userid" required>
                  <option disabled value="">Select a user</option>
                  <option v-for="u in users" :key="u.userid" :value="u.userid">
                    {{ u.username }} ({{ u.userid }})
                  </option>
                </select>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
              <button type="submit" class="save-btn">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  height: 100vh;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.admin-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: #333;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #eee;
}

.tabs button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  color: #666;
}

.tabs button.active {
  border-bottom-color: #4CAF50;
  color: #4CAF50;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.actions-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
}

.items-per-page-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  table-layout: fixed;
}

.data-table th, .data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.truncate-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.add-btn, .save-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn, .back-btn {
  background-color: #9e9e9e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1;
}

.badge.public { background-color: #e8f5e9; color: #2e7d32; }
.badge.private { background-color: #ffebee; color: #c62828; }
.badge.friend { background-color: #e3f2fd; color: #1565c0; }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  color: #333; /* Ensure text is visible */
}

.page-btn:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: #666;
}

.links-container {
  max-width: 800px;
  margin: 0 auto;
}

.info-box {
  background-color: #e3f2fd;
  border-left: 5px solid #2196F3;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 4px;
}

.info-box p {
  margin: 0;
  color: #0d47a1;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.link-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.link-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.link-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.stat-card h3 {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #2196F3;
  margin: 1rem 0;
}

.stat-label {
  color: #999;
  margin: 0;
  font-size: 0.9rem;
}

.link-card li {
  margin-bottom: 0.75rem;
}

.link-card a {
  color: #2196F3;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.link-card a:hover {
  text-decoration: underline;
}
</style>
