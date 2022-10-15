const puppeteer = require('puppeteer-core');
const express = require('express');
const app = express();
const axios = require('axios');

const PORT = process.env.PORT;
const MATCH = process.env.MATCH;
const matchNames = new Map([
    ['101437163862', 'ARABIA'],
    ['101437163878', 'MEXICO'],
    ['101437163893', 'POLONIA'],
    ['101437163904', '8VOS'],
    ['101437163875', 'TUNEZ-AUSTRALIA']
]);
let browser;

process.on('unhandledRejection', (reason) => {
    console.error(reason.message);
})

app.listen(PORT, async () => {
    console.info(`Gordoboooot buscando entradas en el puerto ${PORT} para ${matchNames.get(MATCH)}`);
    const browserConfig = await axios.get('http://127.0.0.1:9222/json/version');
    browser = await puppeteer.connect({
        browserWSEndpoint: browserConfig.data.webSocketDebuggerUrl
    });
    page = await browser.newPage();
    await page.setRequestInterception(true)
    page.on('request', (request) => {
        if (request.resourceType() === 'image') request.abort()
        else request.continue()
    });
    await browserGoTo(page);
    await checkAndAddTickets(page);
});

checkAndAddTickets = async function (page) {
    let inCart = false;
    while (!inCart) {        
        const tickets = await page.$$("tr[id^='FIFAT_FWC22RI']");
        let index = 0;
        if(tickets.length === 0) {
            await browserGoTo(page);
            continue;
        } 
        console.log('Hay ' + tickets.length + ' entradas');        
        for (const ticket of tickets) {
            index++;
            await ticket.click();
            await page.click('#book');
            await page.waitForNavigation();
            // console.log('Intenté comprar ' + index);
            if (await page.$('#buy_order')) {
                inCart = true;
                await page.click('#book');
                alertPage = await browser.newPage();
                await alertPage.goto('https://youtu.be/vyDjFVZgJoo?t=56');
                return;
            } 
            await browserGoTo(page);
        }
        await browserGoTo(page);
    }
}

browserGoTo = async (page) => {
    await page.goto(`https://resale-intl.fwc22.tickets.fifa.com/secured/selection/resale/item?performanceId=${MATCH}&productId=101437163862&lang=es`,
        {
            waitUntil: 'load',
            timeout: 0
        });
}