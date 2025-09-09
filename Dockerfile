FROM oven/bun:1.1.38

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    WATCHPACK_POLLING=true \
    CHOKIDAR_USEPOLLING=true

CMD ["bun", "dev", "-H", "0.0.0.0", "-p", "3000"]
