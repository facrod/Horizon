# 🌅 Horizon - Task Manager

Horizon es un organizador de tareas fullstack construido con **Vanilla JavaScript**, **Node.js**, **Express** y **MongoDB**. El proyecto nació como un desafío personal para dominar los fundamentos del desarrollo web nativo y creció hasta convertirse en una aplicación completa con autenticación, base de datos en la nube y deploy en producción.

## 🚀 Características técnicas

- **Dynamic Rendering:** Arquitectura basada en funciones de JS para la inyección de componentes en el DOM.
- **Event Delegation:** Gestión centralizada de interacciones mediante `e.target.closest()`, optimizando el uso de memoria.
- **REST API:** Backend con arquitectura en capas (routes → controllers → models) construido con Express.
- **Autenticación JWT + bcrypt:** Sistema de registro y login con tokens firmados y contraseñas encriptadas. Ninguna ruta es accesible sin autenticación.
- **Base de datos en la nube:** Persistencia real con MongoDB Atlas. Cada tarea está asociada a su usuario mediante referencias entre colecciones.
- **Eliminado lógico:** Las tareas eliminadas se marcan como inactivas y pueden recuperarse desde una sección dedicada.
- **Drag & Drop:** Las tarjetas pueden arrastrarse entre columnas con detección de solapamientos de horario.
- **Advanced CSS:** Implementación del selector relacional `:has()` para estados de UI dinámicos sin dependencia de JS adicional.
- **Real-time Sync:** Lógica de refresco automático de vistas ante cambios en el modelo de datos.

## 🛠️ Tecnologías utilizadas

**Frontend**
- HTML5 (Semántico)
- CSS3 (Flexbox, Grid, `:has()` selector, Transitions)
- JavaScript ES6+ (Vanilla, sin frameworks)

**Backend**
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT (jsonwebtoken)
- bcrypt

**Deploy**
- Frontend: Vercel
- Backend: Railway
- Base de datos: MongoDB Atlas

## 🌐 Demo

[horizon-one-ebon.vercel.app](https://horizon-one-ebon.vercel.app)

## 📦 Instalación local
```bash
git clone https://github.com/facrod/Horizon.git
cd Horizon
npm install
```

Creá un archivo `.env` en la raíz con las siguientes variables:
DB_CONNECTION=tu_string_de_mongo
SALT=10
SECRETO=tu_secreto_jwt
```bash
npm run dev
```

---

Creado por Facundo Rodriguez — Proceso documentado en LinkedIn.