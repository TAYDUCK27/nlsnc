/* ==========================================================================
   CAM NANG SO BÌNH ĐẲNG GIỚI & KỸ NĂNG SỐ - JAVASCRIPT NAVBAR DI ĐỘNG
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  // 1. HIỆU ỨNG THU NHỎ HEADER KHI CUỘN CHUỘT (STICKY HEADER)
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Chạy kiểm tra ngay khi load xong trang đề phòng reload đang ở giữa trang

  // 2. ĐÓNG MỞ MENU MOBILE HAMBURGER
  const toggleMobileMenu = () => {
    const isActive = hamburgerBtn.classList.contains('active');

    if (isActive) {
      // Đóng menu
      hamburgerBtn.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = ''; // Cho phép cuộn trang trở lại
    } else {
      // Mở menu
      hamburgerBtn.classList.add('active');
      mobileNavOverlay.classList.add('active');
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden'; // Ngăn chặn cuộn trang phía sau menu
    }
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  if (mobileNavOverlay) {
    // Click vào vùng mờ overlay ngoài menu để đóng menu
    mobileNavOverlay.addEventListener('click', toggleMobileMenu);
  }

  // Tự động đóng menu nếu người dùng thay đổi kích thước trình duyệt sang màn hình lớn
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && hamburgerBtn && hamburgerBtn.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
});
