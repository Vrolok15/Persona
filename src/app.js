// Import Vue
import { createApp } from 'vue';

// Certificate Card Component
const CertificateCard = {
    props: {
        certificate: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class="certificate-tile tile">
            <div class="certificate-image">
                <img :src="certificate.ImageUrl" :alt="certificate.Title" class="certificate-img">
            </div>
            <h3 class="certificate-title">{{ certificate.Title }}</h3>
            <p class="certificate-description">{{ certificate.Description }}</p>
            <h3>Completed projects</h3>
            <ul>
                <li v-for="project in certificate.CompletedProjects" :key="project">{{ project }}</li>
            </ul>
            <div class="certificate-links">
                <a :href="certificate.CertificateUrl" class="certificate-link" target="_blank">
                    <i class="fas fa-certificate"></i> View Certificate
                </a>
            </div>
        </div>
    `
};

// Project Card Component
const ProjectCard = {
    props: {
        project: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class="project-tile tile">
            <div class="project-image">
                <svg class="framework-icon" viewBox="0 0 100 100">
                    <use :href="project.Logo"/>
                </svg>
            </div>
            <h3 class="project-title">{{ project.Title }}</h3>
            <p class="project-tech">{{ project.Description }}</p>
            <div class="project-links">
                <a :href="project.ProjectUrl" class="project-link" target="_blank">
                    <i class="fab fa-github"></i> GitHub
                </a>
                <a :href="project.LiveUrl" class="project-link" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
            </div>
        </div>
    `
};

// Game Card Component
const GameCard = {
    props: {
        game: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class="project-tile game-tile tile">
            <div class="project-image game-image">
                <img :src="game.ImageUrl" :alt="game.Title" class="game-img">
            </div>
            <h3 class="project-title">{{ game.Title }}</h3>
            <p class="project-tech">{{ game.Description }}</p>
            <div class="project-links">
                <a :href="game.GameUrl" target="_blank" class="project-link">
                    <i class="fas fa-gamepad"></i> Play Game
                </a>
            </div>
        </div>
    `
};

// Video Card Component
const VideoCard = {
    props: {
        video: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class="project-tile tile">
            <div class="video-container">
                <iframe 
                    :src="video.VideoUrl.replace('watch?v=', 'embed/')" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
            <div class="video-content">
                <h3 class="video-title">{{ video.Title }}</h3>
                <p class="video-description">{{ video.Description }}</p>
            </div>
        </div>
    `
};

// Footer Component
const Footer = {
    data() {
        return {
            currentYear: new Date().getFullYear()
        }
    },
    template: `
        <footer>
            <p class="footer-text">&copy; {{ currentYear }} Nikita Kurguzov. All rights reserved.</p>
            <p class="footer-text">Made with <a href="https://vuejs.org/" target="_blank">Vue.js</a></p>
        </footer>
    `
};

// Tech Stack Component
const TechStack = {
    data() {
        return {
            techStack: ['JavaScript', 'TypeScript', 'Vue', 'React', 'Next.js', 'Phaser', 'SharePoint'],
            currentText: '',
            currentIndex: 0,
            techIndex: 0
        }
    },
    mounted() {
        this.typeLetter();
    },
    methods: {
        typeLetter() {
            const currentTech = this.techStack[this.techIndex];
            
            if (this.currentIndex < currentTech.length) {
                // Add next letter
                this.currentText = currentTech.substring(0, this.currentIndex + 1);
                this.currentIndex++;
                setTimeout(() => this.typeLetter(), 100);
            } else {
                // Finished typing current tech, wait and then clear for next tech
                setTimeout(() => {
                    this.backspace();
                }, 1500);
            }
        },
        backspace() {
            if (this.currentText.length > 0) {
                this.currentText = this.currentText.slice(0, -1);
                setTimeout(() => this.backspace(), 50);
            } else {
                // Move to next tech
                this.techIndex = (this.techIndex + 1) % this.techStack.length;
                this.currentIndex = 0;
                setTimeout(() => this.typeLetter(), 500);
            }
        }
    },
    template: `
        <p class="tech-stack">{{ currentText }}</p>
    `
};

// Main App
const app = createApp({
    components: {
        CertificateCard,
        ProjectCard,
        GameCard,
        VideoCard,
        Footer,
        TechStack
    },
    data() {
        return {
            certificates: [],
            projects: [],
            games: [],
            videos: [],
            loading: true,
            error: null,
            isWelcomeVisible: true
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
        this.loadData();
    },
    updated() {
        this.setupSmoothScroll();
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            const scrollPosition = window.scrollY;
            this.isWelcomeVisible = scrollPosition < 100;
        },
        setupSmoothScroll() {
            const navbarHeight = 60; // Height of the fixed navbar
            
            const links = document.querySelectorAll('a[href^="#"]');
            
            links.forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const targetId = anchor.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const elementPosition = targetElement.offsetTop;
                        const offsetPosition = elementPosition - navbarHeight;
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },
        async loadData() {
            try {
                const [certificatesRes, projectsRes, gamesRes, videosRes] = await Promise.all([
                    fetch('data/Certificates.json'),
                    fetch('data/Projects.json'),
                    fetch('data/Games.json'),
                    fetch('data/Videos.json')
                ]);

                if (!certificatesRes.ok || !projectsRes.ok || !gamesRes.ok || !videosRes.ok) {
                    throw new Error('Failed to load data');
                }

                this.certificates = await certificatesRes.json();
                this.projects = await projectsRes.json();
                this.games = await gamesRes.json();
                this.videos = await videosRes.json();
            } catch (error) {
                console.error('Error loading data:', error);
                this.error = 'Failed to load portfolio data. Please try again later.';
            } finally {
                this.loading = false;
            }
        }
    },
    template: `
        <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>Loading portfolio data...</p>
        </div>
        <div v-else-if="error" class="error">
            <p>{{ error }}</p>
        </div>
        <div v-else>
            <div class="tech-background-container">
                <svg class="tech-background" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
                    <use href="#tech-background"/>
                </svg>
            </div>

            <nav id="navbar">
                <div class="nav-content">
                    <div class="logo-container">
                        <svg class="logo-img" viewBox="0 0 100 100">
                            <use href="#atom-icon"/>
                        </svg>
                        <h1>NK</h1>
                    </div>
                    <ul class="nav-links">
                        <li><a href="#welcome-section">Home</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#certificates">Certificates</a></li>
                        <li><a href="#games">Games</a></li>
                        <li><a href="#videos">Videos</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
            </nav>

            <section id="welcome-section">
                <div class="welcome-content">
                    <h1>Nikita Kurguzov</h1>
                    <p>Tech Wizard</p>
                    <tech-stack></tech-stack>
                </div>
            </section>

            <section id="projects" class="section">
                <h2 class="section-title">Projects</h2>
                <div class="projects-grid">
                    <project-card v-for="project in projects" :key="project.Title" :project="project"></project-card>
                </div>
            </section>

            <section id="certificates" class="section">
                <h2 class="section-title">Certificates</h2>
                <div class="certificates-grid">
                    <certificate-card v-for="certificate in certificates" :key="certificate.Title" :certificate="certificate"></certificate-card>
                </div>
            </section>

            <section id="games" class="section">
                <h2 class="section-title">Games</h2>
                <div class="projects-grid">
                    <game-card v-for="game in games" :key="game.Title" :game="game"></game-card>
                </div>
            </section>

            <section id="videos" class="section">
                <h2 class="section-title">Video Tutorials</h2>
                <div class="projects-grid">
                    <video-card v-for="video in videos" :key="video.Title" :video="video"></video-card>
                </div>
            </section>

            <section id="contact">
                <h2 class="section-title">Contact Me</h2>
                <div class="contact-links">
                    <a id="profile-link" href="https://github.com/Vrolok15" target="_blank">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                    <a href="https://t.me/Kit_Kitych" target="_blank">
                        <i class="fab fa-telegram"></i> Telegram
                    </a>
                </div>
            </section>

            <Footer></Footer>
        </div>
    `
});

// Mount the app
app.mount('#app');
