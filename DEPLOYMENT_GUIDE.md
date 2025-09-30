# Deployment Guide - Medicaid Provider Dashboard

Your repository is ready for deployment! Follow these steps to host your dashboard online.

## ✅ Completed Setup

- [x] Git repository initialized
- [x] All files committed
- [x] `.gitignore` configured
- [x] README.md created
- [x] Documentation included

## 🚀 Quick Deploy Options

### Option 1: GitHub Pages (Recommended - FREE)

#### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `medicaid-dashboard` (or your preferred name)
3. Description: "Interactive Medicaid provider access visualization"
4. Choose: **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README (you already have one)
6. Click "Create repository"

#### Step 2: Push Your Code

Copy and run these commands in your terminal:

```bash
cd /Users/jagan/Downloads/V1.7

# Add GitHub as remote
git remote add origin https://github.com/YOUR-USERNAME/medicaid-dashboard.git

# Push your code
git branch -M main
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username**

#### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

#### Step 4: Access Your Site

Wait 2-3 minutes, then visit:
```
https://YOUR-USERNAME.github.io/medicaid-dashboard/
```

**🎉 Your dashboard is now live!**

---

### Option 2: Netlify (Easiest - FREE)

#### Deploy via Drag & Drop

1. Visit https://app.netlify.com/drop
2. **Drag the entire `V1.7` folder** onto the upload area
3. Wait 30 seconds for deployment
4. Get instant URL: `https://random-name-12345.netlify.app`

#### Deploy via Git (Better for updates)

1. Push code to GitHub first (see Option 1, Steps 1-2)
2. Visit https://app.netlify.com
3. Click "New site from Git"
4. Connect to GitHub
5. Select your repository
6. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.` (or leave default)
7. Click "Deploy site"

**Your site is live at a Netlify URL**

#### Add Custom Domain (Optional)

1. In Netlify dashboard: Domain settings
2. Add custom domain
3. Update your DNS records as instructed

---

### Option 3: Vercel (Modern - FREE)

#### Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/jagan/Downloads/V1.7
vercel
```

Follow prompts, and your site will be live at a Vercel URL.

#### Deploy via Git

1. Push code to GitHub (see Option 1, Steps 1-2)
2. Visit https://vercel.com/new
3. Import your GitHub repository
4. Click "Deploy"

**Site live at a Vercel URL**

---

### Option 4: AWS S3 + CloudFront (Enterprise - ~$1-5/month)

#### Prerequisites

- AWS account
- AWS CLI installed: `brew install awscli`
- Configure AWS: `aws configure`

#### Deploy Script

```bash
# Create S3 bucket
aws s3 mb s3://medicaid-dashboard-YOUR-UNIQUE-NAME

# Upload files
cd /Users/jagan/Downloads/V1.7
aws s3 sync . s3://medicaid-dashboard-YOUR-UNIQUE-NAME \
  --exclude ".git/*" \
  --exclude "Data Preprocessing/*.csv" \
  --exclude "Data Preprocessing/*.dta"

# Enable static website hosting
aws s3 website s3://medicaid-dashboard-YOUR-UNIQUE-NAME \
  --index-document index.html

# Set bucket policy for public access
cat > bucket-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:GetObject"],
    "Resource": ["arn:aws:s3:::medicaid-dashboard-YOUR-UNIQUE-NAME/*"]
  }]
}
EOF

aws s3api put-bucket-policy \
  --bucket medicaid-dashboard-YOUR-UNIQUE-NAME \
  --policy file://bucket-policy.json
```

**Your site is live at:**
```
http://medicaid-dashboard-YOUR-UNIQUE-NAME.s3-website-us-east-1.amazonaws.com
```

#### Add CloudFront CDN (Recommended)

1. Go to AWS CloudFront console
2. Create distribution
3. Origin: Your S3 bucket website endpoint
4. Default root object: `index.html`
5. Wait 10-15 minutes for deployment
6. Get CloudFront URL: `https://d1234abcd.cloudfront.net`

---

## 🔧 Configuration Options

### Custom Domain

Once deployed, add your own domain:

#### For GitHub Pages:
1. Buy domain (e.g., medicaid-dashboard.org)
2. Add `CNAME` file to repository:
   ```bash
   echo "medicaid-dashboard.org" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```
