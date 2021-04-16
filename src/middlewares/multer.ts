import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

const config = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"))
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err)

        const filename = `${hash.toString('hex')}- ${file.originalname}`

        cb(null, filename)
      })
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png'
    ]

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
}

export const upload = multer(config)