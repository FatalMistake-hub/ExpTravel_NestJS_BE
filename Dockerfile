# Sử dụng image Node.js chính thức
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install --legacy-peer-deps

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Biên dịch mã TypeScript
RUN npm run build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["npm", "run", "start:dev"]


# Stage 2: Run the application
# FROM node:20-alpine

# WORKDIR /app

# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./

# EXPOSE 3000

# CMD ["node", "dist/main"]
