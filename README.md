# Explore Metroplex API

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

- #### Create and setup `.env` file in the root folder with same text in `.env.development` file 

- #### Push Database Schema to Local Database
  ```bash 
  npx prisma db push
  ```

- #### Start server
  ```bash
  npm run start
  ```
