# Before making a release build, set VITE_API_BASE_URL in the frontend .env to
# the deployed HTTPS API URL. Android cannot reach a developer machine at
# localhost.

# Build the website and sync it into the Android project:

npm run build
npx cap sync android

# Build the debug APK:
cd D:\coding\akarabo\akarabo-image-frontend\android
.\gradlew.bat assembleDebug

# APK output:
D:\coding\akarabo\akarabo-image-frontend\android\app\build\outputs\apk\debug