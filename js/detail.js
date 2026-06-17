/* ==========================================================================
   CAM NANG SO BÌNH ĐẲNG GIỚI & KỸ NĂNG SỐ - JAVASCRIPT HỖ TRỢ ĐỌC BÀI VIẾT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Lấy khu vực chứa văn bản nội dung bài viết chính
  const articleContent = document.querySelector('.article-body');
  const decreaseBtn = document.getElementById('btn-font-decrease');
  const resetBtn = document.getElementById('btn-font-reset');
  const increaseBtn = document.getElementById('btn-font-increase');

  // Đánh dấu đã đọc (Giả lập Client-side local check)
  const markReadBtn = document.getElementById('btn-mark-read');

  if (!articleContent) return; // Chỉ kích hoạt trên các trang chi tiết có nội dung bài viết chính

  // Thiết lập các cỡ chữ (tính bằng rem)
  const fontSizes = {
    small: '0.9rem',
    normal: '1.05rem',
    large: '1.25rem',
    xlarge: '1.5rem'
  };

  // Các bước cỡ chữ tương ứng
  const steps = ['small', 'normal', 'large', 'xlarge'];
  let currentStepIndex = 1; // Mặc định là 'normal' (chỉ số 1)

  // Khôi phục tùy chọn cỡ chữ từ localStorage (nếu người dùng đã đặt từ trước)
  const savedFontSizeStep = localStorage.getItem('userFontSizeStep');
  if (savedFontSizeStep && steps.includes(savedFontSizeStep)) {
    currentStepIndex = steps.indexOf(savedFontSizeStep);
    applyFontSize(savedFontSizeStep);
  }

  function applyFontSize(step) {
    // Thay đổi cỡ chữ của các đoạn văn và thẻ danh sách trong bài viết chính
    const targets = articleContent.querySelectorAll('p, li, td, span:not(.no-resize)');
    targets.forEach(el => {
      el.style.fontSize = fontSizes[step];
    });

    // Thay đổi độ cao của dòng tương ứng để không bị chồng chéo chữ
    if (step === 'xlarge') {
      articleContent.style.lineHeight = '1.8';
    } else {
      articleContent.style.lineHeight = '1.6';
    }

    // Đánh dấu nút đang hoạt động
    updateResizerUI();
    
    // Lưu vào bộ nhớ cục bộ trình duyệt
    localStorage.setItem('userFontSizeStep', step);
  }

  function updateResizerUI() {
    if (decreaseBtn && resetBtn && increaseBtn) {
      // Bật/tắt trạng thái disable của nút nếu đã đạt đến giới hạn nhỏ nhất/lớn nhất
      decreaseBtn.disabled = currentStepIndex === 0;
      increaseBtn.disabled = currentStepIndex === steps.length - 1;

      // Đổi opacity nút để người dùng dễ nhận biết
      decreaseBtn.style.opacity = currentStepIndex === 0 ? '0.5' : '1';
      increaseBtn.style.opacity = currentStepIndex === steps.length - 1 ? '0.5' : '1';
    }
  }

  // Sự kiện nút Tăng cỡ chữ
  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        applyFontSize(steps[currentStepIndex]);
      }
    });
  }

  // Sự kiện nút Giảm cỡ chữ
  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      if (currentStepIndex > 0) {
        currentStepIndex--;
        applyFontSize(steps[currentStepIndex]);
      }
    });
  }

  // Sự kiện đặt lại cỡ chữ mặc định
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentStepIndex = 1; // Trở về 'normal'
      applyFontSize(steps[currentStepIndex]);
    });
  }

  // Khởi chạy giao diện nút ban đầu
  updateResizerUI();

  // 2. GIẢ LẬP ĐÁNH DẤU "ĐÃ ĐỌC XONG" BÀI VIẾT
  if (markReadBtn) {
    const pageId = window.location.pathname.split('/').pop(); // Lấy tên file hiện tại làm ID bài học
    
    // Kiểm tra trạng thái đã đọc trước đó
    if (localStorage.getItem(`read-${pageId}`) === 'true') {
      setAsRead();
    }

    markReadBtn.addEventListener('click', () => {
      localStorage.setItem(`read-${pageId}`, 'true');
      setAsRead();
      
      // Hiển thị thông báo toast nhỏ
      showToast('Đã đánh dấu hoàn thành bài học này.');
    });

    function setAsRead() {
      markReadBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg> Đã đọc hoàn thành
      `;
      markReadBtn.style.backgroundColor = 'var(--color-primary-light)';
      markReadBtn.style.color = 'var(--color-primary)';
      markReadBtn.style.borderColor = 'var(--color-primary)';
      markReadBtn.disabled = true;
    }
  }

  // Tạo hàm thông báo Toast đơn giản
  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background-color: var(--color-primary-dark);
      color: #FFFFFF;
      padding: 12px 24px;
      border-radius: var(--radius-pill);
      box-shadow: var(--shadow-medium);
      font-size: 0.95rem;
      font-weight: 500;
      opacity: 0;
      z-index: 3000;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Tạo hiệu ứng trượt lên
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    }, 50);

    // Tự động biến mất sau 3 giây
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3000);
  }
});
