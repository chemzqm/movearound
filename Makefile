
build:
	@webpack example/example.js example/bundle.js

install:
	@npm install

test: install build
	@open example/example.html

doc: install build
	@rm -fr .gh-pages
	@mkdir .gh-pages
	@cp example/example.html .gh-pages/index.html
	@cp example/bundle.js .gh-pages
	@ghp-import .gh-pages -n -p
	@rm -fr .gh-pages

clean:
	rm -fr build components template.js

.PHONY: clean
