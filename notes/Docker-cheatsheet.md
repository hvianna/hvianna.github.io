---
nav_exclude: true
---

# Docker cheatsheet

Parar um container (não remove):
```
docker stop <id> | <name>
```

Parar e remover um container:
```
docker rm <id> | <name>
```

Iniciar um container com o composer (verificar existência do arquivo `docker-composer.yml`):
```
docker-compose up -d
```

Parar e remover um container com composer:
```
docker-compose down
```

Listar containers em execução:
```
docker ps
```

Listar todos os containers criados:
```
docker ps -a
```

Listar todas as imagens instaladas:
```
docker images -a
```

Remover uma imagem instalada:
```
docker rmi <id> | <repository>
```

Acesso ao filesystem de containers:
```
docker exec -t -i teste-wp sh
```
https://stackoverflow.com/a/20816397/2370385
