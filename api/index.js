const app = require('./src/app');
const { port } = require('./src/config');

app.listen(port, () => {
  console.log(`🚀 Financely API corriendo en el puerto ${port}`);
});
