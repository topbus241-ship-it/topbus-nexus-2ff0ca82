# Master Access Configuration

## Segurança Crítica

O acesso **Master** foi removido da interface pública de login. Ele permanece oculto propositalmente.

### Como acessar Master (Apenas para Administração)

#### Método 1: Backend Direct (Recomendado)

No backend, execute manualmente:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"Administrador Master","role":"master"}'
```

O endpoint retornará um JWT token que deve ser armazenado em `localStorage`:

```javascript
localStorage.setItem("topbus-token", "eyJhbGc...");
localStorage.setItem("topbus-session", '{"name":"Administrador Master","role":"master"}');
```

#### Método 2: Database Seed (Development)

No `backend/prisma/seed.ts`, adicione um usuário master:

```typescript
const masterUser = await prisma.user.create({
  data: {
    name: "Administrador Master",
    email: "admin@topbus.local",
    role: "master",
    password: await bcrypt.hash("SENHA_FORTE_AQUI", 10),
  },
});
```

Execute: `npm run prisma:seed`

#### Método 3: Environment Variable

Configure a credencial master como variável de ambiente:

```bash
# .env (Backend)
MASTER_PASSWORD="sua_senha_criptografada"
```

E implemente no login:

```typescript
if (role === "master" && password === process.env.MASTER_PASSWORD) {
  // Gerar JWT e retornar
}
```

### Credenciais Padrão (Mudança OBRIGATÓRIA em Produção)

- **Role**: `master`
- **Default Name**: `Administrador Master`
- **Default Email**: `admin@topbus.local`
- **Password**: Defina uma senha forte via `.env`

### Checklist de Segurança

- [ ] JWT_SECRET em `.env` é uma string aleatória longa (32+ caracteres)
- [ ] Master password não está em código aberto
- [ ] `.env` está em `.gitignore` e nunca foi commitado
- [ ] Role master não é exibida no frontend
- [ ] Acesso master requer autenticação dupla em produção
- [ ] Logs de acesso master são registrados

### Remoção de Referências Públicas

- [x] Comentários sobre "lovable" removidos de `vite.config.ts`
- [x] `.lovable/` adicionado ao `.gitignore`
- [x] Credenciais master não aparecem no código frontend
- [x] Pacotes de build ocultos em `node_modules`

---

**⚠️ NUNCA compartilhe credenciais master ou JWT tokens em público.**
