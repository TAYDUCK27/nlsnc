/* ==========================================================================
   CAM NANG SO BÌNH ĐẲNG GIỚI & KỸ NĂNG SỐ - JAVASCRIPT HỘP THOẠI POPUP MODAL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // PHẦN 1. HỘP THOẠI PHÓNG TO ẢNH (IMAGE LIGHTBOX MODAL)
  // ==========================================
  
  // Tự động tạo và chèn HTML Lightbox Modal vào cuối body
  const lightboxModal = document.createElement('div');
  lightboxModal.id = 'custom-lightbox';
  lightboxModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(28, 45, 36, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    z-index: 2100; /* Cao hơn detail modal (2000) */
    transition: opacity 0.3s ease, visibility 0.3s ease;
    cursor: pointer;
  `;

  lightboxModal.innerHTML = `
    <button id="lightbox-close" style="
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      color: #FFFFFF;
      font-size: 40px;
      cursor: pointer;
      line-height: 1;
      padding: 10px;
      transition: transform 0.2s ease;
    ">&times;</button>
    <div style="max-width: 90%; max-height: 85%; display: flex; flex-direction: column; align-items: center; gap: 12px;">
      <img id="lightbox-img" class="lightbox-img-animate" src="" alt="Hình phóng to" style="
        max-width: 100%;
        max-height: 80vh;
        border-radius: var(--radius-md, 16px);
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        object-fit: contain;
      ">
      <p id="lightbox-caption" style="
        color: #E2EAE5;
        font-size: 1.05rem;
        text-align: center;
        margin: 0;
        padding: 5px 20px;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 20px;
      "></p>
    </div>
  `;

  document.body.appendChild(lightboxModal);

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close');

  // Hàm mở Lightbox
  const openLightbox = (imgSrc, altText) => {
    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = altText || 'Hình ảnh thực tế';
    lightboxModal.style.opacity = '1';
    lightboxModal.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
  };

  // Hàm đóng Lightbox
  const closeLightbox = () => {
    lightboxModal.style.opacity = '0';
    lightboxModal.style.visibility = 'hidden';
    if (!document.getElementById('global-detail-modal').classList.contains('show')) {
      document.body.style.overflow = ''; // Chỉ mở lại cuộn trang chính nếu detail modal không mở
    }
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300);
  };

  // Gắn sự kiện click cho các ảnh gallery có sẵn trên trang
  const galleryImages = document.querySelectorAll('.gallery-grid img, .gallery-item img, [data-lightbox]');
  galleryImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src, img.alt);
    });
  });

  // Sự kiện đóng của Lightbox
  lightboxModal.addEventListener('click', closeLightbox);
  lightboxCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });


  // ==========================================
  // PHẦN 2. HỘP THOẠI POPUP CHI TIẾT BÀI VIẾT (ARTICLE DETAIL MODAL)
  // ==========================================
  const modalButtons = document.querySelectorAll('[data-open-modal]');
  
  if (modalButtons.length > 0) {
    // Tự động tạo và chèn HTML Detail Modal
    const detailModal = document.createElement('div');
    detailModal.id = 'global-detail-modal';
    detailModal.className = 'detail-modal';
    detailModal.innerHTML = `
      <div class="detail-modal-content">
        <!-- Nút quay lại nhỏ ở góc trên bên trái -->
        <span class="back-modal-corner-btn" id="back-detail-modal-btn" title="Quay lại danh sách">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </span>
        <span class="close-detail-modal" id="close-detail-modal-btn" title="Đóng">&times;</span>
        <div id="detail-modal-body"></div>
      </div>
    `;
    document.body.appendChild(detailModal);

    const modalBody = document.getElementById('detail-modal-body');
    const detailModalCloseBtn = document.getElementById('close-detail-modal-btn');
    const backDetailModalBtn = document.getElementById('back-detail-modal-btn');

    // Hàm mở Detail Modal hỗ trợ cuộn đến phần cụ thể
    const openDetailModal = (topicId, targetSection, headingText) => {
      const template = document.getElementById(`modal-data-${topicId}`);
      if (template) {
        modalBody.innerHTML = template.innerHTML;
        detailModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Khởi động các tính năng phụ trợ bên trong bài viết vừa nạp vào modal
        initializeModalContentHelpers(modalBody);

        // Đảm bảo cuộn mượt đến phần mục tiêu nếu có
        if (targetSection) {
          setTimeout(() => {
            let element = null;
            if (targetSection === 'slides') {
              element = modalBody.querySelector('.slides-section');
            } else if (targetSection === 'audio') {
              element = modalBody.querySelector('.audio-section');
            } else if (targetSection === 'video') {
              element = modalBody.querySelector('.video-section');
            } else if (targetSection === 'support') {
              element = modalBody.querySelector('.support-widget, .support-people');
            } else if (targetSection === 'heading' && headingText) {
              const headings = modalBody.querySelectorAll('.article-text-content h2, .article-text-content h3');
              for (let h of headings) {
                if (h.textContent.trim().toLowerCase().includes(headingText.toLowerCase().trim())) {
                  element = h;
                  break;
                }
              }
            } else if (targetSection === 'article') {
              element = modalBody.querySelector('.article-text-content');
            }

            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Tạo hiệu ứng phát sáng nhẹ để người dùng chú ý
              element.classList.add('highlight-glow');
              setTimeout(() => {
                element.classList.remove('highlight-glow');
              }, 2500);
            }
          }, 350); // Khoảng thời chờ hoạt ảnh modal trượt lên hoàn tất
        }
      }
    };

    // Khai báo ra phạm vi toàn cục để file search.js có thể gọi
    window.openDetailModal = openDetailModal;

    // Hàm đóng Detail Modal
    const closeDetailModal = () => {
      detailModal.classList.remove('show');
      document.body.style.overflow = '';
      modalBody.innerHTML = '';
    };

    // Khởi tạo các trợ lý đọc và sự kiện ảnh zoom trong bài viết modal
    const initializeModalContentHelpers = (container) => {
      const decreaseBtn = container.querySelector('#btn-font-decrease');
      const resetBtn = container.querySelector('#btn-font-reset');
      const increaseBtn = container.querySelector('#btn-font-increase');
      const articleText = container.querySelector('.article-text-content');

      // 1. Tiện ích tăng giảm cỡ chữ trong modal
      if (articleText) {
        const fontSizes = {
          small: '0.9rem',
          normal: '1.05rem',
          large: '1.25rem',
          xlarge: '1.5rem'
        };
        const steps = ['small', 'normal', 'large', 'xlarge'];
        let currentStepIndex = 1;

        const savedFontSizeStep = localStorage.getItem('userFontSizeStep');
        if (savedFontSizeStep && steps.includes(savedFontSizeStep)) {
          currentStepIndex = steps.indexOf(savedFontSizeStep);
          applyFontSize(savedFontSizeStep);
        }

        function applyFontSize(step) {
          const targets = articleText.querySelectorAll('p, li, td, span:not(.no-resize)');
          targets.forEach(el => {
            el.style.fontSize = fontSizes[step];
          });
          articleText.style.lineHeight = step === 'xlarge' ? '1.8' : '1.6';
          localStorage.setItem('userFontSizeStep', step);
          updateResizerUI();
        }

        function updateResizerUI() {
          if (decreaseBtn && resetBtn && increaseBtn) {
            decreaseBtn.disabled = currentStepIndex === 0;
            increaseBtn.disabled = currentStepIndex === steps.length - 1;
            decreaseBtn.style.opacity = currentStepIndex === 0 ? '0.5' : '1';
            increaseBtn.style.opacity = currentStepIndex === steps.length - 1 ? '0.5' : '1';
          }
        }

        if (increaseBtn) {
          increaseBtn.addEventListener('click', () => {
            if (currentStepIndex < steps.length - 1) {
              currentStepIndex++;
              applyFontSize(steps[currentStepIndex]);
            }
          });
        }
        if (decreaseBtn) {
          decreaseBtn.addEventListener('click', () => {
            if (currentStepIndex > 0) {
              currentStepIndex--;
              applyFontSize(steps[currentStepIndex]);
            }
          });
        }
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            currentStepIndex = 1;
            applyFontSize(steps[currentStepIndex]);
          });
        }

        updateResizerUI();
      }

      // 2. Gắn Lightbox cho các hình ảnh trong nội dung bài viết modal
      const modalImages = container.querySelectorAll('img[data-lightbox="true"], img');
      modalImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(img.src, img.alt);
        });
      });

      // 3. Gắn sự kiện đóng cho nút Quay lại ở cuối bài viết trong modal
      const backModalBtns = container.querySelectorAll('.close-modal-action-btn');
      backModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          closeDetailModal();
        });
      });

      // 4. Gắn sự kiện cho các nút chuyển đổi nhanh chủ đề bên trong modal
      const switchBtns = container.querySelectorAll('[data-switch-modal]');
      switchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const nextTopicId = btn.getAttribute('data-switch-modal');
          openDetailModal(nextTopicId);
        });
      });
    };

    // Gắn sự kiện click mở modal cho các nút bấm Xem chi tiết
    modalButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const topicId = btn.getAttribute('data-open-modal');
        openDetailModal(topicId);
      });
    });

    // Gắn sự kiện click cho các tag chủ đề con ngoài thẻ Card
    const subtopicTags = document.querySelectorAll('.subtopic-tag');
    subtopicTags.forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Ngăn kích hoạt stretched-link của thẻ card bọc ngoài
        const topicId = tag.getAttribute('data-open-modal');
        const targetSection = tag.getAttribute('data-target-section');
        openDetailModal(topicId, targetSection);
      });
    });

    // Sự kiện đóng của Detail Modal
    detailModalCloseBtn.addEventListener('click', closeDetailModal);
    if (backDetailModalBtn) {
      backDetailModalBtn.addEventListener('click', closeDetailModal);
    }
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        closeDetailModal();
      }
    });

    // Hỗ trợ đóng modal bằng phím ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && detailModal.classList.contains('show')) {
        closeDetailModal();
      }
    });
  }

  // Tải đóng cả 2 modal bằng ESC (đảm bảo dự phòng)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal.style.visibility === 'visible') {
        closeLightbox();
      }
    }
  });

});
