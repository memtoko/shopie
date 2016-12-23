.DEFAULT_GOAL = help

NPMBIN		:= node_modules/.bin

FRONTENDAPP = frontend
CSSBUILD 	= shopie/static/shopie/css
JSBUILD 	= shopie/static/shopie/js

.PHONY: run init copy-static

# - Command
help:
	@echo ""
	@echo "AVAILABLE TASKS"
	@echo ""
	@echo "  compile ................ Compiles frontend app."
	@echo "  clean .................. Removes build artifacts."
	@echo "  test ................... Runs the tests for the project."
	@echo "  lint ................... Lints all source files."
	@echo ""

init:
	# weird, most npm modules doesnt work if we invoke them from here
	cd $(FRONTENDAPP) && npm install && cd ..

run:
	python manage.py runserver 0.0.0.0:8000

copy-static: compile
	cp $(FRONTENDAPP)/dist/*.js $(JSBUILD)
	cp $(FRONTENDAPP)/dist/*.css $(CSSBUILD)

lint:
	sh $(NPMBIN)/eslint "src" "test"

compile-js:
	cd $(FRONTENDAPP) && npm run build
	cd ..

compile-css:
	cd $(FRONTENDAPP) && npm run build:css
	cd ..

compile: compile-js compile-css
