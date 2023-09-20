const express = require('express');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider
      auth: {
        user: 'your_email@gmail.com', // Your email
        pass: 'your_password', // Your password
      },
    });

    // Render the EJS email template
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, 'views', 'emailTemplate.ejs'),
      { subject, text }
    );

    // Email data
    const mailOptions = {
      from: 'your_email@gmail.com', // Sender email
      to, // Receiver email
      subject,
      html: emailTemplate,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.send('Email sent successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Email not sent.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
