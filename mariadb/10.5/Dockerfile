FROM woolfg/mysql-backup-sidecar:v0.3.4-mariadb-10.5

LABEL maintainer="Wolfgang Gassler"
LABEL description="XtraBackup based MySQL / MariaDB backup docker image to create incremental backups periodically and upload it to GCP storage"

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs

WORKDIR /gs-upload
COPY ./src .
RUN npm install