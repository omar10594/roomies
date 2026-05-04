# roomies

> App de control de renta para roomies. Administa roomies, rentas, datos de depósito y pagos sin autenticación tradicional — usa códigos de acceso fijos en la base de datos.

## Stack

- **Frontend**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Turso (SQLite edge) + Drizzle ORM
- **DevContainer**: universal:linux con Docker-in-Docker

## Setup

1. Abre este proyecto en VS Code con la extensión Dev Container
2. El container se construirá y ejecutará automáticamente
3. `npm install` se ejecutará en postCreate
4. Copia `.env.example` a `.env` y configura `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`
5. Ejecuta `npx autoskill` para instalar skills recomendadas

## Development

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`

## Structure

```
roomies/
├── .devcontainer/
│   └── devcontainer.json
├── src/
├── tests/
├── README.md
├── opencode.json
└── .gitignore
```

## Notes

- Este proyecto usa un devcontainer para un entorno de desarrollo consistente
- Docker-in-Docker está habilitado para workflows containerizados
- El shell por defecto es zsh con Oh My Zsh
- Ejecuta `npx autoskill` al abrir para obtener skills específicas del proyecto
