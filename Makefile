dev:
	./pre-up-db.sh
	docker compose -f docker-compose.dev.yml up --detach --build
	./post-up-db.sh
	npm run dev
gen-db:
	npx prisma generate
db-migrate:
	npx prisma migrate dev
db-format:
	npx prisma format
db-view:
	npx prisma studio
stop-db:
	docker compose -f docker-compose.dev.yml down --remove-orphans
db-console:
	docker exec -it db bash
api-doc:
	npx next-swagger-doc-cli next-swagger-doc.json
cy-test:
	npx cypress open
