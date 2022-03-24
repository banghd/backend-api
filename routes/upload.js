const router = require('express').Router()
const cloudinary = require('cloudinary').v2
const bluebird = require('bluebird')
const fs = require('fs')


//  upload image on cloudinary
const config = () => cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
})

router.post('/upload', async (req, res) => {
    try {
        config()
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No files were uploaded.' })

        const files = req.files.file;
        const data = await bluebird.map(files, async (file) => {
            if (file.size > 5 * 1024 * 1024) {
                removeTmp(file.tempFilePath)
                throw new Error("file is too large")
            }

            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
                removeTmp(file.tempFilePath)
                throw new Error("File format is incorrect.")
            }
            const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "test" })
            await removeTmp(file.tempFilePath)
            return { public_id: result.public_id, url: result.secure_url }
        })
        return res.status(200).json(data)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: err.message })
    }
})

router.post('/destroy', async (req, res) => {
    try {
        config()
        const { public_id } = req.body;
        if (!public_id || public_id.length === 0) return res.status(400).json({ msg: 'No images Selected' })
        const data = await bluebird.map(public_id, async id => {
            return cloudinary.uploader.destroy(id)
        })
        return res.status(200).json({ msg: "Deleted Image", data})
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }

})


const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

module.exports = router