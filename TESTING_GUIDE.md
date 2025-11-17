# Quick Testing Guide

## 🚀 Start Development Server

```bash
npm run dev
```

Access at: `http://localhost:3000` (or your Codespaces forwarded URL)

---

## 🧪 Test Scenarios

### 1. Admin Bypass System

**URL:** `/admin`

**Steps:**

1. Login with:
   - Email: `wallington.cameras@yahoo.com`
   - Password: `Admin08`
2. Enter a photo UUID in the bypass form (you'll need to create a photo first)
3. Click "Bypass & View Photo"
4. Should redirect to order page showing the photo without payment

**Expected Result:** Photo displays with "admin-bypass" status

---

### 2. UK Digital Code

**URL:** `/make-photo` → Complete order

**Steps:**

1. Upload a photo
2. Select "Standard" package (£8.88)
3. Complete payment (use test card: `4242 4242 4242 4242`)
4. View order confirmation page

**Expected Result:**

- UK Digital Code displayed (format: `XXXX-XXXX-XXXX-XXXX`)
- QR code rendered below the code
- "Valid for 30 days" message shown

---

### 3. Dual Download System

**URL:** Order confirmation page after payment

**Steps:**

1. Complete an order (any package)
2. On order page, locate download section
3. Click "Download Single Photo" → Should download exact-size photo
4. Click "Download 4x6 Sheet" → Should download sheet with 4 copies

**Expected Result:**

- Single photo: Original specification dimensions
- 4x6 sheet: 1200x1800px with 4 photos in 2x2 grid

---

### 4. Package Display

**URL:** `/make-photo`

**Steps:**

1. Navigate to photo upload page
2. Scroll to pricing section

**Expected Result:**

- Only 2 packages visible:
  - ✅ Standard - £8.88
  - ✅ Premium - £15.20
- ❌ Basic package NOT visible

---

### 5. Multi-Country Infrastructure (Backend Ready)

**Status:** Infrastructure complete, UI implementation pending

**Current State:**

- OrderModel has `secondarySpecCode` and `secondaryPhotoUrl` fields
- Ready for UI integration in MakePhotoView

**To Fully Test (Future):**

1. Add country selector in MakePhotoView
2. Process both photos after payment
3. Display both photos on order page

---

## 🐛 Debugging Tips

### Check Package Filtering

```bash
# In browser console on /make-photo page:
console.log(constants.productPackages);
// Should show only 2 packages
```

### Verify UK Code Generation

```javascript
import { generateUKDigitalCode } from "@/utils/generateUKDigitalCode";
const code = generateUKDigitalCode("test-uuid-123");
console.log(code); // Should be XXXX-XXXX-XXXX-XXXX format
```

### Test 4x6 Sheet Canvas

- Open browser DevTools → Network tab
- Download 4x6 sheet
- Check image dimensions: 1200x1800px

---

## ⚠️ Known Issues

### Sharp Module Warning

```
Error: Module `sharp` not found
```

**Fix:**

```bash
npm install --cpu=wasm32 sharp
```

**Impact:** Only affects production build, dev server works fine

---

## 🔑 Test Credentials

### Admin Panel

- Email: `wallington.cameras@yahoo.com` / Password: `Admin08`
- Email: `wallington.cameras@gmail.com` / Password: `Admin28`

### Stripe Test Card

- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

---

## 📊 Verification Checklist

- [ ] Dev server starts without errors
- [ ] Admin login works
- [ ] Admin bypass redirects correctly
- [ ] Only 2 packages displayed (Standard, Premium)
- [ ] UK digital code shows for Standard package
- [ ] QR code renders on order page
- [ ] Single photo download works
- [ ] 4x6 sheet download contains 4 photos
- [ ] Payment flow completes successfully
- [ ] Order page displays all order details

---

## 🚀 Ready for Production

Before deploying:

1. Run `npm install --cpu=wasm32 sharp`
2. Test all features in production mode (`npm run build && npm start`)
3. Update admin keys with secure values
4. Enable IP restrictions for admin routes
5. Configure environment variables in Vercel/hosting platform

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify `.env` file has all required variables
3. Ensure dev server is running on correct port
4. Clear browser cache and restart dev server
