import socketIOClient from "socket.io-client";
const ENDPOINT = "https://trvia-co.herokuapp.com";
export const socket = socketIOClient(ENDPOINT);
