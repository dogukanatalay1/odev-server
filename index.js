const express = require('express');
const cors = require('cors');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const { hashAndSave } = require("./scripts/script");

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

    hashAndSave({ 
        file: req.file, 
        algo: req.body.algo,
        secretKey: req.body.secretKey
    });
    
    res.status(200).json({
        data: {}
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});