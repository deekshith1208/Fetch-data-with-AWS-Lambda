# Fetch-data-with-AWS-Lambda
AWS PROJECT

# Retrieve DynamoDB Table Data using AWS Lambda Function

This guide walks you through setting up a DynamoDB table and an AWS Lambda function to retrieve data from the table. Follow the steps below to get started.

---

## Step 1: Set Up a DynamoDB Table
The DynamoDB table will store user data.

1. **Create Table**
   - Navigate to **DynamoDB** > **Tables** > **Create Table**.
   - Provide the table name: `UserData`.
   - Set the partition key: `userid`.
   - Use the default settings and create the table.

     ![Image](https://github.com/user-attachments/assets/33a15f64-38b7-488d-bcc2-c76ecfd69266)

2. **Add an Item**
   - Wait until the table status is `ACTIVE`.
   - Select **Explore Table Items**.
   - Click **Create Item** and switch to the **JSON View**.
   - Add the following JSON data and create the item:
     ```json
     {
       "userid": "1",
       "name": "Test User",
       "email": "test@example.com"
     }
     ```

---

## Step 2: Set Up a Lambda Function
AWS Lambda allows you to run code without managing servers. This function will retrieve data from the DynamoDB table.

1. **Create Function**
   - Navigate to **AWS Lambda** > **Create Function**.
   - Set the function name: `RetrieveUserData`.
   - Change the default execution role by selecting **Create a new role with basic Lambda permissions**.
   - Create the function.

2. **Write Code**
   - Replace the region with your region ID.
   - Add the following code to your Lambda function:
     ```javascript
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
     ```
   - Deploy the function.

---

## Step 3: Write a Lambda Function Test

1. Navigate to the **Test** tab in your Lambda function.
2. Scroll down to **Event JSON** and input the following:
   ```json
   {
     "userId": "1"
   }
   ```
3. Click **Test**.

If the code runs successfully but cannot access DynamoDB, proceed to the next step to grant necessary permissions.

---

## Step 4: Grant DynamoDB Access to Lambda

1. Navigate to the Lambda function's **Configuration** tab.
2. Select **Permissions** and click on the role name.
3. Add permissions by attaching the `AmazonDynamoDBReadOnlyAccess` policy.
4. Click **Add Permissions**.

---

## Final Step: Retest Lambda Function

After adding permissions, retest the Lambda function by using the **Test** tab.

---

## Additional Security: Use an Inline Policy
To secure access even further, replace the read-only policy with an inline policy.

1. Navigate to the **Configuration** tab of the Lambda function.
2. Select **Permissions**.
3. Remove the `AmazonDynamoDBReadOnlyAccess` policy.
4. Add an inline policy with the following JSON code:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "DynamoDBReadAccess",
         "Effect": "Allow",
         "Action": [
           "dynamodb:GetItem"
         ],
         "Resource": [
           "arn:aws:dynamodb:YOUR-REGION:YOUR-ACCOUNT-ID:table/YOUR-TABLE-NAME"
         ]
       }
     ]
   }
   ```
5. Provide a policy name and create the policy.

---

Congratulations! You have successfully set up an AWS Lambda function to retrieve data from a DynamoDB table. Ensure you replace placeholders (`YOUR-REGION`, `YOUR-ACCOUNT-ID`, `YOUR-TABLE-NAME`) with your actual values where applicable.

