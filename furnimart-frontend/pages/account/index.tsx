import Head from 'next/head';
import Link from 'next/link';

const addresses = [
  '123 Lê Lợi, Quận 1, TP.HCM',
  '25 Trần Não, TP. Thủ Đức',
];

const paymentMethods = ['Visa **** 4242', 'Momo đã liên kết', 'ZaloPay đã liên kết'];

export default function AccountPage() {
  return (
    <>
      <Head>
        <title>Tài khoản | FurniMart</title>
      </Head>
      <div className="page-shell">
        <nav className="navbar">
          <div className="brand">
            <span className="brand-badge">FM</span>
            Hồ sơ khách hàng
          </div>
          <div className="nav-links">
            <Link className="nav-chip" href="/">Tổng quan</Link>
            <Link className="nav-chip" href="/orders">Đơn hàng</Link>
            <span className="nav-chip active">Tài khoản</span>
          </div>
        </nav>

        <div className="section-header">
          <h2>Thông tin cá nhân</h2>
          <span className="status-pill">Đổi mật khẩu · Lưu địa chỉ</span>
        </div>
        <div className="grid">
          <div className="card">
            <h3>Hồ sơ</h3>
            <p>Nguyễn An · an.nguyen@example.com · 0901 234 567</p>
            <div className="badge-row">
              <span className="badge">Thành viên Silver</span>
              <span className="badge">Nhận thông báo</span>
            </div>
          </div>
          <div className="card">
            <h3>Địa chỉ đã lưu</h3>
            <div className="timeline">
              {addresses.map((address) => (
                <div className="timeline-item" key={address}>{address}</div>
              ))}
            </div>
            <Link className="secondary-btn" href="/checkout">Chọn khi checkout</Link>
          </div>
          <div className="card">
            <h3>Phương thức thanh toán</h3>
            <div className="timeline">
              {paymentMethods.map((method) => (
                <div className="timeline-item" key={method}>{method}</div>
              ))}
            </div>
            <Link className="secondary-btn" href="/checkout">Quản lý khi thanh toán</Link>
          </div>
          <div className="card">
            <h3>Lịch sử đơn hàng</h3>
            <p>Theo dõi trạng thái giao, đánh giá sản phẩm đã mua.</p>
            <div className="badge-row">
              <span className="badge">Timeline giao</span>
              <span className="badge">Đánh giá</span>
            </div>
            <Link className="primary-btn" href="/checkout">Xem đơn gần nhất →</Link>
          </div>
        </div>
      </div>
    </>
  );
}
