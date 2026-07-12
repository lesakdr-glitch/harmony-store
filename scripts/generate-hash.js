const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123';

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('Пароль:', password);
    console.log('Хеш:', hash);
    console.log('\nSQL для вставки:');
    console.log(`INSERT INTO users (email, password_hash, name, role) VALUES ('admin@example.com', '${hash}', 'Admin', 'admin');`);
  })
  .catch(err => console.error(err));
