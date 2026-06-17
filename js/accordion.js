/* ==========================================================================
   CAM NANG SO BÌNH ĐẲNG GIỚI & KỸ NĂNG SỐ - JAVASCRIPT ACCORDION FAQ
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (header && content) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Đóng toàn bộ các mục khác để tạo hiệu ứng chuyển tiếp chuyên nghiệp (Chỉ mở 1 mục duy nhất tại 1 thời điểm)
        accordionItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.accordion-content');
            if (otherContent) {
              otherContent.style.maxHeight = '0px';
            }
          }
        });

        // Toggle trạng thái của mục hiện tại
        if (isOpen) {
          item.classList.remove('active');
          content.style.maxHeight = '0px';
        } else {
          item.classList.add('active');
          // Đo độ cao thực tế của nội dung văn bản để trượt mở mượt mà
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  // Xử lý khi quay ngang điện thoại hoặc thay đổi kích thước cửa sổ để tính toán lại độ cao của accordion đang mở
  window.addEventListener('resize', () => {
    accordionItems.forEach(item => {
      if (item.classList.contains('active')) {
        const content = item.querySelector('.accordion-content');
        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  });
});
