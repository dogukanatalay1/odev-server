const express = require('express');
const cors = require('cors');
const multer = require('multer');

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

app.get("/api/file/aes", (req, res) => {

    let decryptedFile = decryptWithAES(
        'uploads\\84c38a41c16c10de3c7b909d7e9aa4d0', 
        "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899"
    );

    res.json({ decryptedFile });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});