import { GreenchatDatabase } from "./database/greenchat-database";
import { generateIdentity } from "./security/generate-identity";

let user = null;

async function run() {
    let db = new GreenchatDatabase("greenchat-db");
    user = await db.getUser();
    if (null == user) {
        document.getElementById("splashscreen_status-generating-user").style.display = "block";
        user = await generateIdentity();
        db.createUser(user);
    }
}

run().catch(err => console.error(err));