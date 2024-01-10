const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

const { hashAndSave, decryptWithAES } = require("./scripts/script");

const app = express();
app.use(express.json());

app.use(cors({ origin: '*' }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

const PORT = process.env.PORT || 3003;

app.get('/', (req, res) => {
    res.send('welcome');
});

app.post("/api/file", upload.single('file'), (req, res) => {

    console.log('req.body.algo: ', req.body.algo);
    console.log('req.body.secretKey: ', req.body.secretKey);
    console.log('req.file: ', req.file);

    let encrypted = hashAndSave({ 
        filePath: req.file.path, 
        algo: req.body.algo,
        secretKey: req.body.secretKey
    });

    console.log('encrypted: ', encrypted);
    
    res.status(200).json({
        encrypted
    });
});

app.get("/api/file/aes/:selectedFileName", (req, res) => {
    let selectedFileName = req.params.selectedFileName;

    let decryptedFile = decryptWithAES(
        `uploads\\${selectedFileName}`, 
        "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899"
    );

    res.json({ decryptedFile });
});

app.delete("/api/files/delete/:selectedFileName", (req, res) => {
    let selectedFileName = req.params.selectedFileName;
    let filePath = path.join(__dirname, 'uploads', selectedFileName); 

    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error deleting file');
            }
            res.send({ message: 'File deleted successfully' });
        });
    } else {
        res.status(404).send('File not found');
    }
});

app.get("/api/files/all", (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads'); 

    fs.readdir(directoryPath, function(err, files) {
        if (err) {
            console.log('Error finding files: ' + err);
            res.status(500).send('Unable to scan directory: ' + err);
        } else {
            let fileNames = files.map(file => {
                return file;
            });
            res.json(fileNames); 
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});