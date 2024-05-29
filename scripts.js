document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const pagination = document.querySelector('.pagination');
    const main = document.getElementById('main-container');
    const dynamicText = document.getElementById('dynamic-text');
    const circle = document.querySelector('.circle');
    
    let currentSection = 0;
    let isAnimating = false;

    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        circle.style.transform = `translate(${mouseX - circle.offsetWidth / 2}px, ${mouseY - circle.offsetHeight / 2}px)`;

        const elementsToInvert = document.elementsFromPoint(mouseX, mouseY);

        document.querySelectorAll('.reversed').forEach(element => {
            element.classList.remove('reversed');
        });

        elementsToInvert.forEach(element => {
            if (element !== circle && element !== document.body) {
                element.classList.add('reversed');
            }
        });
    });

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
  
    function updateActiveDot(index) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }
  
    function scrollToSection(index) {
        if (isAnimating || index < 0 || index >= sections.length) return;
        isAnimating = true;
        main.style.transform = `translateY(-${index * 100}vh)`;
        updateActiveDot(index);
        setTimeout(() => {
            isAnimating = false;
        }, 700);
    }
  
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            currentSection = index;
            scrollToSection(index);
        });
    });
  
    let lastScroll = 0;
  
    function throttle(fn, wait) {
        let time = Date.now();
        return function(...args) {
            if ((time + wait - Date.now()) < 0) {
                fn(...args);
                time = Date.now();
            }
        }
    }

    document.addEventListener('wheel', throttle(function(e) {
        if (isAnimating) return;
  
        const deltaY = e.deltaY;
  
        if (deltaY > 0) {
            currentSection = Math.min(sections.length - 1, currentSection + 1);
        } else {
            currentSection = Math.max(0, currentSection - 1);
        }
        scrollToSection(currentSection);
    }, 1000));
  
    document.addEventListener('keydown', function(e) {
        if (isAnimating) return;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            currentSection = Math.min(sections.length - 1, currentSection + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            currentSection = Math.max(0, currentSection - 1);
        }
        scrollToSection(currentSection);
    });
  
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
  
    scrollToSection(currentSection);
});
