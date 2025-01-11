# Fullstack Java Project

## Yozkan Halim 3AONC

## Folder structure

- Readme.md
- _architecture_: this folder contains documentation regarding the architecture of your system.
- `docker-compose.yml` : to start the backend (starts all microservices)
- _backend-java_: contains microservices written in java
- _demo-artifacts_: contains images, files, etc that are useful for demo purposes.
- _frontend-web_: contains the Angular webclient

Each folder contains its own specific `.gitignore` file.  
**:warning: complete these files asap, so you don't litter your repository with binary build artifacts!**

## How to setup and run this application

If you want to run the local frontend, you need to uncomment the frontend section in the `docker-compose.yml` file first. Otherwise, you can leave it as is.

Then, run `docker compose up -d` to start the Docker containers (frontend and databases)."

### Forntend

#### - Local Setup

`npm install`

`ng serve`

Visit `http://localhost:4200`

#### - Using docker

If you run `docker compose up -d`, the frontend can be accessed at `http://localhost:4200`.

### Backend

#### - Local Setup

To run the backend locally, start the databases first by running the `docker-compose.yml` file. After that, manually start the services in the following order:

- `config-service`
- `discovery-service`
- `gateway-service`

Finally, start any additional services as needed.
