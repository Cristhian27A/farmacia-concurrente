const java = require('java');
const fs = require('fs');
const path = require('path');

// Configurar classpath para Java
java.classpath.push(
  './lib/h2-2.1.214.jar',
  './src/main/java'
);

console.log('🚀 Iniciando Servidor Farmacia Concurrente en Glitch...');

// Compilar y ejecutar el servidor Java
try {
  // Compilar clases Java
  const { execSync } = require('child_process');
  
  console.log('📦 Compilando clases Java...');
  const compileCommand = [
    'javac',
    '-cp', './lib/h2-2.1.214.jar:.',
    '-d', '.',
    './src/main/java/farmacia/*.java',
    './src/main/java/farmacia/models/*.java'
  ].join(' ');
  
  execSync(compileCommand, { stdio: 'inherit' });
  console.log('✅ Compilación exitosa');
  
  // Ejecutar servidor
  console.log('🔧 Iniciando servidor en puerto ' + process.env.PORT);
  const Server = java.import('farmacia.Server');
  const server = new Server();
  
  // Iniciar en un hilo separado para no bloquear Node.js
  new java.lang.Thread({
    run: function() {
      server.start();
    }
  }).start();
  
  console.log('✅ Servidor Java iniciado correctamente');
  console.log('🌐 La aplicación está disponible en: https://' + process.env.PROJECT_DOMAIN + '.glitch.me');
  
} catch (error) {
  console.error('❌ Error iniciando servidor:', error);
  process.exit(1);
}
