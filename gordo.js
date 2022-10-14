const puppeteer = require('puppeteer-core');
const express = require('express');
const axios = require('axios');
const app = express();
/* const path = require('path');

const matches = [101437163862, 101437163878, 101437163893, 101437163904];
const matchNames = new Map([
    [101437163862, 'ARABIA'],
    [101437163878, 'MEXICO'],
    [101437163893, 'POLONIA'],
    [101437163904, '8VOS'],
    [101437163875, 'TUNEZ-AUSTRALIA']
]); */
let browser;

app.get('/run', async (req, res) => {
    browser = await puppeteer.connect({
        browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/65d0047e-3a90-466d-8d35-fa1a441434ec'
    });
    const page = await browser.newPage();
    await init(page);
    res.end();
});

app.listen(3000, async () => {
    console.info('Gordoboooot buscando entradas en el puerto 3000..');
    try {
        await axios.get('http://localhost:3000/run');
    } catch (err) {
        console.log(err);
    }
});

init = async function (page) {
    await page.goto('https://resale-intl.fwc22.tickets.fifa.com/secured/selection/resale/item?performanceId=101437163862&productId=101437163862&lang=es',
        { waitUntil: 'load' });
    try {
        const ticketsAvailable = await page.$eval('#no_ticket_on_sale', noTicketsSection => {
            return getComputedStyle(noTicketsSection).getPropertyValue('display') !== 'block' && noTicketsSection.offsetHeight === 0;
        });
        if (ticketsAvailable) {
            await page.click("tr[id^='FIFAT_FWC22RI']");
            await page.click('#book');
            await page.waitForNavigation();
            console.log('Intenté comprar!!');
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
                await init(page);
            }
        }
    } catch (error) {
        await init(page);
    }
    await init(page);
}
