# Deployment Guide

## 🚀 Deploy to Production

### Option 1: Heroku (Easiest)

#### Step 1: Install Heroku CLI
```bash
curl https://cli.heroku.com/install.sh | sh
```

#### Step 2: Login & Create App
```bash
heroku login
heroku create your-app-name
```

#### Step 3: Add MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get the connection string
4. Set environment variable:
```bash
heroku config:set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/chat-app"
```

#### Step 4: Deploy
```bash
git push heroku main
```

---

### Option 2: Railway

1. Connect your GitHub repo to [Railway](https://railway.app)
2. Add MongoDB plugin
3. Set `MONGO_URI` in environment variables
4. Deploy! 🎉

---

### Option 3: Render

1. Push code to GitHub
2. Connect to [Render](https://render.com)
3. Create new Web Service
4. Add MongoDB Atlas URI
5. Deploy

---

### Option 4: Self-Hosted (VPS)

#### On Ubuntu/Debian Server:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Clone and setup app
git clone <your-repo-url> chat-app
cd chat-app

npm install

# Create .env
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/chat-app
PORT=3000
NODE_ENV=production
EOF

# Run with PM2 (process manager)
npm install -g pm2
pm2 start server.js --name "chat-app"
pm2 startup
pm2 save
```

#### Setup Nginx Reverse Proxy:
```bash
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/default
```

Add this config:
```nginx
upstream chat_app {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://chat_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable SSL (recommended):
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

---

## 📊 Performance Tips

1. **Enable GZIP Compression** (in server.js)
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add Redis for Message Caching**
```javascript
const redis = require('redis');
const client = redis.createClient();
```

3. **Use CDN for Static Files** (CSS, JS)
- AWS CloudFront
- Cloudflare
- Bunny CDN

4. **Database Indexing** (Already configured in Message schema)

5. **Connection Pooling** – MongoDB does this automatically

---

## 🔒 Security Checklist

- [ ] Use HTTPS/SSL in production
- [ ] Set `NODE_ENV=production`
- [ ] Use strong database passwords
- [ ] Enable CORS properly (only trusted origins)
- [ ] Add rate limiting
- [ ] Implement JWT authentication
- [ ] Use environment variables (never hardcode secrets)
- [ ] Keep dependencies updated (`npm audit fix`)
- [ ] Add helmet for HTTP headers
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## 🐳 Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

Build & Run:
```bash
docker build -t chat-app .
docker run -p 3000:3000 -e MONGO_URI="..." chat-app
```

---

## 📈 Monitoring

Add error tracking:
```bash
npm install sentry
```

Add monitoring:
```bash
npm install pm2-monitoring
```

---

## 🆘 Troubleshooting

**MongoDB Connection Error**
```
Check MONGO_URI format
Whitelist IP in MongoDB Atlas
```

**Socket.IO Connection Issues**
```
Check CORS settings
Ensure WebSocket is enabled
```

**High Memory Usage**
```
Implement message pagination
Clear old messages
Use Redis for caching
```

---

**Happy Deploying! 🚀**
