# 🔧 Useful Commands Cheat Sheet

## 📋 Quick Reference

### Essential Commands
```bash
# Xem IP Ubuntu
hostname -I

# Check MongoDB status
sudo systemctl status mongod

# Check running processes
ps aux | grep node

# Check port usage
sudo lsof -i :5000
```

---

## 🚀 Khởi Động Application

### Windows (PowerShell)

```powershell
# Start MongoDB
net start MongoDB

# Backend (Terminal 1)
cd G:\1_codewebsitedkhocphan\server
node server.js

# Frontend (Terminal 2)
cd G:\1_codewebsitedkhocphan\client
npm start

# Stop MongoDB
net stop MongoDB
```

### Ubuntu/Linux

```bash
# Production mode
cd ~/1_codewebsitedkhocphan
./start.sh

# Development mode
./start-dev.sh

# Stop
./stop.sh

# Manual start backend
cd server
node server.js

# Manual start frontend
cd client
npm start
```

---

## 📦 NPM Commands

### Installation

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd client && npm install

# Install all at once
npm run install-all
```

### Development

```bash
# Run server only
npm run server

# Run client only
npm run client

# Run both (with concurrently)
npm run dev
```

### Production

```bash
# Build frontend
cd client && npm run build

# Start production server
npm start
```

---

## 🗄️ MongoDB Commands

### Service Management (Ubuntu)

```bash
# Start MongoDB
sudo systemctl start mongod

# Stop MongoDB
sudo systemctl stop mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check status
sudo systemctl status mongod

# Enable auto-start on boot
sudo systemctl enable mongod

# Disable auto-start
sudo systemctl disable mongod

# View logs
sudo journalctl -u mongod -f
```

### MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Or with mongo (older versions)
mongo

# Use database
use course_registration

# Show collections
show collections

# Count users
db.users.countDocuments()

# Count courses
db.courses.countDocuments()

# View all users
db.users.find().pretty()

# View all courses
db.courses.find().pretty()

# Find specific user
db.users.findOne({ email: "student@university.edu" })

# Delete all users
db.users.deleteMany({})

# Delete all courses
db.courses.deleteMany({})

# Drop database
db.dropDatabase()

# Exit
exit
```

---

## 🔍 Debugging Commands

### Check Logs

```bash
# View terminal output
# (no log files by default, logs go to console)

# If using PM2:
pm2 logs

# If using systemd:
sudo journalctl -u course-registration -f

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Check Running Processes

```bash
# All Node processes
ps aux | grep node

# Specific port
sudo lsof -i :5000
sudo lsof -i :3000
sudo lsof -i :27017

# Kill process by PID
sudo kill -9 <PID>

# Kill all node processes (careful!)
pkill node
```

### Network Debugging

```bash
# Check if port is open
nc -zv localhost 5000

# Test API endpoint
curl http://localhost:5000/api/health

# Test with headers
curl -H "Content-Type: application/json" \
     http://localhost:5000/api/courses
```

---

## 🔥 Firewall Commands (Ubuntu)

```bash
# Check firewall status
sudo ufw status

# Enable firewall
sudo ufw enable

# Disable firewall
sudo ufw disable

# Allow port 5000
sudo ufw allow 5000/tcp

# Allow port 3000
sudo ufw allow 3000/tcp

# Allow port 27017 (MongoDB)
sudo ufw allow 27017/tcp

# Delete rule
sudo ufw delete allow 5000/tcp

# Reset firewall
sudo ufw reset
```

---

## 📡 API Testing Commands

### Using curl

```bash
# Health check
curl http://localhost:5000/api/health

# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@university.edu",
    "password": "test123",
    "studentId": "TEST001"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@university.edu",
    "password": "student123"
  }'

# Get courses (no auth)
curl http://localhost:5000/api/courses

# Get user profile (with auth)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Enroll in course
curl -X POST http://localhost:5000/api/courses/COURSE_ID/enroll \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐳 Docker Commands (Optional)

### If you want to use Docker:

```bash
# Build image
docker build -t course-registration .

# Run container
docker run -p 5000:5000 course-registration

# Run with MongoDB
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker logs -f container_name
```

---

## 🔄 Git Commands

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote
git remote add origin <repository-url>

# Push to GitHub
git push -u origin main

# Pull updates
git pull origin main

# Check status
git status

# View changes
git diff

# View commit history
git log
```

---

## 📦 System Information

### Check Versions

```bash
# Node.js version
node --version

# NPM version
npm --version

# MongoDB version
mongod --version

# Check if MongoDB is installed
which mongod

# Check if Node is installed
which node

# System info
uname -a

# Disk space
df -h

# Memory usage
free -h

