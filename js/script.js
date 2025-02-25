let textContainer = document.querySelector('.text');
let paragraphs = textContainer.querySelectorAll('p');
let allSpans = [];
let content = document.querySelector('.content');
let box = document.querySelector('.box');
let initialTop = parseInt(window.getComputedStyle(box).top);
let totalChars = 0; 

paragraphs.forEach(paragraph => {
    let textContent = paragraph.textContent;
    paragraph.innerHTML = '';
    for (let char of textContent) {
        let span = document.createElement('span');
        span.textContent = char;
        paragraph.appendChild(span);
        allSpans.push(span);
    }
});

totalChars = allSpans.length; 
let revealThreshold = totalChars * 4; 

function updateContentPosition() {
    let textHeight = textContainer.offsetHeight;
    content.style.marginTop = `${textHeight + 100}px`;
}

window.addEventListener('scroll', () => {
    let scrollDistance = window.scrollY;

    // Активируем символы по мере прокрутки
    allSpans.forEach((span, index) => {
        if (scrollDistance >= (index + 1) * 4) {
            span.classList.add('active');
        } else {
            span.classList.remove('active');
        }
    });

    let allActive = allSpans.every(span => span.classList.contains('active'));
    if (allActive) {
        content.style.display = 'block'; 
    }

    if (scrollDistance >= revealThreshold) {
        let excessScroll = scrollDistance - revealThreshold;
        let newTop = initialTop - excessScroll;
        box.style.top = `${newTop}px`;
    } else {
        box.style.top = `${initialTop}px`;
    }

    let totalHeight = document.body.scrollHeight - window.innerHeight;
    let progress = (scrollDistance / totalHeight) * 100;
    document.querySelector('.scroll-progress').style.width = `${progress}%`;
});

window.addEventListener('resize', updateContentPosition);


updateContentPosition();

(function () {
    const link = document.querySelectorAll('div > .box');
    const cursor = document.querySelector('.cursor');

    const animateit = function (e) {
        const span = this.querySelector('.link > span');
        const { offsetX: x, offsetY: y } = e,
            { offsetWidth: width, offsetHeight: height } = this,
            move = 25,
            xMove = x / width * (move * 2) - move,
            yMove = y / height * (move * 2) - move;

        if (span) span.style.transform = `translate(${xMove}px, ${yMove}px)`;
        if (e.type === 'mouseleave') span.style.transform = '';
    };

    const editCursor = e => {
        const { clientX: x, clientY: y } = e;
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
    };

    link.forEach(b => b.addEventListener('mousemove', animateit));
    link.forEach(b => b.addEventListener('mouseleave', animateit));
    window.addEventListener('mousemove', editCursor);
})();

// Таймлайн
let timelineItems = document.querySelectorAll('.timeline-item');

window.addEventListener('scroll', () => {
    timelineItems.forEach(item => {
        let rect = item.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.8) {
            item.classList.add('visible');
        }
    });
});

function typeWriter(text, element, speed) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

const title = document.querySelector('.box h2');
const titleText = title.textContent;
typeWriter(titleText, title, 100); 

let timeSpent = 0;
setInterval(() => {
    timeSpent++;
    document.getElementById('time-spent').textContent = timeSpent;
}, 1000); 

document.querySelectorAll('.video-container').forEach(container => {
    const video = container.querySelector('.video-item');
    const playPauseBtn = container.querySelector('.play-pause');
    const muteToggleBtn = container.querySelector('.mute-toggle');
    const progressBar = container.querySelector('.progress-bar');
    const progress = container.querySelector('.progress');

    video.muted = true; 
    muteToggleBtn.textContent = video.muted ? '🔇' : '🔊';

    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = '⏸️';
        } else {
            video.pause();
            playPauseBtn.textContent = '▶️';
        }
    });

    muteToggleBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteToggleBtn.textContent = video.muted ? '🔇' : '🔊';
        muteToggleBtn.style.color = video.muted ? '#666' : '#00ff89'; // Визуальная обратная связь
    });

    video.addEventListener('timeupdate', () => {
        const progressPercent = (video.currentTime / video.duration) * 100;
        progress.style.width = `${progressPercent}%`;
    });

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / progressBar.offsetWidth) * video.duration;
        video.currentTime = newTime;
    });

    muteToggleBtn.addEventListener('mouseover', () => {
        muteToggleBtn.style.transform = 'scale(1.2)';
    });
    
    muteToggleBtn.addEventListener('mouseout', () => {
        muteToggleBtn.style.transform = 'scale(1)';
    });
});

const contactItem = document.querySelector('.contact-item');

window.addEventListener('scroll', () => {
    const rect = contactItem.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.9) {
        contactItem.classList.add('visible');
    }
});

contactItem.style.opacity = '0';
contactItem.style.transform = 'translateY(30px)';
contactItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observer.observe(contactItem);