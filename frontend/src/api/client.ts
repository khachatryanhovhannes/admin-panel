import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000", // Ձեր NestJS API baseURL
  // headers: { Authorization: 'Bearer YOUR_TOKEN' } // եթե auth եք օգտագործում
});

export default client;
