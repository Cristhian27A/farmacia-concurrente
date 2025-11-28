# 🎓 Guía de Demostración - Sistema Farmacia Concurrente

## ⏱️ Demostración Rápida (5 minutos)

### 1. Inicio Rápido (1 min)
```bash
# Terminal 1 - Servidor
cd backend/src/main/java/farmacia/
java -cp ../../../../lib/h2-2.1.214.jar:. farmacia.Server

# Terminal 2 - Cliente de prueba
java -cp ../../../../lib/h2-2.1.214.jar:. farmacia.DemoProfesor
