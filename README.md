# twitterGifexporter
Exports from twitter's video `gif` in to actual .gif

you'll need to:

1. ```npm i```
2. ```brew install ffmpeg graphicsmagick```
3. set a path to your Chrome app in .env file
  (cuz headless chromium does not support html5 video)
  usually it's : ```APP_CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome```
  *note: no escape slashes in whitespaced name
4. ```npm dev``` or ```npm start```

But most importantly remember: Not every GIF is a JIF ☝️
