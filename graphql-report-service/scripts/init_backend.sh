# Generate prisma schema
npx prisma generate

# Reset DB
npx prisma db push --force-reset

# Seed DB
npx prisma db seed --preview-feature

# Run development environment
# npm run dev