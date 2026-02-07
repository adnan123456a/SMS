# 🚀 Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests pass (see TESTING_GUIDE.md)
- [ ] Security review completed
- [ ] Database backups in place
- [ ] Environment variables configured
- [ ] SSL certificate ready (if using HTTPS)
- [ ] Domain name available
- [ ] Monitoring setup
- [ ] Error logging setup

---

## Option 1: Deploy to Heroku

### 1. Install Heroku CLI
```bash
# Mac
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Login to Heroku
```bash
heroku login
```

### 3. Create Heroku App
```bash
cd /workspaces/SMS
heroku create your-app-name
```

### 4. Set Environment Variables
```bash
heroku config:set MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/chat-app?retryWrites=true&w=majority
heroku config:set SESSION_SECRET=your-super-secret-key-generate-new
heroku config:set NODE_ENV=production
```

### 5. Add Procfile
```bash
# Create Procfile in project root
echo "web: node server.js" > Procfile
```

### 6. Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 7. Verify Deployment
```bash
heroku logs --tail
heroku open
```

---

## Option 2: Deploy to Railway.app

### 1. Create Account
Visit: https://railway.app

### 2. Create New Project
1. Click "Create a new project"
2. Select "Deploy from GitHub"
3. Select your repository

### 3. Add MongoDB
1. In Railway dashboard, click "+"
2. Search "MongoDB"
3. Provision MongoDB

### 4. Configure Environment
Set variables in Railway dashboard:
```
MONGO_URI=<auto-provided from MongoDB>
SESSION_SECRET=<generate new>
NODE_ENV=production
PORT=<auto-assigned>
```

### 5. Deploy
Push to main branch:
```bash
git push origin main
```

Railway auto-deploys!

---

## Option 3: Deploy to AWS EC2

### 1. Launch EC2 Instance
1. Go to AWS Console
2. Launch Ubuntu 22.04 LTS instance
3. Select t2.micro (free tier)
4. Add security group allowing ports 80, 443, 3000

### 2. SSH Into Instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### 3. Setup Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
```

### 4. Clone Project
```bash
git clone <your-repo> /home/ubuntu/sms-chat
cd /home/ubuntu/sms-chat
npm install
```

### 5. Setup Environment
```bash
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/chat-app
SESSION_SECRET=<generate-new>
NODE_ENV=production
PORT=3000
EOF
```

### 6. Fix Database
```bash
node scripts/fix-db.js
```

### 7. Setup PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 start server.js --name "sms-chat"
pm2 startup
pm2 save
```

### 8. Setup Nginx (Reverse Proxy)
```bash
sudo apt install -y nginx

# Create config
sudo tee /etc/nginx/sites-available/default > /dev/null << EOF
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo systemctl restart nginx
```

### 9. Setup SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com

# Update Nginx config with SSL
sudo certbot --nginx -d yourdomain.com
```

### 10. Verify
Visit: https://yourdomain.com

---

## Option 4: Deploy to DigitalOcean

### 1. Create Droplet
1. Go to DigitalOcean
2. Create new Droplet
3. Select Ubuntu 22.04
4. Select $4-5/month plan

### 2. SSH In
```bash
ssh root@your-droplet-ip
```

### 3. Setup (Same as AWS)
Follow AWS steps 3-9 above

---

## Option 5: Deploy to Render.com

### 1. Connect GitHub
1. Visit https://render.com
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository

### 2. Configure
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: Set MONGO_URI, SESSION_SECRET

### 3. Deploy
Render auto-deploys on push!

---

## Production Environment Variables

**Important:** Never hardcode secrets!

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app

# Session
SESSION_SECRET=<use strong random string>
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Environment
NODE_ENV=production

# Port (usually set by platform)
PORT=3000

# Optional: Monitoring
SENTRY_DSN=<if using Sentry>
```

---

## Post-Deployment Steps

### 1. Setup Monitoring
```bash
# Option A: PM2 Plus (free tier)
pm2 monitor

# Option B: New Relic
npm install newrelic

# Option C: Datadog
# Configure via dashboard
```

### 2. Setup Error Logging
```bash
# Option A: Sentry
npm install @sentry/node

# Option B: LogRocket
npm install logrocket
```

### 3. Setup Backups
```bash
# MongoDB Atlas - Auto-backups enabled
# Or: Manual backup script
mongo --uri "mongodb://..." --eval "db.adminCommand({fsync: 1})"
```

### 4. Monitor Application
```bash
# Check logs
pm2 logs sms-chat

