# Docker

## Instalação do Docker

+ Download em: https://docs.docker.com/get-docker/
+ Executar o instalador
+ Se for solicitada a ativação do Hyper-V responder Sim (irá reiniciar o PC)
+ Caso o serviço não inicie, verificar a mensagem de erro - pode ser necessário ativar o recurso de virtualização no BIOS.

## Instalação dos containers do MySQL e WordPress

+ Abrir um prompt de comando do Windows e executar os dois comandos abaixo:

```
docker run --name teste-mysql -e MYSQL_ROOT_PASSWORD=senha -d mysql
docker run --name teste-wp --link teste-mysql:mysql -p 8080:80 -d wordpress
```

Obs.: *teste-mysql* e *teste-wp* podem ser personalizados ao gosto do usuário.

+ Acessar o endereço http://localhost:8080 no navegador e finalizar a instalação do WP

## Execução

Os passos acima só precisam ser realizados uma vez. Depois, basta executar no prompt:

`docker start teste-mysql teste-wp`

Documentação CLI: [https://docs.docker.com/reference/cli/docker/](https://docs.docker.com/reference/cli/docker/)

## Configuração via Docker Compose

Exemplo de arquivo `docker-composer.yml`:

```
web:
  image: httpd:alpine
  ports:
    - "8000:80"
  volumes:
    - ./public:/usr/local/apache2/htdocs/
    - ~/music:/usr/local/apache2/htdocs/music/
```

Documentação Compose: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)

## Cheatsheet

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
