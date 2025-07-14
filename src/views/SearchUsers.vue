<template>
  <div class="user-search">
    <h1>User Search</h1>

    <div class="search-container">
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
        <div v-for="user in users" :key="user.username" class="user-item">
          <strong>{{ user.username }}</strong>
          <button @click="AddFriend(user.username)" class="action-button">Add Friend</button>
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
  <div class="friend-notifications">
    <h2>Friend Requests</h2>

    <div v-if="notifications.length > 0" class="notifications-list">
      <div v-for="notification in notifications" :key="notification.id" class="notification-item">
        <span class="notification-text">
          <strong>{{ notification.username }}</strong> added you as a friend
        </span>
        <button @click="addFriendBack(notification.userid, notification.username)" class="add-back-button">
          Add them too
        </button>
      </div>
    </div>

    <div v-else class="no-notifications">
      No pending friend requests
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import '@/assets/SearchUsers.css'
export default {
  name: 'UserSearch',
  data() {
    return {
      searchTerm: '',
      users: [],
      error: null,
      searchPerformed: false,
      searchTimeout: null,
      notifications: [],
    }
  },
  mounted() {
    this.loadNotifications();
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
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/friends/search-users?search=${encodeURIComponent(this.searchTerm)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
   async AddFriend(username) {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/friends/add-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ friendUsername: username })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Added ${username} as friend!`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      alert('Failed to send friend request');
    }
  },
  async loadNotifications() {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('/api/friends/notifications', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          this.notifications = data.notifications;
        } else {
          this.error = data.message || 'Failed to load notifications';
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        this.error = 'Network error';
      }
    },

    async addFriendBack(friendUserId, friendUsername) {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('/api/friends/add-friend-back', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ friendUserId: friendUserId })
        });

        const data = await response.json();

        if (data.success) {
          alert(`Added ${friendUsername} back as friend!`);
          // Remove this notification from the list
          this.notifications = this.notifications.filter(n => n.userid !== friendUserId);
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error adding friend back:', error);
        alert('Failed to add friend back');
      }
    }

  }

}
</script>
