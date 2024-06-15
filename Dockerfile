# Menggunakan image Node.js resmi
FROM node:16

# Menyalin file aplikasi ke dalam image
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .

# Menginstal dependencies
RUN npm install

# Menyalin semua file aplikasi
COPY . .

# Mengekspos port yang digunakan aplikasi
EXPOSE 8080

# Menjalankan aplikasi
CMD ["npm", "start"]
