import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/data/:selectedDate/:fileName', async (req, res) => {
  const { selectedDate, fileName } = req.params;

  try {
    const url = `https://files.data.gouv.fr/lcsqa/concentrations-de-polluants-atmospheriques-reglementes/temps-reel/${selectedDate}/${fileName}`;
    const response = await fetch(url);
    const data = await response.text();

    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});