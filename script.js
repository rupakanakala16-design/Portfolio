/* =====================================================
   MODERN PORTFOLIO - JAVASCRIPT
   Three.js Background, Animations & Interactions
   ===================================================== */

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    // Try to initialize Three.js with a timeout
    setTimeout(() => {
        try {
            if (typeof THREE !== 'undefined') {
                initializeThreeJS();
            }
        } catch (e) {
            console.log('Three.js not available, continuing without 3D background');
        }
    }, 100); // Small delay to ensure Three.js loads

    initializeTypingAnimation();
    initializePhotoUpload();
    initializeScrollAnimations();
    initializeContactForm();
    initializeNavigation();
    initializeResumeDownload();
    initializeSkillAnimations();
});

function initializeParallaxMouse() {
    // Disabled for faster loading
}


// ==================== THREE.JS BACKGROUND ====================
/**
 * Initialize Three.js scene with floating particles
 * Creates an animated 3D background with particles and wireframe shapes
 */
function initializeThreeJS() {
    try {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x0a0e1a, 0.1);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        camera.position.z = 35;

        // Mouse interaction variables
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        // Mouse move event listener
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Advanced particle system with multiple layers
        const particleSystems = [];

        // Primary particle layer - larger, colorful particles
        const particlesGeometry1 = new THREE.BufferGeometry();
        const particleCount1 = 200;
        const positions1 = new Float32Array(particleCount1 * 3);
        const velocities1 = new Float32Array(particleCount1 * 3);
        const colors1 = new Float32Array(particleCount1 * 3);
        const sizes1 = new Float32Array(particleCount1);

        for (let i = 0; i < particleCount1; i++) {
            const i3 = i * 3;
            positions1[i3] = (Math.random() - 0.5) * 120;
            positions1[i3 + 1] = (Math.random() - 0.5) * 120;
            positions1[i3 + 2] = (Math.random() - 0.5) * 120;

            velocities1[i3] = (Math.random() - 0.5) * 0.1;
            velocities1[i3 + 1] = (Math.random() - 0.5) * 0.1;
            velocities1[i3 + 2] = (Math.random() - 0.5) * 0.1;

            // Beautiful gradient colors
            const hue = Math.random();
            colors1[i3] = 0.3 + hue * 0.4;     // R (blues to purples)
            colors1[i3 + 1] = 0.4 + hue * 0.3; // G
            colors1[i3 + 2] = 0.7 + hue * 0.3; // B

            sizes1[i] = 1.2 + Math.random() * 3.0;
        }

        particlesGeometry1.setAttribute('position', new THREE.BufferAttribute(positions1, 3));
        particlesGeometry1.setAttribute('color', new THREE.BufferAttribute(colors1, 3));
        particlesGeometry1.setAttribute('size', new THREE.BufferAttribute(sizes1, 1));

        const particlesMaterial1 = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2(0, 0) }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vSize;
                uniform float time;
                uniform vec2 mouse;

                void main() {
                    vColor = color;
                    vSize = size;

                    vec3 pos = position;
                    pos.x += sin(time * 0.5 + position.y * 0.01) * 2.0;
                    pos.y += cos(time * 0.3 + position.x * 0.01) * 2.0;
                    pos.z += sin(time * 0.7 + position.z * 0.01) * 1.0;

                    // Mouse interaction
                    float mouseInfluence = 1.0 - length(mouse);
                    pos.x += mouse.x * mouseInfluence * 5.0;
                    pos.y += mouse.y * mouseInfluence * 5.0;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vSize;

                void main() {
                    float r = length(gl_PointCoord - vec2(0.5));
                    if (r > 0.5) discard;

                    float alpha = 1.0 - smoothstep(0.0, 0.5, r);
                    alpha *= 0.8;

                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });

        const particles1 = new THREE.Points(particlesGeometry1, particlesMaterial1);
        scene.add(particles1);
        particleSystems.push({
            mesh: particles1,
            geometry: particlesGeometry1,
            count: particleCount1,
            velocities: velocities1,
            material: particlesMaterial1
        });

        // Secondary particle layer - smaller, faster particles
        const particlesGeometry2 = new THREE.BufferGeometry();
        const particleCount2 = 400;
        const positions2 = new Float32Array(particleCount2 * 3);
        const velocities2 = new Float32Array(particleCount2 * 3);

        for (let i = 0; i < particleCount2 * 3; i += 3) {
            positions2[i] = (Math.random() - 0.5) * 150;
            positions2[i + 1] = (Math.random() - 0.5) * 150;
            positions2[i + 2] = (Math.random() - 0.5) * 150;

            velocities2[i] = (Math.random() - 0.5) * 0.2;
            velocities2[i + 1] = (Math.random() - 0.5) * 0.2;
            velocities2[i + 2] = (Math.random() - 0.5) * 0.2;
        }

        particlesGeometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));

        const particlesMaterial2 = new THREE.PointsMaterial({
            color: 0x60a5fa,
            size: 0.25,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });

        const particles2 = new THREE.Points(particlesGeometry2, particlesMaterial2);
        scene.add(particles2);
        particleSystems.push({
            mesh: particles2,
            geometry: particlesGeometry2,
            count: particleCount2,
            velocities: velocities2
        });

        // Create diverse 3D geometric shapes
        const shapes = [];

        // Icosahedron - main focal shape
        const icoGeometry = new THREE.IcosahedronGeometry(2, 3);
        const icoMaterial = new THREE.MeshBasicMaterial({
            color: 0x7c8fdc,
            wireframe: true,
            transparent: true,
            opacity: 0.25,
        });
        const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
        icosahedron.position.set(25, 20, -15);
        icosahedron.rotation.set(Math.PI * 0.4, Math.PI * 0.3, Math.PI * 0.1);
        icosahedron.scale.set(1.5, 1.5, 1.5);
        shapes.push({ mesh: icosahedron, rotationSpeed: { x: 0.002, y: 0.0015, z: 0.001 } });
        scene.add(icosahedron);

        // Octahedron
        const octGeometry = new THREE.OctahedronGeometry(1.5, 2);
        const octMaterial = new THREE.MeshBasicMaterial({
            color: 0x5a6fc9,
            wireframe: true,
            transparent: true,
            opacity: 0.2,
        });
        const octahedron = new THREE.Mesh(octGeometry, octMaterial);
        octahedron.position.set(-30, -15, 20);
        octahedron.rotation.set(Math.PI * 0.2, Math.PI * 0.5, Math.PI * 0.3);
        octahedron.scale.set(1.2, 1.2, 1.2);
        shapes.push({ mesh: octahedron, rotationSpeed: { x: 0.0015, y: 0.0025, z: 0.0012 } });
        scene.add(octahedron);

        // Tetrahedron
        const tetGeometry = new THREE.TetrahedronGeometry(1.8, 1);
        const tetMaterial = new THREE.MeshBasicMaterial({
            color: 0x60a5fa,
            wireframe: true,
            transparent: true,
            opacity: 0.18,
        });
        const tetrahedron = new THREE.Mesh(tetGeometry, tetMaterial);
        tetrahedron.position.set(10, -25, 25);
        tetrahedron.rotation.set(Math.PI * 0.6, Math.PI * 0.2, Math.PI * 0.4);
        tetrahedron.scale.set(1.3, 1.3, 1.3);
        shapes.push({ mesh: tetrahedron, rotationSpeed: { x: 0.0018, y: 0.0012, z: 0.0022 } });
        scene.add(tetrahedron);

        // Dodecahedron
        const dodGeometry = new THREE.DodecahedronGeometry(1.2, 0);
        const dodMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a7fd7,
            wireframe: true,
            transparent: true,
            opacity: 0.22,
        });
        const dodecahedron = new THREE.Mesh(dodGeometry, dodMaterial);
        dodecahedron.position.set(-15, 30, -20);
        dodecahedron.rotation.set(Math.PI * 0.1, Math.PI * 0.7, Math.PI * 0.2);
        dodecahedron.scale.set(0.9, 0.9, 0.9);
        shapes.push({ mesh: dodecahedron, rotationSpeed: { x: 0.0013, y: 0.002, z: 0.0016 } });
        scene.add(dodecahedron);

        // Floating torus
        const torusGeometry = new THREE.TorusGeometry(1, 0.4, 8, 16);
        const torusMaterial = new THREE.MeshBasicMaterial({
            color: 0x8ba5e8,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(35, -10, 10);
        torus.rotation.set(Math.PI * 0.3, Math.PI * 0.6, 0);
        torus.scale.set(1.1, 1.1, 1.1);
        shapes.push({ mesh: torus, rotationSpeed: { x: 0.0022, y: 0.001, z: 0.0018 } });
        scene.add(torus);

        // Enhanced lighting system
        const ambientLight = new THREE.AmbientLight(0x8494d8, 0.4);
        scene.add(ambientLight);

        // Add subtle point lights for depth
        const pointLight1 = new THREE.PointLight(0x7c8fdc, 0.5, 80);
        pointLight1.position.set(20, 20, 20);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x60a5fa, 0.3, 80);
        pointLight2.position.set(-20, -20, 25);
        scene.add(pointLight2);

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Enhanced animation loop with mouse interaction
        let animationFrameId;
        let time = 0;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            time += 0.01;

            // Smooth mouse interpolation
            targetX += (mouseX - targetX) * 0.02;
            targetY += (mouseY - targetY) * 0.02;

            // Update shader uniforms
            particlesMaterial1.uniforms.time.value = time;
            particlesMaterial1.uniforms.mouse.value.set(targetX, targetY);

            // Animate multiple particle systems
            particleSystems.forEach((system, systemIndex) => {
                const positions = system.geometry.attributes.position.array;
                for (let i = 0; i < system.count * 3; i += 3) {
                    // Add some wave motion to particles
                    const wave = Math.sin(time + i * 0.01) * 0.5;
                    positions[i] += system.velocities[i] + wave * 0.1;
                    positions[i + 1] += system.velocities[i + 1] + wave * 0.1;
                    positions[i + 2] += system.velocities[i + 2] + wave * 0.1;

                    // Enhanced wrapping with larger boundaries
                    const boundary = systemIndex === 0 ? 60 : 70;
                    if (positions[i] > boundary) positions[i] = -boundary;
                    if (positions[i] < -boundary) positions[i] = boundary;
                    if (positions[i + 1] > boundary) positions[i + 1] = -boundary;
                    if (positions[i + 1] < -boundary) positions[i + 1] = boundary;
                    if (positions[i + 2] > boundary) positions[i + 2] = -boundary;
                    if (positions[i + 2] < -boundary) positions[i + 2] = boundary;
                }
                system.geometry.attributes.position.needsUpdate = true;
            });

            // Animate 3D shapes with individual rotation speeds
            shapes.forEach((shape) => {
                shape.mesh.rotation.x += shape.rotationSpeed.x;
                shape.mesh.rotation.y += shape.rotationSpeed.y;
                shape.mesh.rotation.z += shape.rotationSpeed.z;

                // Add subtle floating motion
                shape.mesh.position.y += Math.sin(time * 2 + shape.mesh.position.x * 0.1) * 0.005;
            });

            // Gentle overall scene rotation
            particles1.rotation.x += 0.0001;
            particles1.rotation.y += 0.00015;
            particles2.rotation.x -= 0.00008;
            particles2.rotation.y += 0.00012;

            // Animate lights for dynamic effect
            pointLight1.intensity = 0.5 + Math.sin(time * 0.5) * 0.2;
            pointLight2.intensity = 0.3 + Math.cos(time * 0.7) * 0.15;

            renderer.render(scene, camera);
        };

        animate();
    } catch (error) {
        console.log('Three.js initialization failed:', error);
    }
}

