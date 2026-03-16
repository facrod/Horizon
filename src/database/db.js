import mongoose from "mongoose";

mongoose.set("strictQuery");
function connect() {
    mongoose.
    connect(process.env.DB_CONNECTION)
    .then((res) => console.log("conectado correctamente a la base de datos"))
    .catch((err) => console.log(err));
}

export default connect;