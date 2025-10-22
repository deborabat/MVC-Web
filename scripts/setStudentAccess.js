const bcrypt = require("bcrypt");
const { sequelize, Student } = require("../src/models");

(async () => {
  const [identifier, password, isAdminFlag] = process.argv.slice(2);
  if (!identifier || !password) {
    console.log(
      "Uso: node scripts/setStudentAccess.js <email|id> <password> [isAdmin]"
    );
    console.log(
      "Ex.: node scripts/setStudentAccess.js aluno@example.com senha123"
    );
    console.log(
      "Ex.: node scripts/setStudentAccess.js admin@example.com senhaAdmin true"
    );
    process.exit(1);
  }

  try {
    await sequelize.authenticate();
    await sequelize.sync(); // garante modelos prontos (dev)

    let student;
    if (identifier.includes("@")) {
      student = await Student.findOne({ where: { email: identifier } });
    } else {
      student = await Student.findByPk(Number(identifier));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const isAdmin = String(isAdminFlag).toLowerCase() === "true";

    if (student) {
      student.passwordHash = passwordHash;
      if (typeof isAdminFlag !== "undefined") student.isAdmin = isAdmin;
      await student.save();
      console.log("Aluno atualizado:", {
        id: student.id,
        name: student.name,
        email: student.email,
        isAdmin: student.isAdmin,
      });
    } else {
      const name = identifier.includes("@")
        ? identifier.split("@")[0]
        : `user${identifier}`;
      const email = identifier.includes("@")
        ? identifier
        : `user${identifier}@example.com`;
      const created = await Student.create({
        name,
        email,
        passwordHash,
        isAdmin,
      });
      console.log("Aluno criado:", {
        id: created.id,
        name: created.name,
        email: created.email,
        isAdmin: created.isAdmin,
      });
    }

    process.exit(0);
  } catch (err) {
    console.error("Erro:", err);
    process.exit(1);
  }
})();
