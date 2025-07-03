<template>
  <div class="user-search-container">
    <h1>User Search</h1>

    <div class="search-box">
      <input
        v-model="searchTerm"
        @input="handleSearch"
        type="text"
        placeholder="Search by username..."
        class="search-input"
      />
    </div>

    <div class="results" v-if="users.length > 0">
      <p>Found {{ users.length }} user(s)</p>
      <div class="users-list">
        <div v-for="user in users" :key="user.userid" class="user-item">
          <strong>{{ user.username }}</strong>
          <span class="user-id">{{ user.userid }}</span>
          <span class="user-date">{{ formatDate(user.created_at) }}</span>
        </div>
      </div>
    </div>

    <div v-if="searchPerformed && users.length === 0" class="no-results">
      No users found
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSearch',
  data() {
    return {
      searchTerm: '',
      users: [],
      error: null,
      searchPerformed: false,
      searchTimeout: null
    }
  },
  methods: {
    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        this.searchUsers();
      }, 300);
    },

    async searchUsers() {
    this.error = null;
    this.searchPerformed = true;

    try {
      const response = await fetch(`/api/add-friends?search=${encodeURIComponent(this.searchTerm)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        this.users = data.users;
      } else {
        this.error = data.message || 'Search failed';
        this.users = [];
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      this.error = 'Network error';
      this.users = [];
    }
  },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    }
  }
}
</script>
