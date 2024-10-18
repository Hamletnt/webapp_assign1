const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body requests
app.use(express.json());

// 1. GET /configs/5
app.get('/configs/5', async (req, res) => {
    try {
        const configResponse = await axios.get('https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec');
        let configData = configResponse.data;

        // จัดการกับ max_speed ตามโจทย์
        if (!configData.max_speed) {
            configData.max_speed = 100; // ค่าเริ่มต้นถ้าไม่มี max_speed
        } else if (configData.max_speed > 110) {
            configData.max_speed = 110; // จำกัดค่า max_speed ไว้ที่ 110
        }

        res.json(configData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch config data' });
    }
});

// 2. GET /status/:id
app.get('/status/:id', (req, res) => {
    const id = req.params.id;
    // สมมติ response สถานะ
    res.json({ condition: 'good' });
});

// 3. GET /logs
app.get('/logs', async (req, res) => {
    try {
        const logsResponse = await axios.get('https://app-tracking.pockethost.io/api/collections/drone_logs/records');
        const logsData = logsResponse.data;

        res.json(logsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// 4. POST /logs
app.post('/logs', (req, res) => {
    const logData = req.body;

    // ที่นี่คุณสามารถทำการบันทึกข้อมูล log ไปที่ฐานข้อมูลหรือ API ได้
    console.log('Received log:', logData);

    res.status(201).json({ message: 'Log created successfully', log: logData });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
