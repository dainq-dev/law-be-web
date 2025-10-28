# Clean everything (KHÔNG xóa volumes để giữ database)
docker compose down
docker system prune -f

# Rebuild without cache
docker compose build --no-cache api

# Start
docker compose up postgres -d
sleep 15
docker compose up api -d

# Check logs
docker compose logs -f api