// ==================== TYPING ANIMATION ====================
const phrases = [
  'Aspiring Developer 🚀',
  'Tech Enthusiast ✨',
  'Problem Solver 🧩',
  'B.Tech Student 📚',
  'Creative Coder 💻',
];
let pi = 0, ci = 0, deleting = false;

function typeLoop() {
  const typedEl = document.getElementById('typed-text');
  if (!typedEl) {
    setTimeout(typeLoop, 100);
    return;
  }

  const current = phrases[pi];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ci + 1);
    ci++;
    if (ci === current.length) {
      deleting = true;
      setTimeout(typeLoop, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, ci - 1);
    ci--;
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }

  setTimeout(typeLoop, deleting ? 50 : 80);
}
/**
 * Create typing effect for hero title
 * Simulates text being typed out character by character
 */
function initializeTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    const text = "RUPA KANAKALA";
    typingText.textContent = '';

    let index = 0;
    const speed = 100; // Typing speed in ms

    function type() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    // Start hero title typing after page load
    setTimeout(type, 500);

    // Start tagline typing animation after initial hero text begins
    setTimeout(() => {
        typeLoop();
    }, 1200);
}

// ==================== PHOTO UPLOAD ====================
/**
 * Handle profile photo upload and preview
 * Uses FileReader API to display image instantly
 */
