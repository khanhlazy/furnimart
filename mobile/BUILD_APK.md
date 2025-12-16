# 📦 Hướng dẫn Build APK cho Android

## 🚀 Cách 1: EAS Build (Khuyến nghị - Dễ nhất)

EAS Build là dịch vụ cloud build của Expo, không cần cài Android Studio.

### Bước 1: Cài đặt EAS CLI

```powershell
npm install -g eas-cli
```

### Bước 2: Đăng nhập Expo

```powershell
eas login
```

Nếu chưa có tài khoản, tạo tại: https://expo.dev/signup

### Bước 3: Khởi tạo EAS Build

```powershell
cd mobile
eas build:configure
```

Lệnh này sẽ tạo file `eas.json` với cấu hình build.

### Bước 4: Cập nhật app.json

Đảm bảo `app.json` có đầy đủ thông tin:

```json
{
  "expo": {
    "name": "FurniMart",
    "slug": "furnimart-mobile",
    "version": "1.0.0",
    "android": {
      "package": "com.furnimart.mobile",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

### Bước 5: Build APK

**Build APK (có thể cài trực tiếp):**
```powershell
eas build --platform android --profile preview
```

**Build AAB (để upload lên Play Store):**
```powershell
eas build --platform android --profile production
```

### Bước 6: Tải APK

Sau khi build xong, EAS sẽ cung cấp link để tải APK về.

---

## 🛠️ Cách 2: Local Build (Cần Android Studio)

### Bước 1: Cài đặt Android Studio

1. Tải Android Studio: https://developer.android.com/studio
2. Cài đặt Android SDK, Android SDK Platform, và Android Virtual Device

### Bước 2: Cấu hình Environment Variables

**Windows:**
```powershell
# Thêm vào System Environment Variables
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
```

### Bước 3: Prebuild (Tạo native code)

```powershell
cd mobile
npx expo prebuild --platform android
```

Lệnh này sẽ tạo folder `android/` với native Android project.

### Bước 4: Build APK

**Debug APK:**
```powershell
cd android
.\gradlew assembleDebug
```

APK sẽ được tạo tại: `android/app/build/outputs/apk/debug/app-debug.apk`

**Release APK (cần keystore):**
```powershell
# Tạo keystore (chỉ lần đầu)
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Build release
.\gradlew assembleRelease
```

APK sẽ được tạo tại: `android/app/build/outputs/apk/release/app-release.apk`

---

## ⚙️ Cấu hình EAS Build (eas.json)

Sau khi chạy `eas build:configure`, file `eas.json` sẽ được tạo. Bạn có thể tùy chỉnh:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## 🔧 Cập nhật API URL cho Production

Trước khi build, cập nhật API URL trong `mobile/src/config/api.ts`:

```typescript
const getApiUrl = (): string => {
  if (!__DEV__) {
    return 'https://your-production-api.com/api'; // ⚠️ THAY BẰNG API PRODUCTION
  }
  // ... rest of code
};
```

---

## 📝 Checklist trước khi build

- [ ] Đã cập nhật version trong `app.json`
- [ ] Đã cập nhật API URL cho production
- [ ] Đã test app trên Expo Go
- [ ] Đã có icon và splash screen
- [ ] Đã cập nhật package name (com.furnimart.mobile)

---

## 🎯 Build nhanh (EAS Build)

```powershell
cd mobile
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

Sau khi build xong, tải APK về và cài đặt trên điện thoại!

---

## 📱 Cài đặt APK trên điện thoại

1. **Tải APK** về máy tính
2. **Chuyển APK** sang điện thoại (USB, email, cloud storage)
3. **Cho phép cài đặt từ nguồn không xác định:**
   - Settings → Security → Unknown Sources (Enable)
4. **Mở APK** và cài đặt

---

## ⚠️ Lưu ý

- **EAS Build miễn phí** cho tài khoản cá nhân (có giới hạn)
- **Local Build** cần Android Studio và nhiều dung lượng
- **APK Preview** dùng để test, **AAB Production** dùng để publish lên Play Store
- **Keystore** cần giữ cẩn thận để update app sau này

