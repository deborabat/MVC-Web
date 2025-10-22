const bcrypt = require("bcrypt");
const { sequelize, Student } = require("../src/models");

(async () => {
  const [name, email, password, isAdminFlag] = process.argv.slice(2);
  if (!name || !email || !password) {
    console.log(
      'Uso: node scripts/createStudent.js "Nome" email@example.com senha [isAdmin]'
    );
    console.log('isAdmin opcional: pass "true" para criar admin.');
    process.exit(1);
  }
  try {
    await sequelize.sync({ alter: true }); // <-- garante coluna isAdmin criada/alterada
    const passwordHash = await bcrypt.hash(password, 10);
    const isAdmin = String(isAdminFlag).toLowerCase() === "true";
    const student = await Student.create({
      name,
      email,
      passwordHash,
      isAdmin,
    });
    console.log("Aluno criado:", {
      id: student.id,
      name: student.name,
      email: student.email,
      isAdmin: student.isAdmin,
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
