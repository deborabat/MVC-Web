const bcrypt = require('bcrypt');
const { sequelize, Student } = require('../src/models');

(async () => {
  const [name, email, password] = process.argv.slice(2);
  if (!name || !email || !password) {
    console.log('Uso: node scripts/createStudent.js "Nome" email@example.com senha');
    process.exit(1);
  }
  try {
    await sequelize.sync();
    const passwordHash = await bcrypt.hash(password, 10);
    const student = await Student.create({ name, email, passwordHash });
    console.log('Aluno criado:', { id: student.id, name: student.name, email: student.email });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();