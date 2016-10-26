# webpack-production-builder
    At first I wanted to make it a 'webpack production builder'. But 
    then, I decided to leave the compiling function to developers' 
    local implementation so developers can use Webpack, rollup or anything else. 
    In the end, this builder is just a minifying and uglification tool based on gulp.

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

