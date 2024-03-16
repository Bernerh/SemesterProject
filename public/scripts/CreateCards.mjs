import DBManager from "./storageManager.mjs";

class createCards {

    async createCardSet(cardSetData) {
        try {
            const cardSet = await DBManager.createCardSet(cardSetData);
            return { success: true, cardSet };
        } catch (error) {
            console.error("Error creating card set:", error);
            return { success: false, message: "Failed to create card set" };
        }
    }

    async getAllCardSets() {
        try {
            const cardSets = await DBManager.getAllCardSets();
            return { success: true, cardSets };
        } catch (error) {
            console.error("Error getting card sets:", error);
            return { success: false, message: "Failed to get card sets" };
        }
    }

    async deleteCardSet(cardSetId) {
        try {
            await DBManager.deleteCardSet(cardSetId);
            return { success: true };
        } catch (error) {
            console.error("Error deleting card set:", error);
            return { success: false, message: "Failed to delete card set" };
        }
    }
}

export default new createCards();