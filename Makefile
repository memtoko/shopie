EMBERAPP = shopiejs
CSSBUILD = shopie/static/shopie/css
JSBUILD = shopie/static/shopie/js

.PHONY: init js-dev js-production run copy-static-dev js-dev js-production

init:
	cd $(EMBERAPP) && npm install
	bower --allow-root install

run:
	python manage.py runserver 0.0.0.0:8000

copy-static-dev: js-dev
	cp $(EMBERAPP)/dist/assets/*.css $(CSSBUILD)
	cp $(EMBERAPP)/dist/assets/*.js $(JSBUILD)

copy-static-prod: js-production
	cp $(EMBERAPP)/dist/assets/*.css $(CSSBUILD)
	cp $(EMBERAPP)/dist/assets/*.js $(JSBUILD)

js-dev:
	cd $(EMBERAPP) && ember build

js-production:
	cd $(EMBERAPP) && ember build --environment=production
