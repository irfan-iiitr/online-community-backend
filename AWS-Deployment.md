# AWS Deployment Guide

## Prerequisites
- AWS Account with necessary permissions
- AWS CLI installed and configured
- Docker and Docker Compose installed locally
- Git repository with project code

## 1. EC2 Instance Setup

### Launch EC2 Instance
1. Go to AWS EC2 Console
2. Click "Launch Instance"
3. Configure:
   - Name: `online-community-app`
   - AMI: Ubuntu Server 22.04 LTS
   - Instance Type: t2.medium (minimum)
   - Storage: 30GB minimum
   - Key pair: Create new or select existing
   
### Security Group Configuration
Create a security group with the following rules:
```
Inbound Rules:
- SSH (22)         : Your IP
- HTTP (80)        : 0.0.0.0/0
- HTTPS (443)      : 0.0.0.0/0
- Custom TCP (3000): 0.0.0.0/0
- Custom TCP (3001): 0.0.0.0/0
- Custom TCP (3002): 0.0.0.0/0
- Custom TCP (3003): 0.0.0.0/0
- Custom TCP (3004): 0.0.0.0/0
```

## 2. Instance Connection & Setup

### Connect to Instance
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

### Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose

sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configure Docker permissions
sudo usermod -aG docker $USER
newgrp docker
```

## 3. Project Deployment

### Clone Repository
```bash
git clone <your-repository-url>
cd social-media-microservice
```

### Configure Environment Variables
Create `.env` files for each service:

1. API Gateway (api-gateway/.env):
```env
PORT=3000
JWT_SECRET=your_secure_jwt_secret
USER_SERVICE_URL=http://user:3001
POST_SERVICE_URL=http://post:3002
CONTENT_SERVICE_URL=http://content:3003
SEARCH_SERVICE_URL=http://search:3004
```

2. User Service (user/.env):
```env
PORT=3001
MONGODB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your_secure_jwt_secret
```

3. Post Service (post/.env):
```env
PORT=3002
MONGODB_URI=mongodb://your-mongodb-uri
RABBITMQ_URL=amqp://rabbitmq:5672
```

4. Content Service (content/.env):
```env
PORT=3003
MONGODB_URI=mongodb://your-mongodb-uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RABBITMQ_URL=amqp://rabbitmq:5672
```

5. Search Service (search/.env):
```env
PORT=3004
RABBITMQ_URL=amqp://rabbitmq:5672
```

### Deploy Application
```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# Verify deployment
docker-compose ps
```



##  Future Considerations

## 4. Monitoring Setup

### Install Monitoring Tools
```bash
# Prometheus
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  prom/prometheus

# Grafana
docker run -d \
  --name grafana \
  -p 3000:3000 \
  grafana/grafana
```

### High Availability
- Set up Auto Scaling Group
- Use Elastic Load Balancer
- Consider AWS ECS/EKS migration

### Database
- Use AWS RDS or DocumentDB
- Configure automated backups
- Set up read replicas

### Security
- Implement AWS WAF
- Use AWS Secrets Manager
- Regular security updates
- Enable CloudWatch monitoring

### SSL/TLS
- Register domain in Route 53
- Configure SSL using AWS Certificate Manager
- Set up HTTPS redirect






