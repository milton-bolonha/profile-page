# 📦 Instruções para Publicação no NPM

## Pré-requisitos

1. **Conta no NPM**: Crie uma conta em [npmjs.com](https://www.npmjs.com/)
2. **Node.js instalado**: Versão 14 ou superior
3. **NPM CLI**: Vem com Node.js

## Passo 1: Preparar o Pacote

### 1.1 Criar `package.json`

Crie um arquivo `package.json` na pasta `lib-3d-blockly-framer-border`:

```json
{
  "name": "3d-blockly-framer-border",
  "version": "1.0.0",
  "description": "Interactive 3D voxel frame effects for images using Three.js",
  "main": "3d-blockly-framer.js",
  "type": "module",
  "scripts": {
    "test": "echo \"No tests specified\""
  },
  "keywords": [
    "three.js",
    "3d",
    "voxel",
    "image",
    "frame",
    "border",
    "interactive",
    "animation",
    "webgl"
  ],
  "author": "Milton Bolonha <your-email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/miltonbolonha/3d-blockly-framer-border.git"
  },
  "bugs": {
    "url": "https://github.com/miltonbolonha/3d-blockly-framer-border/issues"
  },
  "homepage": "https://github.com/miltonbolonha/3d-blockly-framer-border#readme",
  "peerDependencies": {
    "three": "^0.160.0"
  },
  "files": [
    "3d-blockly-framer.js",
    "README.md",
    "LICENSE"
  ]
}
```

### 1.2 Criar arquivo LICENSE

Crie um arquivo `LICENSE` com a licença MIT:

```
MIT License

Copyright (c) 2025 Milton Bolonha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 1.3 Criar `.npmignore`

Crie um arquivo `.npmignore` para excluir arquivos desnecessários:

```
index.html
foto-perfil.jpg
instrucoes.md
node_modules/
.git/
.DS_Store
```

## Passo 2: Fazer Login no NPM

Abra o terminal na pasta `lib-3d-blockly-framer-border` e execute:

```bash
npm login
```

Digite suas credenciais do NPM quando solicitado.

## Passo 3: Testar Localmente (Opcional)

Antes de publicar, teste o pacote localmente:

```bash
# Na pasta lib-3d-blockly-framer-border
npm pack
```

Isso criará um arquivo `.tgz` que você pode instalar em outro projeto para testar:

```bash
# Em outro projeto
npm install /caminho/para/3d-blockly-framer-border-1.0.0.tgz
```

## Passo 4: Publicar no NPM

### 4.1 Primeira Publicação

```bash
npm publish
```

Se o nome do pacote já existir, você precisará usar um nome diferente ou um scoped package:

```bash
# Altere o nome no package.json para:
"name": "@seu-usuario/3d-blockly-framer-border"

# Depois publique:
npm publish --access public
```

### 4.2 Verificar Publicação

Acesse: `https://www.npmjs.com/package/3d-blockly-framer-border`

## Passo 5: Atualizações Futuras

Para publicar uma nova versão:

```bash
# Incrementar versão (patch: 1.0.0 -> 1.0.1)
npm version patch

# Ou minor (1.0.0 -> 1.1.0)
npm version minor

# Ou major (1.0.0 -> 2.0.0)
npm version major

# Publicar
npm publish
```

## Passo 6: Criar Repositório GitHub (Recomendado)

1. Crie um repositório no GitHub: `3d-blockly-framer-border`
2. Inicialize git na pasta:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/miltonbolonha/3d-blockly-framer-border.git
git push -u origin main
```

3. Atualize as URLs no `package.json` com o link correto do repositório

## Comandos Úteis

```bash
# Ver informações do pacote
npm view 3d-blockly-framer-border

# Remover versão publicada (cuidado!)
npm unpublish 3d-blockly-framer-border@1.0.0

# Deprecar versão
npm deprecate 3d-blockly-framer-border@1.0.0 "Use version 1.0.1 instead"

# Ver estatísticas de download
npm info 3d-blockly-framer-border
```

## Checklist Final

- [ ] `package.json` configurado corretamente
- [ ] `LICENSE` criado
- [ ] `.npmignore` configurado
- [ ] `README.md` completo e claro
- [ ] Código testado e funcionando
- [ ] Versão correta no `package.json`
- [ ] Login no NPM realizado
- [ ] Repositório GitHub criado (opcional mas recomendado)
- [ ] Publicação realizada com sucesso

## Suporte

Se tiver problemas durante a publicação:

1. Verifique se o nome do pacote está disponível: `npm search 3d-blockly-framer-border`
2. Consulte a documentação oficial: [docs.npmjs.com](https://docs.npmjs.com/)
3. Verifique se está logado: `npm whoami`

---

**Boa sorte com a publicação! 🚀**
