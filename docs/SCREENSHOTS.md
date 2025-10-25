# Instructions for Adding Screenshots

To complete the README documentation, please add the following screenshots:

## Required Screenshots

### 1. Login Screenshot
- **Filename**: `login.png`
- **Location**: Save to `docs/images/login.png`
- **Source**: The first image you provided (purple gradient login page)
- **Recommended size**: 1920x1080 or similar high resolution

### 2. Dashboard Screenshot
- **Filename**: `dashboard.png`
- **Location**: Save to `docs/images/dashboard.png`
- **Source**: The second image you provided (full dashboard with transactions)
- **Recommended size**: 1920x1080 or similar high resolution

## How to Add Screenshots

### Option 1: Manual Copy
1. Save your screenshots to the `docs/images/` folder
2. Name them exactly as specified above
3. The README will automatically reference them

### Option 2: Using PowerShell
```powershell
# Navigate to project directory
cd "F:\new Project"

# Copy your screenshots (update source paths)
Copy-Item "path\to\your\login-screenshot.png" -Destination "docs\images\login.png"
Copy-Item "path\to\your\dashboard-screenshot.png" -Destination "docs\images\dashboard.png"
```

## Verification

After adding the screenshots, check that:
- [ ] Files exist in `docs/images/` folder
- [ ] Filenames match exactly: `login.png` and `dashboard.png`
- [ ] Images are clear and high quality
- [ ] README displays them correctly when viewed on GitHub

## Alternative: Using Online Images

If you prefer to host images elsewhere:
1. Upload screenshots to an image hosting service (GitHub, Imgur, etc.)
2. Update the README image paths:
   ```markdown
   <img src="https://your-image-url.com/login.png" alt="Login Screen" width="800"/>
   ```
