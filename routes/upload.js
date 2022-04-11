const router = require('express').Router()
const cloudinary = require('cloudinary').v2
const bluebird = require('bluebird')
const fs = require('fs')
const listType = ['image/jpeg', 'image/png', 'image/webp', 'image/webp', 'image/avif', 'image/bmp', 'image/gif', 'image/svg+xml', 'image/tiff']

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

        let files = req.files.file;

        if (Array.isArray(files) && files.length < 1) {
            await bluebird.all(files, file => {
                return removeTmp(file.tempFilePath)
            })
            throw new Error("file must be not empty array")
        }

        if (!Array.isArray(files) && !files.isNull) {
            files = [files]
        }
        const data = await bluebird.map(files, async (file) => {
            if (file.size > 5 * 1024 * 1024) {
                removeTmp(file.tempFilePath)
                throw new Error("file is too large")
            }

            if (!listType.includes(file.mimetype)) {
                removeTmp(file.tempFilePath)
                console.log("type", file.mimetype)
                throw new Error("File format is incorrect.")
            }
            const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "test" })
            await removeTmp(file.tempFilePath)
            return { public_id: result.public_id, url: result.secure_url }
        })
        return res.status(200).json(data.length > 1 ? data : data[0])
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
        const notFound = data.filter(ele => ele.result == "not found")
        if (notFound.length)  return res.status(400).json({ msg: "some id images is not right" })
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