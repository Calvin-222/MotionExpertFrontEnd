<template>
  <div class="home-container">
    <div class="container">
      <!-- 左側導航欄 -->
      <div class="sidebar">
        <!-- 用戶資訊 -->
        <!-- Replace the hardcoded user info section -->
        <div class="user-info">
          <div class="user-avatar">
            <i class="fa fa-user"></i>
          </div>
          <div class="user-details">

            <h3>{{username}}</h3>
            <button @click="logout" class="logout-btn">Logout</button>
            <br>
            <button @click="addfriends" class="logout-btn">Add friends</button>
          </div>
          <button @click="Notifcations" class="notification-btn">
            <svg class="icon" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <div class="badge">{{ notifications.length}} </div>

      </button>        </div>
        <!-- 主要導航 -->
        <nav class="main-nav">
          <ul>
            <li class="active"><i class="fa fa-home"></i> Home</li>
            <li><i class="fa fa-tasks"></i> Project Manager</li>
            <li><i class="fa fa-star"></i> Starred</li>
            <li><i class="fa fa-clock"></i> Recent</li>
          </ul>
        </nav>

        <!-- 專案列表 -->
        <div class="projects-nav">
          <h4>Project</h4>
          <ul>
            <li>
              <i class="fa fa-folder"></i> Spy Warriors
              <i class="fa fa-chevron-down"></i>
            </li>
            <li>
              <i class="fa fa-folder"></i> Dragon River Cross
              <i class="fa fa-chevron-down"></i>
            </li>
            <li>
              <i class="fa fa-folder"></i> Casino Fool
              <i class="fa fa-chevron-down"></i>
            </li>
            <li>
              <i class="fa fa-folder"></i> A Sudden Wealth
              <i class="fa fa-chevron-down"></i>
            </li>
            <li>
              <i class="fa fa-folder"></i> Laugh Die Ghost
              <i class="fa fa-chevron-down"></i>
            </li>
            <li>
              <i class="fa fa-folder"></i> Time Stealer
              <i class="fa fa-chevron-down"></i>
            </li>
            <li>
              <i class="fa fa-folder"></i> A Spring's Tale
              <i class="fa fa-chevron-down"></i>
            </li>
            <li>
              <i class="fa fa-folder"></i> Hot War 3
              <i class="fa fa-chevron-down"></i>
            </li>
            <li>
              <i class="fa fa-folder"></i> Election 3
              <i class="fa fa-chevron-down"></i>
            </li>
          </ul>
        </div>

        <!-- 底部功能區 -->
        <div class="sidebar-footer">
          <div class="search-box">
            <i class="fa fa-search"></i>
            <input type="text" placeholder="Search" />
            <span class="keyboard-shortcut">ctrl+f </span>
          </div>
          <ul class="footer-nav">
            <li><i class="fa fa-trash"></i> Trash</li>
            <li><i class="fa fa-cog"></i> Settings</li>
            <li><i class="fa fa-question-circle"></i> Help</li>
          </ul>
          <div class="company-info">
            <i class="fa fa-circle-user"></i>
            <span>Moneyball NC</span>
          </div>
        </div>
      </div>

      <!-- 主要內容區 -->
      <div class="main-content">
        <!-- 頂部標題 -->
        <header>
          <h1>Home</h1>
        </header>

        <!-- 功能模塊 -->
        <div class="feature-modules">
          <div class="module-row">
            <div class="module">
              <div class="module-icon red-bg">
                <i class="fas fa-film"></i>
              </div>
              <div class="module-name">Project Manager</div>
            </div>
            <div class="module">
              <div class="module-icon red-bg">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="module-name">Prediction Analyser</div>
            </div>
            <div class="module">
              <div class="module-icon red-bg">
                <i class="fas fa-money-bill-wave"></i>
              </div>
              <div class="module-name">Budget Manager</div>
            </div>
            <div class="module">
              <div class="module-icon red-bg">
                <i class="fas fa-users"></i>
              </div>
              <div class="module-name">Talent Manager</div>
            </div>
            <div class="module">
              <div class="module-icon red-bg">
                <i class="fas fa-tachometer-alt"></i>
              </div>
              <div class="module-name">Real-time<br />Performance</div>
            </div>
            <div class="module">
              <div class="module-icon red-bg">
                <i class="fas fa-puzzle-piece"></i>
              </div>
              <div class="module-name">Plugin Manager<br />and Store</div>
            </div>
          </div>
          <div class="module-row">
            <div class="module">
              <div class="module-icon red-bg">
                <i class="fas fa-eye"></i>
              </div>
              <div class="module-name">Project Overview</div>
            </div>
            <router-link to="/ragtest" class="module" style="text-decoration: none; color:inherit;">
                <div class="module-icon red-bg">
                  <i class="fas fa-cube"></i>
                </div>
              <div class="module-name">Rag trainer</div>
            </router-link>
            <router-link to="/synopsis-editor" class="module" style="text-decoration: none; color:inherit;">
                <div class="module-icon red-bg">
                  <i class="fas fa-cube"></i>
                </div>
              <div class="module-name">Synopsis Editor</div>
            </router-link>

            <div class="module">
              <div class="module-icon red-bg">
                <i class="fas fa-user-friends"></i>
              </div>
              <div class="module-name">Character Creator</div>
            </div>
            <div class="module">
              <div class="module-icon red-bg">
                <i class="fas fa-layer-group"></i>
              </div>
              <div class="module-name">Scene Outliner</div>
            </div>
            <div class="module">
              <div class="module-icon red-bg">
                <i class="fas fa-pen-fancy"></i>
              </div>
              <div class="module-name">Screenplay Editor</div>
            </div>
          </div>
        </div>

        <!-- 專案選項卡和專案卡片 -->
        <div class="projects-section">
          <div class="project-tabs">
            <button class="tab active" @click="activeTab = 'myProjects'">My Projects</button>
            <button class="tab" @click="activeTab = 'coworkProjects'">Co-work Projects</button>
          </div>

          <div class="project-carousel">
            <button class="carousel-nav prev" @click="prevPage" :disabled="currentPage === 0">
              <i class="fa fa-chevron-left"></i>
            </button>

            <div class="project-cards">
              <div
                v-for="(project, index) in projects"
                :key="index"
                class="project-card"
                :class="{ hidden: !isCardVisible(index) }"
              >
                <div class="card-poster">
                  <!-- 圖片位置 -->
                </div>
                <div class="card-status" :class="project.statusClass">{{ project.status }}</div>
                <div class="card-actions">
                  <button class="btn-open">Open</button>
                  <button class="btn-share">Share</button>
                </div>
                <div class="card-info">
                  <h3>{{ project.title }}</h3>
                  <p>{{ project.genre }}</p>
                  <p>{{ project.duration }}</p>
                  <div class="card-edited">
                    <span>Last Edited</span>
                    <span>{{ project.lastEdited }}</span>
                  </div>
                </div>
              </div>
            </div>

            <button class="carousel-nav next" @click="nextPage" :disabled="currentPage === totalPages - 1">
              <i class="fa fa-chevron-right"></i>
            </button>
          </div>

          <!-- 底部導航點 -->
          <div class="carousel-dots">
            <span
              v-for="(page, index) in totalPages"
              :key="index"
              class="dot"
              :class="{ active: index === currentPage }"
              @click="goToPage(index)"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/authService'
