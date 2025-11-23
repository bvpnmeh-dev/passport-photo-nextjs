# ADMIN PRICING CONFIGURATION GUIDE

## Overview

All pricing in this application is now **100% environment variable-driven** and can be adjusted without code deployment.

## Price Configuration Files

### Development: `.env`

- Used for local development and testing
- Contains test Stripe keys
- Safe to experiment with pricing

### Production: `.env.production`

- Used for live production environment
- Contains live Stripe keys
- **Copy from `.env.production.example` and fill in real values**

## How Pricing Works

### Current Price Structure

#### UK Digital ID (Standard Package)

- Environment Variable: `NEXT_PUBLIC_STANDARD_PKG_PRICE_IN_CENT`
- Default: `888` (£8.88)
- Used for: Single country photo compliance

#### Multi-Country (Premium Package)

- Environment Variable: `NEXT_PUBLIC_PREMIUM_PKG_PRICE_IN_CENT`
- Default: `1520` (£15.20)
- Used for: 200+ country compliance

#### Multi-Country Upsell Price

- **Automatically calculated**: `PREMIUM_PRICE - STANDARD_PRICE`
- Current: `1520 - 888 = 632` (£6.32)
- **No manual configuration needed**

### Additional Photo Pricing

- Environment Variable: `NEXT_PUBLIC_PER_ADDITIONAL_PHOTO_PRICE_IN_CENT`
- Default: `200` (£2.00 per extra photo)

## How to Change Prices (ADMIN)

### Option 1: Direct Environment Variable Update (Recommended)

1. **For Vercel Deployment:**

   ```bash
   # Go to Vercel Dashboard
   # Navigate to: Project Settings > Environment Variables
   # Update the value of NEXT_PUBLIC_STANDARD_PKG_PRICE_IN_CENT or NEXT_PUBLIC_PREMIUM_PKG_PRICE_IN_CENT
   # Redeploy the application
   ```

2. **For Other Hosting:**
   - Update `.env.production` file on server
   - Restart the application

### Option 2: Future Admin Dashboard (Recommended for Non-Technical Users)

To implement a visual admin dashboard:

1. Create admin route: `/admin/pricing`
2. Add form inputs for each price variable
3. On save, update environment variables via API
4. Trigger automatic redeployment

**Example implementation:**

```typescript
// app/admin/pricing/page.tsx
export default function AdminPricing() {
  const updatePricing = async (standardPrice: number, premiumPrice: number) => {
    // Update environment variables via Vercel API or server config
    await fetch("/api/admin/update-env", {
      method: "POST",
      body: JSON.stringify({
        NEXT_PUBLIC_STANDARD_PKG_PRICE_IN_CENT: standardPrice,
        NEXT_PUBLIC_PREMIUM_PKG_PRICE_IN_CENT: premiumPrice,
      }),
    });
    // Trigger redeployment
  };
}
```

## Price Examples

### To set UK package to £9.99

```env
NEXT_PUBLIC_STANDARD_PKG_PRICE_IN_CENT=999
```

### To set Multi-Country to £19.99

```env
NEXT_PUBLIC_PREMIUM_PKG_PRICE_IN_CENT=1999
```

### Upsell will automatically become

£19.99 - £9.99 = **£10.00 upsell**

## Important Notes

⚠️ **All prices must be in PENCE/CENTS (integers)**

- ✅ Correct: `888` for £8.88
- ❌ Wrong: `8.88` (will cause errors)

⚠️ **After changing prices:**

- Always redeploy the application
- Clear browser cache to see changes
- Test checkout flow with test Stripe keys first

⚠️ **Security:**

- Never commit `.env.production` to git
- Keep `STRIPE_SECRET_KEY` secure
- Use environment variable encryption when possible

## Validation

The application validates all pricing on startup:

- Ensures prices are positive integers
- Prevents NaN or negative values
- Throws error if critical variables are missing

## Testing Price Changes

1. Update `.env` (local development)
2. Restart dev server: `npm run dev`
3. Navigate to `/make-photo?type=uk`
4. Verify displayed prices match your configuration
5. Test upsell button shows correct upgrade price
6. Complete test checkout to verify Stripe integration

## Future Enhancements

- [ ] Visual admin dashboard for price management
- [ ] A/B testing different price points
- [ ] Dynamic pricing based on demand
- [ ] Promotional pricing with expiration dates
- [ ] Currency conversion for international markets
