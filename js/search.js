/* ==========================================================================
   CAM NANG SO BÌNH ĐẲNG GIỚI & KỸ NĂNG SỐ - BỘ MÁY GỢI Ý TÌM KIẾM THÔNG MINH
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const searchInputs = document.querySelectorAll('.search-input');
  const cardsContainer = document.querySelector('.card-grid, .card-grid-3');
  
  if (!cardsContainer) return; // Chỉ chạy nếu có danh sách card trên trang

  const cards = cardsContainer.querySelectorAll('.card');
  const searchDatabase = [];

  // ==========================================
  // PHẦN 1. XÂY DỰNG CƠ SỞ DỮ LIỆU TÌM KIẾM ĐỘNG (SEARCH SUGGESTIONS INDEX)
  // ==========================================
  cards.forEach(card => {
    const modalBtn = card.querySelector('[data-open-modal]');
    if (!modalBtn) return;
    
    const topicId = modalBtn.getAttribute('data-open-modal');
    const cardTitle = card.querySelector('h3, .card-title, h4')?.textContent?.trim() || '';
    const cardDesc = card.querySelector('p')?.textContent?.trim() || '';
    
    // 1. Chỉ mục chính của thẻ Card
    searchDatabase.push({
      type: 'main',
      topicId: topicId,
      title: cardTitle,
      subtitle: `Xem toàn bộ bài viết về: ${cardTitle}`,
      searchText: (cardTitle + ' ' + cardDesc).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      targetSection: 'article',
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      `
    });

    // 2. Quét nội dung chi tiết ẩn bên trong Modal tương ứng để lập chỉ mục chuyên sâu
    const template = document.getElementById(`modal-data-${topicId}`);
    if (template) {
      // A. Quét tất cả các tiêu đề h2, h3 để làm chủ đề con
      const headings = template.querySelectorAll('.article-text-content h2, .article-text-content h3');
      headings.forEach(heading => {
        const headingText = heading.textContent.trim();
        if (headingText && !heading.classList.contains('no-resize')) {
          // Lấy thêm ngữ cảnh văn bản ngay bên dưới tiêu đề để tìm kiếm chính xác hơn
          let contextText = '';
          let sibling = heading.nextElementSibling;
          let count = 0;
          while (sibling && sibling.tagName !== 'H2' && sibling.tagName !== 'H3' && count < 3) {
            contextText += ' ' + sibling.textContent;
            sibling = sibling.nextElementSibling;
            count++;
          }

          searchDatabase.push({
            type: 'sub',
            topicId: topicId,
            title: headingText,
            subtitle: `Nội dung thuộc: ${cardTitle}`,
            searchText: (headingText + ' ' + cardTitle + ' ' + contextText).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            targetSection: 'heading',
            headingSelector: headingText,
            icon: `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            `
          });
        }
      });

      // B. Chỉ mục cho Bài giảng PowerPoint
      const slides = template.querySelector('.slides-section');
      if (slides) {
        searchDatabase.push({
          type: 'slides',
          topicId: topicId,
          title: 'Bài giảng trình chiếu (PowerPoint Slides)',
          subtitle: `Trình bày tóm tắt: ${cardTitle}`,
          searchText: ('powerpoint slide trinh chieu bai giang giao an bai hoc ' + cardTitle).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          targetSection: 'slides',
          icon: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14zM9 7.5c0-.83.67-1.5 1.5-1.5h3c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5v-3z"/>
            </svg>
          `
        });
      }

      // C. Chỉ mục cho Bản tin âm thanh
      const audio = template.querySelector('.audio-section');
      if (audio) {
        searchDatabase.push({
          type: 'audio',
          topicId: topicId,
          title: 'Bản tin phát thanh (Audio Podcast)',
          subtitle: `Nghe đọc tuyên truyền: ${cardTitle}`,
          searchText: ('audio podcast am thanh phat thanh nghe loa phat thanh nhac nen mp3 ' + cardTitle).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          targetSection: 'audio',
          icon: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          `
        });
      }

      // C1. Chỉ mục cho Video giải thích/tuyên truyền
      const video = template.querySelector('.video-section');
      if (video) {
        searchDatabase.push({
          type: 'video',
          topicId: topicId,
          title: 'Video tuyên truyền giải thích ngắn',
          subtitle: `Xem video clip: ${cardTitle}`,
          searchText: ('video clip phim xem clip xem video minh hoa phong su giai thich ' + cardTitle).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          targetSection: 'video',
          icon: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          `
        });
      }

      // D. Chỉ mục cho Cán bộ tư vấn địa phương
      const support = template.querySelector('.support-widget, .support-people');
      if (support) {
        searchDatabase.push({
          type: 'support',
          topicId: topicId,
          title: 'Thông tin cán bộ tư vấn tại Xã/Bản',
          subtitle: `Liên hệ hỗ trợ: ${cardTitle}`,
          searchText: ('can bo tu van ho tro dien thoai hot line hoi phu nu nguoi lien he ' + cardTitle).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          targetSection: 'support',
          icon: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          `
        });
      }
    }
  });

  // ==========================================
  // PHẦN 2. KHỞI TẠO BẢNG GỢI Ý (SUGGESTIONS DROPDOWN DOM)
  // ==========================================
  const searchContainers = document.querySelectorAll('.search-container');
  searchContainers.forEach(container => {
    // Tạo và chèn Hộp gợi ý nổi (.search-dropdown) vào mỗi container tìm kiếm
    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.style.display = 'none';
    container.appendChild(dropdown);
  });

  // Hàm ẩn toàn bộ bảng gợi ý
  const hideAllDropdowns = () => {
    document.querySelectorAll('.search-dropdown').forEach(dropdown => {
      dropdown.style.display = 'none';
      dropdown.innerHTML = '';
    });
  };

  // Hàm lọc gợi ý và hiển thị trên bảng tương ứng
  const handleSearchInput = (inputVal, containerEl) => {
    const dropdown = containerEl.querySelector('.search-dropdown');
    if (!dropdown) return;

    const cleanQuery = inputVal.toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (cleanQuery.length === 0) {
      dropdown.style.display = 'none';
      dropdown.innerHTML = '';
      return;
    }

    // Lọc các bản ghi khớp với từ khóa
    const matches = searchDatabase.filter(record => record.searchText.includes(cleanQuery)).slice(0, 6);

    dropdown.innerHTML = '';

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div class="dropdown-no-results">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#889A90" style="margin-bottom: 8px;">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <div>Không tìm thấy dòng nội dung phù hợp</div>
        </div>
      `;
    } else {
      matches.forEach(match => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.innerHTML = `
          <div class="dropdown-item-icon">${match.icon}</div>
          <div class="dropdown-item-text">
            <div class="dropdown-item-title">${match.title}</div>
            <div class="dropdown-item-subtitle">${match.subtitle}</div>
          </div>
        `;

        // Gắn sự kiện click mở modal
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          hideAllDropdowns();
          
          // Làm trống ô tìm kiếm và bỏ focus
          const input = containerEl.querySelector('.search-input');
          if (input) {
            input.value = '';
            input.blur();
          }

          // Gọi hàm mở Modal toàn cục đã định nghĩa trong modal.js
          if (window.openDetailModal) {
            window.openDetailModal(match.topicId, match.targetSection, match.headingSelector);
          }
        });

        dropdown.appendChild(item);
      });
    }

    dropdown.style.display = 'block';
  };

  // ==========================================
  // PHẦN 3. BIND SỰ KIỆN CHO CÁC Ô TÌM KIẾM
  // ==========================================
  searchInputs.forEach(input => {
    const container = input.closest('.search-container');

    // Sự kiện gõ phím
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      
      // Đồng bộ giá trị gõ phím giữa ô Desktop và Mobile
      searchInputs.forEach(otherInput => {
        if (otherInput !== input) {
          otherInput.value = val;
        }
      });

      if (container) {
        handleSearchInput(val, container);
      }
    });

    // Mở gợi ý khi focus vào nếu ô đã có chữ
    input.addEventListener('focus', (e) => {
      if (e.target.value.trim().length > 0 && container) {
        handleSearchInput(e.target.value, container);
      }
    });

    // Hỗ trợ phím mũi tên và Enter
    input.addEventListener('keydown', (e) => {
      if (container) {
        const dropdown = container.querySelector('.search-dropdown');
        if (dropdown && dropdown.style.display === 'block') {
          const items = dropdown.querySelectorAll('.dropdown-item');
          if (items.length > 0) {
            if (e.key === 'Enter') {
              e.preventDefault();
              items[0].click(); // Chọn gợi ý đầu tiên
            }
          }
        }
      }
    });
  });

  // Đóng gợi ý khi nhấp chuột ra ngoài
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      hideAllDropdowns();
    }
  });
});
