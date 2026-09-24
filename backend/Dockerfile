FROM python:3.11-slim

WORKDIR /app

# Install system build dependencies, Coin-OR CBC solver, and curl for health monitoring
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    coinor-cbc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Ensure non-root operational security
RUN useradd -u 1000 -m resqgrid && chown -R resqgrid:resqgrid /app
USER resqgrid

EXPOSE 8000

# Healthcheck monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
