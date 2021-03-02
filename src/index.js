const {Storage} = require('@google-cloud/storage')
const winston = require('winston')
const archiver = require('archiver')
const path = require('path')
const fs = require('fs')

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: 'gs-upload' },
  transports: [new winston.transports.Console()],
})

const gsKeyFile = process.env.GS_KEY_FILE
const gsBucketName = process.env.GS_BUCKET_NAME
const projectName = process.env.GS_PROJECT_NAME || process.env.HOSTNAME
const fullBackupsOnly = process.env.GS_FULLBACKUPS_ONLY || false

const backupStatus = process.argv[2]
const backupStdout = process.argv[3]
const pathToBackup = process.argv[4]

const uploadProcess = new Promise((resolve, reject) => {

  if (backupStatus !== "succeed")  { return reject(`Backup was not finished successfully, upload cancelled`) }
  if(!gsKeyFile) { return reject(`Please, specify ENV var GS_KEY_FILE, current value of it: ${gsKeyFile}`) }
  if(!gsBucketName) { return reject(`Please, specify ENV var GS_BUCKET_NAME, current value of it: ${gsBucketName}`) }
  if(!pathToBackup) { return reject(`Backup path missing - usage: ${process.argv[0]} ${process.argv[1]} backupStatus backupStdOut pathToBackup`) }
  if (!fs.existsSync(pathToBackup)) { return reject(`Backup path ${pathToBackup} doesn't exist`) }

  if (fullBackupsOnly) {
    const checkpointsPath = pathToBackup+'/xtrabackup_checkpoints'
    if (!fs.existsSync(checkpointsPath)) { return reject(`Checkpoints file couldn't be found`) }
    const checkpointsData = fs.readFileSync(checkpointsPath, {encoding:'utf8', flag:'r'});
    if (checkpointsData.indexOf("full-backuped") === -1) {
      return resolve(`Not a full backup, therefore, we won't upload it`)
    }
  }

  const backupFileName = projectName + '/' + new Date().toISOString() + '_' + projectName + '.zip'

  logger.info({message: `Going to upload ${pathToBackup} as zipped file ${backupFileName} to bucket ${gsBucketName}`})

  const storage = new Storage({keyFilename: gsKeyFile})
  const backupBucket = storage.bucket(gsBucketName)
  
  const uploadFileHandle = backupBucket.file(backupFileName);

  const uploadStream = uploadFileHandle.createWriteStream({resumable: false})
  uploadStream
  .on('error', function(err){
    reject(err);
  })
  .on('finish', function() {
    resolve("Upload was successfully finished")
  })

  const archive = archiver('zip')
  archive.on('error', function(err){
    reject(err);
  })
  
  archive.pipe(uploadStream)
  archive.directory(pathToBackup, false)

  archive.finalize()

})

uploadProcess
.then(msg => {
  logger.info(msg)
})
.catch(err => {
  if (err instanceof Error && err.stack !== undefined) {
    logger.error({message: err, stack: err.stack})
  } else {
    logger.error({message: err})
  }
})