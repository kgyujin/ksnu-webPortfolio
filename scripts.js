document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const pagination = document.querySelector('.pagination');
    const circle = document.querySelector('.circle');
    const dynamicText = document.getElementById('dynamic-text');
    const projectGallery = document.querySelector('.project-gallery');
    const projectModal = document.getElementById('project-modal');
    const closeButton = document.querySelector('.close-button');
    const projectDetail = document.getElementById('project-detail');

    let mouseX = 0;
    let mouseY = 0;
    let isAnimating = false;
    let isDown = false;
    let startX;
    let scrollLeft;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateCirclePosition();

        const elementsToInvert = document.elementsFromPoint(mouseX, mouseY);

        document.querySelectorAll('.reversed').forEach(element => {
            element.classList.remove('reversed');
        });

        let hoverLink = false;
        elementsToInvert.forEach(element => {
            if (element !== circle && element !== document.body) {
                element.classList.add('reversed');
            }
            if (element.tagName === 'A' || element.closest('a') || element.classList.contains('dot') || element.classList.contains('project') || element.classList.contains('close-button')) {
                hoverLink = true;
            }
        });

        if (hoverLink) {
            circle.classList.add('link-hover');
        } else {
            circle.classList.remove('link-hover');
        }
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

    projectGallery.addEventListener('mousedown', (e) => {
        isDown = true;
        projectGallery.classList.add('active');
        startX = e.pageX - projectGallery.offsetLeft;
        scrollLeft = projectGallery.scrollLeft;
    });

    projectGallery.addEventListener('mouseleave', () => {
        isDown = false;
        projectGallery.classList.remove('active');
    });

    projectGallery.addEventListener('mouseup', () => {
        isDown = false;
        projectGallery.classList.remove('active');
    });

    projectGallery.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - projectGallery.offsetLeft;
        const walk = (x - startX) * 2;
        projectGallery.scrollLeft = scrollLeft - walk;
    });

    const projects = {
        project1: {
            title: "국립생태원",
            period: "2022년 11월 28일 → 2023년 11월 10일",
            description: "연구원들이 공지사항 및 자료를 관리하고 데이터를 효율적으로 분류 및 조회할 수 있게 지원하는 데이터 관리 웹 사이트",
            skills: ["Spring", "MySQL", "Tomcat"],
            role: "자료 등록 및 관리 기능 구현, 리포트 제작 및 관리, 서버 및 데이터베이스 관리, 보안 강화",
            review: "엑셀 데이터 추출 등의 기능 개발을 통해 실무적 기술 능력을 한 단계 발전"
        },
        project2: {
            title: "대구어린이세상",
            period: "2023년 3월 31일 → 2023년 7월 26일",
            description: "어린이와 가족들이 다양한 교육 콘텐츠와 서비스를 이용할 수 있는 웹 사이트",
            skills: ["eGov", "Oracle Database", "Tomcat"],
            role: "게시판 구현 및 유지보수, API 테스트 및 구현, 서버 및 데이터베이스 관리, 보안 강화",
            review: "트래픽과 API 관련 다양한 예외 상황을 팀원들과 협력해 해결함으로써, 문제에 대처할 수 있는 능력 향상"
        },
        project3: {
            title: "도서 관리 프로그램",
            period: "2022년 5월 16일 → 2022년 6월 29일",
            description: "사용자가 손쉽게 도서와 회원을 관리할 수 있도록 C#으로 개발된 도서 관리 프로그램",
            skills: ["C#(WPF .NET)", "MySQL"],
            role: "전체 프로그램 설계 및 개발, 사용자 경험 개선",
            review: "사용자가 도서 및 회원 정보를 효율적으로 관리하고, 도서의 대여 및 반납 프로세스를 손쉽게 처리할 수 있는 프로그램을 제공"
        },
        project4: {
            title: "이무아",
            period: "2022년 3월 24일 → 2022년 6월 24일",
            description: "인공지능을 활용한 사물 인식 모바일 앱",
            skills: ["Android Studio", "Java", "TensorFlow"],
            role: "애플리케이션 개발 및 구현, PPT 제작",
            review: "학습한 이미지들을 혼동하는 문제를 해결하기 위해 다량의 이미지를 학습시키고, 다양한 각도에서 사물을 인식할 수 있도록 개선"
        }
    };

    projectGallery.addEventListener('click', function(e) {
        const projectElement = e.target.closest('.project');
        if (projectElement) {
            const projectKey = projectElement.getAttribute('data-project');
            const project = projects[projectKey];
            projectDetail.innerHTML = `
                <h2>${project.title}</h2>
                <h3>기간</h3>
                <p>${project.period}</p>
                <h3>소개</h3>
                <p>${project.description}</p>
                <h3>기술 스택</h3>
                <p>${project.skills.join(', ')}</p>
                <h3>역할</h3>
                <p>${project.role}</p>
                <h3>리뷰</h3>
                <p>${project.review}</p>
            `;
            openModal();
        }
    });

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target === projectModal) {
            closeModal();
        }
    });

    function openModal() {
        projectModal.classList.remove('fade-out');
        projectModal.classList.add('fade-in');
        projectModal.style.display = 'block';
    }

    function closeModal() {
        projectModal.classList.remove('fade-in');
        projectModal.classList.add('fade-out');
        setTimeout(() => {
            projectModal.style.display = 'none';
        }, 500);
    }
});
