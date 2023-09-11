const express = require('express');
const router = express.Router();
const cors = require('cors');
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router.get('/addWallet', (req, res) => {

});

router.post('/newuser', (req, res) => {

});

app.listen(port, () => console.log(`Listening on port ${port}`));