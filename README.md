# BE-Law-Official - Backend Portal

Hệ thống quản lý luật và dịch vụ pháp lý với kiến trúc Modular Monolith sử dụng NestJS.

## 🚀 Tính năng chính

### 1. Authentication & Authorization
- JWT Authentication với refresh token
- Role-based access control (RBAC)
- Permission management
- Admin management

### 2. Human Resources Management
- Quản lý nhân sự
- Quản lý học vấn và kinh nghiệm
- Featured staff display

### 3. Services Management
- Quản lý dịch vụ pháp lý
- Process steps cho từng dịch vụ
- Pricing và duration management

### 4. Contact Management
- Contact form với email notification
- Auto-reply system
- Admin dashboard cho contact management

### 5. Homepage
- Tổng hợp thống kê
- Featured content display
- Company information

## 🛠️ Công nghệ sử dụng

- **Backend Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL với TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer với SMTP
- **Testing**: Jest

## 📋 Yêu cầu hệ thống

- Node.js >= 18.x
- PostgreSQL >= 13.x
- npm hoặc yarn

## 🚀 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd be-law-official
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình environment
```bash
cp env.example .env
```

Chỉnh sửa file `.env` với thông tin database và các cấu hình khác:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=law_company_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. Chạy migrations
```bash
npm run mg:run
```

### 5. Chạy ứng dụng
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Documentation

Sau khi chạy ứng dụng, truy cập Swagger UI tại:
```
http://localhost:3000/swagger
```

## 🏗️ Kiến trúc dự án

```
src/
├── module/                    # Business modules
│   ├── auth/                 # Authentication
│   ├── admin/                # Admin management
│   ├── human-resources/      # Human resources
│   ├── services/             # Services management
│   ├── contact/              # Contact management
│   └── homepage/             # Homepage data
├── shared/                   # Shared components
│   ├── entities/             # Database entities
│   ├── utilities/            # Utility functions
│   ├── interfaces/           # Type definitions
│   └── constants/            # Application constants
└── config/                   # Configuration files
```

## 🔐 Authentication

### Đăng nhập
```bash
POST /api/auth/login
{
  "user_email": "admin@lawcompany.com",
  "password": "password123"
}
```

### Refresh token
```bash
POST /api/auth/refresh
{
  "refresh_token": "your-refresh-token"
}
```

## 📊 Các API chính

### Human Resources
- `GET /api/human-resources` - Danh sách nhân sự
- `POST /api/human-resources` - Tạo nhân sự mới
- `GET /api/human-resources/featured` - Nhân sự nổi bật

### Services
- `GET /api/services` - Danh sách dịch vụ
- `POST /api/services` - Tạo dịch vụ mới
- `GET /api/services/featured` - Dịch vụ nổi bật

### Contact
- `POST /api/contact` - Gửi form liên hệ
- `GET /api/contact` - Danh sách liên hệ (Admin)

### Homepage
- `GET /api/homepage` - Dữ liệu trang chủ
- `GET /api/homepage/stats` - Thống kê (Admin)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Scripts

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Database migrations
npm run mg:run
npm run mg:generate --name=migration-name
npm run mg:revert

# Linting
npm run lint

# Format code
npm run format
```

## 🔧 Cấu hình Database

### Tạo migration mới
```bash
npm run mg:generate --name=add-new-feature
```

### Chạy migrations
```bash
npm run mg:run
```

### Revert migration
```bash
npm run mg:revert
```

## 📧 Email Configuration

Cấu hình SMTP trong file `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

## 🚀 Deployment

### 1. Build ứng dụng
```bash
npm run build
```

### 2. Cấu hình production
- Cập nhật các biến môi trường production
- Cấu hình database production
- Cấu hình SMTP production

### 3. Chạy migrations production
```bash
npm run mg:run
```

### 4. Start ứng dụng
```bash
npm run start:prod
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm thông tin.

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.
