FROM woolfg/mysql-backup-sidecar:v0.3.2-mariadb-10.5

LABEL maintainer="Wolfgang Gassler"
LABEL description="XtraBackup based MySQL / MariaDB backup docker image to create incremental backups periodically and upload it to GCP storage"

RUN curl -fsSL https://deb.nodesource.com/setup_15.x | bash - && apt-get install -y nodejs

WORKDIR /scripts/gs-upload
COPY ./src .
RUN yarn install