const fs = require('fs');
let code = fs.readFileSync('electron-main.cjs', 'utf8');
code = code.replace("output.match(/http:\\\/\\\/127\\\.0\\\.0\\\.1:(\\d+)/)", "output.match(/http:\\\/\\\/(localhost|127\\\.0\\\.0\\\.1|0\\\.0\\\.0\\\.0):(\\d+)/)");
fs.writeFileSync('electron-main.cjs', code);
