const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const { sequelize } = require("./src/models");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "algum_segredo",
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session; // navbar usa session
  next();
});

const adminRoutes = require('./src/routes/admin');
app.use('/admin', adminRoutes);

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "src", "public")));

(async () => {
  try {
    // trocar alter:true por sync() para não tentar modificar tabelas existentes
    await sequelize.sync(); // <-- menos invasivo que { alter: true }

    // require/mount routes after sync
    const authRoutes = require("./src/routes/auth");
    const projectRoutes = require("./src/routes/projects");

    app.use("/", authRoutes);
    app.use("/projects", projectRoutes);
    const myKnowledges = require('./src/routes/myKnowledges');
    app.use('/my/knowledges', myKnowledges);

    app.get("/", (req, res) => res.redirect("/projects"));

    const port = process.env.PORT || 8081;
    app.listen(port, () =>
      console.log(`Servidor rodando em http://localhost:${port}`)
    );
  } catch (err) {
    console.error(err);
  }
})();
