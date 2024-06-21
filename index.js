import express from 'express';
import FileUpload from 'express-fileupload';
import cors from 'cors';
// import session from 'express-session';
import MeatRoute from './routes/MeatRoute.js';
import dotenv from 'dotenv';
import UserRoute from './routes/UserRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import CartRoute from './routes/CartRoute.js';
import OrderRoute from './routes/OrderRoute.js';
import PredictRoute from './routes/PredictRoute.js';
// import FirestoreStore from './middleware/FirestoreStore.js';


dotenv.config();

const app = express();

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   store: new FirestoreStore(),
//   cookie: {
//     secure: 'auto'
//   }
// }));

app.use(cors());
app.use(express.json());
app.use(FileUpload());
app.use(express.static('public'));


app.use(MeatRoute);
app.use(UserRoute);
app.use(AuthRoute);
app.use(CartRoute);
app.use(OrderRoute);
app.use(PredictRoute);

app.get('/', (req, res) => {
  res.send('Aplikasi Berjalan');
});

const PORT = process.env.PORT || 8080;  // Use PORT from environment variables, or default to 8080

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Up and Running on port ${PORT}`);
});
