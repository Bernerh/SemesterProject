import pg from "pg"
import SuperLogger from "./SuperLogger.mjs";
import "dotenv/config";

if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

class DBManager {

    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
        };

    }

    async updateUser(user) {
        const client = new pg.Client(this.#credentials);

        let newUser;

        try {
            await client.connect();
            const output = await client.query(
                'UPDATE "public"."Users" SET "name" = $1, "email" = $2, "password" = $3 WHERE "id" = $4 RETURNING *;', [user.name, user.email, user.pswHash, user.id]
            );

            if (output.rowCount === 0) {
                throw new Error('User not found.');
            }
            newUser = output.rows[0];
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        } finally {
            await client.end();
        }

        return newUser;
    }

    async deleteUser(id) {

        const client = new pg.Client(this.#credentials);

        let output;

        try {
            await client.connect();
            output = await client.query('Delete from "public"."Users" where id = $1;', [id]);

        } catch (error) {
            SuperLogger.log('Deltete User Error: ' + error.message, SuperLogger.LOGGING_LEVELS.ERROR);
        } finally {
            client.end();
        }

        return output;
    }

    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("name", "email", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;', [user.name, user.email, user.pswHash]);

            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
            SuperLogger.log('Create User ERROR: ' + error.message, SuperLogger.LOGGING_LEVELS.ERROR);
        } finally {
            client.end();
        }

        return user;

    }

    async findUser(userEmail) {
        const client = new pg.Client(this.#credentials);
        let user;

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Users" WHERE email = $1;', [userEmail]);
            user = output.rows[0];
        } catch (error) {
            console.error(error);
            SuperLogger.log('Find User Error: ' + error.message, SuperLogger.LOGGING_LEVELS.ERROR);
        } finally {
            client.end();
        }

        return user;
    }

    async createCard(cardData) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Card"("cardName", "wordSentence", "meaning") VALUES($1::Text, $2::Text, $3::Text);', [cardData.cardName, cardData.wordSentence, cardData.meaning]);

        } catch (error) {
            console.error(error);
            SuperLogger.log('Create Cards Error: ' + error.message, SuperLogger.LOGGING_LEVELS.ERROR);
        } finally {
            client.end();
        }

    }

    async getCards() {
        const client = new pg.Client(this.#credentials);

        let cards;

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Card";');
            cards = output.rows;

        } catch (error) {
            console.error(error);
            SuperLogger.log('Get Cards Error: ' + error.message, SuperLogger.LOGGING_LEVELS.ERROR);
        } finally {
            client.end();
        }

        return cards;
    }

    async getCardInfo(id) {
        const client = new pg.Client(this.#credentials);

        let card;

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Card" WHERE "cardID" = $1;', [id]);

            card = output.rows;
        } catch (error) {
            console.error(error);
            SuperLogger.log('Get Cards Error: ' + error.message, SuperLogger.LOGGING_LEVELS.ERROR);
        } finally {
            client.end();
        }

        return card;
    }

    async findUserById(id) {
        const client = new pg.Client(this.#credentials);

        let user;

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Users" WHERE "id" = $1;', [id]);

            user = output.rows[0];
        } catch (error) {
            console.error(error);
            SuperLogger.log('Get Cards Error: ' + error.message, SuperLogger.LOGGING_LEVELS.ERROR);
        } finally {
            client.end();
        }

        return user;
    }

    async deleteCard(cardId) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Card" where "cardID" = $1;', [cardId]);

        } catch (error) {
            SuperLogger.log('Deltete User Error: ' + error.message, SuperLogger.LOGGING_LEVELS.ERROR);
        } finally {
            client.end();
        }
    }

}
export default new DBManager(process.env.DB_CONNECTIONSTRING);