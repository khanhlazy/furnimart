import Head from 'next/head';
import Link from 'next/link';

const steps = ['Địa chỉ giao hàng', 'Phương thức giao', 'Thanh toán', 'Xác nhận'];

export default function CheckoutPage() {
  return (
    <>
      <Head>
        <title>Checkout | FurniMart</title>
      </Head>
      <div className="page-shell">
        <nav className="navbar">
          <div className="brand">
            <span className="brand-badge">FM</span>
            Thanh toán
          </div>
          <div className="nav-links">
            <Link className="nav-chip" href="/cart">Giỏ hàng</Link>
            <span className="nav-chip active">Checkout</span>
            <Link className="nav-chip" href="/account">Tài khoản</Link>
          </div>
        </nav>

        <div className="section-header">
          <h2>Quy trình nhiều bước</h2>
          <span className="status-pill">Lưu địa chỉ & ví điện tử</span>
        </div>
        <div className="timeline">
          {steps.map((step, index) => (
            <div className="timeline-item" key={step}>
              <strong>Bước {index + 1}:</strong> {step}
            </div>
          ))}
        </div>

        <div className="section-header">
          <h2>Tóm tắt đơn</h2>
          <span className="status-pill">Mã đơn #FM-10293</span>
        </div>
        <div className="grid">
          <div className="card">
            <h3>Địa chỉ giao</h3>
            <p>Nguyễn An, 123 Lê Lợi, Quận 1, TP.HCM</p>
            <div className="badge-row">
              <span className="badge">Lưu mặc định</span>
              <span className="badge">Nhận tại cửa hàng: Q1</span>
            </div>
          </div>
          <div className="card">
            <h3>Giao hàng</h3>
            <p>Giao nhanh · Dự kiến 24h</p>
            <div className="badge-row">
              <span className="badge">Phí 50.000đ</span>
              <span className="badge">Theo dõi realtime</span>
            </div>
          </div>
          <div className="card">
            <h3>Thanh toán</h3>
            <p>Momo / ZaloPay / Thẻ tín dụng</p>
            <div className="badge-row">
              <span className="badge">3D Secure</span>
              <span className="badge">Lưu thẻ token</span>
            </div>
          </div>
          <div className="card">
            <h3>Xác nhận</h3>
            <p>Hiển thị tóm tắt, áp dụng mã giảm giá, nút Đặt hàng.</p>
            <div className="badge-row">
              <span className="badge">Email & push</span>
              <span className="badge">Mã đơn tức thì</span>
            </div>
            <Link className="primary-btn" href="/account">Xem đơn của tôi →</Link>
          </div>
        </div>
      </div>
    </>
  );
}
