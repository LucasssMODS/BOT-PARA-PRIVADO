#!/usr/bin/bash
apt-get update
apt-get upgrade
apt-get install -y nodejs libwebp ffmpeg wget tesseract
wget -O ~/../usr/share/tessdata/ind.traineddata "https://github.com/tesseract-ocr/tessdata/blob/master/ind.traineddata?raw=true"
npm install

echo "[*] Opa!, Tudo Instalado com Sucesso agr rode este comando \"npm start\" e escaneie o código"