# CPU info
lscpu
```

---

## 🔧 File Operations (Ubuntu)

### Permissions

```bash
# Make script executable
chmod +x setup.sh
chmod +x start.sh
chmod +x start-dev.sh
chmod +x stop.sh

# Change ownership
sudo chown -R $USER:$USER ~/1_codewebsitedkhocphan

# Set directory permissions
chmod -R 755 ~/1_codewebsitedkhocphan
```

### File Management

```bash
# Copy files
cp source destination
cp -r folder/ destination/

# Move files
mv source destination

# Remove files
rm file
rm -rf folder/

# Create directory
mkdir folder
mkdir -p path/to/folder

# View file content
cat file.txt
less file.txt
tail -n 50 file.txt

# Edit file
nano file.txt
vim file.txt

# Find files
find . -name "*.js"
find . -type f -name "package.json"
```

---

## 🌐 Network Commands

```bash
# Check IP address
ip addr show
hostname -I

# Test connection
ping google.com
ping <ubuntu-ip>

# Check open ports
sudo netstat -tulpn | grep LISTEN
sudo ss -tulpn

# Traceroute
traceroute google.com

# DNS lookup
nslookup google.com
dig google.com
```

---

## 🔨 Development Workflow

### Daily Development

```bash
# Morning: Start services
cd ~/1_codewebsitedkhocphan
./start-dev.sh

# Make changes to code
# ... edit files ...

# Test changes
# ... test in browser ...

# Evening: Stop services
./stop.sh
```

### Deploy Updates

```bash
# Pull latest code
git pull origin main

# Install new dependencies
cd server && npm install
cd ../client && npm install

# Build frontend
cd client && npm run build

# Restart server
cd ..
./stop.sh
./start.sh
```

---

## 🧹 Cleanup Commands

### Clear Cache

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf server/node_modules
rm -rf client/node_modules

# Remove package-lock
rm server/package-lock.json
rm client/package-lock.json

# Reinstall
cd server && npm install
cd ../client && npm install
```

### Reset Database

```bash
# Connect to MongoDB
mongosh

# Use database
use course_registration

# Drop database
db.dropDatabase()

# Exit and restart server
exit
cd ~/1_codewebsitedkhocphan/server
node server.js
# This will recreate sample data
```

---

## 🎯 Quick Fixes

### Problem: Port already in use

```bash
# Find process using port
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### Problem: MongoDB won't start

```bash
# Check status
sudo systemctl status mongod

# View logs
sudo journalctl -u mongod -xe

# Restart
sudo systemctl restart mongod
```

### Problem: npm install fails

```bash
# Clear cache
npm cache clean --force

# Update npm
npm install -g npm@latest

# Try again
npm install
```

### Problem: Cannot connect from Windows

```bash
# Check IP
hostname -I

# Check firewall
sudo ufw status
sudo ufw allow 5000/tcp

# Check if server is running
ps aux | grep node
sudo lsof -i :5000
```

---

## 📊 Performance Monitoring

```bash
# CPU usage
top
htop

# Memory usage
free -h
vmstat

# Disk I/O
iostat

# Network usage
iftop
nethogs

# Node.js specific
node --inspect server.js
```

---

## 🔐 Security Commands

### User Management

```bash
# Create new user
sudo adduser username

# Add to sudo group
sudo usermod -aG sudo username

# Switch user
su - username

# Change password
passwd
```

### File Permissions

```bash
# View permissions
ls -la

# Change permissions
chmod 644 file.txt    # rw-r--r--
chmod 755 script.sh   # rwxr-xr-x
chmod 600 .env        # rw-------

# Change ownership
chown user:group file
chown -R user:group folder/
```

---

## 💾 Backup Commands

```bash
# Backup MongoDB
mongodump --db course_registration --out ~/backup/

# Restore MongoDB
mongorestore --db course_registration ~/backup/course_registration/

# Backup files
tar -czf backup.tar.gz ~/1_codewebsitedkhocphan/

# Extract backup
tar -xzf backup.tar.gz
```

---

## 🎓 Helpful Aliases (Add to ~/.bashrc)

```bash
# Edit ~/.bashrc
nano ~/.bashrc

# Add these lines:
alias coursecd='cd ~/1_codewebsitedkhocphan'
alias coursestart='cd ~/1_codewebsitedkhocphan && ./start.sh'
alias coursestop='cd ~/1_codewebsitedkhocphan && ./stop.sh'
alias mongostart='sudo systemctl start mongod'
alias mongostop='sudo systemctl stop mongod'
alias mongostatus='sudo systemctl status mongod'

# Reload
source ~/.bashrc

# Now you can use:
coursestart
coursestop
```

---

**Lưu file này để reference nhanh! 📚**
