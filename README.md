# Distributed Task Processing

This project simulates a distributed task processing setup using RabbitMQ for message queuing and Redis for caching.

## Setup

1. Make sure RabbitMQ and Redis are installed and running on your local machine.
2. Install dependencies using `npm install`.
3. Start the supervisor and worker nodes using `npm start`, `npm worker1`, and `npm worker2`.
4. Optionally, start the producer using `npm producer`.

## Project Structure

- `src/`: Contains source files.
  - `producer.js`: Producer logic.
  - `worker.js`: Worker logic.
  - `supervisor.js`: Supervisor logic.
  - `cache.js`: Redis caching logic.
- `.gitignore`: Specifies intentionally untracked files to ignore.
- `package.json`: Project metadata and dependencies.
- `README.md`: Project documentation.
