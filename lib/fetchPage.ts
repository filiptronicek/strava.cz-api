import fetch from 'node-fetch';

export const fetchStrava = async (cafeteria: string) => {
    const stravaResp = await fetch('https://www.strava.cz/Strava5/jidelnicky?tisk=True', {
        headers: {
            cookie: `jidelnicky_zarizeni=${cafeteria}`
        }
    });
    if (stravaResp.ok) {
        const data = await stravaResp.text();
        return data;
    }
}