# Redis Setup with Docker

This guide explains how to set up and run Redis using Docker.

## Prerequisites
Ensure you have Docker installed on your system. You can verify the installation by running:

```sh
docker --version
```

## Running Redis Container
To start a Redis container, execute the following command:

```sh
docker run --name redis -p 6379:6379 -d redis
```

### Explanation:
- `--name redis` → Assigns the name `redis` to the container.
- `-p 6379:6379` → Maps port `6379` of the container to `6379` on the host machine.
- `-d redis` → Runs the Redis container in detached mode.

## Verifying Redis is Running
To check if the Redis container is running, use:

```sh
docker ps
```

This should display a running Redis container.

## Accessing Redis CLI
To access the Redis CLI inside the container, run:

```sh
docker exec -it redis redis-cli
```

## Stopping and Removing the Redis Container
If you need to stop the Redis container, use:

```sh
docker stop redis
```

To remove the container after stopping it:

```sh
docker rm redis
```

## Restarting the Redis Container
If you stopped Redis and want to restart it, run:

```sh
docker start redis
```

