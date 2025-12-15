import Head from 'next/head';
import Link from 'next/link';

const cards = [
  { title: 'Người dùng', value: '5.320', desc: 'Tổng số tài khoản hoạt động' },
  { title: 'Đơn hôm nay', value: '482', desc: 'Toàn hệ thống' },
  { title: 'Chi nhánh', value: '12', desc: 'Đang hoạt động' },
  { title: 'Yêu cầu duyệt', value: '7', desc: 'Nhân sự & chi nhánh mới' },
];

const alerts = [
  '2 chi nhánh mới chờ phê duyệt',
  '5 phản hồi khách hàng cần xử lý',
  'Tỷ lệ giao trễ tuần này: 4%',
];

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin | FurniMart</title>
      </Head>
      <div className="page-shell">
        <nav className="navbar">
          <div className="brand">
            <span className="brand-badge">FM</span>
            Bảng điều khiển quản trị
          </div>
          <div className="nav-links">
            <Link className="nav-chip" href="/">Tổng quan</Link>
            <span className="nav-chip active">Admin</span>
            <Link className="nav-chip" href="/products">Sản phẩm</Link>
            <Link className="nav-chip" href="/account">Tài khoản</Link>
          </div>
        </nav>

        <div className="section-header">
          <h2>Số liệu nhanh</h2>
          <span className="status-pill">Realtime dashboard</span>
        </div>
        <div className="grid">
          {cards.map((card) => (
            <div className="card" key={card.title}>
              <h3>{card.title}</h3>
              <p className="hero-title">{card.value}</p>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="section-header">
          <h2>Cảnh báo</h2>
          <span className="status-pill">Vận hành & phê duyệt</span>
        </div>
        <div className="timeline">
          {alerts.map((alert) => (
            <div className="timeline-item" key={alert}>{alert}</div>
          ))}
        </div>

        <div className="section-header">
          <h2>Quản lý</h2>
          <span className="status-pill">Danh mục · Khuyến mãi · Cấu hình</span>
        </div>
        <div className="grid">
          <div className="card">
            <h3>Người dùng & phân quyền</h3>
            <p>Phê duyệt tài khoản nội bộ, khóa/mở khóa khách hàng, gán chi nhánh.</p>
            <Link className="primary-btn" href="/admin">Đi tới quản lý người dùng</Link>
          </div>
          <div className="card">
            <h3>Sản phẩm & danh mục</h3>
            <p>Quản lý cây danh mục, đồng bộ thông tin sản phẩm giữa các chi nhánh.</p>
            <Link className="primary-btn" href="/admin">Đi tới sản phẩm</Link>
          </div>
          <div className="card">
            <h3>Khuyến mãi</h3>
            <p>Tạo mã coupon, cấu hình thời gian hiệu lực và điều kiện sử dụng.</p>
            <Link className="primary-btn" href="/admin">Đi tới khuyến mãi</Link>
          </div>
          <div className="card">
            <h3>Báo cáo</h3>
            <p>Doanh thu theo chi nhánh, sản phẩm bán chạy, hiệu quả giao hàng.</p>
            <Link className="primary-btn" href="/admin">Đi tới báo cáo</Link>
          </div>
        </div>
      </div>
    </>
  );
}
