EMBERAPP = shopie/static/shopie/emberapp

.PHONY: init js-dev js-production run

init:
	cd $(EMBERAPP) && npm install
	bower install

run:
	python manage.py runserver 0.0.0.0:8000

js-dev:
	cd $(EMBERAPP) && ember build

js-production:
	cd $(EMBERAPP) && ember build --environtment=production
