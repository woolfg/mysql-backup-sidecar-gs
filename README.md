# mysql-backup-sidecar with GCP storage support

This image is based on https://github.com/woolfg/mysql-backup-sidecar and extends it
by the feature to upload backups to Google Cloud Storage. The script uses the Google Cloud
Node.js client to upload files.

## Usage/config

The configuration adds the following environment variables. (For other options see the docs of [woolfg/mysql-backup-sidecar](https://github.com/woolfg/mysql-backup-sidecar-gs))

- `GS_PROJECT_NAME` Name that is used to identify your backup files. The backups are uploaded to a directory named like the project name.
- `GS_KEY_FILE` path to the GCP service account JSON file. We recommend to use [docker secrets](https://docs.docker.com/engine/swarm/secrets/) to mount it (see also example `docker-compose` file).
- `GS_BUCKET_NAME` name of your storage bucket in Google Clous Storage
- `GS_FULLBACKUPS_ONLY` optional flag to ignore incremental backups. (default is false)
- `AFTER_BACKUP_SCRIPT: node /gs-upload` has to be always specified. This option executes the upload script by the main backup script.

*Example*

```
GS_PROJECT_NAME: myproject
GS_KEY_FILE: /run/secrets/gs_key_file
GS_BUCKET_NAME: dev_generic
GS_FULLBACKUPS_ONLY: "true"
AFTER_BACKUP_SCRIPT: node /gs-upload
```

A full example can be found in `example/docker-compose.yml`.
