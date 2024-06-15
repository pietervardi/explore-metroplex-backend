# Explore Metroplex API

## What I'm use here?

- [Express Js](https://expressjs.com/) as Framework.
- [Supabase](https://supabase.com/) as Database.

## Deployed Links

- [Front-End]()
- [Back-End](https://explore-metroplex-backend.onrender.com)

## Configuration

To run the project locally, please follow the steps below.

- #### Clone the repository
  Linux and macOS:

  ```bash
  sudo git clone https://github.com/pietervardi/explore-metroplex-backend.git
  ```
  
  Windows :
  
  ```bash
  git clone https://github.com/pietervardi/explore-metroplex-backend.git
  ```

- #### Go to the repository folder
  ```bash
  cd explore-metroplex-backend
  ```

- #### Install all dependencies
  ```bash 
  npm install
  ```

- #### Create and setup `.env` file in the root folder with same text in `.env.example` file 

- #### Push Database Schema to Local Database
  ```bash 
  npx prisma db push
  ```

- #### Start server
  ```bash
  npm run start
  ```

## API Specification

### Base URL
The base URL for all endpoints is:

### Register

- Path :
  - `/register`
- Method:
  - `POST`
- Request
  - Body Request
  ```
  {
    "name": "John Doe",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "12345",
  }
  ```
- Response
  ```
  {
    "status": "success",
    "message": "user registered",
    "data": {
      "user": {
        "id": "24207ba9-0b78-4e8a-b0f3-6ae51a26e5c8",
        "name": "John Doe",
        "username": "johndoe",
        "email": "johndoe@example.com",
        "profilePicture": "https://ui-avatars.com/api/?name=John%20Doe&background=random"
      }
    }
  }
  ```

### Login

- Path :
  - `/login`
- Method:
  - `POST`
- Request
  - Body Request
  ```
  {
    "name": "John Doe",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "{password}",
  }
  ```
- Response
  ```
  {
    "status": "success",
    "message": "login success",
    "data": {
      "token": "{Access Token}"
    }
  }
  ```

### Get Own Profile

- Path :
  - `/users/me`
- Method:
  - `GET`
- Header:
  - Authorization: Bearer - token
- Response
  ```
  {
    "status": "success",
    "message": "profile retrieved",
    "data": {
      "user": {
        "id": "24207ba9-0b78-4e8a-b0f3-6ae51a26e5c8",
        "name": "John Doe",
        "username": "johndoe",
        "email": "johndoe@example.com",
        "profilePicture": "https://ui-avatars.com/api/?name=John%20Doe&background=random",
        "role": "USER"
      }
    }
  }
  ```

### Update Password

- Path :
  - `/users/me/password`
- Method:
  - `PATCH`
- Header:
  - Authorization: Bearer - token
- Request
  - Body Request
  ```
  {
    "currentPassword": "xxxxx",
    "newPassword": "xxxxx"
  }
  ```
- Response
  ```
  {
    "status": "success",
    "message": "password updated"
  }
  ```

### Logout

- Path :
  - `/logout`
- Method:
  - `DELETE`
- Response
  ```
  {
    "status": "success",
    "message": "logout success"
  }
  ```

### Get All Users (ADMIN)

- Path :
  - `/users`
- Method:
  - `GET`
- Header:
  - Authorization: Bearer - token
- Response
  ```
  {
    "status": "success",
    "message": "users retrieved",
    "data": {
      "users": [
        {
          "id": "c063a47d-2bd0-4101-b597-787815aa0b63",
          "name": "Admin",
          "username": "admin",
          "email": "admin@example.com",
          "profilePicture": "https://ui-avatars.com/api/?name=Admin&background=random",
          "role": "ADMIN"
        },
        {
          "id": "24207ba9-0b78-4e8a-b0f3-6ae51a26e5c8",
          "name": "John Doe",
          "username": "johndoe",
          "email": "johndoe@example.com",
          "profilePicture": "https://ui-avatars.com/api/?name=John%20Doe&background=random",
          "role": "USER"
        }
      ]
    }
  }
  ```

### Update User

- Path :
  - `/users/:id`
- Method:
  - `PATCH`
- Header:
  - Authorization: Bearer - token
- Request
  - Body Request
  ```
  {
    "name": "Admin Tertua",
  }
  ```
- Response
  ```
  {
    "status": "success",
    "message": "user updated",
    "data": {
      "user": {
        "id": "c063a47d-2bd0-4101-b597-787815aa0b63",
        "name": "Admin Tertua",
        "username": "admin",
        "email": "admin@example.com",
        "profilePicture": "https://ui-avatars.com/api/?name=Sandhika%20Galih&background=random",
        "role": "ADMIN"
      }
    }
  }
  ```

### Delete User

- Path :
  - `/users/:id`
- Method:
  - `DELETE`
- Header:
  - Authorization: Bearer - token
- Response
  ```
  {
    "status": "success",
    "message": "user deleted",
  }
  ```

### Get All Tours

- Path :
  - `/tours`
- Query Parameter:
  - `city`
  - `page=1`
  - `limit=10`
- Method:
  - `GET`
- Response
  ```
  {
    "status": "success",
    "message": "tours retrieved",
    "data": {
      "tours": [
        {
          "id": "f1cb07ff-a3ce-4ac3-a628-ce8dc7c866c8",
          "name": "Taman Mini Indonesia Indah",
          "city": "Jakarta",
          "price": 35000,
          "capacity": 50,
          "visitor": 125,
          "description": "Taman hiburan di Jakarta Timur",
          "address": "Jl. Taman Mini Indonesia Indah, Ceger, Kec. Cipayung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13820",
          "map": "https://maps.app.goo.gl/KrNbvM7MaWq5HqkP6",
          "photo": "https://explore-metroplex-store.s3.ap-southeast-1.amazonaws.com/tours/9f352b3a58f7c541e34eff935f946d700c6f703737a16084dd988bc26023f79b-Screenshot%20%2872%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQ3EGRJEMSVX6QIUX%2F20240602%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20240602T145058Z&X-Amz-Expires=3600&X-Amz-Signature=886d09dfe320e66b7abe3326f39d62025254780a93974255fd5291dc6303fdcb&X-Amz-SignedHeaders=host&x-id=GetObject",
          "rating": 4.5,
          "createdAt": "2024-05-30T14:59:53.868Z",
          "updatedAt": "2024-05-30T15:15:27.321Z"
        }
      ]
    }
  }
  ```

### Get Detail Tour

- Path :
  - `/tours/:id`
- Method:
  - `GET`
- Response
  ```
  {
    "status": "success",
    "message": "tour retrieved",
    "data": {
      "detailTour": {
        "id": "f1cb07ff-a3ce-4ac3-a628-ce8dc7c866c8",
        "name": "Taman Mini Indonesia Indah",
        "city": "Jakarta",
        "price": 35000,
        "capacity": 50,
        "visitor": 125,
        "description": "Taman hiburan di Jakarta Timur",
        "address": "Jl. Taman Mini Indonesia Indah, Ceger, Kec. Cipayung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13820",
        "map": "https://maps.app.goo.gl/KrNbvM7MaWq5HqkP6",
        "photo": "https://explore-metroplex-store.s3.ap-southeast-1.amazonaws.com/tours/9f352b3a58f7c541e34eff935f946d700c6f703737a16084dd988bc26023f79b-Screenshot%20%2872%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQ3EGRJEMSVX6QIUX%2F20240602%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20240602T145220Z&X-Amz-Expires=3600&X-Amz-Signature=d9062db43e4019532b00452a2bff70a7d4cd1d7fe7f2d7d742b05318ec9a180a&X-Amz-SignedHeaders=host&x-id=GetObject",
        "rating": 4.5,
        "createdAt": "2024-05-30T14:59:53.868Z",
        "updatedAt": "2024-05-30T15:15:27.321Z",
        "feedbacks": [
          {
            "id": "6973a7f2-871b-4636-93fb-c226b3fcb1f3",
            "text": "Tempatnya nyaman dan bersih, saya suka saya suka",
            "rate": 5,
            "createdAt": "2024-05-30T15:12:20.293Z",
            "user": {
              "id": "6130baa8-76d3-4c93-8660-a96acf8b1489",
              "name": "Maria Doe",
              "username": "maria",
              "email": "maria@example.com",
              "profilePicture": "https://ui-avatars.com/api/?name=Maria%20Doe&background=random",
              "role": "USER"
            }
          },
          {
            "id": "30e57435-bead-46b2-9362-e8cf5ea4ad3a",
            "text": "Bagus sih",
            "rate": 4,
            "createdAt": "2024-05-30T15:13:11.714Z",
            "user": {
              "id": "6130baa8-76d3-4c93-8660-a96acf8b1489",
              "name": "Louis Doe",
              "username": "louis",
              "email": "louis@example.com",
              "profilePicture": "https://ui-avatars.com/api/?name=Louis%20Doe&background=random",
              "role": "USER"
            }
          }
        ]
      }
    }
  }
  ```

### Create Tour (ADMIN)

- Path :
  - `/tours`
- Method:
  - `POST`
- Header:
  - Authorization: Bearer - token
- Request
  - Body Request
  ```
  {
    "name": "Taman Safari Indonesia Bogor",
    "city": "Bogor",
    "price": 15000,
    "capacity": 200,
    "description": "Taman Safari Indonesia adalah tempat wisata keluarga berwawasan lingkungan yang berorientasi pada habitat satwa di alam bebas. Taman Safari Indonesia terletak di Desa Cibeureum Kecamatan Cisarua, Kabupaten Bogor, Jawa Barat atau yang lebih dikenal dengan kawasan Puncak.",
    "address": "Jalan Kapten Harun Kabir No.724, Cibeureum, Kec. Cisarua, Kabupaten Bogor, Jawa Barat 16750",
    "map": "https://maps.app.goo.gl/LtR9AQkydnmNhuME6",
  }
  ```
  - File Request
  ```
  "image": "{Image File}"
  ```
- Response
  ```
  {
    "status": "success",
    "message": "tour created",
    "data": {
      "tour": {
        "id": "a7odahpd-a3ce-4ac3-a628-adiq318dh2od",
        "name": "Taman Safari Indonesia Bogor",
        "city": "Bogor",
        "price": 15000,
        "capacity": 200,
        "visitor": 0,
        "description": "Taman Safari Indonesia adalah tempat wisata keluarga berwawasan lingkungan yang berorientasi pada habitat satwa di alam bebas. Taman Safari Indonesia terletak di Desa Cibeureum Kecamatan Cisarua, Kabupaten Bogor, Jawa Barat atau yang lebih dikenal dengan kawasan Puncak.",
        "address": "Jalan Kapten Harun Kabir No.724, Cibeureum, Kec. Cisarua, Kabupaten Bogor, Jawa Barat 16750",
        "map": "https://maps.app.goo.gl/LtR9AQkydnmNhuME6",
      }
    }
  }
  ```

### Update Tour (ADMIN)

- Path :
  - `/tours/:id`
- Method:
  - `PATCH`
- Header:
  - Authorization: Bearer - token
- Request
  - Body Request
  ```
  {
    "price": 55000
  }
  ```
- Response
  ```
  {
    "status": "success",
    "message": "tour updated",
    "data": {
      "tour": {
        "id": "a7odahpd-a3ce-4ac3-a628-adiq318dh2od",
        "name": "Taman Safari Indonesia Bogor",
        "city": "Bogor",
        "price": 55000,
        "capacity": 200,
        "visitor": 0,
        "description": "Taman Safari Indonesia adalah tempat wisata keluarga berwawasan lingkungan yang berorientasi pada habitat satwa di alam bebas. Taman Safari Indonesia terletak di Desa Cibeureum Kecamatan Cisarua, Kabupaten Bogor, Jawa Barat atau yang lebih dikenal dengan kawasan Puncak.",
        "address": "Jalan Kapten Harun Kabir No.724, Cibeureum, Kec. Cisarua, Kabupaten Bogor, Jawa Barat 16750",
        "map": "https://maps.app.goo.gl/LtR9AQkydnmNhuME6",
      }
    }
  }
  ```

### Delete Tour (ADMIN)

- Path :
  - `/tours/:id`
- Method:
  - `DELETE`
- Header:
  - Authorization: Bearer - token
- Response
  ```
  {
    "status": "success",
    "message": "tour deleted",
  }
  ```

### Create Reservation

- Path :
  - `/tours/:id/reservations`
- Method:
  - `POST`
- Header:
  - Authorization: Bearer - token
- Request
  - Body Request
  ```
  {
    "name": "Doni",
    "phone": "084312863193",
    "email": "doni@example.com",
    "ticket": 20,
    "subtotal": 700000,
    "reservedAt": "2024-06-23T20:05:26.064Z"
  }
  ```
- Response
  ```
  {
    "status": "success",
    "message": "reservation created",
  }
  ```

### Get Reservations

- Path :
  - `/reservations`
- Query Parameter:
  - `status`
- Method:
  - `GET`
- Header:
  - Authorization: Bearer - token
- Response
  ```
  {
    "status": "success",
    "message": "reservation retrieved",
    "data": {
      "reservations": [
        {
          "id": "e13191cf-492e-47b1-9f3b-fe3f98c37bea",
          "name": "Doni",
          "phone": "084312863193",
          "email": "doni@example.com",
          "ticket": 20,
          "subtotal": 700000,
          "reservedAt": "2024-06-23T17:00:00.000Z",
          "status": "BOOKED",
          "user": {
            "id": "6130baa8-76d3-4c93-8660-a96acf8b1489",
            "name": "Louis Doe",
            "username": "louis",
            "email": "louis@example.com",
            "profilePicture": "https://ui-avatars.com/api/?name=Louis%20Doe&background=random",
            "role": "USER"
          },
          "tour": {
            "id": "f1cb07ff-a3ce-4ac3-a628-ce8dc7c866c8",
            "name": "Taman Mini Indonesia Indah",
            "city": "Jakarta",
            "price": 35000,
            "description": "Taman hiburan di Jakarta Timur",
            "address": "Jl. Taman Mini Indonesia Indah, Ceger, Kec. Cipayung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13820",
            "map": "https://maps.app.goo.gl/KrNbvM7MaWq5HqkP6",
            "photo": "tours/9f352b3a58f7c541e34eff935f946d700c6f703737a16084dd988bc26023f79b-Screenshot (72).png"
          }
        }
      ]
    }
  }
  ```

### Cancel Reservation

- Path :
  - `/reservations/:id/cancel`
- Method:
  - `PATCH`
- Header:
  - Authorization: Bearer - token
- Response
  ```
  {
    "status": "success",
    "message": "reservation canceled",
  }
  ```

### Create Feedback

- Path :
  - `/tours/:id/feedback`
- Method:
  - `POST`
- Header:
  - Authorization: Bearer - token
- Request
  - Body Request
  ```
  {
    "text": "Bagus sih",
    "rate": 4
  }
  ```
- Response
  ```
  {
    "status": "success",
    "message": "feedback created",
  }
  ```

### Refresh Token

- Path :
  - `/token`
- Method:
  - `GET`
- Request
  - Cookies Request
  ```
  "refreshToken": "{Refresh Token}"
  ```
- Response
  ```
  {
    "status": "success",
    "message": "access token refreshed",
    data: {
      token: "{Access Token}"
    }
  }
  ```
