# image-repo
Submission for Shopify backend developer intern challenge.

## How to use
Prerequisites:
* Node.js
* MongoDB Atlas project and cluster

1. Clone this repository
```
$ git clone https://github.com/jennchenn/image-repo.git
```
2. Install all project dependencies
```
$ npm install
```
3. Make a copy of .env.template and rename it to .env; replace the value of MONGODB_URI with your MongoDB database connection URI
```
PORT=8080
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/defaultDatabase?retryWrites=true&w=majority
JWT_SECRET=somesecret
NUM_SALT_ROUNDS=10
```
4. Start the server
```
$ npm run start
```
5. Endpoints can be tested via Postman

## Features
- Add images to repository (single or multiple file upload)
- Search by image title
- Register a user
- Basic authentication using JWT
- Basic testing of routes

A Postman collection with all available endpoints can be found in the /e2e folder.

## Running tests
Modify the .env `MONGODB_URI` value to point to a test database. Then run the following command:
```
$ npm run test
```

## Next Steps
- Store images elsewhere rather than on the server (perhaps in S3 bucket)
- Support other features: deleting images, selling/buying, searching by text substring or by image tags
- Implementing logging throughout application
- Adding unit tests and integrated testing with test database that is populated with necessary test data
- Better documentation throughout the repository

## Final Notes
Overall this project was a lot of fun to make and taught me a lot!