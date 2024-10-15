export type UserLogin = {
    email: string;
    password: string;
}

export type UserRegister = {
    name: string;
    age: number;
    email: string;
    password: string;
}

export type ChatRoomReq = {
    user1: string;
    user2: string;
}

export type ChatRoomRes = {
    id: number;
    user1: string;
    user2: string;
    email1: string;
    email2: string;
}

export type Token = {
    token: string;
}

export type Chat = {
    chatid: number;
    sender: string;
    receiver: string;
    message: string;
    date_time: string;
}

export type ChatReq = {
    sender: string;
    receiver: string | undefined;
    message: string;
    roomid: number;
}