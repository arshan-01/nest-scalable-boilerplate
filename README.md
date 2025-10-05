# NestJS Backend Template

A production-ready, scalable NestJS backend template with PostgreSQL, Redis, comprehensive authentication, and modern development practices.

## 🚀 Features

### Core Features
- **NestJS Framework** - Modern, scalable Node.js framework
- **PostgreSQL Database** - Support for local, Neon, and Supabase
- **TypeORM** - Advanced ORM with migrations and seeding
- **Redis Caching** - High-performance caching and session storage
- **JWT Authentication** - Secure token-based authentication
- **OTP Verification** - Email-based OTP for login and verification
- **BullMQ Queues** - Background job processing
- **Swagger Documentation** - Auto-generated API documentation

### Security & Performance
- **Helmet** - Security headers
- **Rate Limiting** - Request throttling
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Class-validator with DTOs
- **Error Handling** - Global exception filters
- **Logging** - Structured logging with Winston
- **Health Checks** - Application monitoring

### Development & Deployment
- **Docker Support** - Multi-stage builds and docker-compose
- **Database Migrations** - Version-controlled schema changes
- **Environment Configuration** - Flexible config management
- **TypeScript** - Full type safety
- **ESLint & Prettier** - Code quality and formatting
- **Testing Setup** - Jest configuration

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (local, Neon, or Supabase)
- Redis
- Docker (optional)

## 🛠️ Installation

### 1. Clone the Template
```bash
git clone <your-repo-url>
cd nestjs-backend-template
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp env.example .env
```

Configure your `.env` file:

#### Local PostgreSQL
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=nestjs_template
```

#### Neon PostgreSQL (Cloud)
```env
NEON_DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### Supabase PostgreSQL (Cloud)
```env
SUPABASE_DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### 4. Database Setup
```bash
# Generate migration
npm run migration:generate -- src/database/migrations/InitialMigration

# Run migrations
npm run migration:run

# Seed database
npm run seed:run
```

### 5. Start Development Server
```bash
npm run start:dev
```

## 🐳 Docker Setup

### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Build image
docker build -t nestjs-template .

# Run container
docker run -p 3000:3000 --env-file .env nestjs-template
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/api/v1/health

## 🏗️ Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── controllers/         # Auth controllers
│   ├── services/           # Auth business logic
│   ├── strategies/         # Passport strategies
│   ├── guards/             # Auth guards
│   └── dto/                # Auth DTOs
├── users/                  # User management module
│   ├── controllers/        # User controllers
│   ├── services/          # User business logic
│   └── dto/               # User DTOs
├── common/                 # Shared components
│   ├── entities/          # TypeORM entities
│   ├── dto/               # Common DTOs
│   ├── enums/             # Application enums
│   ├── interfaces/        # TypeScript interfaces
│   ├── decorators/        # Custom decorators
│   ├── guards/            # Global guards
│   ├── interceptors/      # Global interceptors
│   ├── filters/           # Exception filters
│   ├── pipes/             # Validation pipes
│   └── utils/             # Utility functions
├── config/                 # Configuration
│   ├── configuration.ts   # App configuration
│   └── database.config.ts # Database config
├── database/              # Database related
│   ├── migrations/        # TypeORM migrations
│   ├── seeds/            # Database seeds
│   └── data-source.ts    # TypeORM data source
├── health/               # Health check module
├── shared/               # Shared services
├── queue/                # Background job processing
├── app.module.ts         # Root module
└── main.ts              # Application entry point
```

## 🔐 Authentication

### Registration
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Email Verification
```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

### Login with Password
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login with OTP
```bash
# Send OTP
curl -X POST http://localhost:3000/api/v1/auth/send-login-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'

# Login with OTP
curl -X POST http://localhost:3000/api/v1/auth/login-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

## 🗄️ Database

### Migrations
```bash
# Generate migration
npm run migration:generate -- src/database/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Seeding
```bash
# Run seeds
npm run seed:run
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
REDIS_HOST=your-redis-host
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

### Production Build
```bash
npm run build
npm run start:prod
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 Monitoring

### Health Checks
- **Application**: `/api/v1/health`
- **Database**: `/api/v1/health/database`
- **Redis**: `/api/v1/health/redis`

### Logging
- Structured logging with Winston
- Request/response logging
- Error tracking
- Performance metrics

## 🔧 Configuration

### Database Options

#### Local PostgreSQL
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=nestjs_template
```

#### Neon (Cloud PostgreSQL)
```env
NEON_DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### Supabase (Cloud PostgreSQL)
```env
SUPABASE_DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### Redis Configuration
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0
```

## 🛡️ Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secrets**: Use strong, unique secrets
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Configure appropriate limits
5. **Input Validation**: All inputs are validated
6. **Password Security**: Passwords are hashed with bcrypt
7. **CORS**: Configure proper origins
8. **Helmet**: Security headers enabled

## 📈 Performance Optimization

- **Redis Caching**: Frequently accessed data cached
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Compression**: Response compression enabled
- **Rate Limiting**: Prevents abuse
- **Background Jobs**: Heavy operations queued

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For questions and support:
- Create an issue in the repository
- Check the documentation
- Review the examples

## 🔄 Updates

To update the template:
```bash
git pull origin main
npm install
npm run migration:run
```

---

**Happy Coding! 🎉**
