import { Account, Client, Databases, Avatars, Storage } from "appwrite";
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_PROJECT_ID);

export const account = new Account(client);
export const database = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

console.log(storage.getFilePreview('65473d82db1903b4e0ba','65473e26dc92605c56a7'));

export default client;