3. Update DNS:
   ```
   Type: CNAME
   Name: www
   Value: YOUR-USERNAME.github.io
   ```

#### For Netlify/Vercel:
- Use dashboard to add custom domain
- Follow DNS configuration instructions

### Enable HTTPS

- **GitHub Pages**: Automatic (may take 24 hours)
- **Netlify/Vercel**: Automatic and instant
- **AWS CloudFront**: Enable SSL certificate in settings

---

## 📊 Performance Optimization

### Compress Large Files

```bash
# Compress county-table.txt (7.7MB → ~1.5MB)
gzip -k files/theme/medicaid_src/county-table.txt

# Update index.html to load .gz file
# (most hosting platforms auto-serve compressed versions)
```

### Enable CDN Caching

Most platforms handle this automatically, but verify:
- Static assets: Cache for 1 year
- Data files: Cache for 1 hour

---

## 🧪 Testing Your Deployment

### Before Going Live

```bash
# Test locally first
cd /Users/jagan/Downloads/V1.7
python3 -m http.server 8000
```

Visit: http://localhost:8000

**Check:**
- [ ] All maps load correctly
- [ ] State zoom works
- [ ] Filters function properly
- [ ] Trend graphs display
- [ ] Rural/urban filters work
- [ ] Mobile responsive (resize browser)

### After Deployment

**Test across browsers:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Test functionality:**
- [ ] Select different years
- [ ] Click states to zoom
- [ ] Toggle rural/urban filters
- [ ] View trend analysis
- [ ] Take screenshots
- [ ] Check mobile devices

---

## 🔄 Updating Your Site

### GitHub Pages / Netlify / Vercel (Git-based)

```bash
# Make your changes
# Then commit and push

git add .
git commit -m "Update dashboard with 2021 data"
git push

# Site automatically rebuilds and deploys!
```

### AWS S3

```bash
# Re-sync changed files
aws s3 sync . s3://your-bucket-name \
  --exclude ".git/*" \
  --delete
```

---

## 📈 Monitoring

### GitHub Pages
- Check deployment status: Repository → Actions
- View traffic: Repository → Insights → Traffic

### Netlify
- Dashboard shows deployment status
- Analytics available in dashboard

### AWS
- CloudWatch for traffic metrics
- S3 access logs available

---

## ⚠️ Troubleshooting

### Issue: Site not loading

**GitHub Pages:**
- Wait 2-3 minutes after enabling
- Check Pages settings are correct
- Verify `index.html` is in root directory

**Netlify/Vercel:**
- Check build logs for errors
- Verify publish directory is correct

### Issue: Files not found (404)

- Check file paths are relative (not absolute)
- Verify all files were uploaded
- Check `.gitignore` isn't excluding needed files

### Issue: Map not displaying

- Open browser console (F12)
- Check for JavaScript errors
- Verify CDN links are accessible
- Check data files loaded successfully

### Issue: Large files loading slowly

- Enable gzip compression
- Use CDN (CloudFront, Netlify CDN, etc.)
- Consider splitting data by year

---

## 💡 Pro Tips

1. **Use Git Tags for Versions**
   ```bash
   git tag v1.8
   git push origin v1.8
   ```

2. **Set up GitHub Actions for CI/CD**
   - Automatically test on push
   - Lint JavaScript files
   - Validate data files

3. **Monitor Performance**
   - Use Google Analytics
   - Track page load times
   - Monitor user interactions

4. **Backup Your Data**
   - Keep original data files
   - Version control everything
   - Export from hosting regularly

---

## 📞 Support

If you encounter issues:

1. **Check deployment logs**
2. **Review browser console** (F12)
3. **Verify file paths** in index.html
4. **Test locally** before deploying
5. **Check hosting provider status pages**

---

## ✨ Next Steps

After successful deployment:

1. [ ] Share URL with stakeholders
2. [ ] Add analytics tracking
3. [ ] Set up custom domain
4. [ ] Create backup schedule
5. [ ] Plan for data updates (2021 when available)
6. [ ] Consider mobile app wrapper
7. [ ] Implement user feedback mechanism

---

**Your dashboard is ready to make an impact! 🎉**

Need help? Review:
- `README.md` for project overview
- `IMPLEMENTATION_NOTES.md` for technical details
- `QUICK_START_GUIDE.md` for usage instructions