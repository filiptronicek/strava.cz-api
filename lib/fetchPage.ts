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

export const fetchStrava = async (cafeteria: string) => {
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
            const currentDay: Order = {date: orderDay, foodChoices: []};
            for (const foodContainer of [...foodsContainer]) {
                const foodType = foodContainer.querySelector('div.popis.sloupec')?.textContent;
                const foodName = foodContainer.querySelector('div.nazev.sloupec')?.textContent;
                if (foodType && foodName) {
                    currentDay.foodChoices.push({type: foodType, name: foodName});
                }
            }
            parsedOrders.push(currentDay);
        }
        return parsedOrders;
    } else {
        if (stravaResp.status === 500) {
            return 'Not found';
        }
    }
}