# webpack-production-builder

## Install
`npm install webpack-production-builder -g`

## CLI Command
### build
`wpb -i input_path -o output_path`

or

`wpb --input input_path --output output_path`

### help
`wpb -h`

or

`wpb --help`

### Issues
If you use react or ES2015, errors may be reported when compiling code
with `wpb`. In this situation, you should install `babel-preset-react`
or `babel-preset-es2015` in the parent or higher directory of the code
file

