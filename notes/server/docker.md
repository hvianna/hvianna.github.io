---
layout: default
title: Docker basics
parent: Server tools
grand_parent: Notes and bookmarks
nav_order: 1
---

# Docker

+ [Cheat sheet](Docker-cheatsheet)

### Instalação do Docker

+ Baixar o instalador do Docker em: https://store.docker.com/editions/community/docker-ce-desktop-windows
(necessário criar uma conta no Docker)
+ Executar o instalador
+ Se for solicitada a ativação do Hyper-V responder Sim (irá reiniciar o PC)
+ Caso o serviço não inicie, verificar a mensagem de erro - pode ser necessário ativar o recurso de virtualização no BIOS.

### Instalação dos containers do MySQL e WordPress

+ Abrir um prompt de comando do Windows e executar os dois comandos abaixo:

```
docker run --name teste-mysql -e MYSQL_ROOT_PASSWORD=senha -d mysql
docker run --name teste-wp --link teste-mysql:mysql -p 8080:80 -d wordpress
```

Obs.: *teste-mysql* e *teste-wp* podem ser personalizados ao gosto do usuário.

+ Acessar o endereço http://localhost:8080 no navegador e finalizar a instalação do WP

### Execução

Os passos 1 e 2 só precisam ser realizados uma vez. Depois, basta executar no prompt:

`docker start teste-mysql teste-wp`

### Instalação no Windows Home, utilizando VirtualBox:

+ https://docs.docker.com/toolbox/toolbox_install_windows/


### Documentação:

+ https://docs.docker.com/engine/reference/commandline/
