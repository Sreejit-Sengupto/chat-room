# ChatRoom
ChatRoom is a Web application powered by Appwrite and built with React. ChatRoom provides you with a single chat window where you can chat with your friends. All you need is just an Appwrite account and you are all set. The chats will be saved to your Appwrite account in your Appwrite database (yes you can talk about your secrets 🤫)

# Installation
Fork (if you want to contribute) or Clone the project and then follow the steps below -
### Setting up Appwrite
1. Create your Appwrite account if you don't have one or sign in
2. Create a new project
3. Create a new database
4. Create two collections (you can name them as messages and typing indicator)
5. Inside your messages collection create three attributes - user_id, username, message(All of string type) (Attributes should be as it is as mentioned here). Give them a size of 250 and hit create.
6. Inside your typing indicator collection create three attributes - user_id, username,(of String types) isTyping(boolean defaults to false) (Attributes should be as it is as mentioned here). Give them a size of 250 and hit create.
7. Come back to typing indicator collection and create a document, leave user_id and username attributes blank and set isTyping attribute to false.

### Setting up the App
1. Create a .env file at the root of the project and paste the following code -
```
VITE_DATABASE_ID=<YOUR VITE DATABASE ID>
VITE_MESSAGE_COLLECTION_ID=<COLLECTION ID OF THE MESSAGE COLLECTION IN YOUR DATABASE>
VITE_TYPING_COLLECTION_ID=<COLLECTION ID OF THE TYPING-INDICATOR COLLECTION IN YOUR DATABASE>
VITE_TYPING_COLLECTION_DOCUMENT_ID=<DOCUMENT ID OF THE DOCUMENT INSIDE TYPING-INDICATOR COLLECTION>
VITE_PROJECT_ID=<YOUR VITE PROJECT ID>
```
2. `npm install` to install required dependencies. (You need NodeJS for this, install if you haven't)
3. `npm run dev` to run the app in you local host.
5. Deploy it to a provider(Netlify, Vercel, etc.) of your chosen and share with your friends.
6. Go to your Appwrite and in the Auth section add your friends, ask them for their Email IDs and create a password of your chosen (later they can change it within the app).
7. Give them their login credentials and to login to the ChatRoom.
8. Yippee! All set. Now you can chat peacefully.

# Contributions
The app is open for contributions either improve the UI, optimise the code or add a cool feature. It's upto you!
