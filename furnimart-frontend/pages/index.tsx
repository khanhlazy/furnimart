import Head from 'next/head';
import Link from 'next/link';

const roles = [
  {
    title: 'Khách hàng',
    summary: 'Mua sắm nội thất với tìm kiếm, bộ lọc, 3D viewer và theo dõi đơn hàng thời gian thực.',
    href: '/products',
  },
  {
    title: 'Nhân viên cửa hàng',
    summary: 'Quản lý sản phẩm, tồn kho và xác nhận đơn hàng trực tiếp tại chi nhánh.',
    href: '/admin',
  },
  {
    title: 'Quản lý chi nhánh',
    summary: 'Giám sát doanh thu, phân công giao hàng và theo dõi hiệu suất chi nhánh.',
    href: '/admin',
  },
  {
    title: 'Nhân viên giao hàng',
    summary: 'Nhận đơn đã phân công, cập nhật trạng thái giao và báo cáo giao thất bại.',
    href: '/admin',
  },
  {
    title: 'Quản trị viên',
    summary: 'Điều hành toàn hệ thống với cấu hình, danh mục và phê duyệt tài khoản.',
    href: '/admin',
  },
];

const highlights = [
  'Thanh toán an toàn với ví điện tử và thẻ',
  'Trình xem 3D/WebGL trên trang sản phẩm',
  'Theo dõi đơn hàng và giao hàng realtime',
  'Quy trình checkout đa bước với địa chỉ lưu sẵn',
  'Bảng điều khiển cho từng vai trò rõ ràng',
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>FurniMart | Nền tảng nội thất đa vai trò</title>
      </Head>
      <div className="page-shell">
        <nav className="navbar">
          <div className="brand">
            <span className="brand-badge">FM</span>
            FurniMart Experience
          </div>
          <div className="nav-links">
            <Link className="nav-chip active" href="/">Tổng quan</Link>
            <Link className="nav-chip" href="/products">Sản phẩm</Link>
            <Link className="nav-chip" href="/cart">Giỏ hàng</Link>
            <Link className="nav-chip" href="/checkout">Checkout</Link>
            <Link className="nav-chip" href="/account">Tài khoản</Link>
            <Link className="nav-chip" href="/admin">Quản trị</Link>
          </div>
        </nav>

        <div className="hero">
          <div className="hero-card">
            <p className="status-pill">UI prototype · Web & Mobile</p>
            <h1 className="hero-title">FurniMart – thiết kế trải nghiệm cho 5 vai trò</h1>
            <p className="hero-subtitle">
              Từ trình duyệt web đến ứng dụng di động, FurniMart cung cấp hành trình mua sắm nội
              thất đầy đủ: khám phá sản phẩm 3D, thanh toán, chat hỗ trợ và vận hành hậu cần cho từng vai trò.
            </p>
            <div className="badge-row">
              {highlights.map((item) => (
                <span className="badge" key={item}>{item}</span>
              ))}
            </div>
            <Link className="primary-btn" href="/products">
              Bắt đầu mua sắm →
            </Link>
          </div>
          <div className="hero-card">
            <h3>Luồng nhanh</h3>
            <ol className="timeline">
              <li className="timeline-item">Khách chọn sản phẩm, xem 3D và thêm vào giỏ</li>
              <li className="timeline-item">Thực hiện checkout: địa chỉ, giao hàng, thanh toán</li>
              <li className="timeline-item">Nhân viên cửa hàng xác nhận và đóng gói</li>
              <li className="timeline-item">Quản lý phân công giao và theo dõi tiến độ</li>
              <li className="timeline-item">Nhân viên giao hoàn tất, khách đánh giá sản phẩm</li>
            </ol>
          </div>
        </div>

        <div className="section-header">
          <h2>Vai trò và giao diện</h2>
          <span className="status-pill">Responsive · Dark UI</span>
        </div>
        <div className="grid">
          {roles.map((role) => (
            <div className="card" key={role.title}>
              <h3>{role.title}</h3>
              <p>{role.summary}</p>
              <div className="badge-row">
                <span className="badge">Dashboard</span>
                <span className="badge">Realtime</span>
                <span className="badge">Bảo mật</span>
              </div>
              <Link className="secondary-btn" href={role.href}>
                Xem giao diện →
              </Link>
            </div>
          ))}
        </div>

        <div className="section-header">
          <h2>Hành trình khách hàng</h2>
          <span className="status-pill">Khám phá · Giỏ · Thanh toán · Theo dõi</span>
        </div>
        <div className="grid">
          <div className="card">
            <h3>Trang sản phẩm & tìm kiếm</h3>
            <p>Thanh tìm kiếm, lọc nâng cao, sắp xếp, và lưới sản phẩm với giá, đánh giá sao.</p>
            <div className="badge-row">
              <span className="badge">Bộ lọc giá/màu</span>
              <span className="badge">Sắp xếp</span>
              <span className="badge">Infinite scroll</span>
            </div>
          </div>
          <div className="card">
            <h3>Chi tiết sản phẩm 3D</h3>
            <p>Thư viện ảnh + WebGL 3D, chọn biến thể, trạng thái còn hàng theo chi nhánh.</p>
            <div className="badge-row">
              <span className="badge">Zoom/Rotate 3D</span>
              <span className="badge">Biến thể màu</span>
              <span className="badge">CTA Mua ngay</span>
            </div>
          </div>
          <div className="card">
            <h3>Giỏ hàng & mã giảm giá</h3>
            <p>Điều chỉnh số lượng, cảnh báo tồn kho, áp dụng coupon và xem tóm tắt chi phí.</p>
            <div className="badge-row">
              <span className="badge">Cảnh báo tồn</span>
              <span className="badge">Coupon</span>
              <span className="badge">Tổng tiền realtime</span>
            </div>
          </div>
          <div className="card">
            <h3>Thanh toán đa bước</h3>
            <p>Địa chỉ, vận chuyển, thanh toán (COD, ví, thẻ) và xác nhận đơn với mã đơn hàng.</p>
            <div className="badge-row">
              <span className="badge">Địa chỉ lưu</span>
              <span className="badge">Ví điện tử</span>
              <span className="badge">Xác nhận</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
