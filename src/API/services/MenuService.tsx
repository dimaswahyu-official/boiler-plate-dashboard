const BASE_URL = 'https://67ff0b1e58f18d7209efe5c2.mockapi.io/api/v1/menus';

interface Menu {
    id: number;
    name: string;
    path: string;
    icon: string;
    parent_id: number | null;
    order: number;
}

// GET all Data
export const getAllMenus = async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
        throw new Error('Failed to fetch menus');
    }
    const data = await res.json();
    return data;
};

// POST a new post
export const createMenus = async (menuData: Menu) => {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData),
    });

    if (!res.ok) {
        throw new Error('Failed to create menu');
    }

    return res.json();
};
