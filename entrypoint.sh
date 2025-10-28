#!/bin/sh

# # Wait for database to be ready
# echo "Waiting for database to be ready..."
# sleep 10

# # Check if migration already exists
# MIGRATION_EXISTS=$(ls -1 migrations/*.ts 2>/dev/null | wc -l)

# if [ "$MIGRATION_EXISTS" -eq "0" ]; then
#   echo "Generating migration..."
#   npm run mg:generate --name="upgradedb" || echo "Migration generation failed"
# else
#   echo "Migration file already exists, skipping generation..."
# fi

# # Run migrations (with error handling for duplicate indexes)
# echo "Running migrations..."
# npm run mg:run || {
#   echo "Migration failed, but continuing startup..."
# }

# Start the application
echo "Starting application..."
exec node dist/main
