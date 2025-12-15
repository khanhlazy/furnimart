import Head from 'next/head';
import Link from 'next/link';

const cartItems = [
  { name: 'Sofa góc Nordic', qty: 1, price: 12500000 },
  { name: 'Bàn ăn gỗ sồi', qty: 2, price: 7200000 },
];

const format = (value: number) => value.toLocaleString('vi-VN') + 'đ';

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <Head>
        <title>Giỏ hàng | FurniMart</title>
      </Head>
      <div className="page-shell">
        <nav className="navbar">
          <div className="brand">
            <span className="brand-badge">FM</span>
            Giỏ hàng
          </div>
          <div className="nav-links">
            <Link className="nav-chip" href="/products">Tiếp tục mua</Link>
            <span className="nav-chip active">Giỏ hàng</span>
            <Link className="nav-chip" href="/checkout">Thanh toán</Link>
          </div>
        </nav>

        <div className="section-header">
          <h2>Danh sách sản phẩm</h2>
          <span className="status-pill">Cập nhật số lượng & áp dụng coupon</span>
        </div>
        <table className="table-card">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{format(item.price)}</td>
                <td>{format(item.price * item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="section-header">
          <h2>Tổng kết</h2>
          <span className="status-pill">Mã giảm giá & phí vận chuyển</span>
        </div>
        <div className="card">
          <p>Tạm tính: {format(subtotal)}</p>
          <p>Phí vận chuyển dự kiến: 50.000đ</p>
          <p><strong>Tổng cộng: {format(subtotal + 50000)}</strong></p>
          <div className="badge-row">
            <span className="badge">Coupon: SUMMER23</span>
            <span className="badge">Cảnh báo tồn kho realtime</span>
          </div>
          <Link className="primary-btn" href="/checkout">Tiến hành thanh toán →</Link>
        </div>
      </div>
    </>
  );
}