function initializePhotoUpload() {
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    const photoModal = document.getElementById('photoModal');
    const photoModalImg = document.getElementById('photoModalImg');
    const modalUploadBtn = document.getElementById('modalUploadBtn');
    const modalChoosePhotoBtn = document.getElementById('modalChoosePhotoBtn');
    const modalBackBtn = document.getElementById('modalBackBtn');

    const OWNER_CODE = 'Rupa1626';

    function displayPhoto(imageSrc) {
        if (!photoPreview) return;
        photoPreview.innerHTML = '';

        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = 'Profile photo';
        img.style.animation = 'fadeInUp 0.6s ease';
        photoPreview.appendChild(img);

        if (photoModalImg) {
            photoModalImg.src = imageSrc;
        }
    }

    function setPhoto(imageSrc) {
        displayPhoto(imageSrc);
        localStorage.setItem('profilePhoto', imageSrc);
    }

    function loadExistingPhoto() {
        const savedPhoto = localStorage.getItem('profilePhoto');
        if (savedPhoto) {
            setPhoto(savedPhoto);
        } else {
            displayPhoto('https://via.placeholder.com/280x280?text=Profile+Photo');
        }
    }

    function openModal() {
        if (photoModal && photoModalImg) {
            const currentImg = photoPreview.querySelector('img');
            if (currentImg) {
                photoModalImg.src = currentImg.src;
            } else {
                photoModalImg.src = 'https://via.placeholder.com/400x400?text=Profile+Photo';
            }
            photoModal.classList.add('visible');
            photoModal.classList.remove('hidden');
            photoModal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeModal() {
        if (photoModal) {
            photoModal.classList.remove('visible');
            photoModal.classList.add('hidden');
            photoModal.setAttribute('aria-hidden', 'true');
            // Reset buttons to initial state
            modalUploadBtn.classList.remove('hidden-btn');
            modalChoosePhotoBtn.classList.add('hidden-btn');
        }
    }

    loadExistingPhoto();

    photoPreview.addEventListener('click', () => {
        openModal();
    });

    if (photoModal) {
        photoModal.addEventListener('click', (e) => {
            if (e.target === photoModal) {
                closeModal();
            }
        });
    }

    if (modalBackBtn) {
        modalBackBtn.addEventListener('click', closeModal);
    }

    if (modalUploadBtn) {
        modalUploadBtn.addEventListener('click', () => {
            const code = prompt('Enter owner code to upload/change photo:');
            if (code === OWNER_CODE) {
                // Hide Upload button and show Choose Photo button
                modalUploadBtn.classList.add('hidden-btn');
                modalChoosePhotoBtn.classList.remove('hidden-btn');
            } else {
                alert('Incorrect code. Upload not authorized.');
            }
        });
    }

    if (modalChoosePhotoBtn) {
        modalChoosePhotoBtn.addEventListener('click', () => {
            photoInput.click();
        });
    }

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = (event) => {
                setPhoto(event.target.result);
                closeModal();
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    });
}

// ==================== SCROLL ANIMATIONS ====================
/**
 * Initialize scroll reveal animations
 * Elements fade in as they come into view
 */
function initializeScrollAnimations() {
    const reveals = document.querySelectorAll('.skill-card, .project-card, .stat-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
        reveal.classList.add('reveal');
        observer.observe(reveal);
    });
}

