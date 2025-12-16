import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import { Address } from '../../types';
import { colors, spacing, borderRadius, shadows, typography } from '../../theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const userData = await userService.getProfile();
      if (userData.addresses && userData.addresses.length > 0) {
        setAddresses(userData.addresses);
        const defaultAddress = userData.addresses.find(addr => addr.isDefault) || userData.addresses[0];
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showError('Vui lòng chọn địa chỉ giao hàng! 📍');
      return;
    }

    if (items.length === 0) {
      showError('Giỏ hàng trống! Vui lòng thêm sản phẩm! 🛒');
      return;
    }

    // Validate phone number
    const phoneNumber = selectedAddress?.phone || user?.phone;
    if (!phoneNumber) {
      showError('Vui lòng cập nhật số điện thoại trong địa chỉ giao hàng! 📱');
      return;
    }

    setLoading(true);
    try {
      // Format shipping address as string if it's an object
      let shippingAddressString: string;
      if (typeof selectedAddress === 'string') {
        shippingAddressString = selectedAddress;
      } else if (selectedAddress) {
        shippingAddressString = `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`;
      } else {
        throw new Error('Địa chỉ giao hàng không hợp lệ');
      }

      const orderData = {
        items: items.map(item => ({
          productId: item.product._id,
          productName: item.product.name,
          quantity: item.quantity,
          price: (item.product.price || 0) - (item.product.discount || 0),
          discount: item.product.discount || 0,
        })),
        shippingAddress: shippingAddressString,
        phone: phoneNumber,
        paymentMethod: paymentMethod || 'cod',
      };

      console.log('✅ Placing order with data:', JSON.stringify(orderData, null, 2));
      const result = await orderService.create(orderData);
      console.log('✅ Order created successfully:', result);
      clearCart();
      showSuccess('Đơn hàng đã được đặt thành công! 🎉');
      
      // Navigate to orders after a short delay
      setTimeout(() => {
        navigation.navigate('Orders' as never);
      }, 1500);
    } catch (error: any) {
      console.error('Checkout error:', error);
      let errorMessage = 'Không thể đặt hàng';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = typeof error.message === 'string' ? error.message : 'Không thể đặt hàng';
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data);
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      <ScrollView style={styles.scrollView}>
      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đơn hàng</Text>
        {items.map((item) => {
          const finalPrice = (item.product.price || 0) - (item.product.discount || 0);
          return (
            <View key={item.product._id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>{item.product.name}</Text>
              <Text style={styles.orderItemPrice}>
                {finalPrice.toLocaleString('vi-VN')}đ x {item.quantity}
              </Text>
            </View>
          );
        })}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>
            {getTotalPrice().toLocaleString('vi-VN')}đ
          </Text>
        </View>
      </View>

      {/* Shipping Address */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Address' as never)}
          >
            <Text style={styles.linkText}>Quản lý địa chỉ</Text>
          </TouchableOpacity>
        </View>
        {addresses.length > 0 ? (
          <>
            {addresses.map((address) => (
              <TouchableOpacity
                key={address._id}
                style={[
                  styles.addressCard,
                  selectedAddress?._id === address._id && styles.addressCardSelected,
                ]}
                onPress={() => setSelectedAddress(address)}
              >
                <Text style={styles.addressName}>{String(address.name || '')}</Text>
                <Text style={styles.addressPhone}>{String(address.phone || '')}</Text>
                <Text style={styles.addressText}>
                  {String(address.street || '')}, {String(address.ward || '')}, {String(address.district || '')}, {String(address.city || '')}
                </Text>
                {address.isDefault && (
                  <Text style={styles.defaultBadge}>Mặc định</Text>
                )}
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <TouchableOpacity
            style={styles.addAddressButton}
            onPress={() => navigation.navigate('Address' as never)}
          >
            <Text style={styles.addAddressText}>+ Thêm địa chỉ</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'cod' && styles.paymentOptionSelected,
          ]}
          onPress={() => setPaymentMethod('cod')}
        >
          <Text style={styles.paymentOptionText}>Thanh toán khi nhận hàng (COD)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'bank' && styles.paymentOptionSelected,
          ]}
          onPress={() => setPaymentMethod('bank')}
        >
          <Text style={styles.paymentOptionText}>Chuyển khoản ngân hàng</Text>
        </TouchableOpacity>
      </View>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <Button
          title={`Đặt hàng - ${getTotalPrice().toLocaleString('vi-VN')}đ`}
          onPress={handlePlaceOrder}
          variant="primary"
          size="large"
          loading={loading}
          disabled={loading || !selectedAddress || items.length === 0}
          icon={<Ionicons name="checkmark-circle" size={20} color={colors.white} />}
          style={styles.placeOrderButton}
        />
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderItemName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFB800',
  },
  addressCard: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  addressCardSelected: {
    borderColor: '#FFB800',
    backgroundColor: '#fffbf0',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  defaultBadge: {
    fontSize: 12,
    color: '#FFB800',
    fontWeight: '600',
  },
  addAddressButton: {
    borderWidth: 2,
    borderColor: '#FFB800',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  addAddressText: {
    fontSize: 16,
    color: '#FFB800',
    fontWeight: '600',
  },
  linkText: {
    fontSize: 14,
    color: '#FFB800',
    fontWeight: '600',
  },
  paymentOption: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  paymentOptionSelected: {
    borderColor: '#FFB800',
    backgroundColor: '#fffbf0',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  placeOrderButton: {
    backgroundColor: '#FFB800',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

