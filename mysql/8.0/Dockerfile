FROM woolfg/mysql-backup-sidecar:v0.3.4-mysql-8.0

LABEL maintainer="Wolfgang Gassler"
LABEL description="XtraBackup based MySQL / MariaDB backup docker image to create incremental backups periodically and upload it to GCP storage"

RUN curl -fsSL https://deb.nodesource.com/setup_15.x | bash - && apt-get install -y nodejs

WORKDIR /gs-upload
COPY ./src .
RUN npm install