/* ==========================================================================
   CAM NANG SO BÌNH ĐẲNG GIỚI & KỸ NĂNG SỐ - JAVASCRIPT SCROLL REVEAL ANIMATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Tìm tất cả các phần tử có gắn class reveal hoạ ảnh trượt xuất hiện
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealElements.length === 0) return;

  // Cấu hình điểm kích hoạt hoạt ảnh (xuất hiện khi lướt qua 15% diện tích phần tử)
  const observerOptions = {
    root: null, // Sử dụng khung nhìn toàn màn hình trình duyệt
    rootMargin: '0px 0px -8% 0px', // Kích hoạt sớm hơn một chút khi lướt xuống
    threshold: 0.15 // Kích hoạt khi ít nhất 15% diện tích phần tử hiển thị
  };

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Thêm class active để kích hoạt CSS Transition trượt hiện
        entry.target.classList.add('active');
        // Sau khi đã hiển thị xong thì ngừng quan sát để tối ưu bộ nhớ trình duyệt
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(revealCallback, observerOptions);

  // Bắt đầu quan sát từng phần tử trượt hiện
  revealElements.forEach(el => {
    observer.observe(el);
  });
});
