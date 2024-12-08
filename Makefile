include .env
YEAR=2024
DAYS=${patsubst src/day%.js,%, ${wildcard src/day*.js}}
DAY=$(lastword ${DAYS})
RUN=${foreach day,${DAYS},run${day}}
TEST=${foreach day,${DAYS},test${day}}

.PHONY: latest test all tests clean ${TEST} ${RUN}

latest: run${DAY}

test: test${DAY}

all: ${RUN}

tests: ${TEST}

${TEST}: test% : src/day%.js test/day%
	node ./$< <test/day$*
	@printf "\n"

${RUN}: run% : src/day%.js input/day%
	node ./$< <input/day$*
	@printf "\n"

input/day%:
	@curl -s -b session=${AOC_SESSION} -A "github.com/Zkrgu/aoc-2024 by xyzkrgu@gmail.com" https://adventofcode.com/${YEAR}/day/${patsubst 0%,%,$*}/input -o $@

clean:
	rm bin/*
