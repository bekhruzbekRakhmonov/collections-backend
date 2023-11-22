export function isBase64(str: string) {
        try {
            const decoded = atob(str);
            if (btoa(decoded) === str) {
                return true;
            }
        } catch (e) {
            console.error(e);
        }
        return false;
    }