# Check status
pm2 status

# Monitor metrics
pm2 web  # Opens dashboard on :9615
```

---

## Domain Setup (for custom domain)

### 1. Get Domain
- Namecheap
- GoDaddy
- Google Domains
- Cloudflare

### 2. Point to Heroku/Railway
**For Heroku:**
```
# DNS Settings
Type: CNAME
Name: www
Value: your-app.herokuapp.com
```

**For AWS/VPS:**
```
# DNS Settings
Type: A
Name: @
Value: <your-server-ip>
```

### 3. SSL Certificate
- Heroku: Auto (free)
- Railway: Auto (free)
- Let's Encrypt: Free with Certbot
- AWS ACM: Free

---

## Performance Optimization

### 1. Database
```bash
# Create indexes
mongo chat-app
db.messages.createIndex({createdAt: -1})
db.messages.createIndex({roomId: 1})
db.users.createIndex({email: 1})
```

### 2. Caching
```javascript
// Add Redis (optional)
npm install redis

// Cache room list
redis.setex('rooms', 300, JSON.stringify(rooms))
```

### 3. Compression
```javascript
// Already included: app.use(express.json())
// Add gzip compression
const compression = require('compression');
app.use(compression());
```

### 4. CDN (Optional)
- Cloudflare (free tier)
- AWS CloudFront
- For static assets: `/public/*`

---

## Security Hardening

### 1. HTTPS Only
```javascript
// In server.js
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 2. Helmet.js
```bash
npm install helmet

// In server.js
const helmet = require('helmet');
app.use(helmet());
```

### 3. Rate Limiting
```bash
npm install express-rate-limit

// In server.js
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100 // limit 100 requests per windowMs
});
app.use('/api/', limiter);
```

### 4. CORS Configuration
```javascript
// In server.js
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));
```

---

## Scaling

### 1. Database Scaling
- Use MongoDB Atlas
- Enable sharding for large datasets
- Regular backups

### 2. Application Scaling
- Use PM2 cluster mode
- Load balancer (Nginx, HAProxy)
- Multiple instances

### 3. Static Assets
- CDN (Cloudflare)
- Compress images
- Minify CSS/JS

---

## Monitoring Checklist

- [ ] Uptime monitoring (UptimeRobot)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Log aggregation (CloudWatch, Stackdriver)
- [ ] Database monitoring
- [ ] Alert setup (PagerDuty)

---

## Disaster Recovery

### 1. Database Backup
```bash
# Daily backups
mongodump --uri "mongodb://..." --out /backups/$(date +%Y%m%d)

# Or use Atlas auto-backups
```

### 2. Application Backup
```bash
# Weekly git backups
git push --mirror <backup-repo>
```

### 3. Recovery Plan
- Test restore monthly
- Document procedure
- Keep backups off-site

---

## Cost Estimation

| Service | Cost | Notes |
|---------|------|-------|
| Heroku | $7-50/month | Easiest, charges per dyno |
| Railway | Free-$5/month | Generous free tier |
| AWS | $5-30/month | EC2 + RDS |
| DigitalOcean | $4-40/month | Droplets + Managed DB |
| Render | Free-$12/month | Fast, auto-deploy |
| MongoDB Atlas | Free-$57/month | Free tier available |

---

## Support & Troubleshooting

### Common Issues

**"Cannot connect to database in production"**
- Check IP whitelist (MongoDB Atlas)
- Verify MONGO_URI environment variable
- Check network connectivity

**"High memory usage"**
- Check for memory leaks
- Increase Node.js heap: `node --max-old-space-size=2048 server.js`
- Use PM2 watch mode

**"Slow responses"**
- Check database indexes
- Enable caching
- Use CDN for static files
- Monitor API response times

**"Session lost after restart"**
- Verify MongoDB session store
- Check session config
- Test MongoStore connection

---

## Final Checklist

- [ ] Environment variables configured
- [ ] Database backed up
- [ ] SSL/HTTPS enabled
- [ ] Monitoring setup
- [ ] Error logging active
- [ ] Backup automated
- [ ] Security hardened
- [ ] Performance optimized
- [ ] Team trained on deployment
- [ ] Runbook documented

---

## 🎉 You're Live!

Your application is now in production and ready for users!

**Monitor, maintain, and iterate. Good luck!**

