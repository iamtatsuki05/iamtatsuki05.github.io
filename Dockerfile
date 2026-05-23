FROM oven/bun:1.1.38

WORKDIR /app

ENV ASTRO_TELEMETRY_DISABLED=1 \
    CHOKIDAR_USEPOLLING=true

CMD ["bun", "dev", "--host", "0.0.0.0", "--port", "3000"]
