document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById("current-year");
    if (yearElement) yearElement.textContent = new Date().getFullYear().toString();

    // --- Filtering ---
    const projects = document.querySelectorAll(".project");
    const techSet = new Set();

    // Convert technologies to valid class/id format (e.g., C++ -> tech-cpp)
    const normalizeTech = (tech) => "tech-" + tech.toLowerCase().replace(/\+/g, 'p').replace(/#/g, 'sharp').replace(/[^a-z0-9]/g, '-');

    projects.forEach(project => {
        const h4s = project.querySelectorAll("h4");
        h4s.forEach(h4 => {
            if (h4.textContent.includes("Technologies")) {
                const ul = h4.nextElementSibling;
                if (ul && ul.tagName === "UL") {
                    ul.querySelectorAll("code").forEach(code => {
                        const techName = code.textContent.trim();
                        techSet.add(techName);
                        project.classList.add(normalizeTech(techName));
                    });
                }
            }
        });
    });

    const filterContainer = document.createElement("div");
    filterContainer.className = "filter-container";
    filterContainer.innerHTML = `<span class="filter-label">> Filter by Technologies:</span>`;

    const allBtn = document.createElement("button");
    allBtn.className = "filter-btn active";
    allBtn.textContent = "All";
    allBtn.dataset.tech = "all";
    filterContainer.appendChild(allBtn);

    Array.from(techSet).sort().forEach(tech => {
        const btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.textContent = tech;
        btn.dataset.tech = normalizeTech(tech);
        filterContainer.appendChild(btn);
    });

    const firstProject = document.querySelector(".project");
    if (firstProject) {
        firstProject.parentNode.insertBefore(filterContainer, firstProject);
    }

    const filterButtons = filterContainer.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const selectedTech = btn.dataset.tech;

            projects.forEach(project => {
                if (selectedTech === "all" || project.classList.contains(selectedTech)) {
                    project.style.display = "block";
                    project.style.animation = "none";
                    project.offsetHeight;
                    project.style.animation = "fadeIn 0.4s ease forwards";
                } else {
                    project.style.display = "none";
                }
            });
        });
    });

    // --- Carousels ---
    const carousels = document.querySelectorAll('.carousel-wrapper');

    carousels.forEach(wrapper => {
        const slidesContainer = wrapper.querySelector('.carousel-slides');
        const slides = slidesContainer.children;
        const totalSlides = slides.length;
        const prevBtn = wrapper.querySelector('.arrow.left');
        const nextBtn = wrapper.querySelector('.arrow.right');
        const dotsContainer = wrapper.querySelector('.carousel-controls');

        let currentIndex = 0;

        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach(d => d.classList.remove('active'));
            dots[currentIndex].classList.add('active');

            // Pause videos to prevent background audio/video playback
            Array.from(slides).forEach(slide => {
                if (slide.tagName === 'VIDEO') slide.pause();
            });
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    });
});
