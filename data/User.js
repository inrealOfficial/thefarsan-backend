import bcrypt from "bcryptjs";

const users = [
  {
    name: "Ankita",
    email: "ankitamalik03@gmail.com",
    password: bcrypt.hashSync("aryanankita", 10),
    isAdmin: true,
  },
  {
    name: "Aryan",
    email: "aryan23062001@gmail.com",
    password: bcrypt.hashSync("aryanankita", 10),
  },
];

export default users;