// ==================== CONTACT FORM ====================
/**
 * Handle contact form submission
 * Validates input and provides user feedback
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formNote = document.getElementById('formNote');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate inputs
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate sending (in real app, send to backend)
        formNote.textContent = 'Sending...';
        formNote.classList.remove('error', 'success');

        // Show success message after 1 second
        setTimeout(() => {
            showFormMessage('Message sent successfully! I will get back to you soon.', 'success');
            contactForm.reset();

            // Reset message after 5 seconds
            setTimeout(() => {
                formNote.textContent = '';
                formNote.classList.remove('success');
            }, 5000);
        }, 1000);
    });

    /**
     * Display form feedback message
     * @param {string} message - Message to display
     * @param {string} type - 'success' or 'error'
     */
    function showFormMessage(message, type) {
        formNote.textContent = message;
        formNote.classList.add(type);
    }
}

// ==================== NAVIGATION ====================
/**
 * Initialize mobile navigation menu
 * Handles hamburger menu toggle
 */
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// ==================== RESUME DOWNLOAD ====================
/**
 * Handle resume download button
 * Creates a dummy PDF link for demonstration
 */
function initializeResumeDownload() {
    const resumeBtn = document.getElementById('resumeBtn');

    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Create a dummy resume (in real app, link to actual resume file)
        const resumeContent = `
            RUPA KANAKALA
            BTech CSE - 1st Year | NXTWAVE Institute of Advanced Technology (NIAT), Vizag
            
            EMAIL: rupakanakala16@gmail.com
            GITHUB: github.com/rupakanakala16-design
            LINKEDIN: linkedin.com/in/rupa-kanakala-4b85a7373/
            
            SKILLS:
            - HTML5 (Advanced)
            - CSS3 (Advanced)
            - JavaScript (Basics)
            - Python (Intermediate)
            - C (Basics)
            - Communication Skills (Intermediate)
            
            EDUCATION:
            BTech Computer Science & Engineering
            NXTWAVE Institute of Advanced Technology (NIAT), Vizag
            Currently in 1st Year
            
            PROJECTS:
            - Portfolio Website: Modern responsive portfolio with glassmorphism design
            - UI Design System: Reusable components with modern effects
            - Todo Application: Feature-rich todo app with local storage
            - Weather Dashboard: Real-time weather information with API integration
            
            This is a placeholder resume. Update with your actual information.
        `;

        // Create blob and download
        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Rupa_Kanakala_Resume.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
}

