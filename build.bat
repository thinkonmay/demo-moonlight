git submodule update --init --recursive

cp ./src-tauri/tauri.conf.vanilla.json ./src-tauri/tauri.conf.json

npm i

npm run build

npm run tauri build

