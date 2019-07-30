# My Zombies

## Development
1. Clone this repository and run `npm i` in the directory
2. Create your `.env` file based on the `.env.example` and update the values. The Mongo database is accessed via the `MONGODB_URI` variable so make sure you have access to the database and it is running.

## Seeding
For a local database run the following commands. For external dbs use `mongoimport` with username and password.
```bash
mongoimport --db myZombies --collection zombies --file data/zombieTypes.json --jsonArray
mongoimport --db myZombies --collection gadgets --file data/gadgets.json --jsonArray
```