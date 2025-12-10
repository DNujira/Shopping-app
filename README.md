# Shopping App

## สิ่งที่ต้องติดตั้งก่อนเริ่ม

### สำหรับทุกคน
- **Node.js** (version 20 ขึ้นไป)
- **Watchman** (สำหรับ Mac/Linux)

### ถ้าจะรันบน iPhone (iOS)
- **Xcode**  - สามารถดาวน์โหลดจาก App Store
- **CocoaPods** - เปิด Terminal แล้วพิมพ์ `sudo gem install cocoapods`

### ถ้าจะรันบน Android
- **Android Studio**
- **Java JDK** (version 17 ขึ้นไป)

---

## วิธีเริ่มใช้งาน (สำหรับคนที่ Clone มาใหม่)

### ขั้นตอนที่ 1: ติดตั้ง Package

เปิด Terminal แล้วไปที่โฟลเดอร์โปรเจกต์:

```bash
cd Shopping-app/Untitled/ShoppingApp
npm install
```

### ขั้นตอนที่ 2: ติดตั้งไฟล์สำหรับ iOS

**ถ้าจะรันบน iPhone เท่านั้น:**

```bash
cd ios
pod install
cd ..
```

> Noted: เวลาเปิด Xcode ต้องเปิดไฟล์ `ShoppingApp.xcworkspace`

### ขั้นตอนที่ 3: เปิด Metro (ตัวแปลงโค้ด JavaScript)

```bash
npm start
```

ทิ้งหน้าต่าง Terminal นี้ไว้ อย่าปิด

---

## วิธีรันแอป

เปิดหน้าต่าง Terminal ใหม่ แล้วเลือกว่าจะรันบนอะไร:

### รันบน iPhone (iOS)

```bash
npm run ios
```

หรือถ้าอยากเลือก Simulator เฉพาะ:

```bash
npx react-native run-ios --simulator="iPhone 15 Pro"
```

หรือเปิด Xcode แล้วกด Run:

```bash
open ios/ShoppingApp.xcworkspace
```

### รันบน Android

**ต้องเปิด Android Emulator หรือเสียบมือถือ Android ไว้ก่อน** แล้วค่อยพิมพ์:

```bash
npm run android
```

หรือเปิดด้วย Android Studio:

```bash
open -a "Android Studio" android/
```

---
