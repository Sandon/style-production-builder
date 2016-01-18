var Path = require('path');
var fs = require('fs');

exports.mkdirp = function (path) {
  var dirs = [];
  while (!fs.existsSync(path)) {
    dirs.push(Path.basename(path));
    path = Path.dirname(path);
  }

  while (dirs.length) {
    path = Path.join(path, dirs.pop());
    fs.mkdirSync(path);
  }
};


exports.rmDir = function (path) {
  var files = fs.readdirSync(path);
  files.forEach(function (file) {
    var thisPath = Path.join(path, file),
      stat = fs.statSync(thisPath);

    if (stat.isFile()) {
      fs.unlinkSync(thisPath);
    } else if (stat.isDirectory()) {
      exports.rmDir(thisPath);
    }
  });

  fs.rmdirSync(path);
};


exports.scanDir = function (path, ext, fn) {
  if (fn === undefined) {
    fn = ext;
    ext = null;
  }

  var files = fs.readdirSync(path);

  files.forEach(function (file) {
    var thisPath = Path.join(path, file),
      stat = fs.statSync(thisPath);

    if (stat.isFile() &&
      (!ext || Path.extname(thisPath) === ext)) {
      return fn(thisPath);
    }

    if (stat.isDirectory()) {
      return exports.scanDir(thisPath, ext, fn);
    }
  });
};


exports.copyDir = function (src, des, filter, progress) {
  var files = fs.readdirSync(src);

  exports.mkdirp(des);

  files.forEach(function (file) {
    var srcFile = Path.join(src, file),
      desFile = Path.join(des, file),
      stat = fs.statSync(srcFile);

    if (filter && !filter(file, srcFile, stat)) {
      return;
    }

    if (stat.isFile()) {
      exports.copyFile(srcFile, desFile);
      progress && progress(srcFile, desFile);
    } else if (stat.isDirectory()) {
      exports.copyDir(srcFile, desFile, filter, progress);
    }
  });

  if (!fs.readdirSync(des).length) {
    exports.rmDir(des);
  }
};


exports.copyFile = function (src, des) {
  var r = fs.openSync(src, 'r'),
    w = fs.openSync(des, 'w'),
    buf = new Buffer(4096),
    rsize = null,
    wsize = null;

  try {
    while ((rsize = fs.readSync(r, buf, 0, buf.length)) > 0) {
      wsize = fs.writeSync(w, buf, 0, rsize);
      if (wsize !== rsize) {
        throw new Error('copy file error');
      }
    }
  } finally {
    fs.closeSync(r);
    fs.closeSync(w);
  }

};


var globCache = {};
exports.glob = function (pattern, path, stat) {
  if (/\/$/.test(pattern)) {
    if (!stat.isDirectory()) {
      return false;
    }
  } else {
    if (!stat.isFile()) {
      return false;
    }
  }

  path = '/' + path.replace(/\\/g, '/').replace(/^\//, '');

  var r = globCache[pattern];
  if (!r) {
    r = pattern.replace(/\/$/, '')
        .replace(/[^-.\w*?\/]/, '')
        .replace(/\./g, '\\.')
        .replace(/\?/g, '[-\\w]')
        .replace(/\*{2,}/g, '[-\\w\\/]+')
        .replace(/\*/g, '[-\\w]+')
        .replace(/\+/g, '*') + '$';

    r = /^\//.test(pattern) ? '^' + r : '/' + r;
    r = globCache[pattern] = new RegExp(r);
  }

  return r.test(path);
};


exports.copyDirGlob = function (from, to, rule, options) {
  var include = rule.include;
  var ignore = rule.ignore;
  var filter = function (file, path, stat) {
    path = Path.relative(from, path);
    if (include) {
      return stat.isDirectory() || globs(include, path, stat);
    }

    if (ignore) {
      return !globs(ignore, path, stat);
    }

    return false;
  };

  exports.copyDir(from, to, filter, function (src, des) {
    // util.log(options, 'copy file:', Path.relative(from, src), '->', Path.relative(from, des));
  });
};

function globs(rules, path, stat) {
  for (var i = 0, c = rules.length; i < c; i++) {
    if (exports.glob(rules[i], path, stat)) {
      return true;
    }
  }
  return false;
}