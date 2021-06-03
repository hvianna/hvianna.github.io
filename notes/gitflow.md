# gitflow - Um modelo bem-sucedido de branches para Git

Resumo traduzido por [Henrique Vianna](https://henriquevianna.com) do [post original de Vincent Driessen](https://nvie.com/posts/a-successful-git-branching-model/)

<p align="center"><img height="762" src="img/gitflow-model-pt.png"></p>

O modelo apresentado aqui é, essencialmente, apenas um **conjunto de procedimentos que os membros da equipe devem seguir** para que se obtenha um processo gerenciado de desenvolvimento de software.

## Descentralizado mas centralizado

A configuração de repositório sugerida para este modelo é baseada em um repositório "verdade" central. Vamos chamar este repositório de `origin`, pois é um nome familiar a todos os usuários de Git.

<p align="center"><img height="361" src="img/gitflow-teams.png"></p>

Desenvolvedores também podem trocar alterações diretamente entre si, formando sub-equipes.
Para isto, basta definir um remoto do Git que aponte para o repositório do colega.
Isto pode ser útil, por exemplo, para trabalhar com dois ou mais desenvolvedores em uma grande *feature* nova,
antes de enviar trabalho em andamento prematuramente para o `origin`.

## As branches principais

O repositório central abriga duas branches principais, as quais possuem um tempo de vida infinito:

* `master`
* `develop`

Na branch `origin/master` o código fonte em `HEAD` reflete sempre um estado **pronto para produção.**

Na branch `origin/develop` o código fonte em `HEAD` reflete sempre um estado com as últimas alterações **prontas para o próximo _release_.** Alguns chamariam esta branch de "branch de integração". É daqui que devem ser gerados os builds diários automáticos.

Quando o código fonte na branch `develop` atinge um ponto estável e está pronto para ser lançado, todas as alterações devem ser incorporadas de volta (merge) à `master` e então rotuladas (tag) com um número de release.

Dessa forma, cada vez que alterações são incorporadas à `master` considera-se um novo release de produção, *por definição*. Se seguirmos essa regra rigorosamente, podemos usar um script de hook do Git para fazer o build e enviar nosso software para os servidores de produção automaticamente, toda vez que for feito um commit na `master`.

## Branches de apoio

Além das branches principais, este modelo utiliza três tipos de branches auxiliares, com propósitos específicos.
Ao contrário das principais, estas branches têm um tempo de vida limitado e serão eventualmente removidas. São elas:

* Branches de funcionalidades (*features*)
* Branches de lançamentos (*releases*)
* Branches de correções (*hotfixes*)

## Branches de funcionalidades (*features*)

Podem se originar de:<br>
&ensp; &ensp; `develop`<br>
Devem ser mescladas de volta a:<br>
&ensp; &ensp; `develop`<br>
Convenção de nome:<br>
&ensp; &ensp; qualquer coisa exceto `master`, `develop`, `release-*`, ou `hotfix-*`

Branches de funcionalidades são utilizadas para desenvolver novas funcionalidades para um lançamento próximo ou em um futuro mais distante. **Ao iniciar o desenvolvimento de uma funcionalidade não é necessário saber exatamente qual a versão alvo para o seu lançamento.** A branch de uma *feature* existe enquanto a funcionalidade estiver em desenvolvimento e será, em algum momento, incorporada de volta à `develop` (para adicionar a nova funcionalidade definitivamente ao software) ou descartada (caso um experimento não tenha sido satisfatório).

Branches de funcionalidades tipicamente existem apenas nos repositórios dos desenvolvedores, não no `origin`.

### Criando uma branch de funcionalidade

Ao iniciar o trabalho em uma nova funcionalidade, crie uma branch a partir da `develop`.

```console
$ git checkout -b minha-funcionalidade develop
Switched to a new branch "minha-funcionalidade"
```

### Incorporando uma funcionalidade pronta à develop

Funcionalidades concluídas podem ser mescladas de volta à branch `develop` para adicioná-las definitivamente ao próximo lançamento:

```console
$ git checkout develop
Switched to branch 'develop'
$ git merge --no-ff minha-funcionalidade
Updating ea1b82a..05e9557
(Resumo das alterações)
$ git branch -d minha-funcionalidade
Deleted branch minha-funcionalidade (was 05e9557).
$ git push origin develop
```

O flag `--no-ff` faz com que o merge sempre crie um novo objeto de commit, mesmo que ele possa ser realizado com um fast-forward. Isto evita que se perca informação sobre a existência de uma branch de funcionalidade e agrupa todos os commits que criaram aquela funcionalidade. Compare:

<p align="center"><img height="423" src="img/gitflow-merge.png"></p>

No segundo caso, é impossível ver no histórico do Git quais commits contribuiram para implementar uma funcionalidade — você precisaria ler todas as mensagens de log manualmente. **Reverter uma funcionalidade inteira (isto é, um grupo de commits) é uma verdadeira dor-de-cabeça no segundo caso, mas é facilmente executável se o flag `--no-ff` for utilizado.**

## Branches de lançamento (*releases*)

Podem se originar de:<br>
&ensp; &ensp; `develop`<br>
Devem ser mescladas de volta a:<br>
&ensp; &ensp; `develop` e `master`<br>
Convenção de nomes:<br>
&ensp; &ensp; `release-*`

Branches de *release* auxiliam na preparação de um novo lançamento para produção. Elas permitem ajustes e correções de última hora, bem como preparação de meta-dados para um lançamento (número de versão, data de build, etc.). Fazer este trabalho em uma branch de *release* deixa a branch `develop` livre para receber funcionalidades para o próximo grande lançamento.

O momento chave de criar uma nova branch de *release* é quando a `develop` está quase no estado desejado para o novo lançamento. Pelo menos todas as funcionalidades que estavam planejadas para o lançamento já devem estar mescladas à `develop` neste momento. Funcionalidades planejadas para lançamentos futuros não — estas devem esperar até que a branch de *release* seja criada.

É exatamente no início de uma branch de *release* que o futuro lançamento recebe um número de versão — não antes disso.

### Criando uma branch de lançamento

Branches de lançamento são criadas a partir da branch `develop`. Por exemplo, digamos que a versão 1.1.5 é a atual versão de produção e nós temos um grande lançamento a fazer. A `develop` neste momento está pronta para o "próximo lançamento" e decidimos que esta será a versão 1.2 (ao invés de 1.1.6 ou 2.0). Então criamos a branch com um nome que reflete o novo número de versão:

```console
$ git checkout -b release-1.2 develop
Switched to a new branch "release-1.2"
$ ./bump-version.sh 1.2
Files modified successfully, version bumped to 1.2.
$ git commit -a -m "Versão atualizada para 1.2"
[release-1.2 74d9424] Versão atualizada para 1.2
1 files changed, 1 insertions(+), 1 deletions(-)
```

Após criarmos a nova branch e passarmos para ela, nós atualizamos o número da versão. Aqui, `bump-version.sh` é um script shell fictício que altera alguns arquivos para refletir a nova versão. Obviamente esta pode ser uma alteração manual — o ponto é que alguns arquivos são atualizados. Então é feito o commit da atualização de versão.

Esta nova branch pode existir por algum tempo, até que o lançamento esteja pronto para ser feito. Durante este tempo, correções de bugs podem ser aplicadas nesta branch ao invés de na `develop`. Adicionar novas funcionalidades aqui é estritamente proibido. Estas devem ser mescladas à `develop` e, portanto, deverão aguardar o próximo lançamento.

### Finalizando uma branch de lançamento

Quando a branch de *release* está pronta para se tornar um lançamento de fato, algumas ações devem ser tomadas. Primeiro, a branch de lançamento deve ser mesclada de volta à `master`. A seguir, este commit na `master` deve ser rotulado (criar uma tag) para facilitar referências futuras a esta versão. E por fim, as alterações desta branch de *release* devem ser mescladas de volta à `develop`, para que futuros lançamentos também contenham as correções realizadas.

Os primeiros dois passos no Git:

```console
$ git checkout master
Switched to branch 'master'
$ git merge --no-ff release-1.2
Merge made by recursive.
(Resumo das alterações)
$ git tag -a 1.2
```

O lançamento agora está feito, e rotulado para referências futuras.

Para manter as alterações feitas na branch de *release*, precisamos mesclá-las de volta à `develop`. No Git:

```console
$ git checkout develop
Switched to branch 'develop'
$ git merge --no-ff release-1.2
Merge made by recursive.
(Resumo das alterações)
```

Este passo pode gerar um conflito no merge (provavelmente, uma vez que alteramos o número da versão). Caso isso aconteça, corrija e faça o commit.

Agora realmente terminamos e a branch de *release* pode ser removida, uma vez que não precisaremos mais dela:

```console
$ git branch -d release-1.2
Deleted branch release-1.2 (was ff452fe).
```

## Branches de correções (*hotfixes*)

Podem se originar de:<br>
&ensp; &ensp; `master`<br>
Devem ser mescladas de volta à:<br>
&ensp; &ensp; `develop` e `master`<br>
Convenção de nomes:<br>
&ensp; &ensp; `hotfix-*`

Branches de *hotfix* são muito parecidas com branches de *release*, pois também servem para preparar um novo lançamento de produção, embora não planejado. Estas branches surgem da necessidade de agir imediatamente ante um estado indesejado em uma versão de produção. Quando um bug em uma versão de produção necessita ser corrigido rapidamente, pode-se criar uma branch de correção a partir da tag na branch `master` que marca a versão de produção desejada.

A ideia é que o trabalho da equipe possa continuar na branch `develop`, enquanto outra pessoa prepara uma correção rápida para produção.

### Criando uma branch de correção

Branches de correção são criadas a partir da branch `master`. Digamos que a versão 1.2 é o lançamento atual rodando no servidor de produção e está gerando erros devido a um bug grave. Mas as alterações na `develop` ainda estão instáveis.  Podemos então criar uma branch de *hotfix* e começar a corrigir o problema:

```console
$ git checkout -b hotfix-1.2.1 master
Switched to a new branch "hotfix-1.2.1"
$ ./bump-version.sh 1.2.1
Files modified successfully, version bumped to 1.2.1.
$ git commit -a -m "Versão atualizada para 1.2.1"
[hotfix-1.2.1 41e61bb] Versão atualizada para 1.2.1
1 files changed, 1 insertions(+), 1 deletions(-)
```

Não esqueça de atualizar o número de versão após criar a branch!

Então, corrija o bug e faça um ou mais commits, conforme necessário.

```console
$ git commit -m "Corrigido problema grave no produção"
[hotfix-1.2.1 abbe5d6] Corrigido problema grave no produção
5 files changed, 32 insertions(+), 17 deletions(-)
```

### Finalizando uma branch de correção

Quando finalizada, a correção precisa ser mesclada de volta à `master`, e também à `develop`, para garantir que a correção seja incluída também no próximo lançamento. Isto é muito semelhante à finalização das branches de lançamento.

Primeiro, atualize a `master` e rotule o lançamento.

```console
$ git checkout master
Switched to branch 'master'
$ git merge --no-ff hotfix-1.2.1
Merge made by recursive.
(Resumo das alterações)
$ git tag -a 1.2.1
```

A seguir, inclua a correção na `develop` também:

```console
$ git checkout develop
Switched to branch 'develop'
$ git merge --no-ff hotfix-1.2.1
Merge made by recursive.
(Resumo das alterações)
```

A única exceção a esta regra é que, quando houver uma branch de *release* em andamento, a correção deve ser mesclada à branch de *release*, ao invés da `develop`. Quando a branch de *release* for finalizada, as correções serão mescladas à `develop`. Se o trabalho na `develop` necessitar da correção imediatamente e não puder aguardar a finalização da branch de *release*, você pode tranquilamente mesclar a correção à `develop` neste momento também.

Por fim, remova a branch temporária:

```console
$ git branch -d hotfix-1.2.1
Deleted branch hotfix-1.2.1 (was abbe5d6).
```
