import Head from 'next/head';
import Link from 'next/link';

const filters = ['Giá', 'Danh mục', 'Màu sắc', 'Tồn kho', 'Khuyến mãi'];
const products = [
  { name: 'Sofa góc Nordic', price: '12.500.000đ', status: 'Còn 8 tại Q1', tags: ['3D', 'Hot'] },
  { name: 'Bàn ăn gỗ sồi', price: '7.200.000đ', status: 'Còn 3 tại Q7', tags: ['Sale', 'Best seller'] },
  { name: 'Ghế lounge Ari', price: '5.600.000đ', status: 'Còn 5 tại Thủ Đức', tags: ['3D'] },
  { name: 'Tủ quần áo cánh lùa', price: '9.900.000đ', status: 'Còn 2 tại Q3', tags: ['New'] },
];

export default function ProductListPage() {
  return (
    <>
      <Head>
        <title>Danh sách sản phẩm | FurniMart</title>
      </Head>
      <div className="page-shell">
        <nav className="navbar">
          <div className="brand">
            <span className="brand-badge">FM</span>
            Danh sách sản phẩm
          </div>
          <div className="nav-links">
            <Link className="nav-chip" href="/">Tổng quan</Link>
            <span className="nav-chip active">Tìm kiếm</span>
            <Link className="nav-chip" href="/cart">Giỏ hàng</Link>
            <Link className="nav-chip" href="/checkout">Checkout</Link>
          </div>
        </nav>

        <div className="section-header">
          <h2>Lọc & sắp xếp</h2>
          <span className="status-pill">Sidebar desktop · Drawer mobile</span>
        </div>
        <div className="badge-row">
          {filters.map((item) => (
            <span className="badge" key={item}>{item}</span>
          ))}
          <span className="badge">Sắp xếp: Giá ↑</span>
        </div>

        <div className="section-header">
          <h2>Kết quả</h2>
          <span className="status-pill">{products.length} sản phẩm</span>
        </div>
        <div className="grid">
          {products.map((product) => (
            <div className="card" key={product.name}>
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <p className="status-pill">{product.status}</p>
              <div className="badge-row">
                {product.tags.map((tag) => (
                  <span className="badge" key={tag}>{tag}</span>
                ))}
              </div>
              <div className="badge-row">
                <Link className="secondary-btn" href="/products">Xem chi tiết</Link>
                <Link className="primary-btn" href="/cart">Thêm vào giỏ</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
