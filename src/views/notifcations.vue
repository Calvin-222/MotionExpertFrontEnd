<template>
  <div>
    <!-- Only show Friend Requests section if there are notifications -->
    <div v-if="notifications.length > 0" class="friend-notifications">
      <h2>Friend Requests</h2>
      <div class="notifications-list">
        <div v-for="notification in notifications" :key="notification.id" class="notification-item">
          <span class="notification-text">
            <strong>{{ notification.username }}</strong> added you as a friend
          </span>
          <button @click="addFriendBack(notification.userid, notification.username)" class="add-back-button">
            Add them too
          </button>
        </div>
      </div>
    </div>

    <!-- Show this when there are no notifications -->
    <div v-else class="no-notifications-at-all">
      <h2>Notifications</h2>
      <p>You have no notifications</p>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import '@/assets/notifcations.css'
export default {
  name: 'UserSearch',
  data() {
    return {
      users: [],
      error: null,
      notifications: [],
    }
  },
  mounted() {
    this.loadNotifications();
  },
  methods: {
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
