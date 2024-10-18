// Add SDK credentials
// REPLACE WITH YOUR PUBLIC KEY AVAILABLE IN: https://developers.mercadopago.com/panel
const mercadopago = new MercadoPago('APP_USR-18a68246-9590-458c-8cec-1c9875fb85ed', {
    locale: 'es-AR' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});

function createCheckoutButton(preferenceId) {
    const bricksBuilder = mercadopago.bricks();

    const renderComponent = async (bricksBuilder) => {
        if (window.checkoutButton) window.checkoutButton.unmount();
        await bricksBuilder.create(
            'wallet',
            'button-checkout', // Id del elemento donde se mostrará el botón
            {
                initialization: {
                    preferenceId: preferenceId
                },
                callbacks: {
                    onError: (error) => console.error(error),
                    onReady: () => {}
                }
            }
        );
    };

    window.checkoutButton = renderComponent(bricksBuilder);
}