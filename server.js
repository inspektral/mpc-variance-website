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


app.get('/sounds_list', (_req, res) => {
    const soundsDir = path.join(__dirname, 'public', 'sounds');
    
    function buildList(dir, relativePath = '') {
        const items = [];
        const files = fs.readdirSync(dir);
        
        // Sort files and directories
        const sorted = files.sort((a, b) => {
            const aPath = path.join(dir, a);
            const bPath = path.join(dir, b);
            const aIsDir = fs.statSync(aPath).isDirectory();
            const bIsDir = fs.statSync(bPath).isDirectory();
            
            // Directories come first
            if (aIsDir && !bIsDir) return -1;
            if (!aIsDir && bIsDir) return 1;
            return a.localeCompare(b); // Alphabetical sorting
        });
        
        sorted.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            const currentRelativePath = path.join(relativePath, file);
            
            if (stat.isDirectory()) {
                items.push({
                    type: 'directory',
                    name: file,
                    path: currentRelativePath,
                    children: buildList(fullPath, currentRelativePath)
                });
            } else if (file.match(/\.(mp3|wav|ogg)$/i)) { // Only audio files
                items.push({
                    type: 'file',
                    name: file,
                    path: currentRelativePath
                });
            }
        });
        
        return items;
    }
    
    try {
        const list = buildList(soundsDir);
        res.json(list);
    } catch (err) {
        console.error('Error reading sounds directory:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});