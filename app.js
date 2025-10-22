const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const { sequelize } = require("./src/models");
const authRoutes = require("./src/routes/auth");
const projectRoutes = require("./src/routes/projects");

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

// disponibiliza sessão nas views (partials/navbar usa session)
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "src", "public")));

app.use("/", authRoutes);
app.use("/projects", projectRoutes);

// rota raiz -> redireciona para projetos (ou /login se preferir)
app.get("/", (req, res) => {
  return res.redirect("/projects");
});

(async () => {
  try {
    await sequelize.sync(); // trocar por migrations quando for necessário
    const port = process.env.PORT || 8081;
    app.listen(port, () =>
      console.log(`Servidor rodando em http://localhost:${port}`)
    );
  } catch (err) {
    console.error(err);
  }
})();

[
  {
    type: "command",
    details: {
      key: "npm.runScript",
    },
  },
];
