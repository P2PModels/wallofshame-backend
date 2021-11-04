INIT_FLAG=flag.txt

if [ ! -f "./init_flag/$INIT_FLAG" ]; then
    touch "./init_flag/$INIT_FLAG"
    echo "-- Initializing container and db --"
    
    # Generate prisma schema
    npx prisma generate

    # Reset DB
    npx prisma db push --force-reset

    # Seed DB
    npx prisma db seed --preview-feature

    echo "-- Initialization done. --"

else
    echo "-- Container already initialized --"
fi

node dist/server