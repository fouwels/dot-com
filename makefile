# SPDX-FileCopyrightText: 2023 Kaelan Thijs Fouwels <kaelan.thijs@fouwels.com>
#
# SPDX-License-Identifier: MIT

build:
	npm install
	npx ts-standard --fix "lib/**/*.tsx" "index.tsx"
	mkdir -p dist
	cp -r ./static/** dist

release: clean build test
	npx webpack --mode="production"

live: build
	npx webpack serve --mode="development"

test:
# We don't have tests yet
	npx jest --passWithNoTests 
	npx ts-standard "lib/**/*.tsx" "index.tsx"

clean: 
	rm -rf ./dist ./node_modules