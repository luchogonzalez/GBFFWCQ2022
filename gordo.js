const puppeteer = require('puppeteer-core');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const MATCH = process.env.MATCH;

const matchNames = new Map([
    [101437163862, 'ARABIA'],
    [101437163878, 'MEXICO'],
    [101437163893, 'POLONIA'],
    [101437163904, '8VOS'],
    [101437163875, 'TUNEZ-AUSTRALIA']
]);

let browser;

process.on('unhandledRejection', (reason) => {
    console.error(reason.message);
})

app.listen(PORT, async () => {
    console.info(`Gordoboooot buscando entradas en el puerto ${PORT} para ${matchNames.get(MATCH)}`);
    browser = await puppeteer.connect({
        browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/679d5e5d-8835-4065-b697-96b3fb63e4a1'
    });
    const page = await browser.newPage();
    await init(page);
});

init = async function (page) {
    await browserGoTo(page);
    try {
        const ticketsAvailable = await page.$eval('#no_ticket_on_sale', noTicketsSection => {
            return getComputedStyle(noTicketsSection).getPropertyValue('display') !== 'block' && noTicketsSection.offsetHeight === 0;
        });
        if (ticketsAvailable) {
            const tickets = await page.$$("tr[id^='FIFAT_FWC22RI']");
            let index = 1;
            for (const ticket of tickets) {
                await ticket.click();
                await page.click('#book');
                await page.waitForNavigation();
                console.log('Intenté comprar ' + index);
                index++;
                const [cartPage] = await browser.pages();
                if (cartPage.url().includes('cart/reservation')) {
                    console.log('Entradas en el carrito gordo!!!');
                    await page.click('#book');
                    let newPage = await browser.newPage();
                    await newPage.goto('https://youtu.be/vyDjFVZgJoo?t=56');
                    return;
                } else if (await page.$('#buy_order')) {
                    console.log('Entradas en el carrito gordo!!!');
                    await page.click('#book');
                    newPage = await browser.newPage();
                    await newPage.goto('https://youtu.be/vyDjFVZgJoo?t=56');
                    return;
                } else {
                    await browserGoTo(page);
                }
            }
        }
    } catch (error) {
        await init(page);
    }
    await init(page);
}

browserGoTo = async (page) => {
    await page.goto(`https://resale-intl.fwc22.tickets.fifa.com/secured/selection/resale/item?performanceId=${MATCH}&productId=101437163862&lang=es`,
        { waitUntil: 'load' });
}