// eslint-disable-next-line no-unused-vars
import { RouterLink } from 'vue-router'
export default {
  name: 'HomePage',
  data() {
    return {
      activeTab: 'myProjects',
      currentPage: 0,
      cardsPerPage: 6,
      currentUser: {},
      notifications: [],
      projects: [
        {
          title: 'Casino Fool',
          genre: 'Action, Comedy',
          duration: '120 Minutes',
          status: 'Scheduled for Release',
          statusClass: 'green',
          lastEdited: 'Yesterday'
        },
        {
          title: 'A Sudden Wealth',
          genre: 'Comedy, Family',
          duration: '96 Minutes',
          status: 'Scheduled for Release',
          statusClass: 'green',
          lastEdited: '16 Minutes Ago'
        },
        {
          title: 'Laugh Die Ghost',
          genre: 'Comedy, Horror',
          duration: '109 Minutes',
          status: 'Scheduled for Release',
          statusClass: 'green',
          lastEdited: '27 November 2024'
        },
        {
          title: 'Time Stealer',
          genre: 'Family, Romance',
          duration: '113 Minutes',
          status: 'Post-Production',
          statusClass: 'yellow',
          lastEdited: '13 November 2024'
        },
        {
          title: "A Spring's Tale",
          genre: 'Romance, Drama',
          duration: '101 Minutes',
          status: 'Shooting',
          statusClass: 'yellow',
          lastEdited: '4 November 2024'
        },
        {
          title: 'Hot War 3',
          genre: 'Action, Crime',
          duration: '130 Minutes',
          status: 'Project On-hold',
          statusClass: 'red',
          lastEdited: '31 August 2019'
        },
        {
          title: 'Test Project',
          genre: 'Test Genre',
          duration: '90 Minutes',
          status: 'Scheduled for Release',
          statusClass: 'green'
        }
        ,
        {
          title: 'Test Project',
          genre: 'Test Genre',
          duration: '90 Minutes',
          status: 'Scheduled for Release',
          statusClass: 'green'
        },
        {
          title: 'Test Project',
          genre: 'Test Genre',
          duration: '90 Minutes',
          status: 'Scheduled for Release',
          statusClass: 'green'
        },
        {
          title: 'Test Project',
          genre: 'Test Genre',
          duration: '90 Minutes',
          status: 'Scheduled for Release',
          statusClass: 'green'
        },
        {
          title: 'Test Project',
          genre: 'Test Genre',
          duration: '90 Minutes',
          status: 'Scheduled for Release',
          statusClass: 'green'
        },
        {
          title: 'Test Project',
          genre: 'Test Genre',
          duration: '90 Minutes',
          status: 'Scheduled for Release',
          statusClass: 'green'
        },
        {
          title: 'Test Project',
          genre: 'Test Genre',
          duration: '90 Minutes',
          status: 'Scheduled for Release',
          statusClass: 'green'
        },
        {
          title: 'Test Project',
          genre: 'Test Genre',
          duration: '90 Minutes',
          status: 'Scheduled for Release',
          statusClass: 'green'
        }
      ]
    }
  },


  computed: {
    totalPages() {
      return Math.ceil(this.projects.length / this.cardsPerPage)
    },
    username() {
    const user = authService.getUser()
    return user?.username || 'Loading...'
  },
    userid(){
      const user = authService.getUser()
      return user?.userid || 'Loading...'
    }
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
    isCardVisible(index) {
      const startIndex = this.currentPage * this.cardsPerPage
      const endIndex = startIndex + this.cardsPerPage
      return index >= startIndex && index < endIndex
    },
    goToSynopsisEditor() {
      console.log('Clicked!');
      this.$router.push('/synopsis-editor');
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
      }
    },
    goToPage(pageIndex) {
      this.currentPage = pageIndex
    },
    logout() {
      authService.logout()
      this.$router.push('/login')
    },
    addfriends() {
      this.$router.push('/search-users') // Redirect to the search users page
    },
    Notifcations() {
      this.$router.push('/notifcations') // Redirect to the notifications page
    }
  },
  mounted() { // Combine both mounted functions
     this.loadNotifications();

    // Your existing keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && this.currentPage > 0) {
        this.prevPage()
      } else if (e.key === 'ArrowRight' && this.currentPage < this.totalPages - 1) {
        this.nextPage()
      }
    })
  },
}
</script>

<style>
@import '@/assets/HomePage.css';
</style>
