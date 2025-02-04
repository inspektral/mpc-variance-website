const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const responsesFile = path.join(__dirname, 'responses.json');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/get_data', (req, res) => {
    if (fs.existsSync(responsesFile)) {
        const responses = fs.readFileSync(responsesFile);
        res.json(JSON.parse(responses));
    } else {
        res.json([]);
    }
});

app.post('/data', (req, res) => {
    const data = req.body;
    if (data) {
        let responses = [];
        if (fs.existsSync(responsesFile)) {
            responses = JSON.parse(fs.readFileSync(responsesFile));
        }
        responses.push(data);
        fs.writeFileSync(responsesFile, JSON.stringify(responses, null, 2));
        res.send('Data saved successfully.');
    } else {
        res.status(400).send('Invalid data received.');
    }
});


app.get('/sounds_list', (req, res) => {
    const soundsDir = path.join(__dirname, 'public', 'sounds');
    
    function buildTree(dir) {
        const items = {};
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            const relativePath = path.relative(soundsDir, fullPath);
            
            if (stat.isDirectory()) {
                items[file] = buildTree(fullPath);
            } else {
                items[file] = relativePath;
            }
        });
        
        return items;
    }
    
    try {
        const tree = buildTree(soundsDir);
        res.json(tree);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});