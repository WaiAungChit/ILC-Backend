const express = require('express');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const sectionRoutes = require('./routes/sectionRoutes'); 
const peerMentorRoutes = require('./routes/peerMentorRoutes'); 
const appointmentRoutes = require('./routes/appointmentRoutes'); 
const { swaggerDocs } = require('./swagger');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
swaggerDocs(app);

app.use('/api/admin', adminRoutes); 
app.use('/api/courses', courseRoutes);
app.use('/api/sections', sectionRoutes); 
app.use('/api/peermentors', peerMentorRoutes); 
app.use('/api/appointments', appointmentRoutes); 

app.listen(process.env.PORT, () => {
    console.log('Server is up and running!');
});