# easepasscloud

## Introduction
Ease Pass Cloud is a tool that synchronizes your password databases between multiple [Ease Pass](https://github.com/FrozenAssassine/EasePass) instances. To use this tool, you are required to run the latest version of [Ease Pass](https://github.com/FrozenAssassine/EasePass) using the [Ease Pass Cloud Plugin](https://github.com/finn-freitag/EasePassCloudPlugin).

## Installation

To install Ease Pass Cloud, you just need to download the docker-compose.yml file from this repository and run:
```
docker compose up -d
```

Navigate to the webinterface to setup your instance. Upload a database in the Databases tab, verify an access token is created and copy the json configuration from the Ease Pass Config tab to the plugin settings in Ease Pass. Restart Ease Pass and select your cloud database.

## Hint

I recommend making regularily backups of the mounted docker volume to recover your Ease Pass Cloud instance in case of data loss.

## Password Security

Your passwords in Ease Pass Cloud are safe. Ease Pass Cloud does not have any possibilities to decrypt your password databases. The databases are created and encrypted by the Ease Pass desktop application using your masterpassword. The entire encrypted file is uploaded to and downloaded from Ease Pass Cloud by Ease Pass. Without your masterpassword there is no possibility to decrypt the file. Even if a hacker could obtain your database files, they would be worthless for him without the masterpassword. Ease Pass, Ease Pass Cloud and Ease Pass Cloud Plugin are open source, so everyone could verify how they work.

## Disclaimer
Ease Pass Cloud is provided "as is" without any warranties. I am not responsible or liable for any data loss, service interruptions, security issues, malfunctionality, misconfiguration, or any other damages or losses resulting from the use of this software. You use it at your own risk.