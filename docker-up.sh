docker stop webby_lab_app
docker stop webby_lab_db_postgres
docker rm webby_lab_app
docker rm webby_lab_db_postgres

docker rmi tac62/webbylab:0.1

docker-compose up

