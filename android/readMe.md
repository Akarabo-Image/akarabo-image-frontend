#after changing something on website make sure that it is running then run this to generate new app. 

# you can find it in 

D:\coding\akarabo\akarabo-image-frontend\android\app\build\outputs\apk\debug


npm run build
npx cap sync android
cd android
./gradlew.bat assembleDebug