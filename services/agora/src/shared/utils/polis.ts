/** **** WARNING: GENERATED FROM SHARED DIRECTORY, DO NOT MOFIFY THIS FILE DIRECTLY! **** **/
export function isValidPolisUrl(url: string): boolean {
    try {
        const { conversationId, reportId } = extractPolisIdFromUrl(url);
        return conversationId !== undefined || reportId !== undefined;
    } catch (e) {
        console.error(e);
        return false;
    }
}

interface PolisId {
    conversationId?: string;
    reportId?: string;
}

export function extractPolisIdFromUrl(url: string): PolisId {
    if (!url.trim()) {
        throw new Error("Polis URL is empty");
    }
    const urlObject = new URL(url); // can throw
    if (
        urlObject.hostname !== "pol.is" &&
        !urlObject.hostname.endsWith(".pol.is")
    ) {
        throw new Error(`Polis URL ${url} has an incorrect hostname`);
    }

    // e.g. https://pol.is/384anuzye9 or https://pol.is/report/r32beaksmhwesyum6kaur
    const pathParts = urlObject.pathname.split("/").filter((p) => p); // filter out empty strings
    if (pathParts.length === 1) {
        return { conversationId: pathParts[0] }; // e.g. /384anuzye9
    }
    if (pathParts.length === 2 && pathParts[0] === "report") {
        return { reportId: pathParts[1] }; // e.g. /report/r32beaksmhwesyum6kaur
    }
    throw new Error(`Polis URL ${url} has an incorrect pathname`);
}
