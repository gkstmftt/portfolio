import {
    slideTitles,
    slideDescriptions,
    imageUrls,
    buttonConfigs,
    buttonLinks,
    projectCards,
} from './data.js';

// === GSAP 플러그인 등록 ===
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', function () {
    gsap.set('nav', { yPercent: -100 });
    // ------------------------------------
    // 옵션 토글
    const USE_LOADER = false; // 로딩 카운터/텍스트 애니 쓸 거면 true
    const SHOW_MARKERS = false; // ScrollTrigger markers 보이기
    // ------------------------------------

    // ===== 유틸: 텍스트 분할 =====
    function splitTextIntoSpans(selector) {
        document.querySelectorAll(selector).forEach((el) => {
            const text = el.textContent;
            el.innerHTML = text
                .split('')
                .map((c) => (c === ' ' ? '<span>&nbsp;</span>' : `<span>${c}</span>`))
                .join('');
        });
    }

    // ===== 비행기 인트로 =====
    function initAirplaneIntro({ onAfterIntro } = {}) {
        const overlay = document.querySelector('.ap-overlay');
        const sw = document.querySelector('.ap-switch');
        const btn = document.querySelector('.ap-btn');
        const icon = document.querySelector('.ap-icon');
        const sky = document.querySelector('.ap-sky');
        const airport = document.querySelector('.ap-airport');
        if (!overlay || !btn) {
            if (typeof onAfterIntro === 'function') onAfterIntro();
            return;
        }
        let locked = false;
        btn.addEventListener('click', () => {
            if (locked) return;
            locked = true;

            overlay.classList.add('is-sky');
            sw?.classList.add('is-sky');
            icon?.classList.add('active');
            btn.classList.add('moved');
            if (airport) airport.style.transform = 'translateX(-30px)';
            sky?.classList.add('active');

            setTimeout(() => {
                sw?.classList.add('is-out');
                setTimeout(() => {
                    overlay.classList.add('is-out');
                    setTimeout(() => {
                        overlay.remove();
                        if (typeof onAfterIntro === 'function') onAfterIntro();
                    }, 900);
                }, 900);
            }, 1000);
        });
    }

    // ===== 로더 =====
    function startLoader() {
        const counterEl = document.querySelector('.counter');
        const progressBar = document.querySelector('.loading-progress');
        if (!counterEl || !progressBar) {
            animateAfterLoader();
            return;
        }
        let value = 0;
        function updateCounter() {
            if (value >= 100) {
                counterEl.textContent = '100%';
                progressBar.style.width = '100%';
                setTimeout(animateAfterLoader, 500);
                return;
            }
            const inc = Math.floor(Math.random() * 8) + 1;
            value = Math.min(value + inc, 100);
            counterEl.textContent = `${value}%`;
            progressBar.style.width = `${value}%`;
            setTimeout(updateCounter, Math.floor(Math.random() * 150) + 50);
        }
        updateCounter();
    }

    // ===== 로더 이후 텍스트 애니/초기 세팅 =====
    function animateAfterLoader() {
        const tl = gsap.timeline();
        const hasLoadingOverlay = document.querySelector('.loading-overlay');

        if (hasLoadingOverlay) {
            tl.to('.counter', { y: -100, opacity: 0, duration: 0.8, ease: 'power3.inOut' })
                .to(
                    '.logo span',
                    { y: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' },
                    '-=0.3'
                )
                .to(
                    '.logo span',
                    { y: -200, stagger: 0.04, duration: 0.8, ease: 'power3.in' },
                    '+=1.0'
                )
                .to(
                    '.loading-bar',
                    { opacity: 0, y: 50, duration: 0.6, ease: 'power2.inOut' },
                    '-=0.5'
                )
                .to(
                    '.loading-overlay',
                    { y: '-100%', duration: 1.2, ease: 'power3.inOut' },
                    '-=0.3'
                )
                .to('nav', { y: 100, duration: 0.8, ease: 'power3.out' }, '-=0.8')
                .add(() => {
                    ScrollTrigger.refresh(true);
                    setupScrollTriggers();
                    startMarquee();
                });
        } else {
            // 로더 안쓸 때 바로 세팅
            setupScrollTriggers();
            startMarquee();
        }
    }

    // ===== 스크롤 트리거 모음 =====
    function setupScrollTriggers() {
        // 섹션 타이틀 페이드인
        gsap.utils.toArray('.con').forEach((section) => {
            const h2 = section.querySelector('h2');
            if (!h2) return;
            gsap.fromTo(
                h2,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse',
                        markers: SHOW_MARKERS,
                    },
                }
            );
        });

        // 도트 네비
        const dotTargetsSelectors = ['#home', '#section1', '#section2', '#section3'];
        const dotTargets = dotTargetsSelectors.map((sel) => document.querySelector(sel));
        const dots = document.querySelectorAll('.scroll-dot');
        function setActiveDot(index) {
            dots.forEach((d) => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }
        dotTargets.forEach((el, i) => {
            if (!el) return;
            ScrollTrigger.create({
                trigger: el,
                start: 'top 50%',
                end: 'bottom 50%',
                onEnter: () => setActiveDot(i),
                onEnterBack: () => setActiveDot(i),
                markers: SHOW_MARKERS,
            });
        });
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                const target = dotTargets[i];
                if (!target) return;
                gsap.to(window, { duration: 1.2, scrollTo: target, ease: 'power3.inOut' });
            });
        });

        // gallery pin

        const upBox = document.querySelectorAll('.upBox');
        const postcardSection = document.querySelector('.con1_2.postcard');

        if (postcardSection && upBox.length) {
            // 초기 위치 과도 ↓ (500 → 120) : 초반 “바로” 움직이게
            gsap.set(upBox, { yPercent: 150, opacity: 0.999 });

            gsap.timeline({
                scrollTrigger: {
                    trigger: postcardSection,
                    pin: true,
                    start: 'top 15%', // 핀 시작을 정확히 섹션 상단에
                    end: '+=200%', // 과도한 길이 축소 (겹침 방지)
                    scrub: 3,
                    markers: false, // 하드코딩된 true 제거
                    invalidateOnRefresh: true,
                },
            }).to(
                upBox,
                {
                    yPercent: 0,
                    opacity: 1,
                    // 6초 간격(stagger: 6)은 “정지처럼 보임” → 자연스러운 0.25
                    stagger: 4,
                    ease: 'none',
                    duration: 1, // scrub로 타이밍 맞추므로 길게 둘 필요 없음
                },
                0
            );
        }

        // 영상 확대
        if (document.querySelector('.con3_3 video')) {
            gsap.fromTo(
                '.con3_3 video',
                { scale: 0.4, borderRadius: '50%' },
                {
                    scale: 1.3,
                    borderRadius: '0%',
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.con3_3 video',
                        start: 'top 80%',
                        end: 'bottom 50%',
                        scrub: true,
                        markers: SHOW_MARKERS,
                    },
                }
            );
        }

        // 텍스트 마스크
        if (document.querySelector('.mask .text')) {
            gsap.fromTo(
                '.mask .text',
                { backgroundSize: '0% 100%' },
                {
                    backgroundSize: '100% 100%',
                    scrollTrigger: {
                        trigger: '.textBox',
                        start: 'top 60%',
                        end: 'top 30%',
                        scrub: 3,
                        toggleActions: 'play none none reverse',
                        markers: SHOW_MARKERS,
                    },
                }
            );
        }
    }

    // ===== marquee =====
    function startMarquee() {
        const marqueeInner = document.querySelector('.marquee__inner');
        const arrows = document.querySelectorAll('.arrow');
        if (!marqueeInner) return;

        let currentScroll = 0;
        const tween = gsap
            .to('.marquee__part', { xPercent: -100, repeat: -1, duration: 5, ease: 'linear' })
            .totalProgress(0.5);

        gsap.set('.marquee__inner', { xPercent: -50 });

        window.addEventListener('scroll', () => {
            const isDown = window.pageYOffset > currentScroll;
            gsap.to(tween, { timeScale: isDown ? -1 : 1, duration: 0.8, ease: 'power2.out' });
            arrows.forEach((a) => a.classList.toggle('active', isDown));
            currentScroll = window.pageYOffset;
        });
    }

    // ===== 스무스 스크롤 내비 =====
    document.querySelectorAll('nav a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) gsap.to(window, { duration: 1.2, scrollTo: target, ease: 'power3.inOut' });
        });
    });

    // ===== 마우스 팔로워 =====
    (function mouseFollower() {
        const follower = document.querySelector('.cursor-follower');
        const homeEl = document.querySelector('.home');
        if (!(follower && homeEl)) return;
        homeEl.addEventListener('mouseenter', () => (follower.style.display = 'block'));
        homeEl.addEventListener('mouseleave', () => (follower.style.display = 'none'));
        const qx = gsap.quickTo(follower, 'x', { duration: 0.18, ease: 'power3.out' });
        const qy = gsap.quickTo(follower, 'y', { duration: 0.18, ease: 'power3.out' });
        document.addEventListener('mousemove', (e) => {
            qx(e.clientX);
            qy(e.clientY);
        });
    })();

    // ===== 바코드 → section1로 이동 =====
    (function barcodeJump() {
        const barcode = document.querySelector('.barcode');
        if (!barcode) return;
        barcode.addEventListener('click', (e) => {
            e.stopPropagation();
            gsap.to(window, { duration: 1.2, scrollTo: '#section1', ease: 'power3.inOut' });
        });
    })();

    // ===== 시각물 클릭 방지 =====
    (function preventVisualClick() {
        const visualImg = document.querySelector('.visual-img');
        if (visualImg) visualImg.addEventListener('click', (e) => e.stopPropagation());
    })();

    // ===== 포트폴리오 슬라이더(con3_2) =====
    function initPortfolioSlider() {
        const section = document.querySelector('.con3_2');
        if (!section) return;

        const slider = section.querySelector('.slider-portfolio');
        const mainImageContainer = section.querySelector('.slide-main-img-portfolio');
        const titleContainer = section.querySelector('.slide-title-portfolio');
        const descContainer = section.querySelector('.slide-description-portfolio');
        const btnWrapper = section.querySelector('.btn-wrapper-portfolio');
        const counterContainer = section.querySelector('.count-portfolio');

        const totalSlides = imageUrls.length;
        let currentSlide = 1;
        let isAnimating = false;
        let isInSection = false;
        let canScroll = true;
        let lastTime = 0;
        let snapping = false;
        let exiting = false;
        let exitTimer = null;

        function bindButtons(container, slideIdx) {
            if (!container) return;
            container.querySelectorAll('p').forEach((btn, i) => {
                btn.onclick = () => {
                    const link = (buttonLinks[slideIdx - 1] || [])[i];
                    if (link) window.open(link, '_blank');
                };
            });
        }
        function isSectionNearby() {
            const rect = section.getBoundingClientRect();
            const margin = Math.min(200, window.innerHeight * 0.2);
            return rect.top < window.innerHeight - margin && rect.bottom > margin;
        }
        function smoothScrollToSibling(direction) {
            const target =
                direction === 'down' ? section.nextElementSibling : section.previousElementSibling;
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        function exitSection(direction) {
            exiting = true;
            if (exitTimer) clearTimeout(exitTimer);
            document.body.style.overflow = 'auto';
            isInSection = false;
            canScroll = false;
            smoothScrollToSibling(direction);
            exitTimer = setTimeout(() => (exiting = false), 700);
        }
        function lockInSectionWithSnap() {
            if (snapping || exiting) return;
            snapping = true;
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                if (exiting) return (snapping = false);
                document.body.style.overflow = 'hidden';
                isInSection = true;
                canScroll = true;
                snapping = false;
            }, 350);
        }

        function animateSlide(direction) {
            if (isAnimating) return;

            if (
                (currentSlide === totalSlides && direction === 'down') ||
                (currentSlide === 1 && direction === 'up')
            ) {
                exitSection(direction);
                return;
            }

            isAnimating = true;

            const currentSlideEl = slider.querySelector('.slide-portfolio');
            const currentMainWrapper = mainImageContainer.querySelector(
                '.slide-main-img-wrapper-portfolio'
            );
            const currentTitle = titleContainer.querySelector('h1');
            const currentDesc = descContainer.querySelector('p');
            const currentButtons = btnWrapper.querySelector('.btn-container-portfolio');
            const currentCounter = counterContainer.querySelector('p');

            currentSlide =
                direction === 'down'
                    ? currentSlide === totalSlides
                        ? 1
                        : currentSlide + 1
                    : currentSlide === 1
                    ? totalSlides
                    : currentSlide - 1;

            const newSlide = document.createElement('div');
            newSlide.className = 'slide-portfolio';
            const newBgImg = document.createElement('div');
            newBgImg.className = 'slide-bg-img-portfolio';
            newBgImg.style.clipPath =
                direction === 'down'
                    ? 'polygon(0% 100%,100% 100%,100% 100%,0% 100%)'
                    : 'polygon(0% 0%,100% 0%,100% 0%,0% 0%)';
            const newBgImgEl = document.createElement('img');
            newBgImgEl.src = imageUrls[currentSlide - 1];
            newBgImg.appendChild(newBgImgEl);
            newSlide.appendChild(newBgImg);
            slider.appendChild(newSlide);

            const newMainWrapper = document.createElement('div');
            newMainWrapper.className = 'slide-main-img-wrapper-portfolio';
            newMainWrapper.style.clipPath =
                direction === 'down'
                    ? 'polygon(0% 0%,100% 0%,100% 0%,0% 0%)'
                    : 'polygon(0% 100%,100% 100%,100% 100%,0% 100%)';
            const newMainImg = document.createElement('img');
            newMainImg.src = imageUrls[currentSlide - 1];
            newMainWrapper.appendChild(newMainImg);
            mainImageContainer.appendChild(newMainWrapper);
            gsap.set(newMainImg, { y: direction === 'down' ? '-50%' : '50%' });

            const newTitle = document.createElement('h1');
            newTitle.textContent = slideTitles[currentSlide - 1];
            titleContainer.appendChild(newTitle);
            gsap.set(newTitle, { y: direction === 'down' ? 120 : -120 });

            const newDesc = document.createElement('p');
            newDesc.textContent = slideDescriptions[currentSlide - 1];
            descContainer.appendChild(newDesc);
            gsap.set(newDesc, { y: direction === 'down' ? 50 : -50 });

            const newButtons = document.createElement('div');
            newButtons.className = 'btn-container-portfolio';
            (buttonConfigs[currentSlide - 1] || []).forEach((txt) => {
                const btn = document.createElement('p');
                btn.textContent = txt;
                newButtons.appendChild(btn);
            });
            btnWrapper.appendChild(newButtons);
            bindButtons(newButtons, currentSlide);
            gsap.set(newButtons, { y: direction === 'down' ? 70 : -70 });

            const newCounter = document.createElement('p');
            newCounter.textContent = currentSlide;
            counterContainer.appendChild(newCounter);
            gsap.set(newCounter, { y: direction === 'down' ? 40 : -40 });

            const tl = gsap.timeline({
                onComplete: () => {
                    currentSlideEl?.remove();
                    currentMainWrapper?.remove();
                    currentTitle?.remove();
                    currentDesc?.remove();
                    currentButtons?.remove();
                    currentCounter?.remove();
                    isAnimating = false;
                },
            });

            tl.to(
                newBgImg,
                {
                    clipPath:
                        direction === 'down'
                            ? 'polygon(0% 100%,100% 100%,100% 0%,0% 0%)'
                            : 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)',
                    duration: 0.8,
                    ease: 'cubic-bezier(.87,0,.13,1)',
                },
                0
            )
                .to(
                    currentSlideEl?.querySelector('img'),
                    {
                        scale: 1.5,
                        duration: 0.8,
                        ease: 'cubic-bezier(.87,0,.13,1)',
                    },
                    0
                )
                .to(
                    newMainWrapper,
                    {
                        clipPath:
                            direction === 'down'
                                ? 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)'
                                : 'polygon(0% 100%,100% 100%,100% 0%,0% 0%)',
                        duration: 0.8,
                        ease: 'cubic-bezier(.87,0,.13,1)',
                    },
                    0
                )
                .to(
                    currentMainWrapper?.querySelector('img'),
                    {
                        y: direction === 'down' ? '50%' : '-50%',
                        duration: 0.8,
                        ease: 'cubic-bezier(.87,0,.13,1)',
                    },
                    0
                )
                .to(newMainImg, { y: 0, duration: 0.8, ease: 'cubic-bezier(.87,0,.13,1)' }, 0)
                .to(
                    currentTitle,
                    {
                        y: direction === 'down' ? -120 : 120,
                        duration: 0.8,
                        ease: 'cubic-bezier(.87,0,.13,1)',
                    },
                    0
                )
                .to(newTitle, { y: 0, duration: 0.8, ease: 'cubic-bezier(.87,0,.13,1)' }, 0)
                .to(
                    currentDesc,
                    {
                        y: direction === 'down' ? -50 : 50,
                        duration: 0.8,
                        ease: 'cubic-bezier(.87,0,.13,1)',
                    },
                    0
                )
                .to(newDesc, { y: 0, duration: 0.8, ease: 'cubic-bezier(.87,0,.13,1)' }, 0)
                .to(
                    currentButtons,
                    {
                        y: direction === 'down' ? -70 : 70,
                        duration: 0.8,
                        ease: 'cubic-bezier(.87,0,.13,1)',
                    },
                    0
                )
                .to(newButtons, { y: 0, duration: 0.8, ease: 'cubic-bezier(.87,0,.13,1)' }, 0)
                .to(
                    currentCounter,
                    {
                        y: direction === 'down' ? -40 : 40,
                        duration: 0.8,
                        ease: 'cubic-bezier(.87,0,.13,1)',
                    },
                    0
                )
                .to(newCounter, { y: 0, duration: 0.8, ease: 'cubic-bezier(.87,0,.13,1)' }, 0);
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isInSection) {
                        if (!exiting) lockInSectionWithSnap();
                    } else if (!entry.isIntersecting && isInSection) {
                        document.body.style.overflow = 'auto';
                        isInSection = false;
                    }
                });
            },
            { threshold: 0.6 }
        );
        observer.observe(section);

        // Wheel
        window.addEventListener(
            'wheel',
            (e) => {
                if (document.body.classList.contains('modal-open')) return;
                const now = Date.now();
                if (now - lastTime < 600) return;
                const direction = e.deltaY > 0 ? 'down' : 'up';

                if (isInSection && canScroll) {
                    e.preventDefault();
                    lastTime = now;
                    if (
                        (currentSlide === totalSlides && direction === 'down') ||
                        (currentSlide === 1 && direction === 'up')
                    ) {
                        exitSection(direction);
                        return;
                    }
                    animateSlide(direction);
                    return;
                }

                if (
                    !isInSection &&
                    isSectionNearby() &&
                    ((currentSlide === 1 && direction === 'down') ||
                        (currentSlide === totalSlides && direction === 'up'))
                ) {
                    e.preventDefault();
                    lastTime = now;
                    lockInSectionWithSnap();
                }
            },
            { passive: false }
        );

        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (document.body.classList.contains('modal-open')) return;
            const key = e.key;
            const isArrow = key === 'ArrowDown' || key === 'ArrowUp';
            const isPaging = key === 'PageDown' || key === 'PageUp';
            const isSpace = key === ' ' || key === 'Spacebar';
            if (!isInSection || !canScroll) return;
            if (!(isArrow || isPaging || isSpace)) return;

            const now = Date.now();
            if (now - lastTime < 600) return;

            let direction = null;
            if (key === 'ArrowDown' || key === 'PageDown' || isSpace) direction = 'down';
            if (key === 'ArrowUp' || key === 'PageUp') direction = 'up';
            if (!direction) return;

            e.preventDefault();
            lastTime = now;

            if (
                (currentSlide === totalSlides && direction === 'down') ||
                (currentSlide === 1 && direction === 'up')
            ) {
                exitSection(direction);
                return;
            }
            animateSlide(direction);
        });

        // Touch
        let touchStartY = null;
        section.addEventListener(
            'touchstart',
            (e) => {
                touchStartY = e.touches[0].clientY;
            },
            { passive: true }
        );
        section.addEventListener(
            'touchmove',
            (e) => {
                if (touchStartY == null) return;
                const dy = e.touches[0].clientY - touchStartY;
                if (Math.abs(dy) < 50) return;
                const direction = dy < 0 ? 'down' : 'up';
                const now = Date.now();
                if (now - lastTime < 600) return;

                if (isInSection && canScroll) {
                    e.preventDefault();
                    lastTime = now;
                    if (
                        (currentSlide === totalSlides && direction === 'down') ||
                        (currentSlide === 1 && direction === 'up')
                    ) {
                        exitSection(direction);
                        touchStartY = null;
                        return;
                    }
                    animateSlide(direction);
                } else if (
                    !isInSection &&
                    isSectionNearby() &&
                    ((currentSlide === 1 && direction === 'down') ||
                        (currentSlide === totalSlides && direction === 'up'))
                ) {
                    e.preventDefault();
                    lastTime = now;
                    lockInSectionWithSnap();
                }
                touchStartY = null;
            },
            { passive: false }
        );
        section.addEventListener('touchend', () => {
            touchStartY = null;
        });

        // 가드
        window.addEventListener('resize', () => {
            if (isInSection && !snapping) section.scrollIntoView({ block: 'start' });
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) document.body.style.overflow = 'auto';
            else if (isInSection) document.body.style.overflow = 'hidden';
        });

        // 초기 버튼 바인딩
        bindButtons(btnWrapper?.querySelector('.btn-container-portfolio'), 1);
    }

    // ===con3_1 프로젝트 카드 생셩====
    const initProjectCards = () => {
        const listEl = document.querySelector('.con3_1 .list');
        if (!listEl) return;
        listEl.innerHTML = '';
        projectCards.forEach((data) => {
            const box = document.createElement('div');
            box.className = 'box';
            box.innerHTML = `
        <ul>
            <li>${data.category}</li>
            <li class="title">${data.title}</li>
            <li class="subject">${data.subtitle}</li>
            <li class="img">
                <img
                    src="${data.image}"
                    alt="${data.alt}"
                    data-modal-target="${data.modalTarget}"
                    role="button"
                    tabindex="0"
                />
            </li>
            <li class="period">${data.period}</li>
            <li class="skill">
                ${data.skills.map((src) => `<img src="${src}" alt="skill" />`).join('')}
            </li>
        </ul>`;
            listEl.appendChild(box);
        });
    };
    // ===== 모달 (focus trap + 스크롤 락) =====
    // ===== 모달 (focus trap + 스크롤 락) =====
    (function modalInit() {
        const modals = document.querySelectorAll('.modal');

        // 모달 안쪽 스크롤 가드
        function attachInnerScrollGuards(scrollEl) {
            if (!scrollEl) return () => {};
            const onWheel = (e) => {
                const canDown = scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight;
                const canUp = scrollEl.scrollTop > 0;
                if ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp)) {
                    e.stopPropagation();
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
            };
            let startY = 0;
            const onTouchStart = (e) => {
                startY = e.touches[0].clientY;
            };
            const onTouchMove = (e) => {
                const dy = e.touches[0].clientY - startY;
                const goingDown = dy > 0;
                const canDown = scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight;
                const canUp = scrollEl.scrollTop > 0;
                if ((goingDown && canUp) || (!goingDown && canDown)) {
                    e.stopPropagation();
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
            };
            scrollEl.addEventListener('wheel', onWheel, { passive: false });
            scrollEl.addEventListener('touchstart', onTouchStart, { passive: true });
            scrollEl.addEventListener('touchmove', onTouchMove, { passive: false });
            return () => {
                scrollEl.removeEventListener('wheel', onWheel);
                scrollEl.removeEventListener('touchstart', onTouchStart);
                scrollEl.removeEventListener('touchmove', onTouchMove);
            };
        }

        // 모달 상태 저장용
        const state = {
            lastFocused: new WeakMap(),
            scrollY: 0,
            isOpen: false,
            detachGuards: new WeakMap(),
        };

        function getScrollbarWidth() {
            const div = document.createElement('div');
            div.style.cssText =
                'position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll;';
            document.body.appendChild(div);
            const w = div.offsetWidth - div.clientWidth;
            document.body.removeChild(div);
            return w;
        }

        function lockBodyScroll() {
            if (state.isOpen) return;
            state.isOpen = true;
            state.scrollY = window.scrollY || window.pageYOffset;
            const bar = getScrollbarWidth();
            const hadPadding = parseInt(getComputedStyle(document.body).paddingRight, 10) || 0;
            document.body.dataset._pr = hadPadding;
            if (bar > 0) document.body.style.paddingRight = `${hadPadding + bar}px`;
            document.body.classList.add('modal-open');
            document.body.style.position = 'fixed';
            document.body.style.top = `-${state.scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
        }

        function unlockBodyScroll() {
            if (!state.isOpen) return;
            state.isOpen = false;
            document.body.classList.remove('modal-open');
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            const prev = Number(document.body.dataset._pr || 0);
            document.body.style.paddingRight = prev ? `${prev}px` : '';
            delete document.body.dataset._pr;
            window.scrollTo(0, state.scrollY);
        }

        const getFocusables = (root) =>
            Array.from(
                root.querySelectorAll(
                    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
            ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);

        function trapFocus(e) {
            if (e.key !== 'Tab') return;
            const modal = e.currentTarget;
            const f = getFocusables(modal);
            if (!f.length) return;
            const first = f[0];
            const last = f[f.length - 1];
            const active = document.activeElement;
            if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
        }

        function onEscClose(e) {
            if (e.key === 'Escape') closeModal(e.currentTarget);
        }

        function openModal(modal) {
            if (!modal || modal.getAttribute('aria-hidden') === 'false') return;
            const active = document.activeElement;
            if (active) state.lastFocused.set(modal, active);
            modal.setAttribute('aria-hidden', 'false');
            lockBodyScroll();
            const focusables = getFocusables(modal);
            (focusables[0] || modal.querySelector('.modal__close') || modal).focus();
            modal.addEventListener('keydown', trapFocus);
            modal.addEventListener('keydown', onEscClose);
            const content = modal.querySelector('.modal__body');
            const detach = attachInnerScrollGuards(content);
            state.detachGuards.set(modal, detach);
        }

        function closeModal(modal) {
            if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
            modal.setAttribute('aria-hidden', 'true');
            modal.removeEventListener('keydown', trapFocus);
            modal.removeEventListener('keydown', onEscClose);
            const opener = state.lastFocused.get(modal);
            if (opener && typeof opener.focus === 'function') opener.focus();
            const detach = state.detachGuards.get(modal);
            if (typeof detach === 'function') {
                detach();
                state.detachGuards.delete(modal);
            }
            const anyOpen = Array.from(modals).some(
                (m) => m.getAttribute('aria-hidden') === 'false'
            );
            if (!anyOpen) unlockBodyScroll();
        }

        // 🔥 마우스 클릭으로만 모달 열기 (키보드 오프너 X)
        document.addEventListener('click', (e) => {
            const opener = e.target.closest('[data-modal-target]');
            if (!opener) return;

            const selector = opener.getAttribute('data-modal-target'); // 예: "#modal-hogangs"
            const targetModal = document.querySelector(selector);
            if (targetModal) {
                openModal(targetModal);
            }
        });

        // 각 모달별 닫기 버튼 & 백드롭 클릭
        modals.forEach((modal) => {
            modal
                .querySelectorAll('[data-modal-close]')
                .forEach((btn) => btn.addEventListener('click', () => closeModal(modal)));

            const dialog = modal.querySelector('.modal__dialog');
            dialog?.addEventListener('click', (e) => e.stopPropagation());

            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal__backdrop')) closeModal(modal);
            });
        });

        // 탭 전환/숨김 다시 돌아왔을 때 스크롤 상태 정리
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) return;
            const anyOpen = Array.from(modals).some(
                (m) => m.getAttribute('aria-hidden') === 'false'
            );
            if (!anyOpen) unlockBodyScroll();
        });
    })();

    // ===== 초기화 시퀀스 =====
    splitTextIntoSpans('.logo');

    initAirplaneIntro({
        onAfterIntro() {
            function revealNav() {
                const n = document.querySelector('nav');
                if (!n) return;

                gsap.set(n, { yPercent: -100 }); // ← OK
                gsap.to(n, {
                    yPercent: 0,
                    duration: 1.4,
                    ease: 'power4.out',
                });
            }

            revealNav();
            if (USE_LOADER) startLoader();
            else animateAfterLoader();
            initPortfolioSlider();
            initProjectCards();
        },
    });
});