function initializeSkillAnimations() {
    const skillsSection = document.querySelector('#skills');
    if (!skillsSection) return;

    const techItems = skillsSection.querySelectorAll('.tech-single .skill-item');
    const skillProgresses = skillsSection.querySelectorAll('.tech-single .skill-progress .mini-fill');

    techItems.forEach((item, i) => {
        const percentage = Number(item.dataset.percent || 0);
        const label = item.querySelector('.skill-percentage');
        if (label) label.textContent = '0%';
        if (skillProgresses[i]) skillProgresses[i].style.width = '0%';
        item.dataset.animated = 'false';
    });

    const softItems = skillsSection.querySelectorAll('.soft-single .skill-item');
    softItems.forEach((item) => {
        item.dataset.animated = 'false';
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                techItems.forEach((item, i) => {
                    if (item.dataset.animated === 'true') return;

                    const target = Number(item.dataset.percent || 0);
                    const label = item.querySelector('.skill-percentage');
                    const fill = skillProgresses[i];
                    let current = 0;

                    if (fill) fill.style.width = `${target}%`;

                    const countFn = () => {
                        if (label) label.textContent = `${current}%`;
                        if (current < target) {
                            current += 1;
                            requestAnimationFrame(countFn);
                        }
                    };

                    requestAnimationFrame(countFn);
                    item.dataset.animated = 'true';
                });

                softItems.forEach((item) => {
                    if (item.dataset.animated === 'true') return;
                    // Soft skills don't animate percentages.
                    item.dataset.animated = 'true';
                });

                obs.unobserve(skillsSection);
            }
        });
    }, { threshold: 0.25 });

    observer.observe(skillsSection);
}

// ==================== SMOOTH SCROLLING ====================
/**
 * Add smooth scrolling behavior
 * Already handled by CSS scroll-behavior: smooth
 */

// ==================== ADDITIONAL UTILITY FUNCTIONS ====================

/**
 * Debounce function for performance optimization
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get element offset from top
 * @param {HTMLElement} el - Element to measure
 */
function getElementOffset(el) {
    let top = 0;
    if (el.offsetParent) {
        do {
            top += el.offsetTop;
            el = el.offsetParent;
        } while (el);
    }
    return top;
}

// ==================== RESPONSIVE CHECKS ====================

/**
 * Handle window resize events
 */
const handleResize = debounce(() => {
    // Add any resize-specific logic here
    console.log('Window resized');
}, 250);

window.addEventListener('resize', handleResize);

// ==================== PAGE VISIBILITY ====================

/**
 * Pause animations when page is not visible
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations
        document.body.style.animationPlayState = 'running';
    }
});

// ==================== CONSOLE MESSAGE ====================
console.log(
    '%cWelcome to Rupa\'s Portfolio!',
    'color: #6D28CB; font-size: 20px; font-weight: bold;'
);
console.log(
    '%cMade with HTML, CSS, JavaScript & Three.js',
    'color: #0EA5E9; font-size: 14px;'
);
