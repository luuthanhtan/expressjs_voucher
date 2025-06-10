# 📦 Setup Node.js Project

## ✅ Step 1: Init project
```bash
mkdir expressjs_voucher
cd expressjs_voucher
npm init -y
npm install --save-dev nodemon
```

## ✅ Step 2: Setup DB
```bash
npm install express mongoose dotenv
```
### Add `package.json`
```bash
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```
MongoDB Atlas (Cloud): https://cloud.mongodb.com
### Add `.env`
```bash
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/myDB
PORT=3000
```
## ✅ Step 3: Extensions for VS Code
### ESLint `.eslint.config.ts`
### Extension: GitLens — Git supercharged
### Extension: Code Spell Checker

## ✅ Step 4: NVM-Windows
https://github.com/coreybutler/nvm-windows/releases
 
```bash
nvm install 22.3.0
nvm use 22.3.0
node -v
```
## Available Scripts

### `npm run clean-install`

Remove the existing `node_modules/` folder, `package-lock.json`, and reinstall all library modules.


### `npm run dev` or `npm run dev:hot` (hot reloading)

Run the server in development mode.<br/>

**IMPORTANT** development mode uses `swc` for performance reasons which DOES NOT check for typescript errors. Run `npm run type-check` to check for type errors. NOTE: you should use your IDE to prevent most type errors.


### `npm run lint`

Check for linting errors.


### `npm run build`

Build the project for production.


### `npm start`

Run the production build (Must be built first).


### `npm run type-check`

Check for typescript errors.


## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`. 


## Swagger
http://localhost:3000/api-docs/