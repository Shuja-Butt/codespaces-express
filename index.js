const express = require('express')
const app = express()
const port = 3000


const fs = require('fs');


//const FormData = require('form-data'); // Explicitly import the external module
require('dotenv').config()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/print', async (req, res) => {
  try {


     const serial = req.body.serial_number || "";
    // const barcodeWidth = serial.length * 16;
    // const barcodeX = Math.max(20, (560 - barcodeWidth) / 2);

const moduleWidth = 2; // from ^BY2
const barcodeWidth = (serial.length * 11 + 35) * moduleWidth;
const barcodeX = Math.round((560 - barcodeWidth) / 2);











    const zpl = 
    `^XA
^PW560
^LL400

^FO20,20
^A0N,40,40
^FB520,1,0,C
^FD${req.body.name || ''}
^FS




^FO${barcodeX},80
^BY2,3,80
^BCN,N,80,N,N
^FD${serial}
^FS


^FO20,190
^A0N,30,30
^FB520,2,0,C
^FDUsed By: ${req.body.assigned_to || ''}^FS

^FO20,230
^A0N,30,30
^FB520,2,0,C
^FD${serial}^FS


^FO20,270
^A0N,20,20
^FB520,2,0,C
^FDTweed Shire Council^FS
^FO20,300
^A0N,20,20
^FB520,2,0,C
^FDLabel not to be removed^FS
^PQ2
^XZ`;




    
const blob = new Blob(
  [zpl],
  { type: 'text/plain' }
);

const formData = new FormData();



formData.append('sn', process.env.SN);

formData.append('zpl_file', blob, 'label.zpl');




    const response = await fetch('https://api.zebra.com/v2/devices/printers/send', {
      method: 'POST',
      headers: {
        'tenant': process.env.TENANT,
        'apikey': process.env.APIKEY,
        //...formData.getHeaders() // Crucial: Automatically applies the correct bound headers
      },
      body: formData
    });

    const data = await response.json();
    console.log(data);
    res.send(data);

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
