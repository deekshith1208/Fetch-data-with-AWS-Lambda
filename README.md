# Fetch-data-with-AWS-Lambda
AWS Three-Tier Architecture Project

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
  
     ![Image](https://github.com/user-attachments/assets/b9f2c884-46b5-448b-b84a-0e5c5160497a)

     ![Image](https://github.com/user-attachments/assets/fcc1e12f-384c-420c-8c4c-5f6ad9b75d9e)

     ![Image](https://github.com/user-attachments/assets/bfd1cd3c-7603-4c50-a232-f418adbf2667)
     
    - Add the following JSON Code and create the item:

      ![Image](https://github.com/user-attachments/assets/2b47830c-c7d1-4974-87fe-2742c3e21b58)
      
## Step 2: Set Up a Lambda Function
AWS Lambda allows us to run code without managing servers. This function will retrieve data from the DynamoDB table.

![Image](https://github.com/user-attachments/assets/5c57e187-86ae-4090-8a88-381348741a8f)

1. **Create Function**
   - Navigate to **AWS Lambda** > **Create Function**.
   - Set the function name: `RetrieveUserData`.

![Image](https://github.com/user-attachments/assets/46d1d2d5-fba7-4781-9a4c-55acfc4ede0b)

   - Change the default execution role by selecting **Create a new role with basic Lambda permissions**.
   - Create the function.

![Image](https://github.com/user-attachments/assets/5d2e7e03-3cce-4639-915d-e574dace95ce)

     

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

![Image](https://github.com/user-attachments/assets/f9ce34b0-2610-445c-a206-a212f952e15d)

## Step 3: Write a Lambda Function Test

1. Navigate to the **Test** tab in your Lambda function.
2. Scroll down to **Event JSON** and input the following:
   ```json
   {
     "userId": "1"
   }
   ```

   ![Image](https://github.com/user-attachments/assets/6785f8f3-aca9-4aeb-bc35-4585b339f4f1)
   
3. Click **Test**.
![Image](https://github.com/user-attachments/assets/afc98e7f-bd8f-4ce5-aa94-1802cc8a0244) 

If the code runs successfully but cannot access DynamoDB, proceed to the next step to grant necessary permissions.

---

![Image](https://github.com/user-attachments/assets/f0e2ad37-9ada-4e41-94e9-a4d63e4f7dd5)

## Step 4: Grant DynamoDB Access to Lambda
1. Navigate to the **Configuration** tab of the Lambda function.  
2. Select **Permissions**.
  
   ![Image](https://github.com/user-attachments/assets/b12562d4-ab14-46e0-bd79-5b9d987b19ac)
   
3. Add an inline policy with the following JSON code:
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
4. Provide a policy name and create the policy.

---

![Image](https://github.com/user-attachments/assets/27a53e88-744a-42da-9726-42af4433b3f6)

## Final Step: Retest Lambda Function

After adding permissions, retest the Lambda function by using the **Test** tab.

---
![Image](https://github.com/user-attachments/assets/f81a666a-3736-456f-bfd0-07a4d6d76029)

Congratulations! You have successfully set up an AWS Lambda function to retrieve data from a DynamoDB table. Ensure you replace placeholders (`YOUR-REGION`, `YOUR-ACCOUNT-ID`, `YOUR-TABLE-NAME`) with your actual values where applicable.

