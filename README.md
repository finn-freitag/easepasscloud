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