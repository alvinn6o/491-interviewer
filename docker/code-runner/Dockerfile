# Simple code execution container - ARM64 native
FROM python:3.11-slim

# Install g++ for C++
RUN apt-get update && apt-get install -y g++ && rm -rf /var/lib/apt/lists/*

# Install Flask for the API
RUN pip install flask

# Create app directory
WORKDIR /app

# Copy the server script
COPY server.py .

# Expose port
EXPOSE 5000

# Run the server
CMD ["python", "server.py"]
