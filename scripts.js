document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const pagination = document.querySelector('.pagination');
    const circle = document.querySelector('.circle');
    const dynamicText = document.getElementById('dynamic-text');

    let mouseX = 0;
    let mouseY = 0;
    let isAnimating = false;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateCirclePosition();
    });

    function updateCirclePosition() {
        circle.style.transform = `translate(${mouseX - circle.offsetWidth / 2}px, ${mouseY - circle.offsetHeight / 2}px)`;
    }

    function checkVisible(element) {
        const rect = element.getBoundingClientRect();
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }

    function animateSections() {
        sections.forEach((section, index) => {
            if (checkVisible(section)) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }
        });

        // Update the active dot based on the current scroll position
        let currentSectionIndex = sections.length - 1;
        for (let i = 0; i < sections.length; i++) {
            if (checkVisible(sections[i])) {
                currentSectionIndex = i;
                break;
            }
        }
        updateActiveDot(currentSectionIndex);
    }

    function updateActiveDot(index) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    function scrollToSection(index) {
        if (isAnimating || index < 0 || index >= sections.length) return;
        isAnimating = true;
        const section = sections[index];
        window.scrollTo({
            top: section.offsetTop,
            behavior: 'smooth'
        });
        setTimeout(() => {
            isAnimating = false;
            updateActiveDot(index);
        }, 1000);
    }

    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('data-index', index);
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `섹션 ${index + 1}`);
        pagination.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            scrollToSection(index);
        });
    });

    document.addEventListener('scroll', animateSections);
    window.addEventListener('resize', animateSections);
    animateSections();

    const phrases = [
        "✍️기록하며",
        "📖배우며",
        "🏆도전하며",
        "🔍탐구하며",
        "💭생각하며"
    ];

    let currentPhraseIndex = 0;

    function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
            dynamicText.innerHTML = text.substring(0, i + 1);
            setTimeout(function() {
                typeWriter(text, i + 1, fnCallback);
            }, 100);
        } else if (typeof fnCallback === 'function') {
            setTimeout(fnCallback, 700);
        }
    }

    function startTextAnimation() {
        if (currentPhraseIndex < phrases.length) {
            typeWriter(phrases[currentPhraseIndex], 0, function() {
                currentPhraseIndex++;
                if (currentPhraseIndex >= phrases.length) {
                    currentPhraseIndex = 1;
                }
                setTimeout(function() {
                    deleteText(function() {
                        dynamicText.innerHTML = phrases[0];
                        startTextAnimation();
                    });
                }, 2000);
            });
        }
    }

    function deleteText(fnCallback) {
        let text = dynamicText.innerHTML;
        let i = text.length;
        function deleter() {
            if (i >= 0) {
                dynamicText.innerHTML = text.substring(0, i);
                i--;
                setTimeout(deleter, 50);
            } else if (typeof fnCallback === 'function') {
                fnCallback();
            }
        }
        deleter();
    }

    startTextAnimation();

    // Skills Section Animation using GSAP
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const skillsList = document.getElementById('skills-list');
    const skillsItems = Array.from(skillsList.children);

    function animateSkills() {
        gsap.to("#skills-list", {
            xPercent: -100 * (skillsItems.length / 4),
            ease: "none",
            duration: 20 * (skillsItems.length / 4),
            onComplete: () => {
                shuffleArray(skillsItems);
                skillsItems.forEach(item => skillsList.appendChild(item));
                animateSkills();
            }
        });
    }

    shuffleArray(skillsItems);
    skillsItems.forEach(item => skillsList.appendChild(item));
    animateSkills();
});
