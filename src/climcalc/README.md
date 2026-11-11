This project is a calculator for communities and cities, that helps to evaluate the ecological and economic impacts of climate change fighting measures. Note that this project is just the bare calculator and does not include any front-end application. However, you can find one that adopts this project [here](https://klimarechner.wandel-werkstadt.de/). 

# Building

Build the tool with
```
wasm-pack build
```
Afterward, you can integrate it into your node package folder and import it via
```
import {Calculator} from "climcalc-core";
```

# How it works
The calculator differentiates 4 sectors: private households, industry, schools, and the public sector. Each of those sectors is calculated parallel. Three areas are considered: buildings, mobility and energy. Every of those has input variables and produces a bunch of output variables.

[Variable Naming convention](variables_naming_convention.md)

# Testing

run a specific test with

```
cargo test --tests [test_name]
```

i.e.

```
RUST_BACKTRACE=1 cargo test --tests test_buildings_calculate
```


