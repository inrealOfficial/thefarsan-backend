import bcrypt from "bcryptjs";

const users = [
  {
    name: "Ankita",
    email: "ankitamalik03@gmail.com",
    password: bcrypt.hashSync("aryanankita", 10),
    isAdmin: true,
    phoneNumber: 7045013337,
  },
  {
    name: "Aryan",
    email: "aryan23062001@gmail.com",
    password: bcrypt.hashSync("aryanankita", 10),
    phoneNumber: 7045013337,
  },
];

export default users;
