const puppeteer = require('puppeteer-core');
const express = require('express');
const app = express();
const axios = require('axios');

const PORT = process.env.PORT;
const MATCH = process.env.MATCH;
const matchNames = new Map([
    ['101437163915', 'ARABIA'],
    ['101437163878', 'MEXICO'],
    ['101437163893', 'POLONIA'],
    ['101437163904', '8VOS'],
    ['101437163873', 'TUNEZ-AUSTRALIA']
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
    await browserGoTo(page);
    await checkAndAddTickets(page);
});

checkAndAddTickets = async function (page) {
    let inCart = false;
    while (!inCart) {        
        const tickets = await page.$$("tr[id^='FIFAT_FWC22RI']");
        if(tickets.length === 0) {
             await page.waitForTimeout(1500); // Timeout if requests are limited
            await browserGoTo(page);
            continue;
        } 
        const random = getRndInteger(0, tickets.length - 1);      
        await tickets[random].click();
        await page.click('#book');  
        console.log(`${tickets.length} tickets - ${new Date().getHours()}:${new Date().getMinutes()}`);  
        try{
            await page.waitForNavigation();
        } catch (error) {
            await checkAndAddTickets(page);
        }

        if (await page.$('#buy_order')) {
            alertPage = await browser.newPage();
            await alertPage.goto('https://youtu.be/vyDjFVZgJoo?t=56');
            inCart = true;
            await page.click('#book');
            return;
        }
        await page.waitForTimeout(1500);
        await browserGoTo(page);
    }
}

browserGoTo = async (page) => {
    await page.goto(`https://resale-intl.fwc22.tickets.fifa.com/secured/selection/resale/item?performanceId=${MATCH}&productId=101397570845&lang=es`,
        {
            waitUntil: 'load',
            timeout: 0
        });
}

getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
}