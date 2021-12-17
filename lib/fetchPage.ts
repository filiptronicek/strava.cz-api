import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

interface Food {
    type: string;
    name: string;
}

interface Order {
    date: string | undefined;
    foodChoices: Food[]
}

export const getAuthedLunchList = async (username: string, password: string, canteen: string) => {
    const loginResp = await fetch('https://www.strava.cz/Strava/Stravnik/prihlaseni', {
        method: "POST",
        body: JSON.stringify({
            uzivatel: username,
            heslo: password,
            zarizeni: canteen
        })
    });
    if (loginResp.ok) {
        const lunchesResponse = await fetch('https://www.strava.cz/Strava5/Objednavky', {});
        if (lunchesResponse.ok) {
            const data = await lunchesResponse.text();
            const root = parse(data);
            return data;
        } else {
            throw new Error('Problem getting lunch list');
        }
    } else {
        throw new Error('There was a problem authenticating you');
    }
}

export const fetchAnon = async (cafeteria: string) => {
    const stravaResp = await fetch('https://www.strava.cz/Strava5/jidelnicky?tisk=True', {
        headers: {
            cookie: `jidelnicky_zarizeni=${cafeteria}`
        }
    });
    if (stravaResp.ok) {
        const data = await stravaResp.text();
        const root = parse(data);
        const orders = root.querySelectorAll('.objednavka');
        const parsedOrders: Order[] = [];
        for (const order of [...orders]) {
            const orderDay = order.querySelector('.den')?.textContent;
            const foodsContainer = order.querySelectorAll('.jidla .jidlo');
            const currentDay: Order = { date: orderDay, foodChoices: [] };
            for (const foodContainer of [...foodsContainer]) {
                const foodType = foodContainer.querySelector('div.popis.sloupec')?.textContent;
                const foodName = foodContainer.querySelector('div.nazev.sloupec')?.textContent;
                if (foodType && foodName) {
                    currentDay.foodChoices.push({ type: foodType, name: foodName });
                }
            }
            parsedOrders.push(currentDay);
        }
        return parsedOrders;
    } else {
        if (stravaResp.status === 500) {
            throw new Error('Not found');
        }
    }
}