# Whatsapp Automation Tool

The WhatsApp Automation Tool is a powerful application built using Electron.js, React.js, and Tailwind CSS. It provides a range of features to automate WhatsApp messaging and simplify communication processes.

## Features

- **QR-based Authentication**: The application utilizes QR codes for seamless authentication, allowing users to log in quickly.
- **Persistent Authentication**: Authentication data is securely cached in MongoDB, eliminating the need to log in every time the application is launched.
- **Unlimited Messaging**: Send an unlimited number of messages, including media messages, to your contacts effortlessly.
- **Message Templating System**: Utilize the built-in message templating system to compose messages efficiently and conveniently.
- **CSV Number Upload**: Upload a list of contact numbers via a CSV file, simplifying the process of reaching multiple recipients.
- **TXT Template Upload**: Upload message templates from TXT files, enabling easy customization and personalization of messages.
- **Randomized Message Timing**: Messages are sent at random intervals, ensuring that they are not labeled as spam and maintaining a natural flow of communication.
- **Caching**: The WhatsApp Automation Tool utilizes Redis cache to store large CSV and text files before sending, ensuring efficient performance and minimizing resource usage. This approach optimizes file handling and enables fast and reliable access during the sending process.

## ENV Variables

.env file in desktop folder should include two variables:
MONGODB_URI = The Url Of The Mongodb Database server
DB_NAME = the name of the database
REDIS_URI = The URI of the Redis Database

# Note

- The Web folder contains the web version of the application that can run directly in the browser
