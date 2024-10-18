const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();

// Nueva forma de configurar el SDK
mercadopago.configure({
    access_token: 'APP_USR-7658876632220022-101614-d30336768139110fb18fa3ae68e9be9c-110180274'
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("../../client/html-js"));

app.post('/create_preference', (req, res) => {
    const items = req.body.items;
    console.log("Items recibidos:", items);

    mercadopago.preferences.create({
        items: items,
        back_urls: {
            success: 'http://localhost:8080/feedback',
            failure: 'http://localhost:8080/feedback',
            pending: 'http://localhost:8080/feedback'
        },
        auto_return: 'approved'
    }).then(function (preference) {
        // Imprimir todo el objeto para asegurarse de que contiene init_point
        console.log("Preferencia creada:", JSON.stringify(preference.body, null, 2)); 

        // Asegúrate de acceder correctamente al init_point
        const initPoint = preference.body.init_point;
        
        if (initPoint) {
            res.json({ init_point: initPoint }); // Enviar el init_point al cliente
        } else {
            console.error("init_point no está definido en la respuesta.");
            res.status(500).send("No se pudo generar el punto de inicio para el pago.");
        }
    }).catch(function (error) {
        console.error("Error al crear preferencia:", error);
        res.status(500).send("Error al crear la preferencia");
    });
});

app.get('/feedback', (req, res) => {
    res.json({
        Payment: req.query.payment_id,
        Status: req.query.status,
        MerchantOrder: req.query.merchant_order_id
    });
});

app.listen(8080, () => {
    console.log("El servidor está corriendo en el puerto 8080");
});