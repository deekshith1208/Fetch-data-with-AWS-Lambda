
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: 'ap-south-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient);

async function handler(event) {
    const userId = String(event.userId);
    const params = {
        TableName: 'UserData',
        Key: { userId },
    };

    try {
        const command = new GetCommand(params);
        const data = await ddb.send(command);
        console.log("DynamoDB Response:", JSON.stringify(data));
        const { Item } = data;
        if (Item) {
            console.log("User data retrieved:", Item);
            return Item;
        } else {
            console.log("No user data found for userId:", userId);
            return null;
        }
    } catch (err) {
        console.error("Unable to retrieve data:", err);
        return err;
    }
}

export { handler };
