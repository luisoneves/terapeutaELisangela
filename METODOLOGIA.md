# Metodologia de Trabalho

## Sequência de Execução

### Antes de Iniciar Novo Plano
1. ✅ Verificar se já existe branch ativa
2. ✅ Se não existir, criar nova branch semântica
3. ✅ Criar/marcar savepoint inicial

### Para Cada Tarefa
1. Implementar a tarefa
2. Testar: `pnpm build` E `pnpm dev`
3. Se passar → commit semântico ("salve point")
4. Se falhar → analisar erro
   - Verificar se precisa de tarefa seguinte
   - Se sim, implementar tarefa seguinte junto
   - Testar ambas → se passar, commit e seguir
   - Se ainda falhar →报告错误 + opções

### Estrutura de Commits
```
feat: descrição curta
fix: correção
refactor: refatoração
```

### Savepoints
- Criar arquivo com checkpoint + checkbox
- Formato: `- [ ] Tarefa: descrição`
- Atualizar checkbox quando tarefa concluída

---

## Plano de Contingência

### Regras
1. Não corrigir "warning teórico" antes de finalizar feature
2. Se dúvida entre solução sofisticada vs simples → escolher simples
3. Feature flags sempre desligadas por padrão
4. Respeitar `prefers-reduced-motion`
5. Fallback sempre estável (sem animação)

### Em Caso de Falha
1. Identificar se erro é da tarefa atual ou depende de tarefa futura
2. Testar com tarefa seguinte integrada
3. Se passar → commit e continuar
4. Se falhar →报告错误 com opções de resolução

---

## Feature Flags Obrigatório

Todas as novas funcionalidades devem ter flags:
- animationsEnabled (global)
- smartHeaderEnabled
- heroTitleEnabled
- hintsEnabled

Cada flag deve funcionar independentemente.