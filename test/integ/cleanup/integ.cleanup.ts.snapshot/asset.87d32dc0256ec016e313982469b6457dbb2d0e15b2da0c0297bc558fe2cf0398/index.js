"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/unzipper/lib/PullStream.js
var require_PullStream = __commonJS({
  "node_modules/unzipper/lib/PullStream.js"(exports2, module2) {
    "use strict";
    var Stream = require("stream");
    var util = require("util");
    var strFunction = "function";
    function PullStream() {
      if (!(this instanceof PullStream))
        return new PullStream();
      Stream.Duplex.call(this, { decodeStrings: false, objectMode: true });
      this.buffer = Buffer.from("");
      const self2 = this;
      self2.on("finish", function() {
        self2.finished = true;
        self2.emit("chunk", false);
      });
    }
    util.inherits(PullStream, Stream.Duplex);
    PullStream.prototype._write = function(chunk, e, cb) {
      this.buffer = Buffer.concat([this.buffer, chunk]);
      this.cb = cb;
      this.emit("chunk");
    };
    PullStream.prototype.stream = function(eof, includeEof) {
      const p = Stream.PassThrough();
      let done;
      const self2 = this;
      function cb() {
        if (typeof self2.cb === strFunction) {
          const callback = self2.cb;
          self2.cb = void 0;
          return callback();
        }
      }
      function pull() {
        let packet;
        if (self2.buffer && self2.buffer.length) {
          if (typeof eof === "number") {
            packet = self2.buffer.slice(0, eof);
            self2.buffer = self2.buffer.slice(eof);
            eof -= packet.length;
            done = done || !eof;
          } else {
            let match = self2.buffer.indexOf(eof);
            if (match !== -1) {
              self2.match = match;
              if (includeEof) match = match + eof.length;
              packet = self2.buffer.slice(0, match);
              self2.buffer = self2.buffer.slice(match);
              done = true;
            } else {
              const len = self2.buffer.length - eof.length;
              if (len <= 0) {
                cb();
              } else {
                packet = self2.buffer.slice(0, len);
                self2.buffer = self2.buffer.slice(len);
              }
            }
          }
          if (packet) p.write(packet, function() {
            if (self2.buffer.length === 0 || eof.length && self2.buffer.length <= eof.length) cb();
          });
        }
        if (!done) {
          if (self2.finished) {
            self2.removeListener("chunk", pull);
            self2.emit("error", new Error("FILE_ENDED"));
            return;
          }
        } else {
          self2.removeListener("chunk", pull);
          p.end();
        }
      }
      self2.on("chunk", pull);
      pull();
      return p;
    };
    PullStream.prototype.pull = function(eof, includeEof) {
      if (eof === 0) return Promise.resolve("");
      if (!isNaN(eof) && this.buffer.length > eof) {
        const data = this.buffer.slice(0, eof);
        this.buffer = this.buffer.slice(eof);
        return Promise.resolve(data);
      }
      let buffer = Buffer.from("");
      const self2 = this;
      const concatStream = new Stream.Transform();
      concatStream._transform = function(d, e, cb) {
        buffer = Buffer.concat([buffer, d]);
        cb();
      };
      let rejectHandler;
      let pullStreamRejectHandler;
      return new Promise(function(resolve, reject) {
        rejectHandler = reject;
        pullStreamRejectHandler = function(e) {
          self2.__emittedError = e;
          reject(e);
        };
        if (self2.finished)
          return reject(new Error("FILE_ENDED"));
        self2.once("error", pullStreamRejectHandler);
        self2.stream(eof, includeEof).on("error", reject).pipe(concatStream).on("finish", function() {
          resolve(buffer);
        }).on("error", reject);
      }).finally(function() {
        self2.removeListener("error", rejectHandler);
        self2.removeListener("error", pullStreamRejectHandler);
      });
    };
    PullStream.prototype._read = function() {
    };
    module2.exports = PullStream;
  }
});

// node_modules/unzipper/lib/NoopStream.js
var require_NoopStream = __commonJS({
  "node_modules/unzipper/lib/NoopStream.js"(exports2, module2) {
    "use strict";
    var Stream = require("stream");
    var util = require("util");
    function NoopStream() {
      if (!(this instanceof NoopStream)) {
        return new NoopStream();
      }
      Stream.Transform.call(this);
    }
    util.inherits(NoopStream, Stream.Transform);
    NoopStream.prototype._transform = function(d, e, cb) {
      cb();
    };
    module2.exports = NoopStream;
  }
});

// node_modules/unzipper/lib/BufferStream.js
var require_BufferStream = __commonJS({
  "node_modules/unzipper/lib/BufferStream.js"(exports2, module2) {
    "use strict";
    var Stream = require("stream");
    module2.exports = function(entry) {
      return new Promise(function(resolve, reject) {
        const chunks = [];
        const bufferStream = Stream.Transform().on("finish", function() {
          resolve(Buffer.concat(chunks));
        }).on("error", reject);
        bufferStream._transform = function(d, e, cb) {
          chunks.push(d);
          cb();
        };
        entry.on("error", reject).pipe(bufferStream);
      });
    };
  }
});

// node_modules/unzipper/lib/parseBuffer.js
var require_parseBuffer = __commonJS({
  "node_modules/unzipper/lib/parseBuffer.js"(exports2, module2) {
    "use strict";
    var parseUIntLE = function(buffer, offset, size) {
      let result;
      switch (size) {
        case 1:
          result = buffer.readUInt8(offset);
          break;
        case 2:
          result = buffer.readUInt16LE(offset);
          break;
        case 4:
          result = buffer.readUInt32LE(offset);
          break;
        case 8:
          result = Number(buffer.readBigUInt64LE(offset));
          break;
        default:
          throw new Error("Unsupported UInt LE size!");
      }
      return result;
    };
    var parse = function(buffer, format) {
      const result = {};
      let offset = 0;
      for (const [key, size] of format) {
        if (buffer.length >= offset + size) {
          result[key] = parseUIntLE(buffer, offset, size);
        } else {
          result[key] = null;
        }
        offset += size;
      }
      return result;
    };
    module2.exports = {
      parse
    };
  }
});

// node_modules/unzipper/lib/parseExtraField.js
var require_parseExtraField = __commonJS({
  "node_modules/unzipper/lib/parseExtraField.js"(exports2, module2) {
    "use strict";
    var parseBuffer = require_parseBuffer();
    module2.exports = function(extraField, vars) {
      let extra;
      while (!extra && extraField && extraField.length) {
        const candidateExtra = parseBuffer.parse(extraField, [
          ["signature", 2],
          ["partSize", 2]
        ]);
        if (candidateExtra.signature === 1) {
          const fieldsToExpect = [];
          if (vars.uncompressedSize === 4294967295) fieldsToExpect.push(["uncompressedSize", 8]);
          if (vars.compressedSize === 4294967295) fieldsToExpect.push(["compressedSize", 8]);
          if (vars.offsetToLocalFileHeader === 4294967295) fieldsToExpect.push(["offsetToLocalFileHeader", 8]);
          extra = parseBuffer.parse(extraField.slice(4), fieldsToExpect);
        } else {
          extraField = extraField.slice(candidateExtra.partSize + 4);
        }
      }
      extra = extra || {};
      if (vars.compressedSize === 4294967295)
        vars.compressedSize = extra.compressedSize;
      if (vars.uncompressedSize === 4294967295)
        vars.uncompressedSize = extra.uncompressedSize;
      if (vars.offsetToLocalFileHeader === 4294967295)
        vars.offsetToLocalFileHeader = extra.offsetToLocalFileHeader;
      return extra;
    };
  }
});

// node_modules/unzipper/lib/parseDateTime.js
var require_parseDateTime = __commonJS({
  "node_modules/unzipper/lib/parseDateTime.js"(exports2, module2) {
    "use strict";
    module2.exports = function parseDateTime(date, time) {
      const day = date & 31;
      const month = date >> 5 & 15;
      const year = (date >> 9 & 127) + 1980;
      const seconds = time ? (time & 31) * 2 : 0;
      const minutes = time ? time >> 5 & 63 : 0;
      const hours = time ? time >> 11 : 0;
      return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
    };
  }
});

// node_modules/unzipper/lib/parse.js
var require_parse = __commonJS({
  "node_modules/unzipper/lib/parse.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var zlib = require("zlib");
    var Stream = require("stream");
    var PullStream = require_PullStream();
    var NoopStream = require_NoopStream();
    var BufferStream = require_BufferStream();
    var parseExtraField = require_parseExtraField();
    var parseDateTime = require_parseDateTime();
    var pipeline = Stream.pipeline;
    var parseBuffer = require_parseBuffer();
    var endDirectorySignature = Buffer.alloc(4);
    endDirectorySignature.writeUInt32LE(101010256, 0);
    function Parse(opts) {
      if (!(this instanceof Parse)) {
        return new Parse(opts);
      }
      const self2 = this;
      self2._opts = opts || { verbose: false };
      PullStream.call(self2, self2._opts);
      self2.on("finish", function() {
        self2.emit("end");
        self2.emit("close");
      });
      self2._readRecord().catch(function(e) {
        if (!self2.__emittedError || self2.__emittedError !== e)
          self2.emit("error", e);
      });
    }
    util.inherits(Parse, PullStream);
    Parse.prototype._readRecord = function() {
      const self2 = this;
      return self2.pull(4).then(function(data) {
        if (data.length === 0)
          return;
        const signature = data.readUInt32LE(0);
        if (signature === 875721283) {
          return self2._readCrxHeader();
        }
        if (signature === 67324752) {
          return self2._readFile();
        } else if (signature === 33639248) {
          self2.reachedCD = true;
          return self2._readCentralDirectoryFileHeader();
        } else if (signature === 101010256) {
          return self2._readEndOfCentralDirectoryRecord();
        } else if (self2.reachedCD) {
          const includeEof = true;
          return self2.pull(endDirectorySignature, includeEof).then(function() {
            return self2._readEndOfCentralDirectoryRecord();
          });
        } else
          self2.emit("error", new Error("invalid signature: 0x" + signature.toString(16)));
      }).then(function(loop) {
        if (loop) {
          return self2._readRecord();
        }
      });
    };
    Parse.prototype._readCrxHeader = function() {
      const self2 = this;
      return self2.pull(12).then(function(data) {
        self2.crxHeader = parseBuffer.parse(data, [
          ["version", 4],
          ["pubKeyLength", 4],
          ["signatureLength", 4]
        ]);
        return self2.pull(self2.crxHeader.pubKeyLength + self2.crxHeader.signatureLength);
      }).then(function(data) {
        self2.crxHeader.publicKey = data.slice(0, self2.crxHeader.pubKeyLength);
        self2.crxHeader.signature = data.slice(self2.crxHeader.pubKeyLength);
        self2.emit("crx-header", self2.crxHeader);
        return true;
      });
    };
    Parse.prototype._readFile = function() {
      const self2 = this;
      return self2.pull(26).then(function(data) {
        const vars = parseBuffer.parse(data, [
          ["versionsNeededToExtract", 2],
          ["flags", 2],
          ["compressionMethod", 2],
          ["lastModifiedTime", 2],
          ["lastModifiedDate", 2],
          ["crc32", 4],
          ["compressedSize", 4],
          ["uncompressedSize", 4],
          ["fileNameLength", 2],
          ["extraFieldLength", 2]
        ]);
        vars.lastModifiedDateTime = parseDateTime(vars.lastModifiedDate, vars.lastModifiedTime);
        if (self2.crxHeader) vars.crxHeader = self2.crxHeader;
        return self2.pull(vars.fileNameLength).then(function(fileNameBuffer) {
          const fileName = fileNameBuffer.toString("utf8");
          const entry = Stream.PassThrough();
          let __autodraining = false;
          entry.autodrain = function() {
            __autodraining = true;
            const draining = entry.pipe(NoopStream());
            draining.promise = function() {
              return new Promise(function(resolve, reject) {
                draining.on("finish", resolve);
                draining.on("error", reject);
              });
            };
            return draining;
          };
          entry.buffer = function() {
            return BufferStream(entry);
          };
          entry.path = fileName;
          entry.props = {};
          entry.props.path = fileName;
          entry.props.pathBuffer = fileNameBuffer;
          entry.props.flags = {
            "isUnicode": (vars.flags & 2048) != 0
          };
          entry.type = vars.uncompressedSize === 0 && /[/\\]$/.test(fileName) ? "Directory" : "File";
          if (self2._opts.verbose) {
            if (entry.type === "Directory") {
              console.log("   creating:", fileName);
            } else if (entry.type === "File") {
              if (vars.compressionMethod === 0) {
                console.log(" extracting:", fileName);
              } else {
                console.log("  inflating:", fileName);
              }
            }
          }
          return self2.pull(vars.extraFieldLength).then(function(extraField) {
            const extra = parseExtraField(extraField, vars);
            entry.vars = vars;
            entry.extra = extra;
            if (self2._opts.forceStream) {
              self2.push(entry);
            } else {
              self2.emit("entry", entry);
              if (self2._readableState.pipesCount || self2._readableState.pipes && self2._readableState.pipes.length)
                self2.push(entry);
            }
            if (self2._opts.verbose)
              console.log({
                filename: fileName,
                vars,
                extra
              });
            const fileSizeKnown = !(vars.flags & 8) || vars.compressedSize > 0;
            let eof;
            entry.__autodraining = __autodraining;
            const inflater = vars.compressionMethod && !__autodraining ? zlib.createInflateRaw() : Stream.PassThrough();
            if (fileSizeKnown) {
              entry.size = vars.uncompressedSize;
              eof = vars.compressedSize;
            } else {
              eof = Buffer.alloc(4);
              eof.writeUInt32LE(134695760, 0);
            }
            return new Promise(function(resolve, reject) {
              pipeline(
                self2.stream(eof),
                inflater,
                entry,
                function(err) {
                  if (err) {
                    return reject(err);
                  }
                  return fileSizeKnown ? resolve(fileSizeKnown) : self2._processDataDescriptor(entry).then(resolve).catch(reject);
                }
              );
            });
          });
        });
      });
    };
    Parse.prototype._processDataDescriptor = function(entry) {
      const self2 = this;
      return self2.pull(16).then(function(data) {
        const vars = parseBuffer.parse(data, [
          ["dataDescriptorSignature", 4],
          ["crc32", 4],
          ["compressedSize", 4],
          ["uncompressedSize", 4]
        ]);
        entry.size = vars.uncompressedSize;
        return true;
      });
    };
    Parse.prototype._readCentralDirectoryFileHeader = function() {
      const self2 = this;
      return self2.pull(42).then(function(data) {
        const vars = parseBuffer.parse(data, [
          ["versionMadeBy", 2],
          ["versionsNeededToExtract", 2],
          ["flags", 2],
          ["compressionMethod", 2],
          ["lastModifiedTime", 2],
          ["lastModifiedDate", 2],
          ["crc32", 4],
          ["compressedSize", 4],
          ["uncompressedSize", 4],
          ["fileNameLength", 2],
          ["extraFieldLength", 2],
          ["fileCommentLength", 2],
          ["diskNumber", 2],
          ["internalFileAttributes", 2],
          ["externalFileAttributes", 4],
          ["offsetToLocalFileHeader", 4]
        ]);
        return self2.pull(vars.fileNameLength).then(function(fileName) {
          vars.fileName = fileName.toString("utf8");
          return self2.pull(vars.extraFieldLength);
        }).then(function() {
          return self2.pull(vars.fileCommentLength);
        }).then(function() {
          return true;
        });
      });
    };
    Parse.prototype._readEndOfCentralDirectoryRecord = function() {
      const self2 = this;
      return self2.pull(18).then(function(data) {
        const vars = parseBuffer.parse(data, [
          ["diskNumber", 2],
          ["diskStart", 2],
          ["numberOfRecordsOnDisk", 2],
          ["numberOfRecords", 2],
          ["sizeOfCentralDirectory", 4],
          ["offsetToStartOfCentralDirectory", 4],
          ["commentLength", 2]
        ]);
        return self2.pull(vars.commentLength).then(function() {
          self2.end();
          self2.push(null);
        });
      });
    };
    Parse.prototype.promise = function() {
      const self2 = this;
      return new Promise(function(resolve, reject) {
        self2.on("finish", resolve);
        self2.on("error", reject);
      });
    };
    module2.exports = Parse;
  }
});

// node_modules/process-nextick-args/index.js
var require_process_nextick_args = __commonJS({
  "node_modules/process-nextick-args/index.js"(exports2, module2) {
    "use strict";
    if (typeof process === "undefined" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
      module2.exports = { nextTick };
    } else {
      module2.exports = process;
    }
    function nextTick(fn, arg1, arg2, arg3) {
      if (typeof fn !== "function") {
        throw new TypeError('"callback" argument must be a function');
      }
      var len = arguments.length;
      var args, i;
      switch (len) {
        case 0:
        case 1:
          return process.nextTick(fn);
        case 2:
          return process.nextTick(function afterTickOne() {
            fn.call(null, arg1);
          });
        case 3:
          return process.nextTick(function afterTickTwo() {
            fn.call(null, arg1, arg2);
          });
        case 4:
          return process.nextTick(function afterTickThree() {
            fn.call(null, arg1, arg2, arg3);
          });
        default:
          args = new Array(len - 1);
          i = 0;
          while (i < args.length) {
            args[i++] = arguments[i];
          }
          return process.nextTick(function afterTick() {
            fn.apply(null, args);
          });
      }
    }
  }
});

// node_modules/readable-stream/node_modules/isarray/index.js
var require_isarray = __commonJS({
  "node_modules/readable-stream/node_modules/isarray/index.js"(exports2, module2) {
    "use strict";
    var toString = {}.toString;
    module2.exports = Array.isArray || function(arr) {
      return toString.call(arr) == "[object Array]";
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/stream.js"(exports2, module2) {
    "use strict";
    module2.exports = require("stream");
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports2, module2) {
    "use strict";
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/core-util-is/lib/util.js
var require_util = __commonJS({
  "node_modules/core-util-is/lib/util.js"(exports2) {
    "use strict";
    function isArray(arg) {
      if (Array.isArray) {
        return Array.isArray(arg);
      }
      return objectToString(arg) === "[object Array]";
    }
    exports2.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
    }
    exports2.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    exports2.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports2.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    exports2.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports2.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports2.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports2.isUndefined = isUndefined;
    function isRegExp(re) {
      return objectToString(re) === "[object RegExp]";
    }
    exports2.isRegExp = isRegExp;
    function isObject2(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports2.isObject = isObject2;
    function isDate(d) {
      return objectToString(d) === "[object Date]";
    }
    exports2.isDate = isDate;
    function isError2(e) {
      return objectToString(e) === "[object Error]" || e instanceof Error;
    }
    exports2.isError = isError2;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports2.isFunction = isFunction;
    function isPrimitive2(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
      typeof arg === "undefined";
    }
    exports2.isPrimitive = isPrimitive2;
    exports2.isBuffer = require("buffer").Buffer.isBuffer;
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports2, module2) {
    "use strict";
    if (typeof Object.create === "function") {
      module2.exports = function inherits2(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits2(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports2, module2) {
    "use strict";
    try {
      util = require("util");
      if (typeof util.inherits !== "function") throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/BufferList.js"(exports2, module2) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Buffer2 = require_safe_buffer().Buffer;
    var util = require("util");
    function copyBuffer(src, target, offset) {
      src.copy(target, offset);
    }
    module2.exports = function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      BufferList.prototype.push = function push(v) {
        var entry = { data: v, next: null };
        if (this.length > 0) this.tail.next = entry;
        else this.head = entry;
        this.tail = entry;
        ++this.length;
      };
      BufferList.prototype.unshift = function unshift(v) {
        var entry = { data: v, next: this.head };
        if (this.length === 0) this.tail = entry;
        this.head = entry;
        ++this.length;
      };
      BufferList.prototype.shift = function shift() {
        if (this.length === 0) return;
        var ret2 = this.head.data;
        if (this.length === 1) this.head = this.tail = null;
        else this.head = this.head.next;
        --this.length;
        return ret2;
      };
      BufferList.prototype.clear = function clear() {
        this.head = this.tail = null;
        this.length = 0;
      };
      BufferList.prototype.join = function join2(s) {
        if (this.length === 0) return "";
        var p = this.head;
        var ret2 = "" + p.data;
        while (p = p.next) {
          ret2 += s + p.data;
        }
        return ret2;
      };
      BufferList.prototype.concat = function concat(n) {
        if (this.length === 0) return Buffer2.alloc(0);
        var ret2 = Buffer2.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while (p) {
          copyBuffer(p.data, ret2, i);
          i += p.data.length;
          p = p.next;
        }
        return ret2;
      };
      return BufferList;
    }();
    if (util && util.inspect && util.inspect.custom) {
      module2.exports.prototype[util.inspect.custom] = function() {
        var obj2 = util.inspect({ length: this.length });
        return this.constructor.name + " " + obj2;
      };
    }
  }
});

// node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports2, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            pna.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            pna.nextTick(emitErrorNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, _this, err2);
          }
        } else if (cb) {
          cb(err2);
        }
      });
      return this;
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    module2.exports = {
      destroy,
      undestroy
    };
  }
});

// node_modules/util-deprecate/node.js
var require_node = __commonJS({
  "node_modules/util-deprecate/node.js"(exports2, module2) {
    "use strict";
    module2.exports = require("util").deprecate;
  }
});

// node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "node_modules/readable-stream/lib/_stream_writable.js"(exports2, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    module2.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
    var Duplex;
    Writable.WritableState = WritableState;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var internalUtil = {
      deprecate: require_node()
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj2) {
      return Buffer2.isBuffer(obj2) || obj2 instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    util.inherits(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
      var hwm = options.highWaterMark;
      var writableHwm = options.writableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0) this.highWaterMark = hwm;
      else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;
      else this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function(object) {
          if (realHasInstance.call(this, object)) return true;
          if (this !== Writable) return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
        return new Writable(options);
      }
      this._writableState = new WritableState(options, this);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function") this._write = options.write;
        if (typeof options.writev === "function") this._writev = options.writev;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
        if (typeof options.final === "function") this._final = options.final;
      }
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe, not readable"));
    };
    function writeAfterEnd(stream, cb) {
      var er = new Error("write after end");
      stream.emit("error", er);
      pna.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var valid = true;
      var er = false;
      if (chunk === null) {
        er = new TypeError("May not write null values to stream");
      } else if (typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      if (er) {
        stream.emit("error", er);
        pna.nextTick(cb, er);
        valid = false;
      }
      return valid;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret2 = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf) encoding = "buffer";
      else if (!encoding) encoding = state.defaultEncoding;
      if (typeof cb !== "function") cb = nop;
      if (state.ended) writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret2 = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret2;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string") encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret2 = state.length < state.highWaterMark;
      if (!ret2) state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret2;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (writev) stream._writev(chunk, state.onwrite);
      else stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        pna.nextTick(cb, er);
        pna.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      onwriteStateUpdate(state);
      if (er) onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state);
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          asyncWrite(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished) onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf) allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null) state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("_write() is not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0) this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending) endWritable(this, state, cb);
    };
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          stream.emit("error", err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function") {
          state.pendingcb++;
          state.finalCalled = true;
          pna.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished) pna.nextTick(cb);
        else stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      get: function() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      this.end();
      cb(err);
    };
  }
});

// node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "node_modules/readable-stream/lib/_stream_duplex.js"(exports2, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    var objectKeys = Object.keys || function(obj2) {
      var keys2 = [];
      for (var key in obj2) {
        keys2.push(key);
      }
      return keys2;
    };
    module2.exports = Duplex;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var Readable = require_stream_readable();
    var Writable = require_stream_writable();
    util.inherits(Duplex, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex)) return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      if (options && options.readable === false) this.readable = false;
      if (options && options.writable === false) this.writable = false;
      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
      this.once("end", onend);
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended) return;
      pna.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
    Duplex.prototype._destroy = function(err, cb) {
      this.push(null);
      this.end();
      pna.nextTick(cb, err);
    };
  }
});

// node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "node_modules/string_decoder/lib/string_decoder.js"(exports2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc) return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried) return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports2.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0) return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0) return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127) return 0;
      else if (byte >> 5 === 6) return 2;
      else if (byte >> 4 === 14) return 3;
      else if (byte >> 3 === 30) return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i) return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2) nb = 0;
          else self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0) return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed) return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0) return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "node_modules/readable-stream/lib/_stream_readable.js"(exports2, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    module2.exports = Readable;
    var isArray = require_isarray();
    var Duplex;
    Readable.ReadableState = ReadableState;
    var EE = require("events").EventEmitter;
    var EElistenerCount = function(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj2) {
      return Buffer2.isBuffer(obj2) || obj2 instanceof OurUint8Array;
    }
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var debugUtil = require("util");
    var debug = void 0;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function() {
      };
    }
    var BufferList = require_BufferList();
    var destroyImpl = require_destroy();
    var StringDecoder;
    util.inherits(Readable, Stream);
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
      else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);
      else emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
      var hwm = options.highWaterMark;
      var readableHwm = options.readableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0) this.highWaterMark = hwm;
      else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;
      else this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!(this instanceof Readable)) return new Readable(options);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function") this._read = options.read;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      this.push(null);
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck) er = chunkInvalid(state, chunk);
        if (er) {
          stream.emit("error", er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted) stream.emit("error", new Error("stream.unshift() after end event"));
            else addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            stream.emit("error", new Error("stream.push() after EOF"));
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
              else maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
        }
      }
      return needMoreData(state);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit("data", chunk);
        stream.read(0);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront) state.buffer.unshift(chunk);
        else state.buffer.push(chunk);
        if (state.needReadable) emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      return er;
    }
    function needMoreData(state) {
      return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
      return this;
    };
    var MAX_HWM = 8388608;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended) return 0;
      if (state.objectMode) return 1;
      if (n !== n) {
        if (state.flowing && state.length) return state.buffer.head.data.length;
        else return state.length;
      }
      if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length) return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0) state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended) endReadable(this);
        else emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0) endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0) state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading) n = howMuchToRead(nOrig, state);
      }
      var ret2;
      if (n > 0) ret2 = fromList(n, state);
      else ret2 = null;
      if (ret2 === null) {
        state.needReadable = true;
        n = 0;
      } else {
        state.length -= n;
      }
      if (state.length === 0) {
        if (!state.ended) state.needReadable = true;
        if (nOrig !== n && state.ended) endReadable(this);
      }
      if (ret2 !== null) this.emit("data", ret2);
      return ret2;
    };
    function onEofChunk(stream, state) {
      if (state.ended) return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      emitReadable(stream);
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        if (state.sync) pna.nextTick(emitReadable_, stream);
        else emitReadable_(stream);
      }
    }
    function emitReadable_(stream) {
      debug("emit readable");
      stream.emit("readable");
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        pna.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      var len = state.length;
      while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
        else len = state.length;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      this.emit("error", new Error("_read() is not implemented"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted) pna.nextTick(endFn);
      else src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
      }
      var increasedAwaitDrain = false;
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        increasedAwaitDrain = false;
        var ret2 = dest.write(chunk);
        if (false === ret2 && !increasedAwaitDrain) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
            increasedAwaitDrain = true;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0) dest.emit("error", er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain) state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = { hasUnpiped: false };
      if (state.pipesCount === 0) return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes) return this;
        if (!dest) dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest) dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) {
          dests[i].emit("unpipe", this, { hasUnpiped: false });
        }
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1) return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1) state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      if (ev === "data") {
        if (this._readableState.flowing !== false) this.resume();
      } else if (ev === "readable") {
        var state = this._readableState;
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.emittedReadable = false;
          if (!state.reading) {
            pna.nextTick(nReadingNextTick, this);
          } else if (state.length) {
            emitReadable(this);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = true;
        resume(this, state);
      }
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        pna.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      if (!state.reading) {
        debug("resume read 0");
        stream.read(0);
      }
      state.resumeScheduled = false;
      state.awaitDrain = 0;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading) stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (false !== this._readableState.flowing) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null) {
      }
    }
    Readable.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length) _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder) chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0)) return;
        else if (!state.objectMode && (!chunk || !chunk.length)) return;
        var ret2 = _this.push(chunk);
        if (!ret2) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = /* @__PURE__ */ function(method) {
            return function() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._readableState.highWaterMark;
      }
    });
    Readable._fromList = fromList;
    function fromList(n, state) {
      if (state.length === 0) return null;
      var ret2;
      if (state.objectMode) ret2 = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder) ret2 = state.buffer.join("");
        else if (state.buffer.length === 1) ret2 = state.buffer.head.data;
        else ret2 = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret2 = fromListPartial(n, state.buffer, state.decoder);
      }
      return ret2;
    }
    function fromListPartial(n, list, hasStrings) {
      var ret2;
      if (n < list.head.data.length) {
        ret2 = list.head.data.slice(0, n);
        list.head.data = list.head.data.slice(n);
      } else if (n === list.head.data.length) {
        ret2 = list.shift();
      } else {
        ret2 = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
      }
      return ret2;
    }
    function copyFromBufferString(n, list) {
      var p = list.head;
      var c = 1;
      var ret2 = p.data;
      n -= ret2.length;
      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret2 += str;
        else ret2 += str.slice(0, n);
        n -= nb;
        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) list.head = p.next;
            else list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = str.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret2;
    }
    function copyFromBuffer(n, list) {
      var ret2 = Buffer2.allocUnsafe(n);
      var p = list.head;
      var c = 1;
      p.data.copy(ret2);
      n -= p.data.length;
      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret2, ret2.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) list.head = p.next;
            else list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = buf.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret2;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');
      if (!state.endEmitted) {
        state.ended = true;
        pna.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
      }
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
      }
      return -1;
    }
  }
});

// node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "node_modules/readable-stream/lib/_stream_transform.js"(exports2, module2) {
    "use strict";
    module2.exports = Transform;
    var Duplex = require_stream_duplex();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb) {
        return this.emit("error", new Error("write callback called multiple times"));
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform)) return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function") this._transform = options.transform;
        if (typeof options.flush === "function") this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function") {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("_transform() is not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      var _this2 = this;
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
        _this2.emit("close");
      });
    };
    function done(stream, er, data) {
      if (er) return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length) throw new Error("Calling transform done when ws.length != 0");
      if (stream._transformState.transforming) throw new Error("Calling transform done when still transforming");
      return stream.push(null);
    }
  }
});

// node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "node_modules/readable-stream/lib/_stream_passthrough.js"(exports2, module2) {
    "use strict";
    module2.exports = PassThrough;
    var Transform = require_stream_transform();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough)) return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/readable-stream/readable.js
var require_readable = __commonJS({
  "node_modules/readable-stream/readable.js"(exports2, module2) {
    "use strict";
    var Stream = require("stream");
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module2.exports = Stream;
      exports2 = module2.exports = Stream.Readable;
      exports2.Readable = Stream.Readable;
      exports2.Writable = Stream.Writable;
      exports2.Duplex = Stream.Duplex;
      exports2.Transform = Stream.Transform;
      exports2.PassThrough = Stream.PassThrough;
      exports2.Stream = Stream;
    } else {
      exports2 = module2.exports = require_stream_readable();
      exports2.Stream = Stream || exports2;
      exports2.Readable = exports2;
      exports2.Writable = require_stream_writable();
      exports2.Duplex = require_stream_duplex();
      exports2.Transform = require_stream_transform();
      exports2.PassThrough = require_stream_passthrough();
    }
  }
});

// node_modules/duplexer2/index.js
var require_duplexer2 = __commonJS({
  "node_modules/duplexer2/index.js"(exports2, module2) {
    "use strict";
    var stream = require_readable();
    function DuplexWrapper(options, writable, readable) {
      if (typeof readable === "undefined") {
        readable = writable;
        writable = options;
        options = null;
      }
      stream.Duplex.call(this, options);
      if (typeof readable.read !== "function") {
        readable = new stream.Readable(options).wrap(readable);
      }
      this._writable = writable;
      this._readable = readable;
      this._waiting = false;
      var self2 = this;
      writable.once("finish", function() {
        self2.end();
      });
      this.once("finish", function() {
        writable.end();
      });
      readable.on("readable", function() {
        if (self2._waiting) {
          self2._waiting = false;
          self2._read();
        }
      });
      readable.once("end", function() {
        self2.push(null);
      });
      if (!options || typeof options.bubbleErrors === "undefined" || options.bubbleErrors) {
        writable.on("error", function(err) {
          self2.emit("error", err);
        });
        readable.on("error", function(err) {
          self2.emit("error", err);
        });
      }
    }
    DuplexWrapper.prototype = Object.create(stream.Duplex.prototype, { constructor: { value: DuplexWrapper } });
    DuplexWrapper.prototype._write = function _write(input, encoding, done) {
      this._writable.write(input, encoding, done);
    };
    DuplexWrapper.prototype._read = function _read() {
      var buf;
      var reads = 0;
      while ((buf = this._readable.read()) !== null) {
        this.push(buf);
        reads++;
      }
      if (reads === 0) {
        this._waiting = true;
      }
    };
    module2.exports = function duplex2(options, writable, readable) {
      return new DuplexWrapper(options, writable, readable);
    };
    module2.exports.DuplexWrapper = DuplexWrapper;
  }
});

// node_modules/unzipper/lib/parseOne.js
var require_parseOne = __commonJS({
  "node_modules/unzipper/lib/parseOne.js"(exports2, module2) {
    "use strict";
    var Stream = require("stream");
    var Parse = require_parse();
    var duplexer2 = require_duplexer2();
    var BufferStream = require_BufferStream();
    function parseOne(match, opts) {
      const inStream = Stream.PassThrough({ objectMode: true });
      const outStream = Stream.PassThrough();
      const transform = Stream.Transform({ objectMode: true });
      const re = match instanceof RegExp ? match : match && new RegExp(match);
      let found;
      transform._transform = function(entry, e, cb) {
        if (found || re && !re.exec(entry.path)) {
          entry.autodrain();
          return cb();
        } else {
          found = true;
          out.emit("entry", entry);
          entry.on("error", function(e2) {
            outStream.emit("error", e2);
          });
          entry.pipe(outStream).on("error", function(err) {
            cb(err);
          }).on("finish", function(d) {
            cb(null, d);
          });
        }
      };
      inStream.pipe(Parse(opts)).on("error", function(err) {
        outStream.emit("error", err);
      }).pipe(transform).on("error", Object).on("finish", function() {
        if (!found)
          outStream.emit("error", new Error("PATTERN_NOT_FOUND"));
        else
          outStream.end();
      });
      const out = duplexer2(inStream, outStream);
      out.buffer = function() {
        return BufferStream(outStream);
      };
      return out;
    }
    module2.exports = parseOne;
  }
});

// node_modules/universalify/index.js
var require_universalify = __commonJS({
  "node_modules/universalify/index.js"(exports2) {
    "use strict";
    exports2.fromCallback = function(fn) {
      return Object.defineProperty(function(...args) {
        if (typeof args[args.length - 1] === "function") fn.apply(this, args);
        else {
          return new Promise((resolve, reject) => {
            args.push((err, res) => err != null ? reject(err) : resolve(res));
            fn.apply(this, args);
          });
        }
      }, "name", { value: fn.name });
    };
    exports2.fromPromise = function(fn) {
      return Object.defineProperty(function(...args) {
        const cb = args[args.length - 1];
        if (typeof cb !== "function") return fn.apply(this, args);
        else {
          args.pop();
          fn.apply(this, args).then((r) => cb(null, r), cb);
        }
      }, "name", { value: fn.name });
    };
  }
});

// node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/graceful-fs/polyfills.js"(exports2, module2) {
    "use strict";
    var constants = require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module2.exports = patch;
    function patch(fs2) {
      if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs2);
      }
      if (!fs2.lutimes) {
        patchLutimes(fs2);
      }
      fs2.chown = chownFix(fs2.chown);
      fs2.fchown = chownFix(fs2.fchown);
      fs2.lchown = chownFix(fs2.lchown);
      fs2.chmod = chmodFix(fs2.chmod);
      fs2.fchmod = chmodFix(fs2.fchmod);
      fs2.lchmod = chmodFix(fs2.lchmod);
      fs2.chownSync = chownFixSync(fs2.chownSync);
      fs2.fchownSync = chownFixSync(fs2.fchownSync);
      fs2.lchownSync = chownFixSync(fs2.lchownSync);
      fs2.chmodSync = chmodFixSync(fs2.chmodSync);
      fs2.fchmodSync = chmodFixSync(fs2.fchmodSync);
      fs2.lchmodSync = chmodFixSync(fs2.lchmodSync);
      fs2.stat = statFix(fs2.stat);
      fs2.fstat = statFix(fs2.fstat);
      fs2.lstat = statFix(fs2.lstat);
      fs2.statSync = statFixSync(fs2.statSync);
      fs2.fstatSync = statFixSync(fs2.fstatSync);
      fs2.lstatSync = statFixSync(fs2.lstatSync);
      if (fs2.chmod && !fs2.lchmod) {
        fs2.lchmod = function(path2, mode, cb) {
          if (cb) process.nextTick(cb);
        };
        fs2.lchmodSync = function() {
        };
      }
      if (fs2.chown && !fs2.lchown) {
        fs2.lchown = function(path2, uid, gid, cb) {
          if (cb) process.nextTick(cb);
        };
        fs2.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs2.rename = typeof fs2.rename !== "function" ? fs2.rename : function(fs$rename) {
          function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs2.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb) cb(er);
            });
          }
          if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename);
          return rename;
        }(fs2.rename);
      }
      fs2.read = typeof fs2.read !== "function" ? fs2.read : function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
        return read;
      }(fs2.read);
      fs2.readSync = typeof fs2.readSync !== "function" ? fs2.readSync : /* @__PURE__ */ function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs2, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      }(fs2.readSync);
      function patchLchmod(fs3) {
        fs3.lchmod = function(path2, mode, callback) {
          fs3.open(
            path2,
            constants.O_WRONLY | constants.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback) callback(err);
                return;
              }
              fs3.fchmod(fd, mode, function(err2) {
                fs3.close(fd, function(err22) {
                  if (callback) callback(err2 || err22);
                });
              });
            }
          );
        };
        fs3.lchmodSync = function(path2, mode) {
          var fd = fs3.openSync(path2, constants.O_WRONLY | constants.O_SYMLINK, mode);
          var threw = true;
          var ret2;
          try {
            ret2 = fs3.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs3.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs3.closeSync(fd);
            }
          }
          return ret2;
        };
      }
      function patchLutimes(fs3) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs3.futimes) {
          fs3.lutimes = function(path2, at, mt, cb) {
            fs3.open(path2, constants.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb) cb(er);
                return;
              }
              fs3.futimes(fd, at, mt, function(er2) {
                fs3.close(fd, function(er22) {
                  if (cb) cb(er2 || er22);
                });
              });
            });
          };
          fs3.lutimesSync = function(path2, at, mt) {
            var fd = fs3.openSync(path2, constants.O_SYMLINK);
            var ret2;
            var threw = true;
            try {
              ret2 = fs3.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs3.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs3.closeSync(fd);
              }
            }
            return ret2;
          };
        } else if (fs3.futimes) {
          fs3.lutimes = function(_a, _b, _c, cb) {
            if (cb) process.nextTick(cb);
          };
          fs3.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig) return orig;
        return function(target, mode, cb) {
          return orig.call(fs2, target, mode, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target, mode) {
          try {
            return orig.call(fs2, target, mode);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig) return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs2, target, uid, gid, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs2, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig) return orig;
        return function(target, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0) stats.uid += 4294967296;
              if (stats.gid < 0) stats.gid += 4294967296;
            }
            if (cb) cb.apply(this, arguments);
          }
          return options ? orig.call(fs2, target, options, callback) : orig.call(fs2, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig) return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs2, target, options) : orig.call(fs2, target);
          if (stats) {
            if (stats.uid < 0) stats.uid += 4294967296;
            if (stats.gid < 0) stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "node_modules/graceful-fs/legacy-streams.js"(exports2, module2) {
    "use strict";
    var Stream = require("stream").Stream;
    module2.exports = legacy;
    function legacy(fs2) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path2, options) {
        if (!(this instanceof ReadStream)) return new ReadStream(path2, options);
        Stream.call(this);
        var self2 = this;
        this.path = path2;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.encoding) this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self2._read();
          });
          return;
        }
        fs2.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self2.emit("error", err);
            self2.readable = false;
            return;
          }
          self2.fd = fd;
          self2.emit("open", fd);
          self2._read();
        });
      }
      function WriteStream(path2, options) {
        if (!(this instanceof WriteStream)) return new WriteStream(path2, options);
        Stream.call(this);
        this.path = path2;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs2.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "node_modules/graceful-fs/clone.js"(exports2, module2) {
    "use strict";
    module2.exports = clone;
    var getPrototypeOf = Object.getPrototypeOf || function(obj2) {
      return obj2.__proto__;
    };
    function clone(obj2) {
      if (obj2 === null || typeof obj2 !== "object")
        return obj2;
      if (obj2 instanceof Object)
        var copy = { __proto__: getPrototypeOf(obj2) };
      else
        var copy = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj2).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj2, key));
      });
      return copy;
    }
  }
});

// node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "node_modules/graceful-fs/graceful-fs.js"(exports2, module2) {
    "use strict";
    var fs2 = require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util = require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = Symbol.for("graceful-fs.queue");
      previousSymbol = Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop;
    if (util.debuglog)
      debug = util.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util.format.apply(util, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs2[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs2, queue);
      fs2.close = function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs2, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close, previousSymbol, {
          value: fs$close
        });
        return close;
      }(fs2.close);
      fs2.closeSync = function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs2, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      }(fs2.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs2[gracefulQueue]);
          require("assert").equal(fs2[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs2[gracefulQueue]);
    }
    module2.exports = patch(clone(fs2));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs2.__patched) {
      module2.exports = patch(fs2);
      fs2.__patched = true;
    }
    function patch(fs3) {
      polyfills(fs3);
      fs3.gracefulify = patch;
      fs3.createReadStream = createReadStream;
      fs3.createWriteStream = createWriteStream;
      var fs$readFile = fs3.readFile;
      fs3.readFile = readFile;
      function readFile(path2, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path2, options, cb);
        function go$readFile(path3, options2, cb2, startTime) {
          return fs$readFile(path3, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path3, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs3.writeFile;
      fs3.writeFile = writeFile;
      function writeFile(path2, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path2, data, options, cb);
        function go$writeFile(path3, data2, options2, cb2, startTime) {
          return fs$writeFile(path3, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs3.appendFile;
      if (fs$appendFile)
        fs3.appendFile = appendFile;
      function appendFile(path2, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path2, data, options, cb);
        function go$appendFile(path3, data2, options2, cb2, startTime) {
          return fs$appendFile(path3, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs3.copyFile;
      if (fs$copyFile)
        fs3.copyFile = copyFile;
      function copyFile(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs3.readdir;
      fs3.readdir = readdir;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir(path2, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path3, options2, cb2, startTime) {
          return fs$readdir(path3, fs$readdirCallback(
            path3,
            options2,
            cb2,
            startTime
          ));
        } : function go$readdir2(path3, options2, cb2, startTime) {
          return fs$readdir(path3, options2, fs$readdirCallback(
            path3,
            options2,
            cb2,
            startTime
          ));
        };
        return go$readdir(path2, options, cb);
        function fs$readdirCallback(path3, options2, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path3, options2, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs3);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs3.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs3.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs3, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs3, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val) {
          WriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs3, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs3, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path2, options) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path2, options) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path2, options) {
        return new fs3.ReadStream(path2, options);
      }
      function createWriteStream(path2, options) {
        return new fs3.WriteStream(path2, options);
      }
      var fs$open = fs3.open;
      fs3.open = open;
      function open(path2, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path2, flags, mode, cb);
        function go$open(path3, flags2, mode2, cb2, startTime) {
          return fs$open(path3, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path3, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs3;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs2[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs2[gracefulQueue].length; ++i) {
        if (fs2[gracefulQueue][i].length > 2) {
          fs2[gracefulQueue][i][3] = now;
          fs2[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs2[gracefulQueue].length === 0)
        return;
      var elem = fs2[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs2[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/fs/index.js
var require_fs = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/fs/index.js"(exports2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs2 = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "cp",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "glob",
      "lchmod",
      "lchown",
      "lutimes",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "statfs",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs2[key] === "function";
    });
    Object.assign(exports2, fs2);
    api.forEach((method) => {
      exports2[method] = u(fs2[method]);
    });
    exports2.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs2.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs2.exists(filename, resolve);
      });
    };
    exports2.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs2.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs2.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports2.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs2.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs2.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    exports2.readv = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs2.readv(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs2.readv(fd, buffers, ...args, (err, bytesRead, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffers: buffers2 });
        });
      });
    };
    exports2.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs2.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs2.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
    if (typeof fs2.realpath.native === "function") {
      exports2.realpath.native = u(fs2.realpath.native);
    } else {
      process.emitWarning(
        "fs.realpath.native is not a function. Is fs being monkey-patched?",
        "Warning",
        "fs-extra-WARN0003"
      );
    }
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/mkdirs/utils.js"(exports2, module2) {
    "use strict";
    var path2 = require("path");
    module2.exports.checkPath = function checkPath(pth) {
      if (process.platform === "win32") {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path2.parse(pth).root, ""));
        if (pathHasInvalidWinCharacters) {
          const error = new Error(`Path contains invalid characters: ${pth}`);
          error.code = "EINVAL";
          throw error;
        }
      }
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports2, module2) {
    "use strict";
    var fs2 = require_fs();
    var { checkPath } = require_utils();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number") return options;
      return { ...defaults, ...options }.mode;
    };
    module2.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs2.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module2.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs2.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/mkdirs/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var { makeDir: _makeDir, makeDirSync } = require_make_dir();
    var makeDir = u(_makeDir);
    module2.exports = {
      mkdirs: makeDir,
      mkdirsSync: makeDirSync,
      // alias
      mkdirp: makeDir,
      mkdirpSync: makeDirSync,
      ensureDir: makeDir,
      ensureDirSync: makeDirSync
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/path-exists/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs2 = require_fs();
    function pathExists(path2) {
      return fs2.access(path2).then(() => true).catch(() => false);
    }
    module2.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs2.existsSync
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/util/utimes.js"(exports2, module2) {
    "use strict";
    var fs2 = require_fs();
    var u = require_universalify().fromPromise;
    async function utimesMillis(path2, atime, mtime) {
      const fd = await fs2.open(path2, "r+");
      let closeErr = null;
      try {
        await fs2.futimes(fd, atime, mtime);
      } finally {
        try {
          await fs2.close(fd);
        } catch (e) {
          closeErr = e;
        }
      }
      if (closeErr) {
        throw closeErr;
      }
    }
    function utimesMillisSync(path2, atime, mtime) {
      const fd = fs2.openSync(path2, "r+");
      fs2.futimesSync(fd, atime, mtime);
      return fs2.closeSync(fd);
    }
    module2.exports = {
      utimesMillis: u(utimesMillis),
      utimesMillisSync
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/util/stat.js
var require_stat = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/util/stat.js"(exports2, module2) {
    "use strict";
    var fs2 = require_fs();
    var path2 = require("path");
    var u = require_universalify().fromPromise;
    function getStats(src, dest, opts) {
      const statFunc = opts.dereference ? (file) => fs2.stat(file, { bigint: true }) : (file) => fs2.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT") return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src, dest, opts) {
      let destStat;
      const statFunc = opts.dereference ? (file) => fs2.statSync(file, { bigint: true }) : (file) => fs2.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT") return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    async function checkPaths(src, dest, funcName, opts) {
      const { srcStat, destStat } = await getStats(src, dest, opts);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path2.basename(src);
          const destBaseName = path2.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkPathsSync(src, dest, funcName, opts) {
      const { srcStat, destStat } = getStatsSync(src, dest, opts);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path2.basename(src);
          const destBaseName = path2.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    async function checkParentPaths(src, srcStat, dest, funcName) {
      const srcParent = path2.resolve(path2.dirname(src));
      const destParent = path2.resolve(path2.dirname(dest));
      if (destParent === srcParent || destParent === path2.parse(destParent).root) return;
      let destStat;
      try {
        destStat = await fs2.stat(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPaths(src, srcStat, destParent, funcName);
    }
    function checkParentPathsSync(src, srcStat, dest, funcName) {
      const srcParent = path2.resolve(path2.dirname(src));
      const destParent = path2.resolve(path2.dirname(dest));
      if (destParent === srcParent || destParent === path2.parse(destParent).root) return;
      let destStat;
      try {
        destStat = fs2.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPathsSync(src, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src, dest) {
      const srcArr = path2.resolve(src).split(path2.sep).filter((i) => i);
      const destArr = path2.resolve(dest).split(path2.sep).filter((i) => i);
      return srcArr.every((cur, i) => destArr[i] === cur);
    }
    function errMsg(src, dest, funcName) {
      return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
    }
    module2.exports = {
      // checkPaths
      checkPaths: u(checkPaths),
      checkPathsSync,
      // checkParent
      checkParentPaths: u(checkParentPaths),
      checkParentPathsSync,
      // Misc
      isSrcSubdir,
      areIdentical
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/copy/copy.js
var require_copy = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/copy/copy.js"(exports2, module2) {
    "use strict";
    var fs2 = require_fs();
    var path2 = require("path");
    var { mkdirs } = require_mkdirs();
    var { pathExists } = require_path_exists();
    var { utimesMillis } = require_utimes();
    var stat = require_stat();
    async function copy(src, dest, opts = {}) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0001"
        );
      }
      const { srcStat, destStat } = await stat.checkPaths(src, dest, "copy", opts);
      await stat.checkParentPaths(src, srcStat, dest, "copy");
      const include = await runFilter(src, dest, opts);
      if (!include) return;
      const destParent = path2.dirname(dest);
      const dirExists = await pathExists(destParent);
      if (!dirExists) {
        await mkdirs(destParent);
      }
      await getStatsAndPerformCopy(destStat, src, dest, opts);
    }
    async function runFilter(src, dest, opts) {
      if (!opts.filter) return true;
      return opts.filter(src, dest);
    }
    async function getStatsAndPerformCopy(destStat, src, dest, opts) {
      const statFn = opts.dereference ? fs2.stat : fs2.lstat;
      const srcStat = await statFn(src);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);
      if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts);
      if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
      if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
      if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    async function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat) return copyFile(srcStat, src, dest, opts);
      if (opts.overwrite) {
        await fs2.unlink(dest);
        return copyFile(srcStat, src, dest, opts);
      }
      if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    async function copyFile(srcStat, src, dest, opts) {
      await fs2.copyFile(src, dest);
      if (opts.preserveTimestamps) {
        if (fileIsNotWritable(srcStat.mode)) {
          await makeFileWritable(dest, srcStat.mode);
        }
        const updatedSrcStat = await fs2.stat(src);
        await utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
      }
      return fs2.chmod(dest, srcStat.mode);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return fs2.chmod(dest, srcMode | 128);
    }
    async function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat) {
        await fs2.mkdir(dest);
      }
      const promises = [];
      for await (const item of await fs2.opendir(src)) {
        const srcItem = path2.join(src, item.name);
        const destItem = path2.join(dest, item.name);
        promises.push(
          runFilter(srcItem, destItem, opts).then((include) => {
            if (include) {
              return stat.checkPaths(srcItem, destItem, "copy", opts).then(({ destStat: destStat2 }) => {
                return getStatsAndPerformCopy(destStat2, srcItem, destItem, opts);
              });
            }
          })
        );
      }
      await Promise.all(promises);
      if (!destStat) {
        await fs2.chmod(dest, srcStat.mode);
      }
    }
    async function onLink(destStat, src, dest, opts) {
      let resolvedSrc = await fs2.readlink(src);
      if (opts.dereference) {
        resolvedSrc = path2.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs2.symlink(resolvedSrc, dest);
      }
      let resolvedDest = null;
      try {
        resolvedDest = await fs2.readlink(dest);
      } catch (e) {
        if (e.code === "EINVAL" || e.code === "UNKNOWN") return fs2.symlink(resolvedSrc, dest);
        throw e;
      }
      if (opts.dereference) {
        resolvedDest = path2.resolve(process.cwd(), resolvedDest);
      }
      if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
        throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
      }
      if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
        throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
      }
      await fs2.unlink(dest);
      return fs2.symlink(resolvedSrc, dest);
    }
    module2.exports = copy;
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/copy/copy-sync.js"(exports2, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    var path2 = require("path");
    var mkdirsSync = require_mkdirs().mkdirsSync;
    var utimesMillisSync = require_utimes().utimesMillisSync;
    var stat = require_stat();
    function copySync(src, dest, opts) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0002"
        );
      }
      const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "copy");
      if (opts.filter && !opts.filter(src, dest)) return;
      const destParent = path2.dirname(dest);
      if (!fs2.existsSync(destParent)) mkdirsSync(destParent);
      return getStats(destStat, src, dest, opts);
    }
    function getStats(destStat, src, dest, opts) {
      const statSync = opts.dereference ? fs2.statSync : fs2.lstatSync;
      const srcStat = statSync(src);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts);
      else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
      else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
      else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat) return copyFile(srcStat, src, dest, opts);
      return mayCopyFile(srcStat, src, dest, opts);
    }
    function mayCopyFile(srcStat, src, dest, opts) {
      if (opts.overwrite) {
        fs2.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts);
      } else if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts) {
      fs2.copyFileSync(src, dest);
      if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src, dest) {
      if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
      return setDestTimestamps(src, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs2.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src, dest) {
      const updatedSrcStat = fs2.statSync(src);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts);
      return copyDir(src, dest, opts);
    }
    function mkDirAndCopy(srcMode, src, dest, opts) {
      fs2.mkdirSync(dest);
      copyDir(src, dest, opts);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src, dest, opts) {
      const dir = fs2.opendirSync(src);
      try {
        let dirent;
        while ((dirent = dir.readSync()) !== null) {
          copyDirItem(dirent.name, src, dest, opts);
        }
      } finally {
        dir.closeSync();
      }
    }
    function copyDirItem(item, src, dest, opts) {
      const srcItem = path2.join(src, item);
      const destItem = path2.join(dest, item);
      if (opts.filter && !opts.filter(srcItem, destItem)) return;
      const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts);
      return getStats(destStat, srcItem, destItem, opts);
    }
    function onLink(destStat, src, dest, opts) {
      let resolvedSrc = fs2.readlinkSync(src);
      if (opts.dereference) {
        resolvedSrc = path2.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs2.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs2.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs2.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts.dereference) {
          resolvedDest = path2.resolve(process.cwd(), resolvedDest);
        }
        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs2.unlinkSync(dest);
      return fs2.symlinkSync(resolvedSrc, dest);
    }
    module2.exports = copySync;
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/copy/index.js
var require_copy2 = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/copy/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    module2.exports = {
      copy: u(require_copy()),
      copySync: require_copy_sync()
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/remove/index.js
var require_remove = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/remove/index.js"(exports2, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    var u = require_universalify().fromCallback;
    function remove(path2, callback) {
      fs2.rm(path2, { recursive: true, force: true }, callback);
    }
    function removeSync(path2) {
      fs2.rmSync(path2, { recursive: true, force: true });
    }
    module2.exports = {
      remove: u(remove),
      removeSync
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/empty/index.js
var require_empty = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/empty/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs2 = require_fs();
    var path2 = require("path");
    var mkdir = require_mkdirs();
    var remove = require_remove();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs2.readdir(dir);
      } catch {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove.remove(path2.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs2.readdirSync(dir);
      } catch {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path2.join(dir, item);
        remove.removeSync(item);
      });
    }
    module2.exports = {
      emptyDirSync,
      emptydirSync: emptyDirSync,
      emptyDir,
      emptydir: emptyDir
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/ensure/file.js
var require_file = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/ensure/file.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path2 = require("path");
    var fs2 = require_fs();
    var mkdir = require_mkdirs();
    async function createFile(file) {
      let stats;
      try {
        stats = await fs2.stat(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path2.dirname(file);
      let dirStats = null;
      try {
        dirStats = await fs2.stat(dir);
      } catch (err) {
        if (err.code === "ENOENT") {
          await mkdir.mkdirs(dir);
          await fs2.writeFile(file, "");
          return;
        } else {
          throw err;
        }
      }
      if (dirStats.isDirectory()) {
        await fs2.writeFile(file, "");
      } else {
        await fs2.readdir(dir);
      }
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs2.statSync(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path2.dirname(file);
      try {
        if (!fs2.statSync(dir).isDirectory()) {
          fs2.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT") mkdir.mkdirsSync(dir);
        else throw err;
      }
      fs2.writeFileSync(file, "");
    }
    module2.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/ensure/link.js
var require_link = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/ensure/link.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path2 = require("path");
    var fs2 = require_fs();
    var mkdir = require_mkdirs();
    var { pathExists } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createLink(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = await fs2.lstat(dstpath);
      } catch {
      }
      let srcStat;
      try {
        srcStat = await fs2.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      if (dstStat && areIdentical(srcStat, dstStat)) return;
      const dir = path2.dirname(dstpath);
      const dirExists = await pathExists(dir);
      if (!dirExists) {
        await mkdir.mkdirs(dir);
      }
      await fs2.link(srcpath, dstpath);
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs2.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs2.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat)) return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path2.dirname(dstpath);
      const dirExists = fs2.existsSync(dir);
      if (dirExists) return fs2.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs2.linkSync(srcpath, dstpath);
    }
    module2.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports2, module2) {
    "use strict";
    var path2 = require("path");
    var fs2 = require_fs();
    var { pathExists } = require_path_exists();
    var u = require_universalify().fromPromise;
    async function symlinkPaths(srcpath, dstpath) {
      if (path2.isAbsolute(srcpath)) {
        try {
          await fs2.lstat(srcpath);
        } catch (err) {
          err.message = err.message.replace("lstat", "ensureSymlink");
          throw err;
        }
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path2.dirname(dstpath);
      const relativeToDst = path2.join(dstdir, srcpath);
      const exists = await pathExists(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      try {
        await fs2.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureSymlink");
        throw err;
      }
      return {
        toCwd: srcpath,
        toDst: path2.relative(dstdir, srcpath)
      };
    }
    function symlinkPathsSync(srcpath, dstpath) {
      if (path2.isAbsolute(srcpath)) {
        const exists2 = fs2.existsSync(srcpath);
        if (!exists2) throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path2.dirname(dstpath);
      const relativeToDst = path2.join(dstdir, srcpath);
      const exists = fs2.existsSync(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      const srcExists = fs2.existsSync(srcpath);
      if (!srcExists) throw new Error("relative srcpath does not exist");
      return {
        toCwd: srcpath,
        toDst: path2.relative(dstdir, srcpath)
      };
    }
    module2.exports = {
      symlinkPaths: u(symlinkPaths),
      symlinkPathsSync
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/ensure/symlink-type.js"(exports2, module2) {
    "use strict";
    var fs2 = require_fs();
    var u = require_universalify().fromPromise;
    async function symlinkType(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = await fs2.lstat(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    function symlinkTypeSync(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = fs2.lstatSync(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module2.exports = {
      symlinkType: u(symlinkType),
      symlinkTypeSync
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/ensure/symlink.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path2 = require("path");
    var fs2 = require_fs();
    var { mkdirs, mkdirsSync } = require_mkdirs();
    var { symlinkPaths, symlinkPathsSync } = require_symlink_paths();
    var { symlinkType, symlinkTypeSync } = require_symlink_type();
    var { pathExists } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createSymlink(srcpath, dstpath, type) {
      let stats;
      try {
        stats = await fs2.lstat(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const [srcStat, dstStat] = await Promise.all([
          fs2.stat(srcpath),
          fs2.stat(dstpath)
        ]);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative = await symlinkPaths(srcpath, dstpath);
      srcpath = relative.toDst;
      const toType = await symlinkType(relative.toCwd, type);
      const dir = path2.dirname(dstpath);
      if (!await pathExists(dir)) {
        await mkdirs(dir);
      }
      return fs2.symlink(srcpath, dstpath, toType);
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs2.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs2.statSync(srcpath);
        const dstStat = fs2.statSync(dstpath);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path2.dirname(dstpath);
      const exists = fs2.existsSync(dir);
      if (exists) return fs2.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs2.symlinkSync(srcpath, dstpath, type);
    }
    module2.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/ensure/index.js
var require_ensure = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/ensure/index.js"(exports2, module2) {
    "use strict";
    var { createFile, createFileSync } = require_file();
    var { createLink, createLinkSync } = require_link();
    var { createSymlink, createSymlinkSync } = require_symlink();
    module2.exports = {
      // file
      createFile,
      createFileSync,
      ensureFile: createFile,
      ensureFileSync: createFileSync,
      // link
      createLink,
      createLinkSync,
      ensureLink: createLink,
      ensureLinkSync: createLinkSync,
      // symlink
      createSymlink,
      createSymlinkSync,
      ensureSymlink: createSymlink,
      ensureSymlinkSync: createSymlinkSync
    };
  }
});

// node_modules/jsonfile/utils.js
var require_utils2 = __commonJS({
  "node_modules/jsonfile/utils.js"(exports2, module2) {
    "use strict";
    function stringify(obj2, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
      const EOF = finalEOL ? EOL : "";
      const str = JSON.stringify(obj2, replacer, spaces);
      return str.replace(/\n/g, EOL) + EOF;
    }
    function stripBom(content) {
      if (Buffer.isBuffer(content)) content = content.toString("utf8");
      return content.replace(/^\uFEFF/, "");
    }
    module2.exports = { stringify, stripBom };
  }
});

// node_modules/jsonfile/index.js
var require_jsonfile = __commonJS({
  "node_modules/jsonfile/index.js"(exports2, module2) {
    "use strict";
    var _fs;
    try {
      _fs = require_graceful_fs();
    } catch (_) {
      _fs = require("fs");
    }
    var universalify = require_universalify();
    var { stringify, stripBom } = require_utils2();
    async function _readFile(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs2 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      let data = await universalify.fromCallback(fs2.readFile)(file, options);
      data = stripBom(data);
      let obj2;
      try {
        obj2 = JSON.parse(data, options ? options.reviver : null);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
      return obj2;
    }
    var readFile = universalify.fromPromise(_readFile);
    function readFileSync2(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs2 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      try {
        let content = fs2.readFileSync(file, options);
        content = stripBom(content);
        return JSON.parse(content, options.reviver);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
    }
    async function _writeFile(file, obj2, options = {}) {
      const fs2 = options.fs || _fs;
      const str = stringify(obj2, options);
      await universalify.fromCallback(fs2.writeFile)(file, str, options);
    }
    var writeFile = universalify.fromPromise(_writeFile);
    function writeFileSync(file, obj2, options = {}) {
      const fs2 = options.fs || _fs;
      const str = stringify(obj2, options);
      return fs2.writeFileSync(file, str, options);
    }
    var jsonfile = {
      readFile,
      readFileSync: readFileSync2,
      writeFile,
      writeFileSync
    };
    module2.exports = jsonfile;
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile2 = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/json/jsonfile.js"(exports2, module2) {
    "use strict";
    var jsonFile = require_jsonfile();
    module2.exports = {
      // jsonfile exports
      readJson: jsonFile.readFile,
      readJsonSync: jsonFile.readFileSync,
      writeJson: jsonFile.writeFile,
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/output-file/index.js
var require_output_file = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/output-file/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs2 = require_fs();
    var path2 = require("path");
    var mkdir = require_mkdirs();
    var pathExists = require_path_exists().pathExists;
    async function outputFile(file, data, encoding = "utf-8") {
      const dir = path2.dirname(file);
      if (!await pathExists(dir)) {
        await mkdir.mkdirs(dir);
      }
      return fs2.writeFile(file, data, encoding);
    }
    function outputFileSync(file, ...args) {
      const dir = path2.dirname(file);
      if (!fs2.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      fs2.writeFileSync(file, ...args);
    }
    module2.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/json/output-json.js
var require_output_json = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/json/output-json.js"(exports2, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFile } = require_output_file();
    async function outputJson(file, data, options = {}) {
      const str = stringify(data, options);
      await outputFile(file, str, options);
    }
    module2.exports = outputJson;
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/json/output-json-sync.js"(exports2, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFileSync } = require_output_file();
    function outputJsonSync(file, data, options) {
      const str = stringify(data, options);
      outputFileSync(file, str, options);
    }
    module2.exports = outputJsonSync;
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/json/index.js
var require_json = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/json/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var jsonFile = require_jsonfile2();
    jsonFile.outputJson = u(require_output_json());
    jsonFile.outputJsonSync = require_output_json_sync();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module2.exports = jsonFile;
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/move/move.js
var require_move = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/move/move.js"(exports2, module2) {
    "use strict";
    var fs2 = require_fs();
    var path2 = require("path");
    var { copy } = require_copy2();
    var { remove } = require_remove();
    var { mkdirp } = require_mkdirs();
    var { pathExists } = require_path_exists();
    var stat = require_stat();
    async function move(src, dest, opts = {}) {
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = await stat.checkPaths(src, dest, "move", opts);
      await stat.checkParentPaths(src, srcStat, dest, "move");
      const destParent = path2.dirname(dest);
      const parsedParentPath = path2.parse(destParent);
      if (parsedParentPath.root !== destParent) {
        await mkdirp(destParent);
      }
      return doRename(src, dest, overwrite, isChangingCase);
    }
    async function doRename(src, dest, overwrite, isChangingCase) {
      if (!isChangingCase) {
        if (overwrite) {
          await remove(dest);
        } else if (await pathExists(dest)) {
          throw new Error("dest already exists.");
        }
      }
      try {
        await fs2.rename(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV") {
          throw err;
        }
        await moveAcrossDevice(src, dest, overwrite);
      }
    }
    async function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      await copy(src, dest, opts);
      return remove(src);
    }
    module2.exports = move;
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/move/move-sync.js"(exports2, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    var path2 = require("path");
    var copySync = require_copy2().copySync;
    var removeSync = require_remove().removeSync;
    var mkdirpSync = require_mkdirs().mkdirpSync;
    var stat = require_stat();
    function moveSync(src, dest, opts) {
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "move");
      if (!isParentRoot(dest)) mkdirpSync(path2.dirname(dest));
      return doRename(src, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path2.dirname(dest);
      const parsedPath = path2.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase) {
      if (isChangingCase) return rename(src, dest, overwrite);
      if (overwrite) {
        removeSync(dest);
        return rename(src, dest, overwrite);
      }
      if (fs2.existsSync(dest)) throw new Error("dest already exists.");
      return rename(src, dest, overwrite);
    }
    function rename(src, dest, overwrite) {
      try {
        fs2.renameSync(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV") throw err;
        return moveAcrossDevice(src, dest, overwrite);
      }
    }
    function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      copySync(src, dest, opts);
      return removeSync(src);
    }
    module2.exports = moveSync;
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/move/index.js
var require_move2 = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/move/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    module2.exports = {
      move: u(require_move()),
      moveSync: require_move_sync()
    };
  }
});

// node_modules/unzipper/node_modules/fs-extra/lib/index.js
var require_lib = __commonJS({
  "node_modules/unzipper/node_modules/fs-extra/lib/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      // Export promiseified graceful-fs:
      ...require_fs(),
      // Export extra methods:
      ...require_copy2(),
      ...require_empty(),
      ...require_ensure(),
      ...require_json(),
      ...require_mkdirs(),
      ...require_move2(),
      ...require_output_file(),
      ...require_path_exists(),
      ...require_remove()
    };
  }
});

// node_modules/unzipper/lib/extract.js
var require_extract = __commonJS({
  "node_modules/unzipper/lib/extract.js"(exports2, module2) {
    "use strict";
    module2.exports = Extract2;
    var Parse = require_parse();
    var fs2 = require_lib();
    var path2 = require("path");
    var stream = require("stream");
    var duplexer2 = require_duplexer2();
    function Extract2(opts) {
      opts.path = path2.resolve(path2.normalize(opts.path));
      const parser = new Parse(opts);
      const outStream = new stream.Writable({ objectMode: true });
      outStream._write = async function(entry, encoding, cb) {
        const extractPath = path2.join(opts.path, entry.path.replace(/\\/g, "/"));
        if (extractPath.indexOf(opts.path) != 0) {
          return cb();
        }
        if (entry.type == "Directory") {
          await fs2.ensureDir(extractPath);
          return cb();
        }
        await fs2.ensureDir(path2.dirname(extractPath));
        const writer = opts.getWriter ? opts.getWriter({ path: extractPath }) : fs2.createWriteStream(extractPath);
        entry.pipe(writer).on("error", cb).on("close", cb);
      };
      const extract = duplexer2(parser, outStream);
      parser.once("crx-header", function(crxHeader) {
        extract.crxHeader = crxHeader;
      });
      parser.pipe(outStream).on("finish", function() {
        extract.emit("close");
      });
      extract.promise = function() {
        return new Promise(function(resolve, reject) {
          extract.on("close", resolve);
          extract.on("error", reject);
        });
      };
      return extract;
    }
  }
});

// node_modules/node-int64/Int64.js
var require_Int64 = __commonJS({
  "node_modules/node-int64/Int64.js"(exports2, module2) {
    "use strict";
    var VAL32 = 4294967296;
    var _HEX = [];
    for (i = 0; i < 256; i++) {
      _HEX[i] = (i > 15 ? "" : "0") + i.toString(16);
    }
    var i;
    var Int64 = module2.exports = function(a1, a2) {
      if (a1 instanceof Buffer) {
        this.buffer = a1;
        this.offset = a2 || 0;
      } else if (Object.prototype.toString.call(a1) == "[object Uint8Array]") {
        this.buffer = new Buffer(a1);
        this.offset = a2 || 0;
      } else {
        this.buffer = this.buffer || new Buffer(8);
        this.offset = 0;
        this.setValue.apply(this, arguments);
      }
    };
    Int64.MAX_INT = Math.pow(2, 53);
    Int64.MIN_INT = -Math.pow(2, 53);
    Int64.prototype = {
      constructor: Int64,
      /**
       * Do in-place 2's compliment.  See
       * http://en.wikipedia.org/wiki/Two's_complement
       */
      _2scomp: function() {
        var b = this.buffer, o = this.offset, carry = 1;
        for (var i2 = o + 7; i2 >= o; i2--) {
          var v = (b[i2] ^ 255) + carry;
          b[i2] = v & 255;
          carry = v >> 8;
        }
      },
      /**
       * Set the value. Takes any of the following arguments:
       *
       * setValue(string) - A hexidecimal string
       * setValue(number) - Number (throws if n is outside int64 range)
       * setValue(hi, lo) - Raw bits as two 32-bit values
       */
      setValue: function(hi, lo) {
        var negate = false;
        if (arguments.length == 1) {
          if (typeof hi == "number") {
            negate = hi < 0;
            hi = Math.abs(hi);
            lo = hi % VAL32;
            hi = hi / VAL32;
            if (hi > VAL32) throw new RangeError(hi + " is outside Int64 range");
            hi = hi | 0;
          } else if (typeof hi == "string") {
            hi = (hi + "").replace(/^0x/, "");
            lo = hi.substr(-8);
            hi = hi.length > 8 ? hi.substr(0, hi.length - 8) : "";
            hi = parseInt(hi, 16);
            lo = parseInt(lo, 16);
          } else {
            throw new Error(hi + " must be a Number or String");
          }
        }
        var b = this.buffer, o = this.offset;
        for (var i2 = 7; i2 >= 0; i2--) {
          b[o + i2] = lo & 255;
          lo = i2 == 4 ? hi : lo >>> 8;
        }
        if (negate) this._2scomp();
      },
      /**
       * Convert to a native JS number.
       *
       * WARNING: Do not expect this value to be accurate to integer precision for
       * large (positive or negative) numbers!
       *
       * @param allowImprecise If true, no check is performed to verify the
       * returned value is accurate to integer precision.  If false, imprecise
       * numbers (very large positive or negative numbers) will be forced to +/-
       * Infinity.
       */
      toNumber: function(allowImprecise) {
        var b = this.buffer, o = this.offset;
        var negate = b[o] & 128, x = 0, carry = 1;
        for (var i2 = 7, m = 1; i2 >= 0; i2--, m *= 256) {
          var v = b[o + i2];
          if (negate) {
            v = (v ^ 255) + carry;
            carry = v >> 8;
            v = v & 255;
          }
          x += v * m;
        }
        if (!allowImprecise && x >= Int64.MAX_INT) {
          return negate ? -Infinity : Infinity;
        }
        return negate ? -x : x;
      },
      /**
       * Convert to a JS Number. Returns +/-Infinity for values that can't be
       * represented to integer precision.
       */
      valueOf: function() {
        return this.toNumber(false);
      },
      /**
       * Return string value
       *
       * @param radix Just like Number#toString()'s radix
       */
      toString: function(radix) {
        return this.valueOf().toString(radix || 10);
      },
      /**
       * Return a string showing the buffer octets, with MSB on the left.
       *
       * @param sep separator string. default is '' (empty string)
       */
      toOctetString: function(sep) {
        var out = new Array(8);
        var b = this.buffer, o = this.offset;
        for (var i2 = 0; i2 < 8; i2++) {
          out[i2] = _HEX[b[o + i2]];
        }
        return out.join(sep || "");
      },
      /**
       * Returns the int64's 8 bytes in a buffer.
       *
       * @param {bool} [rawBuffer=false]  If no offset and this is true, return the internal buffer.  Should only be used if
       *                                  you're discarding the Int64 afterwards, as it breaks encapsulation.
       */
      toBuffer: function(rawBuffer) {
        if (rawBuffer && this.offset === 0) return this.buffer;
        var out = new Buffer(8);
        this.buffer.copy(out, 0, this.offset, this.offset + 8);
        return out;
      },
      /**
       * Copy 8 bytes of int64 into target buffer at target offset.
       *
       * @param {Buffer} targetBuffer       Buffer to copy into.
       * @param {number} [targetOffset=0]   Offset into target buffer.
       */
      copy: function(targetBuffer, targetOffset) {
        this.buffer.copy(targetBuffer, targetOffset || 0, this.offset, this.offset + 8);
      },
      /**
       * Returns a number indicating whether this comes before or after or is the
       * same as the other in sort order.
       *
       * @param {Int64} other  Other Int64 to compare.
       */
      compare: function(other) {
        if ((this.buffer[this.offset] & 128) != (other.buffer[other.offset] & 128)) {
          return other.buffer[other.offset] - this.buffer[this.offset];
        }
        for (var i2 = 0; i2 < 8; i2++) {
          if (this.buffer[this.offset + i2] !== other.buffer[other.offset + i2]) {
            return this.buffer[this.offset + i2] - other.buffer[other.offset + i2];
          }
        }
        return 0;
      },
      /**
       * Returns a boolean indicating if this integer is equal to other.
       *
       * @param {Int64} other  Other Int64 to compare.
       */
      equals: function(other) {
        return this.compare(other) === 0;
      },
      /**
       * Pretty output in console.log
       */
      inspect: function() {
        return "[Int64 value:" + this + " octets:" + this.toOctetString(" ") + "]";
      }
    };
  }
});

// node_modules/unzipper/lib/Decrypt.js
var require_Decrypt = __commonJS({
  "node_modules/unzipper/lib/Decrypt.js"(exports2, module2) {
    "use strict";
    var Int64 = require_Int64();
    var Stream = require("stream");
    if (!Stream.Writable || !Stream.Writable.prototype.destroy)
      Stream = require_readable();
    var table;
    function generateTable() {
      const poly = 3988292384;
      let c, n, k;
      table = [];
      for (n = 0; n < 256; n++) {
        c = n;
        for (k = 0; k < 8; k++) c = c & 1 ? poly ^ c >>> 1 : c = c >>> 1;
        table[n] = c >>> 0;
      }
    }
    function crc(ch, crc2) {
      if (!table) generateTable();
      if (ch.charCodeAt) ch = ch.charCodeAt(0);
      const l = crc2.readUInt32BE() >> 8 & 16777215;
      const r = table[(crc2.readUInt32BE() ^ ch >>> 0) & 255];
      return (l ^ r) >>> 0;
    }
    function multiply(a, b) {
      const ah = a >> 16 & 65535;
      const al = a & 65535;
      const bh = b >> 16 & 65535;
      const bl = b & 65535;
      const high = ah * bl + al * bh & 65535;
      return (high << 16 >>> 0) + al * bl;
    }
    function Decrypt() {
      if (!(this instanceof Decrypt)) return new Decrypt();
      this.key0 = Buffer.allocUnsafe(4);
      this.key1 = Buffer.allocUnsafe(4);
      this.key2 = Buffer.allocUnsafe(4);
      this.key0.writeUInt32BE(305419896, 0);
      this.key1.writeUInt32BE(591751049, 0);
      this.key2.writeUInt32BE(878082192, 0);
    }
    Decrypt.prototype.update = function(h) {
      this.key0.writeUInt32BE(crc(h, this.key0));
      this.key1.writeUInt32BE(
        (this.key0.readUInt32BE() & 255 & 4294967295) + this.key1.readUInt32BE() >>> 0
      );
      const x = new Int64(
        multiply(this.key1.readUInt32BE(), 134775813) + 1 & 4294967295
      );
      const b = Buffer.alloc(8);
      x.copy(b, 0);
      b.copy(this.key1, 0, 4, 8);
      this.key2.writeUInt32BE(
        crc((this.key1.readUInt32BE() >> 24 & 255) >>> 0, this.key2)
      );
    };
    Decrypt.prototype.decryptByte = function(c) {
      const k = (this.key2.readUInt32BE() | 2) >>> 0;
      c = c ^ multiply(k, k ^ 1 >>> 0) >> 8 & 255;
      this.update(c);
      return c;
    };
    Decrypt.prototype.stream = function() {
      const stream = Stream.Transform(), self2 = this;
      stream._transform = function(d, e, cb) {
        for (let i = 0; i < d.length; i++) {
          d[i] = self2.decryptByte(d[i]);
        }
        this.push(d);
        cb();
      };
      return stream;
    };
    module2.exports = Decrypt;
  }
});

// node_modules/unzipper/lib/Open/unzip.js
var require_unzip = __commonJS({
  "node_modules/unzipper/lib/Open/unzip.js"(exports2, module2) {
    "use strict";
    var Decrypt = require_Decrypt();
    var PullStream = require_PullStream();
    var Stream = require("stream");
    var zlib = require("zlib");
    var parseExtraField = require_parseExtraField();
    var parseDateTime = require_parseDateTime();
    var parseBuffer = require_parseBuffer();
    module2.exports = function unzip(source, offset, _password, directoryVars, length) {
      const file = PullStream(), entry = Stream.PassThrough();
      const req = source.stream(offset, length);
      req.pipe(file).on("error", function(e) {
        entry.emit("error", e);
      });
      entry.vars = file.pull(30).then(function(data) {
        let vars = parseBuffer.parse(data, [
          ["signature", 4],
          ["versionsNeededToExtract", 2],
          ["flags", 2],
          ["compressionMethod", 2],
          ["lastModifiedTime", 2],
          ["lastModifiedDate", 2],
          ["crc32", 4],
          ["compressedSize", 4],
          ["uncompressedSize", 4],
          ["fileNameLength", 2],
          ["extraFieldLength", 2]
        ]);
        vars.lastModifiedDateTime = parseDateTime(vars.lastModifiedDate, vars.lastModifiedTime);
        return file.pull(vars.fileNameLength).then(function(fileName) {
          vars.fileName = fileName.toString("utf8");
          return file.pull(vars.extraFieldLength);
        }).then(function(extraField) {
          let checkEncryption;
          vars.extra = parseExtraField(extraField, vars);
          if (directoryVars && directoryVars.compressedSize) vars = directoryVars;
          if (vars.flags & 1) checkEncryption = file.pull(12).then(function(header) {
            if (!_password)
              throw new Error("MISSING_PASSWORD");
            const decrypt = Decrypt();
            String(_password).split("").forEach(function(d) {
              decrypt.update(d);
            });
            for (let i = 0; i < header.length; i++)
              header[i] = decrypt.decryptByte(header[i]);
            vars.decrypt = decrypt;
            vars.compressedSize -= 12;
            const check = vars.flags & 8 ? vars.lastModifiedTime >> 8 & 255 : vars.crc32 >> 24 & 255;
            if (header[11] !== check)
              throw new Error("BAD_PASSWORD");
            return vars;
          });
          return Promise.resolve(checkEncryption).then(function() {
            entry.emit("vars", vars);
            return vars;
          });
        });
      });
      entry.vars.then(function(vars) {
        const fileSizeKnown = !(vars.flags & 8) || vars.compressedSize > 0;
        let eof;
        const inflater = vars.compressionMethod ? zlib.createInflateRaw() : Stream.PassThrough();
        if (fileSizeKnown) {
          entry.size = vars.uncompressedSize;
          eof = vars.compressedSize;
        } else {
          eof = Buffer.alloc(4);
          eof.writeUInt32LE(134695760, 0);
        }
        let stream = file.stream(eof);
        if (vars.decrypt)
          stream = stream.pipe(vars.decrypt.stream());
        stream.pipe(inflater).on("error", function(err) {
          entry.emit("error", err);
        }).pipe(entry).on("finish", function() {
          if (req.destroy)
            req.destroy();
          else if (req.abort)
            req.abort();
          else if (req.close)
            req.close();
          else if (req.push)
            req.push();
          else
            console.log("warning - unable to close stream");
        });
      }).catch(function(e) {
        entry.emit("error", e);
      });
      return entry;
    };
  }
});

// node_modules/bluebird/js/release/es5.js
var require_es5 = __commonJS({
  "node_modules/bluebird/js/release/es5.js"(exports2, module2) {
    "use strict";
    var isES5 = function() {
      "use strict";
      return this === void 0;
    }();
    if (isES5) {
      module2.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        getDescriptor: Object.getOwnPropertyDescriptor,
        keys: Object.keys,
        names: Object.getOwnPropertyNames,
        getPrototypeOf: Object.getPrototypeOf,
        isArray: Array.isArray,
        isES5,
        propertyIsWritable: function(obj2, prop) {
          var descriptor = Object.getOwnPropertyDescriptor(obj2, prop);
          return !!(!descriptor || descriptor.writable || descriptor.set);
        }
      };
    } else {
      has = {}.hasOwnProperty;
      str = {}.toString;
      proto = {}.constructor.prototype;
      ObjectKeys = function(o) {
        var ret2 = [];
        for (var key in o) {
          if (has.call(o, key)) {
            ret2.push(key);
          }
        }
        return ret2;
      };
      ObjectGetDescriptor = function(o, key) {
        return { value: o[key] };
      };
      ObjectDefineProperty = function(o, key, desc) {
        o[key] = desc.value;
        return o;
      };
      ObjectFreeze = function(obj2) {
        return obj2;
      };
      ObjectGetPrototypeOf = function(obj2) {
        try {
          return Object(obj2).constructor.prototype;
        } catch (e) {
          return proto;
        }
      };
      ArrayIsArray = function(obj2) {
        try {
          return str.call(obj2) === "[object Array]";
        } catch (e) {
          return false;
        }
      };
      module2.exports = {
        isArray: ArrayIsArray,
        keys: ObjectKeys,
        names: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        getDescriptor: ObjectGetDescriptor,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5,
        propertyIsWritable: function() {
          return true;
        }
      };
    }
    var has;
    var str;
    var proto;
    var ObjectKeys;
    var ObjectGetDescriptor;
    var ObjectDefineProperty;
    var ObjectFreeze;
    var ObjectGetPrototypeOf;
    var ArrayIsArray;
  }
});

// node_modules/bluebird/js/release/util.js
var require_util2 = __commonJS({
  "node_modules/bluebird/js/release/util.js"(exports, module) {
    "use strict";
    var es5 = require_es5();
    var canEvaluate = typeof navigator == "undefined";
    var errorObj = { e: {} };
    var tryCatchTarget;
    var globalObject = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : exports !== void 0 ? exports : null;
    function tryCatcher() {
      try {
        var target = tryCatchTarget;
        tryCatchTarget = null;
        return target.apply(this, arguments);
      } catch (e) {
        errorObj.e = e;
        return errorObj;
      }
    }
    function tryCatch(fn) {
      tryCatchTarget = fn;
      return tryCatcher;
    }
    var inherits = function(Child, Parent) {
      var hasProp = {}.hasOwnProperty;
      function T() {
        this.constructor = Child;
        this.constructor$ = Parent;
        for (var propertyName in Parent.prototype) {
          if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length - 1) !== "$") {
            this[propertyName + "$"] = Parent.prototype[propertyName];
          }
        }
      }
      T.prototype = Parent.prototype;
      Child.prototype = new T();
      return Child.prototype;
    };
    function isPrimitive(val) {
      return val == null || val === true || val === false || typeof val === "string" || typeof val === "number";
    }
    function isObject(value) {
      return typeof value === "function" || typeof value === "object" && value !== null;
    }
    function maybeWrapAsError(maybeError) {
      if (!isPrimitive(maybeError)) return maybeError;
      return new Error(safeToString(maybeError));
    }
    function withAppended(target, appendee) {
      var len = target.length;
      var ret2 = new Array(len + 1);
      var i;
      for (i = 0; i < len; ++i) {
        ret2[i] = target[i];
      }
      ret2[i] = appendee;
      return ret2;
    }
    function getDataPropertyOrDefault(obj2, key, defaultValue) {
      if (es5.isES5) {
        var desc = Object.getOwnPropertyDescriptor(obj2, key);
        if (desc != null) {
          return desc.get == null && desc.set == null ? desc.value : defaultValue;
        }
      } else {
        return {}.hasOwnProperty.call(obj2, key) ? obj2[key] : void 0;
      }
    }
    function notEnumerableProp(obj2, name, value) {
      if (isPrimitive(obj2)) return obj2;
      var descriptor = {
        value,
        configurable: true,
        enumerable: false,
        writable: true
      };
      es5.defineProperty(obj2, name, descriptor);
      return obj2;
    }
    function thrower(r) {
      throw r;
    }
    var inheritedDataKeys = function() {
      var excludedPrototypes = [
        Array.prototype,
        Object.prototype,
        Function.prototype
      ];
      var isExcludedProto = function(val) {
        for (var i = 0; i < excludedPrototypes.length; ++i) {
          if (excludedPrototypes[i] === val) {
            return true;
          }
        }
        return false;
      };
      if (es5.isES5) {
        var getKeys = Object.getOwnPropertyNames;
        return function(obj2) {
          var ret2 = [];
          var visitedKeys = /* @__PURE__ */ Object.create(null);
          while (obj2 != null && !isExcludedProto(obj2)) {
            var keys;
            try {
              keys = getKeys(obj2);
            } catch (e) {
              return ret2;
            }
            for (var i = 0; i < keys.length; ++i) {
              var key = keys[i];
              if (visitedKeys[key]) continue;
              visitedKeys[key] = true;
              var desc = Object.getOwnPropertyDescriptor(obj2, key);
              if (desc != null && desc.get == null && desc.set == null) {
                ret2.push(key);
              }
            }
            obj2 = es5.getPrototypeOf(obj2);
          }
          return ret2;
        };
      } else {
        var hasProp = {}.hasOwnProperty;
        return function(obj2) {
          if (isExcludedProto(obj2)) return [];
          var ret2 = [];
          enumeration: for (var key in obj2) {
            if (hasProp.call(obj2, key)) {
              ret2.push(key);
            } else {
              for (var i = 0; i < excludedPrototypes.length; ++i) {
                if (hasProp.call(excludedPrototypes[i], key)) {
                  continue enumeration;
                }
              }
              ret2.push(key);
            }
          }
          return ret2;
        };
      }
    }();
    var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
    function isClass(fn) {
      try {
        if (typeof fn === "function") {
          var keys = es5.names(fn.prototype);
          var hasMethods = es5.isES5 && keys.length > 1;
          var hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === "constructor");
          var hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;
          if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) {
            return true;
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    }
    function toFastProperties(obj) {
      function FakeConstructor() {
      }
      FakeConstructor.prototype = obj;
      var receiver = new FakeConstructor();
      function ic() {
        return typeof receiver.foo;
      }
      ic();
      ic();
      return obj;
      eval(obj);
    }
    var rident = /^[a-z$_][a-z$_0-9]*$/i;
    function isIdentifier(str) {
      return rident.test(str);
    }
    function filledRange(count, prefix, suffix) {
      var ret2 = new Array(count);
      for (var i = 0; i < count; ++i) {
        ret2[i] = prefix + i + suffix;
      }
      return ret2;
    }
    function safeToString(obj2) {
      try {
        return obj2 + "";
      } catch (e) {
        return "[no string representation]";
      }
    }
    function isError(obj2) {
      return obj2 instanceof Error || obj2 !== null && typeof obj2 === "object" && typeof obj2.message === "string" && typeof obj2.name === "string";
    }
    function markAsOriginatingFromRejection(e) {
      try {
        notEnumerableProp(e, "isOperational", true);
      } catch (ignore) {
      }
    }
    function originatesFromRejection(e) {
      if (e == null) return false;
      return e instanceof Error["__BluebirdErrorTypes__"].OperationalError || e["isOperational"] === true;
    }
    function canAttachTrace(obj2) {
      return isError(obj2) && es5.propertyIsWritable(obj2, "stack");
    }
    var ensureErrorObject = function() {
      if (!("stack" in new Error())) {
        return function(value) {
          if (canAttachTrace(value)) return value;
          try {
            throw new Error(safeToString(value));
          } catch (err) {
            return err;
          }
        };
      } else {
        return function(value) {
          if (canAttachTrace(value)) return value;
          return new Error(safeToString(value));
        };
      }
    }();
    function classString(obj2) {
      return {}.toString.call(obj2);
    }
    function copyDescriptors(from, to, filter) {
      var keys = es5.names(from);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (filter(key)) {
          try {
            es5.defineProperty(to, key, es5.getDescriptor(from, key));
          } catch (ignore) {
          }
        }
      }
    }
    var asArray = function(v) {
      if (es5.isArray(v)) {
        return v;
      }
      return null;
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
      ArrayFrom = typeof Array.from === "function" ? function(v) {
        return Array.from(v);
      } : function(v) {
        var ret2 = [];
        var it = v[Symbol.iterator]();
        var itResult;
        while (!(itResult = it.next()).done) {
          ret2.push(itResult.value);
        }
        return ret2;
      };
      asArray = function(v) {
        if (es5.isArray(v)) {
          return v;
        } else if (v != null && typeof v[Symbol.iterator] === "function") {
          return ArrayFrom(v);
        }
        return null;
      };
    }
    var ArrayFrom;
    var isNode = typeof process !== "undefined" && classString(process).toLowerCase() === "[object process]";
    var hasEnvVariables = typeof process !== "undefined" && typeof process.env !== "undefined";
    function env(key) {
      return hasEnvVariables ? process.env[key] : void 0;
    }
    function getNativePromise() {
      if (typeof Promise === "function") {
        try {
          var promise = new Promise(function() {
          });
          if (classString(promise) === "[object Promise]") {
            return Promise;
          }
        } catch (e) {
        }
      }
    }
    var reflectHandler;
    function contextBind(ctx, cb) {
      if (ctx === null || typeof cb !== "function" || cb === reflectHandler) {
        return cb;
      }
      if (ctx.domain !== null) {
        cb = ctx.domain.bind(cb);
      }
      var async = ctx.async;
      if (async !== null) {
        var old = cb;
        cb = function() {
          var $_len = arguments.length + 2;
          var args = new Array($_len);
          for (var $_i = 2; $_i < $_len; ++$_i) {
            args[$_i] = arguments[$_i - 2];
          }
          ;
          args[0] = old;
          args[1] = this;
          return async.runInAsyncScope.apply(async, args);
        };
      }
      return cb;
    }
    var ret = {
      setReflectHandler: function(fn) {
        reflectHandler = fn;
      },
      isClass,
      isIdentifier,
      inheritedDataKeys,
      getDataPropertyOrDefault,
      thrower,
      isArray: es5.isArray,
      asArray,
      notEnumerableProp,
      isPrimitive,
      isObject,
      isError,
      canEvaluate,
      errorObj,
      tryCatch,
      inherits,
      withAppended,
      maybeWrapAsError,
      toFastProperties,
      filledRange,
      toString: safeToString,
      canAttachTrace,
      ensureErrorObject,
      originatesFromRejection,
      markAsOriginatingFromRejection,
      classString,
      copyDescriptors,
      isNode,
      hasEnvVariables,
      env,
      global: globalObject,
      getNativePromise,
      contextBind
    };
    ret.isRecentNode = ret.isNode && function() {
      var version;
      if (process.versions && process.versions.node) {
        version = process.versions.node.split(".").map(Number);
      } else if (process.version) {
        version = process.version.split(".").map(Number);
      }
      return version[0] === 0 && version[1] > 10 || version[0] > 0;
    }();
    ret.nodeSupportsAsyncResource = ret.isNode && function() {
      var supportsAsync = false;
      try {
        var res = require("async_hooks").AsyncResource;
        supportsAsync = typeof res.prototype.runInAsyncScope === "function";
      } catch (e) {
        supportsAsync = false;
      }
      return supportsAsync;
    }();
    if (ret.isNode) ret.toFastProperties(process);
    try {
      throw new Error();
    } catch (e) {
      ret.lastLineError = e;
    }
    module.exports = ret;
  }
});

// node_modules/bluebird/js/release/schedule.js
var require_schedule = __commonJS({
  "node_modules/bluebird/js/release/schedule.js"(exports2, module2) {
    "use strict";
    var util = require_util2();
    var schedule;
    var noAsyncScheduler = function() {
      throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
    };
    var NativePromise = util.getNativePromise();
    if (util.isNode && typeof MutationObserver === "undefined") {
      GlobalSetImmediate = global.setImmediate;
      ProcessNextTick = process.nextTick;
      schedule = util.isRecentNode ? function(fn) {
        GlobalSetImmediate.call(global, fn);
      } : function(fn) {
        ProcessNextTick.call(process, fn);
      };
    } else if (typeof NativePromise === "function" && typeof NativePromise.resolve === "function") {
      nativePromise = NativePromise.resolve();
      schedule = function(fn) {
        nativePromise.then(fn);
      };
    } else if (typeof MutationObserver !== "undefined" && !(typeof window !== "undefined" && window.navigator && (window.navigator.standalone || window.cordova)) && "classList" in document.documentElement) {
      schedule = function() {
        var div = document.createElement("div");
        var opts = { attributes: true };
        var toggleScheduled = false;
        var div2 = document.createElement("div");
        var o2 = new MutationObserver(function() {
          div.classList.toggle("foo");
          toggleScheduled = false;
        });
        o2.observe(div2, opts);
        var scheduleToggle = function() {
          if (toggleScheduled) return;
          toggleScheduled = true;
          div2.classList.toggle("foo");
        };
        return function schedule2(fn) {
          var o = new MutationObserver(function() {
            o.disconnect();
            fn();
          });
          o.observe(div, opts);
          scheduleToggle();
        };
      }();
    } else if (typeof setImmediate !== "undefined") {
      schedule = function(fn) {
        setImmediate(fn);
      };
    } else if (typeof setTimeout !== "undefined") {
      schedule = function(fn) {
        setTimeout(fn, 0);
      };
    } else {
      schedule = noAsyncScheduler;
    }
    var GlobalSetImmediate;
    var ProcessNextTick;
    var nativePromise;
    module2.exports = schedule;
  }
});

// node_modules/bluebird/js/release/queue.js
var require_queue = __commonJS({
  "node_modules/bluebird/js/release/queue.js"(exports2, module2) {
    "use strict";
    function arrayMove(src, srcIndex, dst, dstIndex, len) {
      for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
      }
    }
    function Queue(capacity) {
      this._capacity = capacity;
      this._length = 0;
      this._front = 0;
    }
    Queue.prototype._willBeOverCapacity = function(size) {
      return this._capacity < size;
    };
    Queue.prototype._pushOne = function(arg) {
      var length = this.length();
      this._checkCapacity(length + 1);
      var i = this._front + length & this._capacity - 1;
      this[i] = arg;
      this._length = length + 1;
    };
    Queue.prototype.push = function(fn, receiver2, arg) {
      var length = this.length() + 3;
      if (this._willBeOverCapacity(length)) {
        this._pushOne(fn);
        this._pushOne(receiver2);
        this._pushOne(arg);
        return;
      }
      var j = this._front + length - 3;
      this._checkCapacity(length);
      var wrapMask = this._capacity - 1;
      this[j + 0 & wrapMask] = fn;
      this[j + 1 & wrapMask] = receiver2;
      this[j + 2 & wrapMask] = arg;
      this._length = length;
    };
    Queue.prototype.shift = function() {
      var front = this._front, ret2 = this[front];
      this[front] = void 0;
      this._front = front + 1 & this._capacity - 1;
      this._length--;
      return ret2;
    };
    Queue.prototype.length = function() {
      return this._length;
    };
    Queue.prototype._checkCapacity = function(size) {
      if (this._capacity < size) {
        this._resizeTo(this._capacity << 1);
      }
    };
    Queue.prototype._resizeTo = function(capacity) {
      var oldCapacity = this._capacity;
      this._capacity = capacity;
      var front = this._front;
      var length = this._length;
      var moveItemsCount = front + length & oldCapacity - 1;
      arrayMove(this, 0, this, oldCapacity, moveItemsCount);
    };
    module2.exports = Queue;
  }
});

// node_modules/bluebird/js/release/async.js
var require_async = __commonJS({
  "node_modules/bluebird/js/release/async.js"(exports2, module2) {
    "use strict";
    var firstLineError;
    try {
      throw new Error();
    } catch (e) {
      firstLineError = e;
    }
    var schedule = require_schedule();
    var Queue = require_queue();
    function Async() {
      this._customScheduler = false;
      this._isTickUsed = false;
      this._lateQueue = new Queue(16);
      this._normalQueue = new Queue(16);
      this._haveDrainedQueues = false;
      var self2 = this;
      this.drainQueues = function() {
        self2._drainQueues();
      };
      this._schedule = schedule;
    }
    Async.prototype.setScheduler = function(fn) {
      var prev = this._schedule;
      this._schedule = fn;
      this._customScheduler = true;
      return prev;
    };
    Async.prototype.hasCustomScheduler = function() {
      return this._customScheduler;
    };
    Async.prototype.haveItemsQueued = function() {
      return this._isTickUsed || this._haveDrainedQueues;
    };
    Async.prototype.fatalError = function(e, isNode2) {
      if (isNode2) {
        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
        process.exit(2);
      } else {
        this.throwLater(e);
      }
    };
    Async.prototype.throwLater = function(fn, arg) {
      if (arguments.length === 1) {
        arg = fn;
        fn = function() {
          throw arg;
        };
      }
      if (typeof setTimeout !== "undefined") {
        setTimeout(function() {
          fn(arg);
        }, 0);
      } else try {
        this._schedule(function() {
          fn(arg);
        });
      } catch (e) {
        throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
      }
    };
    function AsyncInvokeLater(fn, receiver2, arg) {
      this._lateQueue.push(fn, receiver2, arg);
      this._queueTick();
    }
    function AsyncInvoke(fn, receiver2, arg) {
      this._normalQueue.push(fn, receiver2, arg);
      this._queueTick();
    }
    function AsyncSettlePromises(promise) {
      this._normalQueue._pushOne(promise);
      this._queueTick();
    }
    Async.prototype.invokeLater = AsyncInvokeLater;
    Async.prototype.invoke = AsyncInvoke;
    Async.prototype.settlePromises = AsyncSettlePromises;
    function _drainQueue(queue) {
      while (queue.length() > 0) {
        _drainQueueStep(queue);
      }
    }
    function _drainQueueStep(queue) {
      var fn = queue.shift();
      if (typeof fn !== "function") {
        fn._settlePromises();
      } else {
        var receiver2 = queue.shift();
        var arg = queue.shift();
        fn.call(receiver2, arg);
      }
    }
    Async.prototype._drainQueues = function() {
      _drainQueue(this._normalQueue);
      this._reset();
      this._haveDrainedQueues = true;
      _drainQueue(this._lateQueue);
    };
    Async.prototype._queueTick = function() {
      if (!this._isTickUsed) {
        this._isTickUsed = true;
        this._schedule(this.drainQueues);
      }
    };
    Async.prototype._reset = function() {
      this._isTickUsed = false;
    };
    module2.exports = Async;
    module2.exports.firstLineError = firstLineError;
  }
});

// node_modules/bluebird/js/release/errors.js
var require_errors = __commonJS({
  "node_modules/bluebird/js/release/errors.js"(exports2, module2) {
    "use strict";
    var es52 = require_es5();
    var Objectfreeze = es52.freeze;
    var util = require_util2();
    var inherits2 = util.inherits;
    var notEnumerableProp2 = util.notEnumerableProp;
    function subError(nameProperty, defaultMessage) {
      function SubError(message) {
        if (!(this instanceof SubError)) return new SubError(message);
        notEnumerableProp2(
          this,
          "message",
          typeof message === "string" ? message : defaultMessage
        );
        notEnumerableProp2(this, "name", nameProperty);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        } else {
          Error.call(this);
        }
      }
      inherits2(SubError, Error);
      return SubError;
    }
    var _TypeError;
    var _RangeError;
    var Warning = subError("Warning", "warning");
    var CancellationError = subError("CancellationError", "cancellation error");
    var TimeoutError = subError("TimeoutError", "timeout error");
    var AggregateError = subError("AggregateError", "aggregate error");
    try {
      _TypeError = TypeError;
      _RangeError = RangeError;
    } catch (e) {
      _TypeError = subError("TypeError", "type error");
      _RangeError = subError("RangeError", "range error");
    }
    var methods = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" ");
    for (i = 0; i < methods.length; ++i) {
      if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
      }
    }
    var i;
    es52.defineProperty(AggregateError.prototype, "length", {
      value: 0,
      configurable: false,
      writable: true,
      enumerable: true
    });
    AggregateError.prototype["isOperational"] = true;
    var level = 0;
    AggregateError.prototype.toString = function() {
      var indent = Array(level * 4 + 1).join(" ");
      var ret2 = "\n" + indent + "AggregateError of:\n";
      level++;
      indent = Array(level * 4 + 1).join(" ");
      for (var i2 = 0; i2 < this.length; ++i2) {
        var str = this[i2] === this ? "[Circular AggregateError]" : this[i2] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
          lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret2 += str + "\n";
      }
      level--;
      return ret2;
    };
    function OperationalError(message) {
      if (!(this instanceof OperationalError))
        return new OperationalError(message);
      notEnumerableProp2(this, "name", "OperationalError");
      notEnumerableProp2(this, "message", message);
      this.cause = message;
      this["isOperational"] = true;
      if (message instanceof Error) {
        notEnumerableProp2(this, "message", message.message);
        notEnumerableProp2(this, "stack", message.stack);
      } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
    inherits2(OperationalError, Error);
    var errorTypes = Error["__BluebirdErrorTypes__"];
    if (!errorTypes) {
      errorTypes = Objectfreeze({
        CancellationError,
        TimeoutError,
        OperationalError,
        RejectionError: OperationalError,
        AggregateError
      });
      es52.defineProperty(Error, "__BluebirdErrorTypes__", {
        value: errorTypes,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
    module2.exports = {
      Error,
      TypeError: _TypeError,
      RangeError: _RangeError,
      CancellationError: errorTypes.CancellationError,
      OperationalError: errorTypes.OperationalError,
      TimeoutError: errorTypes.TimeoutError,
      AggregateError: errorTypes.AggregateError,
      Warning
    };
  }
});

// node_modules/bluebird/js/release/thenables.js
var require_thenables = __commonJS({
  "node_modules/bluebird/js/release/thenables.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var util = require_util2();
      var errorObj2 = util.errorObj;
      var isObject2 = util.isObject;
      function tryConvertToPromise(obj2, context) {
        if (isObject2(obj2)) {
          if (obj2 instanceof Promise2) return obj2;
          var then = getThen(obj2);
          if (then === errorObj2) {
            if (context) context._pushContext();
            var ret2 = Promise2.reject(then.e);
            if (context) context._popContext();
            return ret2;
          } else if (typeof then === "function") {
            if (isAnyBluebirdPromise(obj2)) {
              var ret2 = new Promise2(INTERNAL);
              obj2._then(
                ret2._fulfill,
                ret2._reject,
                void 0,
                ret2,
                null
              );
              return ret2;
            }
            return doThenable(obj2, then, context);
          }
        }
        return obj2;
      }
      function doGetThen(obj2) {
        return obj2.then;
      }
      function getThen(obj2) {
        try {
          return doGetThen(obj2);
        } catch (e) {
          errorObj2.e = e;
          return errorObj2;
        }
      }
      var hasProp = {}.hasOwnProperty;
      function isAnyBluebirdPromise(obj2) {
        try {
          return hasProp.call(obj2, "_promise0");
        } catch (e) {
          return false;
        }
      }
      function doThenable(x, then, context) {
        var promise = new Promise2(INTERNAL);
        var ret2 = promise;
        if (context) context._pushContext();
        promise._captureStackTrace();
        if (context) context._popContext();
        var synchronous = true;
        var result = util.tryCatch(then).call(x, resolve, reject);
        synchronous = false;
        if (promise && result === errorObj2) {
          promise._rejectCallback(result.e, true, true);
          promise = null;
        }
        function resolve(value) {
          if (!promise) return;
          promise._resolveCallback(value);
          promise = null;
        }
        function reject(reason) {
          if (!promise) return;
          promise._rejectCallback(reason, synchronous, true);
          promise = null;
        }
        return ret2;
      }
      return tryConvertToPromise;
    };
  }
});

// node_modules/bluebird/js/release/promise_array.js
var require_promise_array = __commonJS({
  "node_modules/bluebird/js/release/promise_array.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
      var util = require_util2();
      var isArray = util.isArray;
      function toResolutionValue(val) {
        switch (val) {
          case -2:
            return [];
          case -3:
            return {};
          case -6:
            return /* @__PURE__ */ new Map();
        }
      }
      function PromiseArray(values) {
        var promise = this._promise = new Promise2(INTERNAL);
        if (values instanceof Promise2) {
          promise._propagateFrom(values, 3);
          values.suppressUnhandledRejections();
        }
        promise._setOnCancel(this);
        this._values = values;
        this._length = 0;
        this._totalResolved = 0;
        this._init(void 0, -2);
      }
      util.inherits(PromiseArray, Proxyable);
      PromiseArray.prototype.length = function() {
        return this._length;
      };
      PromiseArray.prototype.promise = function() {
        return this._promise;
      };
      PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
        var values = tryConvertToPromise(this._values, this._promise);
        if (values instanceof Promise2) {
          values = values._target();
          var bitField = values._bitField;
          ;
          this._values = values;
          if ((bitField & 50397184) === 0) {
            this._promise._setAsyncGuaranteed();
            return values._then(
              init,
              this._reject,
              void 0,
              this,
              resolveValueIfEmpty
            );
          } else if ((bitField & 33554432) !== 0) {
            values = values._value();
          } else if ((bitField & 16777216) !== 0) {
            return this._reject(values._reason());
          } else {
            return this._cancel();
          }
        }
        values = util.asArray(values);
        if (values === null) {
          var err = apiRejection(
            "expecting an array or an iterable object but got " + util.classString(values)
          ).reason();
          this._promise._rejectCallback(err, false);
          return;
        }
        if (values.length === 0) {
          if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
          } else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
          }
          return;
        }
        this._iterate(values);
      };
      PromiseArray.prototype._iterate = function(values) {
        var len = this.getActualLength(values.length);
        this._length = len;
        this._values = this.shouldCopyValues() ? new Array(len) : this._values;
        var result = this._promise;
        var isResolved = false;
        var bitField = null;
        for (var i = 0; i < len; ++i) {
          var maybePromise = tryConvertToPromise(values[i], result);
          if (maybePromise instanceof Promise2) {
            maybePromise = maybePromise._target();
            bitField = maybePromise._bitField;
          } else {
            bitField = null;
          }
          if (isResolved) {
            if (bitField !== null) {
              maybePromise.suppressUnhandledRejections();
            }
          } else if (bitField !== null) {
            if ((bitField & 50397184) === 0) {
              maybePromise._proxy(this, i);
              this._values[i] = maybePromise;
            } else if ((bitField & 33554432) !== 0) {
              isResolved = this._promiseFulfilled(maybePromise._value(), i);
            } else if ((bitField & 16777216) !== 0) {
              isResolved = this._promiseRejected(maybePromise._reason(), i);
            } else {
              isResolved = this._promiseCancelled(i);
            }
          } else {
            isResolved = this._promiseFulfilled(maybePromise, i);
          }
        }
        if (!isResolved) result._setAsyncGuaranteed();
      };
      PromiseArray.prototype._isResolved = function() {
        return this._values === null;
      };
      PromiseArray.prototype._resolve = function(value) {
        this._values = null;
        this._promise._fulfill(value);
      };
      PromiseArray.prototype._cancel = function() {
        if (this._isResolved() || !this._promise._isCancellable()) return;
        this._values = null;
        this._promise._cancel();
      };
      PromiseArray.prototype._reject = function(reason) {
        this._values = null;
        this._promise._rejectCallback(reason, false);
      };
      PromiseArray.prototype._promiseFulfilled = function(value, index) {
        this._values[index] = value;
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= this._length) {
          this._resolve(this._values);
          return true;
        }
        return false;
      };
      PromiseArray.prototype._promiseCancelled = function() {
        this._cancel();
        return true;
      };
      PromiseArray.prototype._promiseRejected = function(reason) {
        this._totalResolved++;
        this._reject(reason);
        return true;
      };
      PromiseArray.prototype._resultCancelled = function() {
        if (this._isResolved()) return;
        var values = this._values;
        this._cancel();
        if (values instanceof Promise2) {
          values.cancel();
        } else {
          for (var i = 0; i < values.length; ++i) {
            if (values[i] instanceof Promise2) {
              values[i].cancel();
            }
          }
        }
      };
      PromiseArray.prototype.shouldCopyValues = function() {
        return true;
      };
      PromiseArray.prototype.getActualLength = function(len) {
        return len;
      };
      return PromiseArray;
    };
  }
});

// node_modules/bluebird/js/release/context.js
var require_context = __commonJS({
  "node_modules/bluebird/js/release/context.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      var longStackTraces = false;
      var contextStack = [];
      Promise2.prototype._promiseCreated = function() {
      };
      Promise2.prototype._pushContext = function() {
      };
      Promise2.prototype._popContext = function() {
        return null;
      };
      Promise2._peekContext = Promise2.prototype._peekContext = function() {
      };
      function Context() {
        this._trace = new Context.CapturedTrace(peekContext());
      }
      Context.prototype._pushContext = function() {
        if (this._trace !== void 0) {
          this._trace._promiseCreated = null;
          contextStack.push(this._trace);
        }
      };
      Context.prototype._popContext = function() {
        if (this._trace !== void 0) {
          var trace = contextStack.pop();
          var ret2 = trace._promiseCreated;
          trace._promiseCreated = null;
          return ret2;
        }
        return null;
      };
      function createContext() {
        if (longStackTraces) return new Context();
      }
      function peekContext() {
        var lastIndex = contextStack.length - 1;
        if (lastIndex >= 0) {
          return contextStack[lastIndex];
        }
        return void 0;
      }
      Context.CapturedTrace = null;
      Context.create = createContext;
      Context.deactivateLongStackTraces = function() {
      };
      Context.activateLongStackTraces = function() {
        var Promise_pushContext = Promise2.prototype._pushContext;
        var Promise_popContext = Promise2.prototype._popContext;
        var Promise_PeekContext = Promise2._peekContext;
        var Promise_peekContext = Promise2.prototype._peekContext;
        var Promise_promiseCreated = Promise2.prototype._promiseCreated;
        Context.deactivateLongStackTraces = function() {
          Promise2.prototype._pushContext = Promise_pushContext;
          Promise2.prototype._popContext = Promise_popContext;
          Promise2._peekContext = Promise_PeekContext;
          Promise2.prototype._peekContext = Promise_peekContext;
          Promise2.prototype._promiseCreated = Promise_promiseCreated;
          longStackTraces = false;
        };
        longStackTraces = true;
        Promise2.prototype._pushContext = Context.prototype._pushContext;
        Promise2.prototype._popContext = Context.prototype._popContext;
        Promise2._peekContext = Promise2.prototype._peekContext = peekContext;
        Promise2.prototype._promiseCreated = function() {
          var ctx = this._peekContext();
          if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
        };
      };
      return Context;
    };
  }
});

// node_modules/bluebird/js/release/debuggability.js
var require_debuggability = __commonJS({
  "node_modules/bluebird/js/release/debuggability.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, Context, enableAsyncHooks, disableAsyncHooks) {
      var async = Promise2._async;
      var Warning = require_errors().Warning;
      var util = require_util2();
      var es52 = require_es5();
      var canAttachTrace2 = util.canAttachTrace;
      var unhandledRejectionHandled;
      var possiblyUnhandledRejection;
      var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
      var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
      var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
      var stackFramePattern = null;
      var formatStack = null;
      var indentStackFrames = false;
      var printWarning;
      var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 && (util.env("BLUEBIRD_DEBUG") || util.env("NODE_ENV") === "development"));
      var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 && (debugging || util.env("BLUEBIRD_WARNINGS")));
      var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 && (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));
      var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
      var deferUnhandledRejectionCheck;
      (function() {
        var promises = [];
        function unhandledRejectionCheck() {
          for (var i = 0; i < promises.length; ++i) {
            promises[i]._notifyUnhandledRejection();
          }
          unhandledRejectionClear();
        }
        function unhandledRejectionClear() {
          promises.length = 0;
        }
        deferUnhandledRejectionCheck = function(promise) {
          promises.push(promise);
          setTimeout(unhandledRejectionCheck, 1);
        };
        es52.defineProperty(Promise2, "_unhandledRejectionCheck", {
          value: unhandledRejectionCheck
        });
        es52.defineProperty(Promise2, "_unhandledRejectionClear", {
          value: unhandledRejectionClear
        });
      })();
      Promise2.prototype.suppressUnhandledRejections = function() {
        var target = this._target();
        target._bitField = target._bitField & ~1048576 | 524288;
      };
      Promise2.prototype._ensurePossibleRejectionHandled = function() {
        if ((this._bitField & 524288) !== 0) return;
        this._setRejectionIsUnhandled();
        deferUnhandledRejectionCheck(this);
      };
      Promise2.prototype._notifyUnhandledRejectionIsHandled = function() {
        fireRejectionEvent(
          "rejectionHandled",
          unhandledRejectionHandled,
          void 0,
          this
        );
      };
      Promise2.prototype._setReturnedNonUndefined = function() {
        this._bitField = this._bitField | 268435456;
      };
      Promise2.prototype._returnedNonUndefined = function() {
        return (this._bitField & 268435456) !== 0;
      };
      Promise2.prototype._notifyUnhandledRejection = function() {
        if (this._isRejectionUnhandled()) {
          var reason = this._settledValue();
          this._setUnhandledRejectionIsNotified();
          fireRejectionEvent(
            "unhandledRejection",
            possiblyUnhandledRejection,
            reason,
            this
          );
        }
      };
      Promise2.prototype._setUnhandledRejectionIsNotified = function() {
        this._bitField = this._bitField | 262144;
      };
      Promise2.prototype._unsetUnhandledRejectionIsNotified = function() {
        this._bitField = this._bitField & ~262144;
      };
      Promise2.prototype._isUnhandledRejectionNotified = function() {
        return (this._bitField & 262144) > 0;
      };
      Promise2.prototype._setRejectionIsUnhandled = function() {
        this._bitField = this._bitField | 1048576;
      };
      Promise2.prototype._unsetRejectionIsUnhandled = function() {
        this._bitField = this._bitField & ~1048576;
        if (this._isUnhandledRejectionNotified()) {
          this._unsetUnhandledRejectionIsNotified();
          this._notifyUnhandledRejectionIsHandled();
        }
      };
      Promise2.prototype._isRejectionUnhandled = function() {
        return (this._bitField & 1048576) > 0;
      };
      Promise2.prototype._warn = function(message, shouldUseOwnTrace, promise) {
        return warn(message, shouldUseOwnTrace, promise || this);
      };
      Promise2.onPossiblyUnhandledRejection = function(fn) {
        var context = Promise2._getContext();
        possiblyUnhandledRejection = util.contextBind(context, fn);
      };
      Promise2.onUnhandledRejectionHandled = function(fn) {
        var context = Promise2._getContext();
        unhandledRejectionHandled = util.contextBind(context, fn);
      };
      var disableLongStackTraces = function() {
      };
      Promise2.longStackTraces = function() {
        if (async.haveItemsQueued() && !config.longStackTraces) {
          throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
        }
        if (!config.longStackTraces && longStackTracesIsSupported()) {
          var Promise_captureStackTrace = Promise2.prototype._captureStackTrace;
          var Promise_attachExtraTrace = Promise2.prototype._attachExtraTrace;
          var Promise_dereferenceTrace = Promise2.prototype._dereferenceTrace;
          config.longStackTraces = true;
          disableLongStackTraces = function() {
            if (async.haveItemsQueued() && !config.longStackTraces) {
              throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
            }
            Promise2.prototype._captureStackTrace = Promise_captureStackTrace;
            Promise2.prototype._attachExtraTrace = Promise_attachExtraTrace;
            Promise2.prototype._dereferenceTrace = Promise_dereferenceTrace;
            Context.deactivateLongStackTraces();
            config.longStackTraces = false;
          };
          Promise2.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
          Promise2.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
          Promise2.prototype._dereferenceTrace = longStackTracesDereferenceTrace;
          Context.activateLongStackTraces();
        }
      };
      Promise2.hasLongStackTraces = function() {
        return config.longStackTraces && longStackTracesIsSupported();
      };
      var legacyHandlers = {
        unhandledrejection: {
          before: function() {
            var ret2 = util.global.onunhandledrejection;
            util.global.onunhandledrejection = null;
            return ret2;
          },
          after: function(fn) {
            util.global.onunhandledrejection = fn;
          }
        },
        rejectionhandled: {
          before: function() {
            var ret2 = util.global.onrejectionhandled;
            util.global.onrejectionhandled = null;
            return ret2;
          },
          after: function(fn) {
            util.global.onrejectionhandled = fn;
          }
        }
      };
      var fireDomEvent = function() {
        var dispatch = function(legacy, e) {
          if (legacy) {
            var fn;
            try {
              fn = legacy.before();
              return !util.global.dispatchEvent(e);
            } finally {
              legacy.after(fn);
            }
          } else {
            return !util.global.dispatchEvent(e);
          }
        };
        try {
          if (typeof CustomEvent === "function") {
            var event = new CustomEvent("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event2) {
              name = name.toLowerCase();
              var eventData = {
                detail: event2,
                cancelable: true
              };
              var domEvent = new CustomEvent(name, eventData);
              es52.defineProperty(
                domEvent,
                "promise",
                { value: event2.promise }
              );
              es52.defineProperty(
                domEvent,
                "reason",
                { value: event2.reason }
              );
              return dispatch(legacyHandlers[name], domEvent);
            };
          } else if (typeof Event === "function") {
            var event = new Event("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event2) {
              name = name.toLowerCase();
              var domEvent = new Event(name, {
                cancelable: true
              });
              domEvent.detail = event2;
              es52.defineProperty(domEvent, "promise", { value: event2.promise });
              es52.defineProperty(domEvent, "reason", { value: event2.reason });
              return dispatch(legacyHandlers[name], domEvent);
            };
          } else {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent("testingtheevent", false, true, {});
            util.global.dispatchEvent(event);
            return function(name, event2) {
              name = name.toLowerCase();
              var domEvent = document.createEvent("CustomEvent");
              domEvent.initCustomEvent(
                name,
                false,
                true,
                event2
              );
              return dispatch(legacyHandlers[name], domEvent);
            };
          }
        } catch (e) {
        }
        return function() {
          return false;
        };
      }();
      var fireGlobalEvent = function() {
        if (util.isNode) {
          return function() {
            return process.emit.apply(process, arguments);
          };
        } else {
          if (!util.global) {
            return function() {
              return false;
            };
          }
          return function(name) {
            var methodName = "on" + name.toLowerCase();
            var method = util.global[methodName];
            if (!method) return false;
            method.apply(util.global, [].slice.call(arguments, 1));
            return true;
          };
        }
      }();
      function generatePromiseLifecycleEventObject(name, promise) {
        return { promise };
      }
      var eventToObjectGenerator = {
        promiseCreated: generatePromiseLifecycleEventObject,
        promiseFulfilled: generatePromiseLifecycleEventObject,
        promiseRejected: generatePromiseLifecycleEventObject,
        promiseResolved: generatePromiseLifecycleEventObject,
        promiseCancelled: generatePromiseLifecycleEventObject,
        promiseChained: function(name, promise, child) {
          return { promise, child };
        },
        warning: function(name, warning) {
          return { warning };
        },
        unhandledRejection: function(name, reason, promise) {
          return { reason, promise };
        },
        rejectionHandled: generatePromiseLifecycleEventObject
      };
      var activeFireEvent = function(name) {
        var globalEventFired = false;
        try {
          globalEventFired = fireGlobalEvent.apply(null, arguments);
        } catch (e) {
          async.throwLater(e);
          globalEventFired = true;
        }
        var domEventFired = false;
        try {
          domEventFired = fireDomEvent(
            name,
            eventToObjectGenerator[name].apply(null, arguments)
          );
        } catch (e) {
          async.throwLater(e);
          domEventFired = true;
        }
        return domEventFired || globalEventFired;
      };
      Promise2.config = function(opts) {
        opts = Object(opts);
        if ("longStackTraces" in opts) {
          if (opts.longStackTraces) {
            Promise2.longStackTraces();
          } else if (!opts.longStackTraces && Promise2.hasLongStackTraces()) {
            disableLongStackTraces();
          }
        }
        if ("warnings" in opts) {
          var warningsOption = opts.warnings;
          config.warnings = !!warningsOption;
          wForgottenReturn = config.warnings;
          if (util.isObject(warningsOption)) {
            if ("wForgottenReturn" in warningsOption) {
              wForgottenReturn = !!warningsOption.wForgottenReturn;
            }
          }
        }
        if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
          if (async.haveItemsQueued()) {
            throw new Error(
              "cannot enable cancellation after promises are in use"
            );
          }
          Promise2.prototype._clearCancellationData = cancellationClearCancellationData;
          Promise2.prototype._propagateFrom = cancellationPropagateFrom;
          Promise2.prototype._onCancel = cancellationOnCancel;
          Promise2.prototype._setOnCancel = cancellationSetOnCancel;
          Promise2.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
          Promise2.prototype._execute = cancellationExecute;
          propagateFromFunction = cancellationPropagateFrom;
          config.cancellation = true;
        }
        if ("monitoring" in opts) {
          if (opts.monitoring && !config.monitoring) {
            config.monitoring = true;
            Promise2.prototype._fireEvent = activeFireEvent;
          } else if (!opts.monitoring && config.monitoring) {
            config.monitoring = false;
            Promise2.prototype._fireEvent = defaultFireEvent;
          }
        }
        if ("asyncHooks" in opts && util.nodeSupportsAsyncResource) {
          var prev = config.asyncHooks;
          var cur = !!opts.asyncHooks;
          if (prev !== cur) {
            config.asyncHooks = cur;
            if (cur) {
              enableAsyncHooks();
            } else {
              disableAsyncHooks();
            }
          }
        }
        return Promise2;
      };
      function defaultFireEvent() {
        return false;
      }
      Promise2.prototype._fireEvent = defaultFireEvent;
      Promise2.prototype._execute = function(executor, resolve, reject) {
        try {
          executor(resolve, reject);
        } catch (e) {
          return e;
        }
      };
      Promise2.prototype._onCancel = function() {
      };
      Promise2.prototype._setOnCancel = function(handler7) {
        ;
      };
      Promise2.prototype._attachCancellationCallback = function(onCancel) {
        ;
      };
      Promise2.prototype._captureStackTrace = function() {
      };
      Promise2.prototype._attachExtraTrace = function() {
      };
      Promise2.prototype._dereferenceTrace = function() {
      };
      Promise2.prototype._clearCancellationData = function() {
      };
      Promise2.prototype._propagateFrom = function(parent, flags) {
        ;
        ;
      };
      function cancellationExecute(executor, resolve, reject) {
        var promise = this;
        try {
          executor(resolve, reject, function(onCancel) {
            if (typeof onCancel !== "function") {
              throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
            }
            promise._attachCancellationCallback(onCancel);
          });
        } catch (e) {
          return e;
        }
      }
      function cancellationAttachCancellationCallback(onCancel) {
        if (!this._isCancellable()) return this;
        var previousOnCancel = this._onCancel();
        if (previousOnCancel !== void 0) {
          if (util.isArray(previousOnCancel)) {
            previousOnCancel.push(onCancel);
          } else {
            this._setOnCancel([previousOnCancel, onCancel]);
          }
        } else {
          this._setOnCancel(onCancel);
        }
      }
      function cancellationOnCancel() {
        return this._onCancelField;
      }
      function cancellationSetOnCancel(onCancel) {
        this._onCancelField = onCancel;
      }
      function cancellationClearCancellationData() {
        this._cancellationParent = void 0;
        this._onCancelField = void 0;
      }
      function cancellationPropagateFrom(parent, flags) {
        if ((flags & 1) !== 0) {
          this._cancellationParent = parent;
          var branchesRemainingToCancel = parent._branchesRemainingToCancel;
          if (branchesRemainingToCancel === void 0) {
            branchesRemainingToCancel = 0;
          }
          parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
        }
        if ((flags & 2) !== 0 && parent._isBound()) {
          this._setBoundTo(parent._boundTo);
        }
      }
      function bindingPropagateFrom(parent, flags) {
        if ((flags & 2) !== 0 && parent._isBound()) {
          this._setBoundTo(parent._boundTo);
        }
      }
      var propagateFromFunction = bindingPropagateFrom;
      function boundValueFunction() {
        var ret2 = this._boundTo;
        if (ret2 !== void 0) {
          if (ret2 instanceof Promise2) {
            if (ret2.isFulfilled()) {
              return ret2.value();
            } else {
              return void 0;
            }
          }
        }
        return ret2;
      }
      function longStackTracesCaptureStackTrace() {
        this._trace = new CapturedTrace(this._peekContext());
      }
      function longStackTracesAttachExtraTrace(error, ignoreSelf) {
        if (canAttachTrace2(error)) {
          var trace = this._trace;
          if (trace !== void 0) {
            if (ignoreSelf) trace = trace._parent;
          }
          if (trace !== void 0) {
            trace.attachExtraTrace(error);
          } else if (!error.__stackCleaned__) {
            var parsed = parseStackAndMessage(error);
            util.notEnumerableProp(
              error,
              "stack",
              parsed.message + "\n" + parsed.stack.join("\n")
            );
            util.notEnumerableProp(error, "__stackCleaned__", true);
          }
        }
      }
      function longStackTracesDereferenceTrace() {
        this._trace = void 0;
      }
      function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
        if (returnValue === void 0 && promiseCreated !== null && wForgottenReturn) {
          if (parent !== void 0 && parent._returnedNonUndefined()) return;
          if ((promise._bitField & 65535) === 0) return;
          if (name) name = name + " ";
          var handlerLine = "";
          var creatorLine = "";
          if (promiseCreated._trace) {
            var traceLines = promiseCreated._trace.stack.split("\n");
            var stack = cleanStack(traceLines);
            for (var i = stack.length - 1; i >= 0; --i) {
              var line = stack[i];
              if (!nodeFramePattern.test(line)) {
                var lineMatches = line.match(parseLinePattern);
                if (lineMatches) {
                  handlerLine = "at " + lineMatches[1] + ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
                }
                break;
              }
            }
            if (stack.length > 0) {
              var firstUserLine = stack[0];
              for (var i = 0; i < traceLines.length; ++i) {
                if (traceLines[i] === firstUserLine) {
                  if (i > 0) {
                    creatorLine = "\n" + traceLines[i - 1];
                  }
                  break;
                }
              }
            }
          }
          var msg = "a promise was created in a " + name + "handler " + handlerLine + "but was not returned from it, see http://goo.gl/rRqMUw" + creatorLine;
          promise._warn(msg, true, promiseCreated);
        }
      }
      function deprecated(name, replacement) {
        var message = name + " is deprecated and will be removed in a future version.";
        if (replacement) message += " Use " + replacement + " instead.";
        return warn(message);
      }
      function warn(message, shouldUseOwnTrace, promise) {
        if (!config.warnings) return;
        var warning = new Warning(message);
        var ctx;
        if (shouldUseOwnTrace) {
          promise._attachExtraTrace(warning);
        } else if (config.longStackTraces && (ctx = Promise2._peekContext())) {
          ctx.attachExtraTrace(warning);
        } else {
          var parsed = parseStackAndMessage(warning);
          warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
        }
        if (!activeFireEvent("warning", warning)) {
          formatAndLogError(warning, "", true);
        }
      }
      function reconstructStack(message, stacks) {
        for (var i = 0; i < stacks.length - 1; ++i) {
          stacks[i].push("From previous event:");
          stacks[i] = stacks[i].join("\n");
        }
        if (i < stacks.length) {
          stacks[i] = stacks[i].join("\n");
        }
        return message + "\n" + stacks.join("\n");
      }
      function removeDuplicateOrEmptyJumps(stacks) {
        for (var i = 0; i < stacks.length; ++i) {
          if (stacks[i].length === 0 || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
            stacks.splice(i, 1);
            i--;
          }
        }
      }
      function removeCommonRoots(stacks) {
        var current = stacks[0];
        for (var i = 1; i < stacks.length; ++i) {
          var prev = stacks[i];
          var currentLastIndex = current.length - 1;
          var currentLastLine = current[currentLastIndex];
          var commonRootMeetPoint = -1;
          for (var j = prev.length - 1; j >= 0; --j) {
            if (prev[j] === currentLastLine) {
              commonRootMeetPoint = j;
              break;
            }
          }
          for (var j = commonRootMeetPoint; j >= 0; --j) {
            var line = prev[j];
            if (current[currentLastIndex] === line) {
              current.pop();
              currentLastIndex--;
            } else {
              break;
            }
          }
          current = prev;
        }
      }
      function cleanStack(stack) {
        var ret2 = [];
        for (var i = 0; i < stack.length; ++i) {
          var line = stack[i];
          var isTraceLine = "    (No stack trace)" === line || stackFramePattern.test(line);
          var isInternalFrame = isTraceLine && shouldIgnore(line);
          if (isTraceLine && !isInternalFrame) {
            if (indentStackFrames && line.charAt(0) !== " ") {
              line = "    " + line;
            }
            ret2.push(line);
          }
        }
        return ret2;
      }
      function stackFramesAsArray(error) {
        var stack = error.stack.replace(/\s+$/g, "").split("\n");
        for (var i = 0; i < stack.length; ++i) {
          var line = stack[i];
          if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
            break;
          }
        }
        if (i > 0 && error.name != "SyntaxError") {
          stack = stack.slice(i);
        }
        return stack;
      }
      function parseStackAndMessage(error) {
        var stack = error.stack;
        var message = error.toString();
        stack = typeof stack === "string" && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"];
        return {
          message,
          stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
        };
      }
      function formatAndLogError(error, title, isSoft) {
        if (typeof console !== "undefined") {
          var message;
          if (util.isObject(error)) {
            var stack = error.stack;
            message = title + formatStack(stack, error);
          } else {
            message = title + String(error);
          }
          if (typeof printWarning === "function") {
            printWarning(message, isSoft);
          } else if (typeof console.log === "function" || typeof console.log === "object") {
            console.log(message);
          }
        }
      }
      function fireRejectionEvent(name, localHandler, reason, promise) {
        var localEventFired = false;
        try {
          if (typeof localHandler === "function") {
            localEventFired = true;
            if (name === "rejectionHandled") {
              localHandler(promise);
            } else {
              localHandler(reason, promise);
            }
          }
        } catch (e) {
          async.throwLater(e);
        }
        if (name === "unhandledRejection") {
          if (!activeFireEvent(name, reason, promise) && !localEventFired) {
            formatAndLogError(reason, "Unhandled rejection ");
          }
        } else {
          activeFireEvent(name, promise);
        }
      }
      function formatNonError(obj2) {
        var str;
        if (typeof obj2 === "function") {
          str = "[function " + (obj2.name || "anonymous") + "]";
        } else {
          str = obj2 && typeof obj2.toString === "function" ? obj2.toString() : util.toString(obj2);
          var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
          if (ruselessToString.test(str)) {
            try {
              var newStr = JSON.stringify(obj2);
              str = newStr;
            } catch (e) {
            }
          }
          if (str.length === 0) {
            str = "(empty array)";
          }
        }
        return "(<" + snip(str) + ">, no stack trace)";
      }
      function snip(str) {
        var maxChars = 41;
        if (str.length < maxChars) {
          return str;
        }
        return str.substr(0, maxChars - 3) + "...";
      }
      function longStackTracesIsSupported() {
        return typeof captureStackTrace === "function";
      }
      var shouldIgnore = function() {
        return false;
      };
      var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
      function parseLineInfo(line) {
        var matches = line.match(parseLineInfoRegex);
        if (matches) {
          return {
            fileName: matches[1],
            line: parseInt(matches[2], 10)
          };
        }
      }
      function setBounds(firstLineError, lastLineError) {
        if (!longStackTracesIsSupported()) return;
        var firstStackLines = (firstLineError.stack || "").split("\n");
        var lastStackLines = (lastLineError.stack || "").split("\n");
        var firstIndex = -1;
        var lastIndex = -1;
        var firstFileName;
        var lastFileName;
        for (var i = 0; i < firstStackLines.length; ++i) {
          var result = parseLineInfo(firstStackLines[i]);
          if (result) {
            firstFileName = result.fileName;
            firstIndex = result.line;
            break;
          }
        }
        for (var i = 0; i < lastStackLines.length; ++i) {
          var result = parseLineInfo(lastStackLines[i]);
          if (result) {
            lastFileName = result.fileName;
            lastIndex = result.line;
            break;
          }
        }
        if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex) {
          return;
        }
        shouldIgnore = function(line) {
          if (bluebirdFramePattern.test(line)) return true;
          var info = parseLineInfo(line);
          if (info) {
            if (info.fileName === firstFileName && (firstIndex <= info.line && info.line <= lastIndex)) {
              return true;
            }
          }
          return false;
        };
      }
      function CapturedTrace(parent) {
        this._parent = parent;
        this._promisesCreated = 0;
        var length = this._length = 1 + (parent === void 0 ? 0 : parent._length);
        captureStackTrace(this, CapturedTrace);
        if (length > 32) this.uncycle();
      }
      util.inherits(CapturedTrace, Error);
      Context.CapturedTrace = CapturedTrace;
      CapturedTrace.prototype.uncycle = function() {
        var length = this._length;
        if (length < 2) return;
        var nodes = [];
        var stackToIndex = {};
        for (var i = 0, node = this; node !== void 0; ++i) {
          nodes.push(node);
          node = node._parent;
        }
        length = this._length = i;
        for (var i = length - 1; i >= 0; --i) {
          var stack = nodes[i].stack;
          if (stackToIndex[stack] === void 0) {
            stackToIndex[stack] = i;
          }
        }
        for (var i = 0; i < length; ++i) {
          var currentStack = nodes[i].stack;
          var index = stackToIndex[currentStack];
          if (index !== void 0 && index !== i) {
            if (index > 0) {
              nodes[index - 1]._parent = void 0;
              nodes[index - 1]._length = 1;
            }
            nodes[i]._parent = void 0;
            nodes[i]._length = 1;
            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;
            if (index < length - 1) {
              cycleEdgeNode._parent = nodes[index + 1];
              cycleEdgeNode._parent.uncycle();
              cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
            } else {
              cycleEdgeNode._parent = void 0;
              cycleEdgeNode._length = 1;
            }
            var currentChildLength = cycleEdgeNode._length + 1;
            for (var j = i - 2; j >= 0; --j) {
              nodes[j]._length = currentChildLength;
              currentChildLength++;
            }
            return;
          }
        }
      };
      CapturedTrace.prototype.attachExtraTrace = function(error) {
        if (error.__stackCleaned__) return;
        this.uncycle();
        var parsed = parseStackAndMessage(error);
        var message = parsed.message;
        var stacks = [parsed.stack];
        var trace = this;
        while (trace !== void 0) {
          stacks.push(cleanStack(trace.stack.split("\n")));
          trace = trace._parent;
        }
        removeCommonRoots(stacks);
        removeDuplicateOrEmptyJumps(stacks);
        util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
        util.notEnumerableProp(error, "__stackCleaned__", true);
      };
      var captureStackTrace = function stackDetection() {
        var v8stackFramePattern = /^\s*at\s*/;
        var v8stackFormatter = function(stack, error) {
          if (typeof stack === "string") return stack;
          if (error.name !== void 0 && error.message !== void 0) {
            return error.toString();
          }
          return formatNonError(error);
        };
        if (typeof Error.stackTraceLimit === "number" && typeof Error.captureStackTrace === "function") {
          Error.stackTraceLimit += 6;
          stackFramePattern = v8stackFramePattern;
          formatStack = v8stackFormatter;
          var captureStackTrace2 = Error.captureStackTrace;
          shouldIgnore = function(line) {
            return bluebirdFramePattern.test(line);
          };
          return function(receiver2, ignoreUntil) {
            Error.stackTraceLimit += 6;
            captureStackTrace2(receiver2, ignoreUntil);
            Error.stackTraceLimit -= 6;
          };
        }
        var err = new Error();
        if (typeof err.stack === "string" && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
          stackFramePattern = /@/;
          formatStack = v8stackFormatter;
          indentStackFrames = true;
          return function captureStackTrace3(o) {
            o.stack = new Error().stack;
          };
        }
        var hasStackAfterThrow;
        try {
          throw new Error();
        } catch (e) {
          hasStackAfterThrow = "stack" in e;
        }
        if (!("stack" in err) && hasStackAfterThrow && typeof Error.stackTraceLimit === "number") {
          stackFramePattern = v8stackFramePattern;
          formatStack = v8stackFormatter;
          return function captureStackTrace3(o) {
            Error.stackTraceLimit += 6;
            try {
              throw new Error();
            } catch (e) {
              o.stack = e.stack;
            }
            Error.stackTraceLimit -= 6;
          };
        }
        formatStack = function(stack, error) {
          if (typeof stack === "string") return stack;
          if ((typeof error === "object" || typeof error === "function") && error.name !== void 0 && error.message !== void 0) {
            return error.toString();
          }
          return formatNonError(error);
        };
        return null;
      }([]);
      if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
        printWarning = function(message) {
          console.warn(message);
        };
        if (util.isNode && process.stderr.isTTY) {
          printWarning = function(message, isSoft) {
            var color = isSoft ? "\x1B[33m" : "\x1B[31m";
            console.warn(color + message + "\x1B[0m\n");
          };
        } else if (!util.isNode && typeof new Error().stack === "string") {
          printWarning = function(message, isSoft) {
            console.warn(
              "%c" + message,
              isSoft ? "color: darkorange" : "color: red"
            );
          };
        }
      }
      var config = {
        warnings,
        longStackTraces: false,
        cancellation: false,
        monitoring: false,
        asyncHooks: false
      };
      if (longStackTraces) Promise2.longStackTraces();
      return {
        asyncHooks: function() {
          return config.asyncHooks;
        },
        longStackTraces: function() {
          return config.longStackTraces;
        },
        warnings: function() {
          return config.warnings;
        },
        cancellation: function() {
          return config.cancellation;
        },
        monitoring: function() {
          return config.monitoring;
        },
        propagateFromFunction: function() {
          return propagateFromFunction;
        },
        boundValueFunction: function() {
          return boundValueFunction;
        },
        checkForgottenReturns,
        setBounds,
        warn,
        deprecated,
        CapturedTrace,
        fireDomEvent,
        fireGlobalEvent
      };
    };
  }
});

// node_modules/bluebird/js/release/catch_filter.js
var require_catch_filter = __commonJS({
  "node_modules/bluebird/js/release/catch_filter.js"(exports2, module2) {
    "use strict";
    module2.exports = function(NEXT_FILTER) {
      var util = require_util2();
      var getKeys = require_es5().keys;
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      function catchFilter(instances, cb, promise) {
        return function(e) {
          var boundTo = promise._boundValue();
          predicateLoop: for (var i = 0; i < instances.length; ++i) {
            var item = instances[i];
            if (item === Error || item != null && item.prototype instanceof Error) {
              if (e instanceof item) {
                return tryCatch2(cb).call(boundTo, e);
              }
            } else if (typeof item === "function") {
              var matchesPredicate = tryCatch2(item).call(boundTo, e);
              if (matchesPredicate === errorObj2) {
                return matchesPredicate;
              } else if (matchesPredicate) {
                return tryCatch2(cb).call(boundTo, e);
              }
            } else if (util.isObject(e)) {
              var keys = getKeys(item);
              for (var j = 0; j < keys.length; ++j) {
                var key = keys[j];
                if (item[key] != e[key]) {
                  continue predicateLoop;
                }
              }
              return tryCatch2(cb).call(boundTo, e);
            }
          }
          return NEXT_FILTER;
        };
      }
      return catchFilter;
    };
  }
});

// node_modules/bluebird/js/release/finally.js
var require_finally = __commonJS({
  "node_modules/bluebird/js/release/finally.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, tryConvertToPromise, NEXT_FILTER) {
      var util = require_util2();
      var CancellationError = Promise2.CancellationError;
      var errorObj2 = util.errorObj;
      var catchFilter = require_catch_filter()(NEXT_FILTER);
      function PassThroughHandlerContext(promise, type, handler7) {
        this.promise = promise;
        this.type = type;
        this.handler = handler7;
        this.called = false;
        this.cancelPromise = null;
      }
      PassThroughHandlerContext.prototype.isFinallyHandler = function() {
        return this.type === 0;
      };
      function FinallyHandlerCancelReaction(finallyHandler2) {
        this.finallyHandler = finallyHandler2;
      }
      FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
        checkCancel(this.finallyHandler);
      };
      function checkCancel(ctx, reason) {
        if (ctx.cancelPromise != null) {
          if (arguments.length > 1) {
            ctx.cancelPromise._reject(reason);
          } else {
            ctx.cancelPromise._cancel();
          }
          ctx.cancelPromise = null;
          return true;
        }
        return false;
      }
      function succeed() {
        return finallyHandler.call(this, this.promise._target()._settledValue());
      }
      function fail2(reason) {
        if (checkCancel(this, reason)) return;
        errorObj2.e = reason;
        return errorObj2;
      }
      function finallyHandler(reasonOrValue) {
        var promise = this.promise;
        var handler7 = this.handler;
        if (!this.called) {
          this.called = true;
          var ret2 = this.isFinallyHandler() ? handler7.call(promise._boundValue()) : handler7.call(promise._boundValue(), reasonOrValue);
          if (ret2 === NEXT_FILTER) {
            return ret2;
          } else if (ret2 !== void 0) {
            promise._setReturnedNonUndefined();
            var maybePromise = tryConvertToPromise(ret2, promise);
            if (maybePromise instanceof Promise2) {
              if (this.cancelPromise != null) {
                if (maybePromise._isCancelled()) {
                  var reason = new CancellationError("late cancellation observer");
                  promise._attachExtraTrace(reason);
                  errorObj2.e = reason;
                  return errorObj2;
                } else if (maybePromise.isPending()) {
                  maybePromise._attachCancellationCallback(
                    new FinallyHandlerCancelReaction(this)
                  );
                }
              }
              return maybePromise._then(
                succeed,
                fail2,
                void 0,
                this,
                void 0
              );
            }
          }
        }
        if (promise.isRejected()) {
          checkCancel(this);
          errorObj2.e = reasonOrValue;
          return errorObj2;
        } else {
          checkCancel(this);
          return reasonOrValue;
        }
      }
      Promise2.prototype._passThrough = function(handler7, type, success3, fail3) {
        if (typeof handler7 !== "function") return this.then();
        return this._then(
          success3,
          fail3,
          void 0,
          new PassThroughHandlerContext(this, type, handler7),
          void 0
        );
      };
      Promise2.prototype.lastly = Promise2.prototype["finally"] = function(handler7) {
        return this._passThrough(
          handler7,
          0,
          finallyHandler,
          finallyHandler
        );
      };
      Promise2.prototype.tap = function(handler7) {
        return this._passThrough(handler7, 1, finallyHandler);
      };
      Promise2.prototype.tapCatch = function(handlerOrPredicate) {
        var len = arguments.length;
        if (len === 1) {
          return this._passThrough(
            handlerOrPredicate,
            1,
            void 0,
            finallyHandler
          );
        } else {
          var catchInstances = new Array(len - 1), j = 0, i;
          for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
              catchInstances[j++] = item;
            } else {
              return Promise2.reject(new TypeError(
                "tapCatch statement predicate: expecting an object but got " + util.classString(item)
              ));
            }
          }
          catchInstances.length = j;
          var handler7 = arguments[i];
          return this._passThrough(
            catchFilter(catchInstances, handler7, this),
            1,
            void 0,
            finallyHandler
          );
        }
      };
      return PassThroughHandlerContext;
    };
  }
});

// node_modules/bluebird/js/release/nodeback.js
var require_nodeback = __commonJS({
  "node_modules/bluebird/js/release/nodeback.js"(exports2, module2) {
    "use strict";
    var util = require_util2();
    var maybeWrapAsError2 = util.maybeWrapAsError;
    var errors = require_errors();
    var OperationalError = errors.OperationalError;
    var es52 = require_es5();
    function isUntypedError(obj2) {
      return obj2 instanceof Error && es52.getPrototypeOf(obj2) === Error.prototype;
    }
    var rErrorKey = /^(?:name|message|stack|cause)$/;
    function wrapAsOperationalError(obj2) {
      var ret2;
      if (isUntypedError(obj2)) {
        ret2 = new OperationalError(obj2);
        ret2.name = obj2.name;
        ret2.message = obj2.message;
        ret2.stack = obj2.stack;
        var keys = es52.keys(obj2);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          if (!rErrorKey.test(key)) {
            ret2[key] = obj2[key];
          }
        }
        return ret2;
      }
      util.markAsOriginatingFromRejection(obj2);
      return obj2;
    }
    function nodebackForPromise(promise, multiArgs) {
      return function(err, value) {
        if (promise === null) return;
        if (err) {
          var wrapped = wrapAsOperationalError(maybeWrapAsError2(err));
          promise._attachExtraTrace(wrapped);
          promise._reject(wrapped);
        } else if (!multiArgs) {
          promise._fulfill(value);
        } else {
          var $_len = arguments.length;
          var args = new Array(Math.max($_len - 1, 0));
          for (var $_i = 1; $_i < $_len; ++$_i) {
            args[$_i - 1] = arguments[$_i];
          }
          ;
          promise._fulfill(args);
        }
        promise = null;
      };
    }
    module2.exports = nodebackForPromise;
  }
});

// node_modules/bluebird/js/release/method.js
var require_method = __commonJS({
  "node_modules/bluebird/js/release/method.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection, debug) {
      var util = require_util2();
      var tryCatch2 = util.tryCatch;
      Promise2.method = function(fn) {
        if (typeof fn !== "function") {
          throw new Promise2.TypeError("expecting a function but got " + util.classString(fn));
        }
        return function() {
          var ret2 = new Promise2(INTERNAL);
          ret2._captureStackTrace();
          ret2._pushContext();
          var value = tryCatch2(fn).apply(this, arguments);
          var promiseCreated = ret2._popContext();
          debug.checkForgottenReturns(
            value,
            promiseCreated,
            "Promise.method",
            ret2
          );
          ret2._resolveFromSyncValue(value);
          return ret2;
        };
      };
      Promise2.attempt = Promise2["try"] = function(fn) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var ret2 = new Promise2(INTERNAL);
        ret2._captureStackTrace();
        ret2._pushContext();
        var value;
        if (arguments.length > 1) {
          debug.deprecated("calling Promise.try with more than 1 argument");
          var arg = arguments[1];
          var ctx = arguments[2];
          value = util.isArray(arg) ? tryCatch2(fn).apply(ctx, arg) : tryCatch2(fn).call(ctx, arg);
        } else {
          value = tryCatch2(fn)();
        }
        var promiseCreated = ret2._popContext();
        debug.checkForgottenReturns(
          value,
          promiseCreated,
          "Promise.try",
          ret2
        );
        ret2._resolveFromSyncValue(value);
        return ret2;
      };
      Promise2.prototype._resolveFromSyncValue = function(value) {
        if (value === util.errorObj) {
          this._rejectCallback(value.e, false);
        } else {
          this._resolveCallback(value, true);
        }
      };
    };
  }
});

// node_modules/bluebird/js/release/bind.js
var require_bind = __commonJS({
  "node_modules/bluebird/js/release/bind.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, debug) {
      var calledBind = false;
      var rejectThis = function(_, e) {
        this._reject(e);
      };
      var targetRejected = function(e, context) {
        context.promiseRejectionQueued = true;
        context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
      };
      var bindingResolved = function(thisArg, context) {
        if ((this._bitField & 50397184) === 0) {
          this._resolveCallback(context.target);
        }
      };
      var bindingRejected = function(e, context) {
        if (!context.promiseRejectionQueued) this._reject(e);
      };
      Promise2.prototype.bind = function(thisArg) {
        if (!calledBind) {
          calledBind = true;
          Promise2.prototype._propagateFrom = debug.propagateFromFunction();
          Promise2.prototype._boundValue = debug.boundValueFunction();
        }
        var maybePromise = tryConvertToPromise(thisArg);
        var ret2 = new Promise2(INTERNAL);
        ret2._propagateFrom(this, 1);
        var target = this._target();
        ret2._setBoundTo(maybePromise);
        if (maybePromise instanceof Promise2) {
          var context = {
            promiseRejectionQueued: false,
            promise: ret2,
            target,
            bindingPromise: maybePromise
          };
          target._then(INTERNAL, targetRejected, void 0, ret2, context);
          maybePromise._then(
            bindingResolved,
            bindingRejected,
            void 0,
            ret2,
            context
          );
          ret2._setOnCancel(maybePromise);
        } else {
          ret2._resolveCallback(target);
        }
        return ret2;
      };
      Promise2.prototype._setBoundTo = function(obj2) {
        if (obj2 !== void 0) {
          this._bitField = this._bitField | 2097152;
          this._boundTo = obj2;
        } else {
          this._bitField = this._bitField & ~2097152;
        }
      };
      Promise2.prototype._isBound = function() {
        return (this._bitField & 2097152) === 2097152;
      };
      Promise2.bind = function(thisArg, value) {
        return Promise2.resolve(value).bind(thisArg);
      };
    };
  }
});

// node_modules/bluebird/js/release/cancel.js
var require_cancel = __commonJS({
  "node_modules/bluebird/js/release/cancel.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection, debug) {
      var util = require_util2();
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      var async = Promise2._async;
      Promise2.prototype["break"] = Promise2.prototype.cancel = function() {
        if (!debug.cancellation()) return this._warn("cancellation is disabled");
        var promise = this;
        var child = promise;
        while (promise._isCancellable()) {
          if (!promise._cancelBy(child)) {
            if (child._isFollowing()) {
              child._followee().cancel();
            } else {
              child._cancelBranched();
            }
            break;
          }
          var parent = promise._cancellationParent;
          if (parent == null || !parent._isCancellable()) {
            if (promise._isFollowing()) {
              promise._followee().cancel();
            } else {
              promise._cancelBranched();
            }
            break;
          } else {
            if (promise._isFollowing()) promise._followee().cancel();
            promise._setWillBeCancelled();
            child = promise;
            promise = parent;
          }
        }
      };
      Promise2.prototype._branchHasCancelled = function() {
        this._branchesRemainingToCancel--;
      };
      Promise2.prototype._enoughBranchesHaveCancelled = function() {
        return this._branchesRemainingToCancel === void 0 || this._branchesRemainingToCancel <= 0;
      };
      Promise2.prototype._cancelBy = function(canceller) {
        if (canceller === this) {
          this._branchesRemainingToCancel = 0;
          this._invokeOnCancel();
          return true;
        } else {
          this._branchHasCancelled();
          if (this._enoughBranchesHaveCancelled()) {
            this._invokeOnCancel();
            return true;
          }
        }
        return false;
      };
      Promise2.prototype._cancelBranched = function() {
        if (this._enoughBranchesHaveCancelled()) {
          this._cancel();
        }
      };
      Promise2.prototype._cancel = function() {
        if (!this._isCancellable()) return;
        this._setCancelled();
        async.invoke(this._cancelPromises, this, void 0);
      };
      Promise2.prototype._cancelPromises = function() {
        if (this._length() > 0) this._settlePromises();
      };
      Promise2.prototype._unsetOnCancel = function() {
        this._onCancelField = void 0;
      };
      Promise2.prototype._isCancellable = function() {
        return this.isPending() && !this._isCancelled();
      };
      Promise2.prototype.isCancellable = function() {
        return this.isPending() && !this.isCancelled();
      };
      Promise2.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
        if (util.isArray(onCancelCallback)) {
          for (var i = 0; i < onCancelCallback.length; ++i) {
            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
          }
        } else if (onCancelCallback !== void 0) {
          if (typeof onCancelCallback === "function") {
            if (!internalOnly) {
              var e = tryCatch2(onCancelCallback).call(this._boundValue());
              if (e === errorObj2) {
                this._attachExtraTrace(e.e);
                async.throwLater(e.e);
              }
            }
          } else {
            onCancelCallback._resultCancelled(this);
          }
        }
      };
      Promise2.prototype._invokeOnCancel = function() {
        var onCancelCallback = this._onCancel();
        this._unsetOnCancel();
        async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
      };
      Promise2.prototype._invokeInternalOnCancel = function() {
        if (this._isCancellable()) {
          this._doInvokeOnCancel(this._onCancel(), true);
          this._unsetOnCancel();
        }
      };
      Promise2.prototype._resultCancelled = function() {
        this.cancel();
      };
    };
  }
});

// node_modules/bluebird/js/release/direct_resolve.js
var require_direct_resolve = __commonJS({
  "node_modules/bluebird/js/release/direct_resolve.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      function returner() {
        return this.value;
      }
      function thrower2() {
        throw this.reason;
      }
      Promise2.prototype["return"] = Promise2.prototype.thenReturn = function(value) {
        if (value instanceof Promise2) value.suppressUnhandledRejections();
        return this._then(
          returner,
          void 0,
          void 0,
          { value },
          void 0
        );
      };
      Promise2.prototype["throw"] = Promise2.prototype.thenThrow = function(reason) {
        return this._then(
          thrower2,
          void 0,
          void 0,
          { reason },
          void 0
        );
      };
      Promise2.prototype.catchThrow = function(reason) {
        if (arguments.length <= 1) {
          return this._then(
            void 0,
            thrower2,
            void 0,
            { reason },
            void 0
          );
        } else {
          var _reason = arguments[1];
          var handler7 = function() {
            throw _reason;
          };
          return this.caught(reason, handler7);
        }
      };
      Promise2.prototype.catchReturn = function(value) {
        if (arguments.length <= 1) {
          if (value instanceof Promise2) value.suppressUnhandledRejections();
          return this._then(
            void 0,
            returner,
            void 0,
            { value },
            void 0
          );
        } else {
          var _value = arguments[1];
          if (_value instanceof Promise2) _value.suppressUnhandledRejections();
          var handler7 = function() {
            return _value;
          };
          return this.caught(value, handler7);
        }
      };
    };
  }
});

// node_modules/bluebird/js/release/synchronous_inspection.js
var require_synchronous_inspection = __commonJS({
  "node_modules/bluebird/js/release/synchronous_inspection.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      function PromiseInspection(promise) {
        if (promise !== void 0) {
          promise = promise._target();
          this._bitField = promise._bitField;
          this._settledValueField = promise._isFateSealed() ? promise._settledValue() : void 0;
        } else {
          this._bitField = 0;
          this._settledValueField = void 0;
        }
      }
      PromiseInspection.prototype._settledValue = function() {
        return this._settledValueField;
      };
      var value = PromiseInspection.prototype.value = function() {
        if (!this.isFulfilled()) {
          throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
        }
        return this._settledValue();
      };
      var reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function() {
        if (!this.isRejected()) {
          throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
        }
        return this._settledValue();
      };
      var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
        return (this._bitField & 33554432) !== 0;
      };
      var isRejected = PromiseInspection.prototype.isRejected = function() {
        return (this._bitField & 16777216) !== 0;
      };
      var isPending = PromiseInspection.prototype.isPending = function() {
        return (this._bitField & 50397184) === 0;
      };
      var isResolved = PromiseInspection.prototype.isResolved = function() {
        return (this._bitField & 50331648) !== 0;
      };
      PromiseInspection.prototype.isCancelled = function() {
        return (this._bitField & 8454144) !== 0;
      };
      Promise2.prototype.__isCancelled = function() {
        return (this._bitField & 65536) === 65536;
      };
      Promise2.prototype._isCancelled = function() {
        return this._target().__isCancelled();
      };
      Promise2.prototype.isCancelled = function() {
        return (this._target()._bitField & 8454144) !== 0;
      };
      Promise2.prototype.isPending = function() {
        return isPending.call(this._target());
      };
      Promise2.prototype.isRejected = function() {
        return isRejected.call(this._target());
      };
      Promise2.prototype.isFulfilled = function() {
        return isFulfilled.call(this._target());
      };
      Promise2.prototype.isResolved = function() {
        return isResolved.call(this._target());
      };
      Promise2.prototype.value = function() {
        return value.call(this._target());
      };
      Promise2.prototype.reason = function() {
        var target = this._target();
        target._unsetRejectionIsUnhandled();
        return reason.call(target);
      };
      Promise2.prototype._value = function() {
        return this._settledValue();
      };
      Promise2.prototype._reason = function() {
        this._unsetRejectionIsUnhandled();
        return this._settledValue();
      };
      Promise2.PromiseInspection = PromiseInspection;
    };
  }
});

// node_modules/bluebird/js/release/join.js
var require_join = __commonJS({
  "node_modules/bluebird/js/release/join.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, tryConvertToPromise, INTERNAL, async) {
      var util = require_util2();
      var canEvaluate2 = util.canEvaluate;
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      var reject;
      if (true) {
        if (canEvaluate2) {
          var thenCallback = function(i2) {
            return new Function("value", "holder", "                             \n            'use strict';                                                    \n            holder.pIndex = value;                                           \n            holder.checkFulfillment(this);                                   \n            ".replace(/Index/g, i2));
          };
          var promiseSetter = function(i2) {
            return new Function("promise", "holder", "                           \n            'use strict';                                                    \n            holder.pIndex = promise;                                         \n            ".replace(/Index/g, i2));
          };
          var generateHolderClass = function(total) {
            var props = new Array(total);
            for (var i2 = 0; i2 < props.length; ++i2) {
              props[i2] = "this.p" + (i2 + 1);
            }
            var assignment = props.join(" = ") + " = null;";
            var cancellationCode = "var promise;\n" + props.map(function(prop) {
              return "                                                         \n                promise = " + prop + ";                                      \n                if (promise instanceof Promise) {                            \n                    promise.cancel();                                        \n                }                                                            \n            ";
            }).join("\n");
            var passedArguments = props.join(", ");
            var name = "Holder$" + total;
            var code = "return function(tryCatch, errorObj, Promise, async) {    \n            'use strict';                                                    \n            function [TheName](fn) {                                         \n                [TheProperties]                                              \n                this.fn = fn;                                                \n                this.asyncNeeded = true;                                     \n                this.now = 0;                                                \n            }                                                                \n                                                                             \n            [TheName].prototype._callFunction = function(promise) {          \n                promise._pushContext();                                      \n                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n                promise._popContext();                                       \n                if (ret === errorObj) {                                      \n                    promise._rejectCallback(ret.e, false);                   \n                } else {                                                     \n                    promise._resolveCallback(ret);                           \n                }                                                            \n            };                                                               \n                                                                             \n            [TheName].prototype.checkFulfillment = function(promise) {       \n                var now = ++this.now;                                        \n                if (now === [TheTotal]) {                                    \n                    if (this.asyncNeeded) {                                  \n                        async.invoke(this._callFunction, this, promise);     \n                    } else {                                                 \n                        this._callFunction(promise);                         \n                    }                                                        \n                                                                             \n                }                                                            \n            };                                                               \n                                                                             \n            [TheName].prototype._resultCancelled = function() {              \n                [CancellationCode]                                           \n            };                                                               \n                                                                             \n            return [TheName];                                                \n        }(tryCatch, errorObj, Promise, async);                               \n        ";
            code = code.replace(/\[TheName\]/g, name).replace(/\[TheTotal\]/g, total).replace(/\[ThePassedArguments\]/g, passedArguments).replace(/\[TheProperties\]/g, assignment).replace(/\[CancellationCode\]/g, cancellationCode);
            return new Function("tryCatch", "errorObj", "Promise", "async", code)(tryCatch2, errorObj2, Promise2, async);
          };
          var holderClasses = [];
          var thenCallbacks = [];
          var promiseSetters = [];
          for (var i = 0; i < 8; ++i) {
            holderClasses.push(generateHolderClass(i + 1));
            thenCallbacks.push(thenCallback(i + 1));
            promiseSetters.push(promiseSetter(i + 1));
          }
          reject = function(reason) {
            this._reject(reason);
          };
        }
      }
      Promise2.join = function() {
        var last = arguments.length - 1;
        var fn;
        if (last > 0 && typeof arguments[last] === "function") {
          fn = arguments[last];
          if (true) {
            if (last <= 8 && canEvaluate2) {
              var ret2 = new Promise2(INTERNAL);
              ret2._captureStackTrace();
              var HolderClass = holderClasses[last - 1];
              var holder = new HolderClass(fn);
              var callbacks = thenCallbacks;
              for (var i2 = 0; i2 < last; ++i2) {
                var maybePromise = tryConvertToPromise(arguments[i2], ret2);
                if (maybePromise instanceof Promise2) {
                  maybePromise = maybePromise._target();
                  var bitField = maybePromise._bitField;
                  ;
                  if ((bitField & 50397184) === 0) {
                    maybePromise._then(
                      callbacks[i2],
                      reject,
                      void 0,
                      ret2,
                      holder
                    );
                    promiseSetters[i2](maybePromise, holder);
                    holder.asyncNeeded = false;
                  } else if ((bitField & 33554432) !== 0) {
                    callbacks[i2].call(
                      ret2,
                      maybePromise._value(),
                      holder
                    );
                  } else if ((bitField & 16777216) !== 0) {
                    ret2._reject(maybePromise._reason());
                  } else {
                    ret2._cancel();
                  }
                } else {
                  callbacks[i2].call(ret2, maybePromise, holder);
                }
              }
              if (!ret2._isFateSealed()) {
                if (holder.asyncNeeded) {
                  var context = Promise2._getContext();
                  holder.fn = util.contextBind(context, holder.fn);
                }
                ret2._setAsyncGuaranteed();
                ret2._setOnCancel(holder);
              }
              return ret2;
            }
          }
        }
        var $_len = arguments.length;
        var args = new Array($_len);
        for (var $_i = 0; $_i < $_len; ++$_i) {
          args[$_i] = arguments[$_i];
        }
        ;
        if (fn) args.pop();
        var ret2 = new PromiseArray(args).promise();
        return fn !== void 0 ? ret2.spread(fn) : ret2;
      };
    };
  }
});

// node_modules/bluebird/js/release/call_get.js
var require_call_get = __commonJS({
  "node_modules/bluebird/js/release/call_get.js"(exports2, module2) {
    "use strict";
    var cr = Object.create;
    if (cr) {
      callerCache = cr(null);
      getterCache = cr(null);
      callerCache[" size"] = getterCache[" size"] = 0;
    }
    var callerCache;
    var getterCache;
    module2.exports = function(Promise2) {
      var util = require_util2();
      var canEvaluate2 = util.canEvaluate;
      var isIdentifier2 = util.isIdentifier;
      var getMethodCaller;
      var getGetter;
      if (true) {
        var makeMethodCaller = function(methodName) {
          return new Function("ensureMethod", "                                    \n        return function(obj) {                                               \n            'use strict'                                                     \n            var len = this.length;                                           \n            ensureMethod(obj, 'methodName');                                 \n            switch(len) {                                                    \n                case 1: return obj.methodName(this[0]);                      \n                case 2: return obj.methodName(this[0], this[1]);             \n                case 3: return obj.methodName(this[0], this[1], this[2]);    \n                case 0: return obj.methodName();                             \n                default:                                                     \n                    return obj.methodName.apply(obj, this);                  \n            }                                                                \n        };                                                                   \n        ".replace(/methodName/g, methodName))(ensureMethod);
        };
        var makeGetter = function(propertyName) {
          return new Function("obj", "                                             \n        'use strict';                                                        \n        return obj.propertyName;                                             \n        ".replace("propertyName", propertyName));
        };
        var getCompiled = function(name, compiler, cache) {
          var ret2 = cache[name];
          if (typeof ret2 !== "function") {
            if (!isIdentifier2(name)) {
              return null;
            }
            ret2 = compiler(name);
            cache[name] = ret2;
            cache[" size"]++;
            if (cache[" size"] > 512) {
              var keys = Object.keys(cache);
              for (var i = 0; i < 256; ++i) delete cache[keys[i]];
              cache[" size"] = keys.length - 256;
            }
          }
          return ret2;
        };
        getMethodCaller = function(name) {
          return getCompiled(name, makeMethodCaller, callerCache);
        };
        getGetter = function(name) {
          return getCompiled(name, makeGetter, getterCache);
        };
      }
      function ensureMethod(obj2, methodName) {
        var fn;
        if (obj2 != null) fn = obj2[methodName];
        if (typeof fn !== "function") {
          var message = "Object " + util.classString(obj2) + " has no method '" + util.toString(methodName) + "'";
          throw new Promise2.TypeError(message);
        }
        return fn;
      }
      function caller(obj2) {
        var methodName = this.pop();
        var fn = ensureMethod(obj2, methodName);
        return fn.apply(obj2, this);
      }
      Promise2.prototype.call = function(methodName) {
        var $_len = arguments.length;
        var args = new Array(Math.max($_len - 1, 0));
        for (var $_i = 1; $_i < $_len; ++$_i) {
          args[$_i - 1] = arguments[$_i];
        }
        ;
        if (true) {
          if (canEvaluate2) {
            var maybeCaller = getMethodCaller(methodName);
            if (maybeCaller !== null) {
              return this._then(
                maybeCaller,
                void 0,
                void 0,
                args,
                void 0
              );
            }
          }
        }
        args.push(methodName);
        return this._then(caller, void 0, void 0, args, void 0);
      };
      function namedGetter(obj2) {
        return obj2[this];
      }
      function indexedGetter(obj2) {
        var index = +this;
        if (index < 0) index = Math.max(0, index + obj2.length);
        return obj2[index];
      }
      Promise2.prototype.get = function(propertyName) {
        var isIndex = typeof propertyName === "number";
        var getter;
        if (!isIndex) {
          if (canEvaluate2) {
            var maybeGetter = getGetter(propertyName);
            getter = maybeGetter !== null ? maybeGetter : namedGetter;
          } else {
            getter = namedGetter;
          }
        } else {
          getter = indexedGetter;
        }
        return this._then(getter, void 0, void 0, propertyName, void 0);
      };
    };
  }
});

// node_modules/bluebird/js/release/generators.js
var require_generators = __commonJS({
  "node_modules/bluebird/js/release/generators.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug) {
      var errors = require_errors();
      var TypeError2 = errors.TypeError;
      var util = require_util2();
      var errorObj2 = util.errorObj;
      var tryCatch2 = util.tryCatch;
      var yieldHandlers = [];
      function promiseFromYieldHandler(value, yieldHandlers2, traceParent) {
        for (var i = 0; i < yieldHandlers2.length; ++i) {
          traceParent._pushContext();
          var result = tryCatch2(yieldHandlers2[i])(value);
          traceParent._popContext();
          if (result === errorObj2) {
            traceParent._pushContext();
            var ret2 = Promise2.reject(errorObj2.e);
            traceParent._popContext();
            return ret2;
          }
          var maybePromise = tryConvertToPromise(result, traceParent);
          if (maybePromise instanceof Promise2) return maybePromise;
        }
        return null;
      }
      function PromiseSpawn(generatorFunction, receiver2, yieldHandler, stack) {
        if (debug.cancellation()) {
          var internal = new Promise2(INTERNAL);
          var _finallyPromise = this._finallyPromise = new Promise2(INTERNAL);
          this._promise = internal.lastly(function() {
            return _finallyPromise;
          });
          internal._captureStackTrace();
          internal._setOnCancel(this);
        } else {
          var promise = this._promise = new Promise2(INTERNAL);
          promise._captureStackTrace();
        }
        this._stack = stack;
        this._generatorFunction = generatorFunction;
        this._receiver = receiver2;
        this._generator = void 0;
        this._yieldHandlers = typeof yieldHandler === "function" ? [yieldHandler].concat(yieldHandlers) : yieldHandlers;
        this._yieldedPromise = null;
        this._cancellationPhase = false;
      }
      util.inherits(PromiseSpawn, Proxyable);
      PromiseSpawn.prototype._isResolved = function() {
        return this._promise === null;
      };
      PromiseSpawn.prototype._cleanup = function() {
        this._promise = this._generator = null;
        if (debug.cancellation() && this._finallyPromise !== null) {
          this._finallyPromise._fulfill();
          this._finallyPromise = null;
        }
      };
      PromiseSpawn.prototype._promiseCancelled = function() {
        if (this._isResolved()) return;
        var implementsReturn = typeof this._generator["return"] !== "undefined";
        var result;
        if (!implementsReturn) {
          var reason = new Promise2.CancellationError(
            "generator .return() sentinel"
          );
          Promise2.coroutine.returnSentinel = reason;
          this._promise._attachExtraTrace(reason);
          this._promise._pushContext();
          result = tryCatch2(this._generator["throw"]).call(
            this._generator,
            reason
          );
          this._promise._popContext();
        } else {
          this._promise._pushContext();
          result = tryCatch2(this._generator["return"]).call(
            this._generator,
            void 0
          );
          this._promise._popContext();
        }
        this._cancellationPhase = true;
        this._yieldedPromise = null;
        this._continue(result);
      };
      PromiseSpawn.prototype._promiseFulfilled = function(value) {
        this._yieldedPromise = null;
        this._promise._pushContext();
        var result = tryCatch2(this._generator.next).call(this._generator, value);
        this._promise._popContext();
        this._continue(result);
      };
      PromiseSpawn.prototype._promiseRejected = function(reason) {
        this._yieldedPromise = null;
        this._promise._attachExtraTrace(reason);
        this._promise._pushContext();
        var result = tryCatch2(this._generator["throw"]).call(this._generator, reason);
        this._promise._popContext();
        this._continue(result);
      };
      PromiseSpawn.prototype._resultCancelled = function() {
        if (this._yieldedPromise instanceof Promise2) {
          var promise = this._yieldedPromise;
          this._yieldedPromise = null;
          promise.cancel();
        }
      };
      PromiseSpawn.prototype.promise = function() {
        return this._promise;
      };
      PromiseSpawn.prototype._run = function() {
        this._generator = this._generatorFunction.call(this._receiver);
        this._receiver = this._generatorFunction = void 0;
        this._promiseFulfilled(void 0);
      };
      PromiseSpawn.prototype._continue = function(result) {
        var promise = this._promise;
        if (result === errorObj2) {
          this._cleanup();
          if (this._cancellationPhase) {
            return promise.cancel();
          } else {
            return promise._rejectCallback(result.e, false);
          }
        }
        var value = result.value;
        if (result.done === true) {
          this._cleanup();
          if (this._cancellationPhase) {
            return promise.cancel();
          } else {
            return promise._resolveCallback(value);
          }
        } else {
          var maybePromise = tryConvertToPromise(value, this._promise);
          if (!(maybePromise instanceof Promise2)) {
            maybePromise = promiseFromYieldHandler(
              maybePromise,
              this._yieldHandlers,
              this._promise
            );
            if (maybePromise === null) {
              this._promiseRejected(
                new TypeError2(
                  "A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(value)) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")
                )
              );
              return;
            }
          }
          maybePromise = maybePromise._target();
          var bitField = maybePromise._bitField;
          ;
          if ((bitField & 50397184) === 0) {
            this._yieldedPromise = maybePromise;
            maybePromise._proxy(this, null);
          } else if ((bitField & 33554432) !== 0) {
            Promise2._async.invoke(
              this._promiseFulfilled,
              this,
              maybePromise._value()
            );
          } else if ((bitField & 16777216) !== 0) {
            Promise2._async.invoke(
              this._promiseRejected,
              this,
              maybePromise._reason()
            );
          } else {
            this._promiseCancelled();
          }
        }
      };
      Promise2.coroutine = function(generatorFunction, options) {
        if (typeof generatorFunction !== "function") {
          throw new TypeError2("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
        }
        var yieldHandler = Object(options).yieldHandler;
        var PromiseSpawn$ = PromiseSpawn;
        var stack = new Error().stack;
        return function() {
          var generator = generatorFunction.apply(this, arguments);
          var spawn = new PromiseSpawn$(
            void 0,
            void 0,
            yieldHandler,
            stack
          );
          var ret2 = spawn.promise();
          spawn._generator = generator;
          spawn._promiseFulfilled(void 0);
          return ret2;
        };
      };
      Promise2.coroutine.addYieldHandler = function(fn) {
        if (typeof fn !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(fn));
        }
        yieldHandlers.push(fn);
      };
      Promise2.spawn = function(generatorFunction) {
        debug.deprecated("Promise.spawn()", "Promise.coroutine()");
        if (typeof generatorFunction !== "function") {
          return apiRejection("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
        }
        var spawn = new PromiseSpawn(generatorFunction, this);
        var ret2 = spawn.promise();
        spawn._run(Promise2.spawn);
        return ret2;
      };
    };
  }
});

// node_modules/bluebird/js/release/map.js
var require_map = __commonJS({
  "node_modules/bluebird/js/release/map.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
      var util = require_util2();
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      var async = Promise2._async;
      function MappingPromiseArray(promises, fn, limit, _filter) {
        this.constructor$(promises);
        this._promise._captureStackTrace();
        var context = Promise2._getContext();
        this._callback = util.contextBind(context, fn);
        this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
        this._limit = limit;
        this._inFlight = 0;
        this._queue = [];
        async.invoke(this._asyncInit, this, void 0);
        if (util.isArray(promises)) {
          for (var i = 0; i < promises.length; ++i) {
            var maybePromise = promises[i];
            if (maybePromise instanceof Promise2) {
              maybePromise.suppressUnhandledRejections();
            }
          }
        }
      }
      util.inherits(MappingPromiseArray, PromiseArray);
      MappingPromiseArray.prototype._asyncInit = function() {
        this._init$(void 0, -2);
      };
      MappingPromiseArray.prototype._init = function() {
      };
      MappingPromiseArray.prototype._promiseFulfilled = function(value, index) {
        var values = this._values;
        var length = this.length();
        var preservedValues = this._preservedValues;
        var limit = this._limit;
        if (index < 0) {
          index = index * -1 - 1;
          values[index] = value;
          if (limit >= 1) {
            this._inFlight--;
            this._drainQueue();
            if (this._isResolved()) return true;
          }
        } else {
          if (limit >= 1 && this._inFlight >= limit) {
            values[index] = value;
            this._queue.push(index);
            return false;
          }
          if (preservedValues !== null) preservedValues[index] = value;
          var promise = this._promise;
          var callback = this._callback;
          var receiver2 = promise._boundValue();
          promise._pushContext();
          var ret2 = tryCatch2(callback).call(receiver2, value, index, length);
          var promiseCreated = promise._popContext();
          debug.checkForgottenReturns(
            ret2,
            promiseCreated,
            preservedValues !== null ? "Promise.filter" : "Promise.map",
            promise
          );
          if (ret2 === errorObj2) {
            this._reject(ret2.e);
            return true;
          }
          var maybePromise = tryConvertToPromise(ret2, this._promise);
          if (maybePromise instanceof Promise2) {
            maybePromise = maybePromise._target();
            var bitField = maybePromise._bitField;
            ;
            if ((bitField & 50397184) === 0) {
              if (limit >= 1) this._inFlight++;
              values[index] = maybePromise;
              maybePromise._proxy(this, (index + 1) * -1);
              return false;
            } else if ((bitField & 33554432) !== 0) {
              ret2 = maybePromise._value();
            } else if ((bitField & 16777216) !== 0) {
              this._reject(maybePromise._reason());
              return true;
            } else {
              this._cancel();
              return true;
            }
          }
          values[index] = ret2;
        }
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= length) {
          if (preservedValues !== null) {
            this._filter(values, preservedValues);
          } else {
            this._resolve(values);
          }
          return true;
        }
        return false;
      };
      MappingPromiseArray.prototype._drainQueue = function() {
        var queue = this._queue;
        var limit = this._limit;
        var values = this._values;
        while (queue.length > 0 && this._inFlight < limit) {
          if (this._isResolved()) return;
          var index = queue.pop();
          this._promiseFulfilled(values[index], index);
        }
      };
      MappingPromiseArray.prototype._filter = function(booleans, values) {
        var len = values.length;
        var ret2 = new Array(len);
        var j = 0;
        for (var i = 0; i < len; ++i) {
          if (booleans[i]) ret2[j++] = values[i];
        }
        ret2.length = j;
        this._resolve(ret2);
      };
      MappingPromiseArray.prototype.preservedValues = function() {
        return this._preservedValues;
      };
      function map(promises, fn, options, _filter) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var limit = 0;
        if (options !== void 0) {
          if (typeof options === "object" && options !== null) {
            if (typeof options.concurrency !== "number") {
              return Promise2.reject(
                new TypeError("'concurrency' must be a number but it is " + util.classString(options.concurrency))
              );
            }
            limit = options.concurrency;
          } else {
            return Promise2.reject(new TypeError(
              "options argument must be an object but it is " + util.classString(options)
            ));
          }
        }
        limit = typeof limit === "number" && isFinite(limit) && limit >= 1 ? limit : 0;
        return new MappingPromiseArray(promises, fn, limit, _filter).promise();
      }
      Promise2.prototype.map = function(fn, options) {
        return map(this, fn, options, null);
      };
      Promise2.map = function(promises, fn, options, _filter) {
        return map(promises, fn, options, _filter);
      };
    };
  }
});

// node_modules/bluebird/js/release/nodeify.js
var require_nodeify = __commonJS({
  "node_modules/bluebird/js/release/nodeify.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      var util = require_util2();
      var async = Promise2._async;
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      function spreadAdapter(val, nodeback) {
        var promise = this;
        if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
        var ret2 = tryCatch2(nodeback).apply(promise._boundValue(), [null].concat(val));
        if (ret2 === errorObj2) {
          async.throwLater(ret2.e);
        }
      }
      function successAdapter(val, nodeback) {
        var promise = this;
        var receiver2 = promise._boundValue();
        var ret2 = val === void 0 ? tryCatch2(nodeback).call(receiver2, null) : tryCatch2(nodeback).call(receiver2, null, val);
        if (ret2 === errorObj2) {
          async.throwLater(ret2.e);
        }
      }
      function errorAdapter(reason, nodeback) {
        var promise = this;
        if (!reason) {
          var newReason = new Error(reason + "");
          newReason.cause = reason;
          reason = newReason;
        }
        var ret2 = tryCatch2(nodeback).call(promise._boundValue(), reason);
        if (ret2 === errorObj2) {
          async.throwLater(ret2.e);
        }
      }
      Promise2.prototype.asCallback = Promise2.prototype.nodeify = function(nodeback, options) {
        if (typeof nodeback == "function") {
          var adapter = successAdapter;
          if (options !== void 0 && Object(options).spread) {
            adapter = spreadAdapter;
          }
          this._then(
            adapter,
            errorAdapter,
            void 0,
            this,
            nodeback
          );
        }
        return this;
      };
    };
  }
});

// node_modules/bluebird/js/release/promisify.js
var require_promisify = __commonJS({
  "node_modules/bluebird/js/release/promisify.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var THIS = {};
      var util = require_util2();
      var nodebackForPromise = require_nodeback();
      var withAppended2 = util.withAppended;
      var maybeWrapAsError2 = util.maybeWrapAsError;
      var canEvaluate2 = util.canEvaluate;
      var TypeError2 = require_errors().TypeError;
      var defaultSuffix = "Async";
      var defaultPromisified = { __isPromisified__: true };
      var noCopyProps = [
        "arity",
        "length",
        "name",
        "arguments",
        "caller",
        "callee",
        "prototype",
        "__isPromisified__"
      ];
      var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");
      var defaultFilter = function(name) {
        return util.isIdentifier(name) && name.charAt(0) !== "_" && name !== "constructor";
      };
      function propsFilter(key) {
        return !noCopyPropsPattern.test(key);
      }
      function isPromisified(fn) {
        try {
          return fn.__isPromisified__ === true;
        } catch (e) {
          return false;
        }
      }
      function hasPromisified(obj2, key, suffix) {
        var val = util.getDataPropertyOrDefault(
          obj2,
          key + suffix,
          defaultPromisified
        );
        return val ? isPromisified(val) : false;
      }
      function checkValid(ret2, suffix, suffixRegexp) {
        for (var i = 0; i < ret2.length; i += 2) {
          var key = ret2[i];
          if (suffixRegexp.test(key)) {
            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
            for (var j = 0; j < ret2.length; j += 2) {
              if (ret2[j] === keyWithoutAsyncSuffix) {
                throw new TypeError2("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
              }
            }
          }
        }
      }
      function promisifiableMethods(obj2, suffix, suffixRegexp, filter) {
        var keys = util.inheritedDataKeys(obj2);
        var ret2 = [];
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          var value = obj2[key];
          var passesDefaultFilter = filter === defaultFilter ? true : defaultFilter(key, value, obj2);
          if (typeof value === "function" && !isPromisified(value) && !hasPromisified(obj2, key, suffix) && filter(key, value, obj2, passesDefaultFilter)) {
            ret2.push(key, value);
          }
        }
        checkValid(ret2, suffix, suffixRegexp);
        return ret2;
      }
      var escapeIdentRegex = function(str) {
        return str.replace(/([$])/, "\\$");
      };
      var makeNodePromisifiedEval;
      if (true) {
        var switchCaseArgumentOrder = function(likelyArgumentCount) {
          var ret2 = [likelyArgumentCount];
          var min = Math.max(0, likelyArgumentCount - 1 - 3);
          for (var i = likelyArgumentCount - 1; i >= min; --i) {
            ret2.push(i);
          }
          for (var i = likelyArgumentCount + 1; i <= 3; ++i) {
            ret2.push(i);
          }
          return ret2;
        };
        var argumentSequence = function(argumentCount) {
          return util.filledRange(argumentCount, "_arg", "");
        };
        var parameterDeclaration = function(parameterCount2) {
          return util.filledRange(
            Math.max(parameterCount2, 3),
            "_arg",
            ""
          );
        };
        var parameterCount = function(fn) {
          if (typeof fn.length === "number") {
            return Math.max(Math.min(fn.length, 1023 + 1), 0);
          }
          return 0;
        };
        makeNodePromisifiedEval = function(callback, receiver2, originalName, fn, _, multiArgs) {
          var newParameterCount = Math.max(0, parameterCount(fn) - 1);
          var argumentOrder = switchCaseArgumentOrder(newParameterCount);
          var shouldProxyThis = typeof callback === "string" || receiver2 === THIS;
          function generateCallForArgumentCount(count) {
            var args = argumentSequence(count).join(", ");
            var comma = count > 0 ? ", " : "";
            var ret2;
            if (shouldProxyThis) {
              ret2 = "ret = callback.call(this, {{args}}, nodeback); break;\n";
            } else {
              ret2 = receiver2 === void 0 ? "ret = callback({{args}}, nodeback); break;\n" : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
            }
            return ret2.replace("{{args}}", args).replace(", ", comma);
          }
          function generateArgumentSwitchCase() {
            var ret2 = "";
            for (var i = 0; i < argumentOrder.length; ++i) {
              ret2 += "case " + argumentOrder[i] + ":" + generateCallForArgumentCount(argumentOrder[i]);
            }
            ret2 += "                                                             \n        default:                                                             \n            var args = new Array(len + 1);                                   \n            var i = 0;                                                       \n            for (var i = 0; i < len; ++i) {                                  \n               args[i] = arguments[i];                                       \n            }                                                                \n            args[i] = nodeback;                                              \n            [CodeForCall]                                                    \n            break;                                                           \n        ".replace("[CodeForCall]", shouldProxyThis ? "ret = callback.apply(this, args);\n" : "ret = callback.apply(receiver, args);\n");
            return ret2;
          }
          var getFunctionCode = typeof callback === "string" ? "this != null ? this['" + callback + "'] : fn" : "fn";
          var body = "'use strict';                                                \n        var ret = function (Parameters) {                                    \n            'use strict';                                                    \n            var len = arguments.length;                                      \n            var promise = new Promise(INTERNAL);                             \n            promise._captureStackTrace();                                    \n            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n            var ret;                                                         \n            var callback = tryCatch([GetFunctionCode]);                      \n            switch(len) {                                                    \n                [CodeForSwitchCase]                                          \n            }                                                                \n            if (ret === errorObj) {                                          \n                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n            }                                                                \n            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n            return promise;                                                  \n        };                                                                   \n        notEnumerableProp(ret, '__isPromisified__', true);                   \n        return ret;                                                          \n    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase()).replace("[GetFunctionCode]", getFunctionCode);
          body = body.replace("Parameters", parameterDeclaration(newParameterCount));
          return new Function(
            "Promise",
            "fn",
            "receiver",
            "withAppended",
            "maybeWrapAsError",
            "nodebackForPromise",
            "tryCatch",
            "errorObj",
            "notEnumerableProp",
            "INTERNAL",
            body
          )(
            Promise2,
            fn,
            receiver2,
            withAppended2,
            maybeWrapAsError2,
            nodebackForPromise,
            util.tryCatch,
            util.errorObj,
            util.notEnumerableProp,
            INTERNAL
          );
        };
      }
      function makeNodePromisifiedClosure(callback, receiver2, _, fn, __, multiArgs) {
        var defaultThis = /* @__PURE__ */ function() {
          return this;
        }();
        var method = callback;
        if (typeof method === "string") {
          callback = fn;
        }
        function promisified() {
          var _receiver = receiver2;
          if (receiver2 === THIS) _receiver = this;
          var promise = new Promise2(INTERNAL);
          promise._captureStackTrace();
          var cb = typeof method === "string" && this !== defaultThis ? this[method] : callback;
          var fn2 = nodebackForPromise(promise, multiArgs);
          try {
            cb.apply(_receiver, withAppended2(arguments, fn2));
          } catch (e) {
            promise._rejectCallback(maybeWrapAsError2(e), true, true);
          }
          if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
          return promise;
        }
        util.notEnumerableProp(promisified, "__isPromisified__", true);
        return promisified;
      }
      var makeNodePromisified = canEvaluate2 ? makeNodePromisifiedEval : makeNodePromisifiedClosure;
      function promisifyAll(obj2, suffix, filter, promisifier, multiArgs) {
        var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
        var methods = promisifiableMethods(obj2, suffix, suffixRegexp, filter);
        for (var i = 0, len = methods.length; i < len; i += 2) {
          var key = methods[i];
          var fn = methods[i + 1];
          var promisifiedKey = key + suffix;
          if (promisifier === makeNodePromisified) {
            obj2[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
          } else {
            var promisified = promisifier(fn, function() {
              return makeNodePromisified(
                key,
                THIS,
                key,
                fn,
                suffix,
                multiArgs
              );
            });
            util.notEnumerableProp(promisified, "__isPromisified__", true);
            obj2[promisifiedKey] = promisified;
          }
        }
        util.toFastProperties(obj2);
        return obj2;
      }
      function promisify(callback, receiver2, multiArgs) {
        return makeNodePromisified(
          callback,
          receiver2,
          void 0,
          callback,
          null,
          multiArgs
        );
      }
      Promise2.promisify = function(fn, options) {
        if (typeof fn !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(fn));
        }
        if (isPromisified(fn)) {
          return fn;
        }
        options = Object(options);
        var receiver2 = options.context === void 0 ? THIS : options.context;
        var multiArgs = !!options.multiArgs;
        var ret2 = promisify(fn, receiver2, multiArgs);
        util.copyDescriptors(fn, ret2, propsFilter);
        return ret2;
      };
      Promise2.promisifyAll = function(target, options) {
        if (typeof target !== "function" && typeof target !== "object") {
          throw new TypeError2("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
        }
        options = Object(options);
        var multiArgs = !!options.multiArgs;
        var suffix = options.suffix;
        if (typeof suffix !== "string") suffix = defaultSuffix;
        var filter = options.filter;
        if (typeof filter !== "function") filter = defaultFilter;
        var promisifier = options.promisifier;
        if (typeof promisifier !== "function") promisifier = makeNodePromisified;
        if (!util.isIdentifier(suffix)) {
          throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
        }
        var keys = util.inheritedDataKeys(target);
        for (var i = 0; i < keys.length; ++i) {
          var value = target[keys[i]];
          if (keys[i] !== "constructor" && util.isClass(value)) {
            promisifyAll(
              value.prototype,
              suffix,
              filter,
              promisifier,
              multiArgs
            );
            promisifyAll(value, suffix, filter, promisifier, multiArgs);
          }
        }
        return promisifyAll(target, suffix, filter, promisifier, multiArgs);
      };
    };
  }
});

// node_modules/bluebird/js/release/props.js
var require_props = __commonJS({
  "node_modules/bluebird/js/release/props.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, tryConvertToPromise, apiRejection) {
      var util = require_util2();
      var isObject2 = util.isObject;
      var es52 = require_es5();
      var Es6Map;
      if (typeof Map === "function") Es6Map = Map;
      var mapToEntries = /* @__PURE__ */ function() {
        var index = 0;
        var size = 0;
        function extractEntry(value, key) {
          this[index] = value;
          this[index + size] = key;
          index++;
        }
        return function mapToEntries2(map) {
          size = map.size;
          index = 0;
          var ret2 = new Array(map.size * 2);
          map.forEach(extractEntry, ret2);
          return ret2;
        };
      }();
      var entriesToMap = function(entries) {
        var ret2 = new Es6Map();
        var length = entries.length / 2 | 0;
        for (var i = 0; i < length; ++i) {
          var key = entries[length + i];
          var value = entries[i];
          ret2.set(key, value);
        }
        return ret2;
      };
      function PropertiesPromiseArray(obj2) {
        var isMap = false;
        var entries;
        if (Es6Map !== void 0 && obj2 instanceof Es6Map) {
          entries = mapToEntries(obj2);
          isMap = true;
        } else {
          var keys = es52.keys(obj2);
          var len = keys.length;
          entries = new Array(len * 2);
          for (var i = 0; i < len; ++i) {
            var key = keys[i];
            entries[i] = obj2[key];
            entries[i + len] = key;
          }
        }
        this.constructor$(entries);
        this._isMap = isMap;
        this._init$(void 0, isMap ? -6 : -3);
      }
      util.inherits(PropertiesPromiseArray, PromiseArray);
      PropertiesPromiseArray.prototype._init = function() {
      };
      PropertiesPromiseArray.prototype._promiseFulfilled = function(value, index) {
        this._values[index] = value;
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= this._length) {
          var val;
          if (this._isMap) {
            val = entriesToMap(this._values);
          } else {
            val = {};
            var keyOffset = this.length();
            for (var i = 0, len = this.length(); i < len; ++i) {
              val[this._values[i + keyOffset]] = this._values[i];
            }
          }
          this._resolve(val);
          return true;
        }
        return false;
      };
      PropertiesPromiseArray.prototype.shouldCopyValues = function() {
        return false;
      };
      PropertiesPromiseArray.prototype.getActualLength = function(len) {
        return len >> 1;
      };
      function props(promises) {
        var ret2;
        var castValue = tryConvertToPromise(promises);
        if (!isObject2(castValue)) {
          return apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
        } else if (castValue instanceof Promise2) {
          ret2 = castValue._then(
            Promise2.props,
            void 0,
            void 0,
            void 0,
            void 0
          );
        } else {
          ret2 = new PropertiesPromiseArray(castValue).promise();
        }
        if (castValue instanceof Promise2) {
          ret2._propagateFrom(castValue, 2);
        }
        return ret2;
      }
      Promise2.prototype.props = function() {
        return props(this);
      };
      Promise2.props = function(promises) {
        return props(promises);
      };
    };
  }
});

// node_modules/bluebird/js/release/race.js
var require_race = __commonJS({
  "node_modules/bluebird/js/release/race.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection) {
      var util = require_util2();
      var raceLater = function(promise) {
        return promise.then(function(array) {
          return race(array, promise);
        });
      };
      function race(promises, parent) {
        var maybePromise = tryConvertToPromise(promises);
        if (maybePromise instanceof Promise2) {
          return raceLater(maybePromise);
        } else {
          promises = util.asArray(promises);
          if (promises === null)
            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
        }
        var ret2 = new Promise2(INTERNAL);
        if (parent !== void 0) {
          ret2._propagateFrom(parent, 3);
        }
        var fulfill = ret2._fulfill;
        var reject = ret2._reject;
        for (var i = 0, len = promises.length; i < len; ++i) {
          var val = promises[i];
          if (val === void 0 && !(i in promises)) {
            continue;
          }
          Promise2.cast(val)._then(fulfill, reject, void 0, ret2, null);
        }
        return ret2;
      }
      Promise2.race = function(promises) {
        return race(promises, void 0);
      };
      Promise2.prototype.race = function() {
        return race(this, void 0);
      };
    };
  }
});

// node_modules/bluebird/js/release/reduce.js
var require_reduce = __commonJS({
  "node_modules/bluebird/js/release/reduce.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
      var util = require_util2();
      var tryCatch2 = util.tryCatch;
      function ReductionPromiseArray(promises, fn, initialValue, _each) {
        this.constructor$(promises);
        var context = Promise2._getContext();
        this._fn = util.contextBind(context, fn);
        if (initialValue !== void 0) {
          initialValue = Promise2.resolve(initialValue);
          initialValue._attachCancellationCallback(this);
        }
        this._initialValue = initialValue;
        this._currentCancellable = null;
        if (_each === INTERNAL) {
          this._eachValues = Array(this._length);
        } else if (_each === 0) {
          this._eachValues = null;
        } else {
          this._eachValues = void 0;
        }
        this._promise._captureStackTrace();
        this._init$(void 0, -5);
      }
      util.inherits(ReductionPromiseArray, PromiseArray);
      ReductionPromiseArray.prototype._gotAccum = function(accum) {
        if (this._eachValues !== void 0 && this._eachValues !== null && accum !== INTERNAL) {
          this._eachValues.push(accum);
        }
      };
      ReductionPromiseArray.prototype._eachComplete = function(value) {
        if (this._eachValues !== null) {
          this._eachValues.push(value);
        }
        return this._eachValues;
      };
      ReductionPromiseArray.prototype._init = function() {
      };
      ReductionPromiseArray.prototype._resolveEmptyArray = function() {
        this._resolve(this._eachValues !== void 0 ? this._eachValues : this._initialValue);
      };
      ReductionPromiseArray.prototype.shouldCopyValues = function() {
        return false;
      };
      ReductionPromiseArray.prototype._resolve = function(value) {
        this._promise._resolveCallback(value);
        this._values = null;
      };
      ReductionPromiseArray.prototype._resultCancelled = function(sender) {
        if (sender === this._initialValue) return this._cancel();
        if (this._isResolved()) return;
        this._resultCancelled$();
        if (this._currentCancellable instanceof Promise2) {
          this._currentCancellable.cancel();
        }
        if (this._initialValue instanceof Promise2) {
          this._initialValue.cancel();
        }
      };
      ReductionPromiseArray.prototype._iterate = function(values) {
        this._values = values;
        var value;
        var i;
        var length = values.length;
        if (this._initialValue !== void 0) {
          value = this._initialValue;
          i = 0;
        } else {
          value = Promise2.resolve(values[0]);
          i = 1;
        }
        this._currentCancellable = value;
        for (var j = i; j < length; ++j) {
          var maybePromise = values[j];
          if (maybePromise instanceof Promise2) {
            maybePromise.suppressUnhandledRejections();
          }
        }
        if (!value.isRejected()) {
          for (; i < length; ++i) {
            var ctx = {
              accum: null,
              value: values[i],
              index: i,
              length,
              array: this
            };
            value = value._then(gotAccum, void 0, void 0, ctx, void 0);
            if ((i & 127) === 0) {
              value._setNoAsyncGuarantee();
            }
          }
        }
        if (this._eachValues !== void 0) {
          value = value._then(this._eachComplete, void 0, void 0, this, void 0);
        }
        value._then(completed, completed, void 0, value, this);
      };
      Promise2.prototype.reduce = function(fn, initialValue) {
        return reduce(this, fn, initialValue, null);
      };
      Promise2.reduce = function(promises, fn, initialValue, _each) {
        return reduce(promises, fn, initialValue, _each);
      };
      function completed(valueOrReason, array) {
        if (this.isFulfilled()) {
          array._resolve(valueOrReason);
        } else {
          array._reject(valueOrReason);
        }
      }
      function reduce(promises, fn, initialValue, _each) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
        return array.promise();
      }
      function gotAccum(accum) {
        this.accum = accum;
        this.array._gotAccum(accum);
        var value = tryConvertToPromise(this.value, this.array._promise);
        if (value instanceof Promise2) {
          this.array._currentCancellable = value;
          return value._then(gotValue, void 0, void 0, this, void 0);
        } else {
          return gotValue.call(this, value);
        }
      }
      function gotValue(value) {
        var array = this.array;
        var promise = array._promise;
        var fn = tryCatch2(array._fn);
        promise._pushContext();
        var ret2;
        if (array._eachValues !== void 0) {
          ret2 = fn.call(promise._boundValue(), value, this.index, this.length);
        } else {
          ret2 = fn.call(
            promise._boundValue(),
            this.accum,
            value,
            this.index,
            this.length
          );
        }
        if (ret2 instanceof Promise2) {
          array._currentCancellable = ret2;
        }
        var promiseCreated = promise._popContext();
        debug.checkForgottenReturns(
          ret2,
          promiseCreated,
          array._eachValues !== void 0 ? "Promise.each" : "Promise.reduce",
          promise
        );
        return ret2;
      }
    };
  }
});

// node_modules/bluebird/js/release/settle.js
var require_settle = __commonJS({
  "node_modules/bluebird/js/release/settle.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, debug) {
      var PromiseInspection = Promise2.PromiseInspection;
      var util = require_util2();
      function SettledPromiseArray(values) {
        this.constructor$(values);
      }
      util.inherits(SettledPromiseArray, PromiseArray);
      SettledPromiseArray.prototype._promiseResolved = function(index, inspection) {
        this._values[index] = inspection;
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= this._length) {
          this._resolve(this._values);
          return true;
        }
        return false;
      };
      SettledPromiseArray.prototype._promiseFulfilled = function(value, index) {
        var ret2 = new PromiseInspection();
        ret2._bitField = 33554432;
        ret2._settledValueField = value;
        return this._promiseResolved(index, ret2);
      };
      SettledPromiseArray.prototype._promiseRejected = function(reason, index) {
        var ret2 = new PromiseInspection();
        ret2._bitField = 16777216;
        ret2._settledValueField = reason;
        return this._promiseResolved(index, ret2);
      };
      Promise2.settle = function(promises) {
        debug.deprecated(".settle()", ".reflect()");
        return new SettledPromiseArray(promises).promise();
      };
      Promise2.allSettled = function(promises) {
        return new SettledPromiseArray(promises).promise();
      };
      Promise2.prototype.settle = function() {
        return Promise2.settle(this);
      };
    };
  }
});

// node_modules/bluebird/js/release/some.js
var require_some = __commonJS({
  "node_modules/bluebird/js/release/some.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection) {
      var util = require_util2();
      var RangeError2 = require_errors().RangeError;
      var AggregateError = require_errors().AggregateError;
      var isArray = util.isArray;
      var CANCELLATION = {};
      function SomePromiseArray(values) {
        this.constructor$(values);
        this._howMany = 0;
        this._unwrap = false;
        this._initialized = false;
      }
      util.inherits(SomePromiseArray, PromiseArray);
      SomePromiseArray.prototype._init = function() {
        if (!this._initialized) {
          return;
        }
        if (this._howMany === 0) {
          this._resolve([]);
          return;
        }
        this._init$(void 0, -5);
        var isArrayResolved = isArray(this._values);
        if (!this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill()) {
          this._reject(this._getRangeError(this.length()));
        }
      };
      SomePromiseArray.prototype.init = function() {
        this._initialized = true;
        this._init();
      };
      SomePromiseArray.prototype.setUnwrap = function() {
        this._unwrap = true;
      };
      SomePromiseArray.prototype.howMany = function() {
        return this._howMany;
      };
      SomePromiseArray.prototype.setHowMany = function(count) {
        this._howMany = count;
      };
      SomePromiseArray.prototype._promiseFulfilled = function(value) {
        this._addFulfilled(value);
        if (this._fulfilled() === this.howMany()) {
          this._values.length = this.howMany();
          if (this.howMany() === 1 && this._unwrap) {
            this._resolve(this._values[0]);
          } else {
            this._resolve(this._values);
          }
          return true;
        }
        return false;
      };
      SomePromiseArray.prototype._promiseRejected = function(reason) {
        this._addRejected(reason);
        return this._checkOutcome();
      };
      SomePromiseArray.prototype._promiseCancelled = function() {
        if (this._values instanceof Promise2 || this._values == null) {
          return this._cancel();
        }
        this._addRejected(CANCELLATION);
        return this._checkOutcome();
      };
      SomePromiseArray.prototype._checkOutcome = function() {
        if (this.howMany() > this._canPossiblyFulfill()) {
          var e = new AggregateError();
          for (var i = this.length(); i < this._values.length; ++i) {
            if (this._values[i] !== CANCELLATION) {
              e.push(this._values[i]);
            }
          }
          if (e.length > 0) {
            this._reject(e);
          } else {
            this._cancel();
          }
          return true;
        }
        return false;
      };
      SomePromiseArray.prototype._fulfilled = function() {
        return this._totalResolved;
      };
      SomePromiseArray.prototype._rejected = function() {
        return this._values.length - this.length();
      };
      SomePromiseArray.prototype._addRejected = function(reason) {
        this._values.push(reason);
      };
      SomePromiseArray.prototype._addFulfilled = function(value) {
        this._values[this._totalResolved++] = value;
      };
      SomePromiseArray.prototype._canPossiblyFulfill = function() {
        return this.length() - this._rejected();
      };
      SomePromiseArray.prototype._getRangeError = function(count) {
        var message = "Input array must contain at least " + this._howMany + " items but contains only " + count + " items";
        return new RangeError2(message);
      };
      SomePromiseArray.prototype._resolveEmptyArray = function() {
        this._reject(this._getRangeError(0));
      };
      function some(promises, howMany) {
        if ((howMany | 0) !== howMany || howMany < 0) {
          return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
        }
        var ret2 = new SomePromiseArray(promises);
        var promise = ret2.promise();
        ret2.setHowMany(howMany);
        ret2.init();
        return promise;
      }
      Promise2.some = function(promises, howMany) {
        return some(promises, howMany);
      };
      Promise2.prototype.some = function(howMany) {
        return some(this, howMany);
      };
      Promise2._SomePromiseArray = SomePromiseArray;
    };
  }
});

// node_modules/bluebird/js/release/timers.js
var require_timers = __commonJS({
  "node_modules/bluebird/js/release/timers.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, debug) {
      var util = require_util2();
      var TimeoutError = Promise2.TimeoutError;
      function HandleWrapper(handle) {
        this.handle = handle;
      }
      HandleWrapper.prototype._resultCancelled = function() {
        clearTimeout(this.handle);
      };
      var afterValue = function(value) {
        return delay(+this).thenReturn(value);
      };
      var delay = Promise2.delay = function(ms, value) {
        var ret2;
        var handle;
        if (value !== void 0) {
          ret2 = Promise2.resolve(value)._then(afterValue, null, null, ms, void 0);
          if (debug.cancellation() && value instanceof Promise2) {
            ret2._setOnCancel(value);
          }
        } else {
          ret2 = new Promise2(INTERNAL);
          handle = setTimeout(function() {
            ret2._fulfill();
          }, +ms);
          if (debug.cancellation()) {
            ret2._setOnCancel(new HandleWrapper(handle));
          }
          ret2._captureStackTrace();
        }
        ret2._setAsyncGuaranteed();
        return ret2;
      };
      Promise2.prototype.delay = function(ms) {
        return delay(ms, this);
      };
      var afterTimeout = function(promise, message, parent) {
        var err;
        if (typeof message !== "string") {
          if (message instanceof Error) {
            err = message;
          } else {
            err = new TimeoutError("operation timed out");
          }
        } else {
          err = new TimeoutError(message);
        }
        util.markAsOriginatingFromRejection(err);
        promise._attachExtraTrace(err);
        promise._reject(err);
        if (parent != null) {
          parent.cancel();
        }
      };
      function successClear(value) {
        clearTimeout(this.handle);
        return value;
      }
      function failureClear(reason) {
        clearTimeout(this.handle);
        throw reason;
      }
      Promise2.prototype.timeout = function(ms, message) {
        ms = +ms;
        var ret2, parent;
        var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
          if (ret2.isPending()) {
            afterTimeout(ret2, message, parent);
          }
        }, ms));
        if (debug.cancellation()) {
          parent = this.then();
          ret2 = parent._then(
            successClear,
            failureClear,
            void 0,
            handleWrapper,
            void 0
          );
          ret2._setOnCancel(handleWrapper);
        } else {
          ret2 = this._then(
            successClear,
            failureClear,
            void 0,
            handleWrapper,
            void 0
          );
        }
        return ret2;
      };
    };
  }
});

// node_modules/bluebird/js/release/using.js
var require_using = __commonJS({
  "node_modules/bluebird/js/release/using.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
      var util = require_util2();
      var TypeError2 = require_errors().TypeError;
      var inherits2 = require_util2().inherits;
      var errorObj2 = util.errorObj;
      var tryCatch2 = util.tryCatch;
      var NULL = {};
      function thrower2(e) {
        setTimeout(function() {
          throw e;
        }, 0);
      }
      function castPreservingDisposable(thenable) {
        var maybePromise = tryConvertToPromise(thenable);
        if (maybePromise !== thenable && typeof thenable._isDisposable === "function" && typeof thenable._getDisposer === "function" && thenable._isDisposable()) {
          maybePromise._setDisposable(thenable._getDisposer());
        }
        return maybePromise;
      }
      function dispose(resources, inspection) {
        var i = 0;
        var len = resources.length;
        var ret2 = new Promise2(INTERNAL);
        function iterator() {
          if (i >= len) return ret2._fulfill();
          var maybePromise = castPreservingDisposable(resources[i++]);
          if (maybePromise instanceof Promise2 && maybePromise._isDisposable()) {
            try {
              maybePromise = tryConvertToPromise(
                maybePromise._getDisposer().tryDispose(inspection),
                resources.promise
              );
            } catch (e) {
              return thrower2(e);
            }
            if (maybePromise instanceof Promise2) {
              return maybePromise._then(
                iterator,
                thrower2,
                null,
                null,
                null
              );
            }
          }
          iterator();
        }
        iterator();
        return ret2;
      }
      function Disposer(data, promise, context) {
        this._data = data;
        this._promise = promise;
        this._context = context;
      }
      Disposer.prototype.data = function() {
        return this._data;
      };
      Disposer.prototype.promise = function() {
        return this._promise;
      };
      Disposer.prototype.resource = function() {
        if (this.promise().isFulfilled()) {
          return this.promise().value();
        }
        return NULL;
      };
      Disposer.prototype.tryDispose = function(inspection) {
        var resource = this.resource();
        var context = this._context;
        if (context !== void 0) context._pushContext();
        var ret2 = resource !== NULL ? this.doDispose(resource, inspection) : null;
        if (context !== void 0) context._popContext();
        this._promise._unsetDisposable();
        this._data = null;
        return ret2;
      };
      Disposer.isDisposer = function(d) {
        return d != null && typeof d.resource === "function" && typeof d.tryDispose === "function";
      };
      function FunctionDisposer(fn, promise, context) {
        this.constructor$(fn, promise, context);
      }
      inherits2(FunctionDisposer, Disposer);
      FunctionDisposer.prototype.doDispose = function(resource, inspection) {
        var fn = this.data();
        return fn.call(resource, resource, inspection);
      };
      function maybeUnwrapDisposer(value) {
        if (Disposer.isDisposer(value)) {
          this.resources[this.index]._setDisposable(value);
          return value.promise();
        }
        return value;
      }
      function ResourceList(length) {
        this.length = length;
        this.promise = null;
        this[length - 1] = null;
      }
      ResourceList.prototype._resultCancelled = function() {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
          var item = this[i];
          if (item instanceof Promise2) {
            item.cancel();
          }
        }
      };
      Promise2.using = function() {
        var len = arguments.length;
        if (len < 2) return apiRejection(
          "you must pass at least 2 arguments to Promise.using"
        );
        var fn = arguments[len - 1];
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var input;
        var spreadArgs = true;
        if (len === 2 && Array.isArray(arguments[0])) {
          input = arguments[0];
          len = input.length;
          spreadArgs = false;
        } else {
          input = arguments;
          len--;
        }
        var resources = new ResourceList(len);
        for (var i = 0; i < len; ++i) {
          var resource = input[i];
          if (Disposer.isDisposer(resource)) {
            var disposer = resource;
            resource = resource.promise();
            resource._setDisposable(disposer);
          } else {
            var maybePromise = tryConvertToPromise(resource);
            if (maybePromise instanceof Promise2) {
              resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
                resources,
                index: i
              }, void 0);
            }
          }
          resources[i] = resource;
        }
        var reflectedResources = new Array(resources.length);
        for (var i = 0; i < reflectedResources.length; ++i) {
          reflectedResources[i] = Promise2.resolve(resources[i]).reflect();
        }
        var resultPromise = Promise2.all(reflectedResources).then(function(inspections) {
          for (var i2 = 0; i2 < inspections.length; ++i2) {
            var inspection = inspections[i2];
            if (inspection.isRejected()) {
              errorObj2.e = inspection.error();
              return errorObj2;
            } else if (!inspection.isFulfilled()) {
              resultPromise.cancel();
              return;
            }
            inspections[i2] = inspection.value();
          }
          promise._pushContext();
          fn = tryCatch2(fn);
          var ret2 = spreadArgs ? fn.apply(void 0, inspections) : fn(inspections);
          var promiseCreated = promise._popContext();
          debug.checkForgottenReturns(
            ret2,
            promiseCreated,
            "Promise.using",
            promise
          );
          return ret2;
        });
        var promise = resultPromise.lastly(function() {
          var inspection = new Promise2.PromiseInspection(resultPromise);
          return dispose(resources, inspection);
        });
        resources.promise = promise;
        promise._setOnCancel(resources);
        return promise;
      };
      Promise2.prototype._setDisposable = function(disposer) {
        this._bitField = this._bitField | 131072;
        this._disposer = disposer;
      };
      Promise2.prototype._isDisposable = function() {
        return (this._bitField & 131072) > 0;
      };
      Promise2.prototype._getDisposer = function() {
        return this._disposer;
      };
      Promise2.prototype._unsetDisposable = function() {
        this._bitField = this._bitField & ~131072;
        this._disposer = void 0;
      };
      Promise2.prototype.disposer = function(fn) {
        if (typeof fn === "function") {
          return new FunctionDisposer(fn, this, createContext());
        }
        throw new TypeError2();
      };
    };
  }
});

// node_modules/bluebird/js/release/any.js
var require_any = __commonJS({
  "node_modules/bluebird/js/release/any.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      var SomePromiseArray = Promise2._SomePromiseArray;
      function any(promises) {
        var ret2 = new SomePromiseArray(promises);
        var promise = ret2.promise();
        ret2.setHowMany(1);
        ret2.setUnwrap();
        ret2.init();
        return promise;
      }
      Promise2.any = function(promises) {
        return any(promises);
      };
      Promise2.prototype.any = function() {
        return any(this);
      };
    };
  }
});

// node_modules/bluebird/js/release/each.js
var require_each = __commonJS({
  "node_modules/bluebird/js/release/each.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var PromiseReduce = Promise2.reduce;
      var PromiseAll = Promise2.all;
      function promiseAllThis() {
        return PromiseAll(this);
      }
      function PromiseMapSeries(promises, fn) {
        return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
      }
      Promise2.prototype.each = function(fn) {
        return PromiseReduce(this, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, this, void 0);
      };
      Promise2.prototype.mapSeries = function(fn) {
        return PromiseReduce(this, fn, INTERNAL, INTERNAL);
      };
      Promise2.each = function(promises, fn) {
        return PromiseReduce(promises, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, promises, void 0);
      };
      Promise2.mapSeries = PromiseMapSeries;
    };
  }
});

// node_modules/bluebird/js/release/filter.js
var require_filter = __commonJS({
  "node_modules/bluebird/js/release/filter.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var PromiseMap = Promise2.map;
      Promise2.prototype.filter = function(fn, options) {
        return PromiseMap(this, fn, options, INTERNAL);
      };
      Promise2.filter = function(promises, fn, options) {
        return PromiseMap(promises, fn, options, INTERNAL);
      };
    };
  }
});

// node_modules/bluebird/js/release/promise.js
var require_promise = __commonJS({
  "node_modules/bluebird/js/release/promise.js"(exports2, module2) {
    "use strict";
    module2.exports = function() {
      var makeSelfResolutionError = function() {
        return new TypeError2("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
      };
      var reflectHandler2 = function() {
        return new Promise2.PromiseInspection(this._target());
      };
      var apiRejection = function(msg) {
        return Promise2.reject(new TypeError2(msg));
      };
      function Proxyable() {
      }
      var UNDEFINED_BINDING = {};
      var util = require_util2();
      util.setReflectHandler(reflectHandler2);
      var getDomain = function() {
        var domain = process.domain;
        if (domain === void 0) {
          return null;
        }
        return domain;
      };
      var getContextDefault = function() {
        return null;
      };
      var getContextDomain = function() {
        return {
          domain: getDomain(),
          async: null
        };
      };
      var AsyncResource = util.isNode && util.nodeSupportsAsyncResource ? require("async_hooks").AsyncResource : null;
      var getContextAsyncHooks = function() {
        return {
          domain: getDomain(),
          async: new AsyncResource("Bluebird::Promise")
        };
      };
      var getContext = util.isNode ? getContextDomain : getContextDefault;
      util.notEnumerableProp(Promise2, "_getContext", getContext);
      var enableAsyncHooks = function() {
        getContext = getContextAsyncHooks;
        util.notEnumerableProp(Promise2, "_getContext", getContextAsyncHooks);
      };
      var disableAsyncHooks = function() {
        getContext = getContextDomain;
        util.notEnumerableProp(Promise2, "_getContext", getContextDomain);
      };
      var es52 = require_es5();
      var Async = require_async();
      var async = new Async();
      es52.defineProperty(Promise2, "_async", { value: async });
      var errors = require_errors();
      var TypeError2 = Promise2.TypeError = errors.TypeError;
      Promise2.RangeError = errors.RangeError;
      var CancellationError = Promise2.CancellationError = errors.CancellationError;
      Promise2.TimeoutError = errors.TimeoutError;
      Promise2.OperationalError = errors.OperationalError;
      Promise2.RejectionError = errors.OperationalError;
      Promise2.AggregateError = errors.AggregateError;
      var INTERNAL = function() {
      };
      var APPLY = {};
      var NEXT_FILTER = {};
      var tryConvertToPromise = require_thenables()(Promise2, INTERNAL);
      var PromiseArray = require_promise_array()(
        Promise2,
        INTERNAL,
        tryConvertToPromise,
        apiRejection,
        Proxyable
      );
      var Context = require_context()(Promise2);
      var createContext = Context.create;
      var debug = require_debuggability()(
        Promise2,
        Context,
        enableAsyncHooks,
        disableAsyncHooks
      );
      var CapturedTrace = debug.CapturedTrace;
      var PassThroughHandlerContext = require_finally()(Promise2, tryConvertToPromise, NEXT_FILTER);
      var catchFilter = require_catch_filter()(NEXT_FILTER);
      var nodebackForPromise = require_nodeback();
      var errorObj2 = util.errorObj;
      var tryCatch2 = util.tryCatch;
      function check(self2, executor) {
        if (self2 == null || self2.constructor !== Promise2) {
          throw new TypeError2("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
        }
        if (typeof executor !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(executor));
        }
      }
      function Promise2(executor) {
        if (executor !== INTERNAL) {
          check(this, executor);
        }
        this._bitField = 0;
        this._fulfillmentHandler0 = void 0;
        this._rejectionHandler0 = void 0;
        this._promise0 = void 0;
        this._receiver0 = void 0;
        this._resolveFromExecutor(executor);
        this._promiseCreated();
        this._fireEvent("promiseCreated", this);
      }
      Promise2.prototype.toString = function() {
        return "[object Promise]";
      };
      Promise2.prototype.caught = Promise2.prototype["catch"] = function(fn) {
        var len = arguments.length;
        if (len > 1) {
          var catchInstances = new Array(len - 1), j = 0, i;
          for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
              catchInstances[j++] = item;
            } else {
              return apiRejection("Catch statement predicate: expecting an object but got " + util.classString(item));
            }
          }
          catchInstances.length = j;
          fn = arguments[i];
          if (typeof fn !== "function") {
            throw new TypeError2("The last argument to .catch() must be a function, got " + util.toString(fn));
          }
          return this.then(void 0, catchFilter(catchInstances, fn, this));
        }
        return this.then(void 0, fn);
      };
      Promise2.prototype.reflect = function() {
        return this._then(
          reflectHandler2,
          reflectHandler2,
          void 0,
          this,
          void 0
        );
      };
      Promise2.prototype.then = function(didFulfill, didReject) {
        if (debug.warnings() && arguments.length > 0 && typeof didFulfill !== "function" && typeof didReject !== "function") {
          var msg = ".then() only accepts functions but was passed: " + util.classString(didFulfill);
          if (arguments.length > 1) {
            msg += ", " + util.classString(didReject);
          }
          this._warn(msg);
        }
        return this._then(didFulfill, didReject, void 0, void 0, void 0);
      };
      Promise2.prototype.done = function(didFulfill, didReject) {
        var promise = this._then(didFulfill, didReject, void 0, void 0, void 0);
        promise._setIsFinal();
      };
      Promise2.prototype.spread = function(fn) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        return this.all()._then(fn, void 0, void 0, APPLY, void 0);
      };
      Promise2.prototype.toJSON = function() {
        var ret2 = {
          isFulfilled: false,
          isRejected: false,
          fulfillmentValue: void 0,
          rejectionReason: void 0
        };
        if (this.isFulfilled()) {
          ret2.fulfillmentValue = this.value();
          ret2.isFulfilled = true;
        } else if (this.isRejected()) {
          ret2.rejectionReason = this.reason();
          ret2.isRejected = true;
        }
        return ret2;
      };
      Promise2.prototype.all = function() {
        if (arguments.length > 0) {
          this._warn(".all() was passed arguments but it does not take any");
        }
        return new PromiseArray(this).promise();
      };
      Promise2.prototype.error = function(fn) {
        return this.caught(util.originatesFromRejection, fn);
      };
      Promise2.getNewLibraryCopy = module2.exports;
      Promise2.is = function(val) {
        return val instanceof Promise2;
      };
      Promise2.fromNode = Promise2.fromCallback = function(fn) {
        var ret2 = new Promise2(INTERNAL);
        ret2._captureStackTrace();
        var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs : false;
        var result = tryCatch2(fn)(nodebackForPromise(ret2, multiArgs));
        if (result === errorObj2) {
          ret2._rejectCallback(result.e, true);
        }
        if (!ret2._isFateSealed()) ret2._setAsyncGuaranteed();
        return ret2;
      };
      Promise2.all = function(promises) {
        return new PromiseArray(promises).promise();
      };
      Promise2.cast = function(obj2) {
        var ret2 = tryConvertToPromise(obj2);
        if (!(ret2 instanceof Promise2)) {
          ret2 = new Promise2(INTERNAL);
          ret2._captureStackTrace();
          ret2._setFulfilled();
          ret2._rejectionHandler0 = obj2;
        }
        return ret2;
      };
      Promise2.resolve = Promise2.fulfilled = Promise2.cast;
      Promise2.reject = Promise2.rejected = function(reason) {
        var ret2 = new Promise2(INTERNAL);
        ret2._captureStackTrace();
        ret2._rejectCallback(reason, true);
        return ret2;
      };
      Promise2.setScheduler = function(fn) {
        if (typeof fn !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(fn));
        }
        return async.setScheduler(fn);
      };
      Promise2.prototype._then = function(didFulfill, didReject, _, receiver2, internalData) {
        var haveInternalData = internalData !== void 0;
        var promise = haveInternalData ? internalData : new Promise2(INTERNAL);
        var target = this._target();
        var bitField = target._bitField;
        if (!haveInternalData) {
          promise._propagateFrom(this, 3);
          promise._captureStackTrace();
          if (receiver2 === void 0 && (this._bitField & 2097152) !== 0) {
            if (!((bitField & 50397184) === 0)) {
              receiver2 = this._boundValue();
            } else {
              receiver2 = target === this ? void 0 : this._boundTo;
            }
          }
          this._fireEvent("promiseChained", this, promise);
        }
        var context = getContext();
        if (!((bitField & 50397184) === 0)) {
          var handler7, value, settler = target._settlePromiseCtx;
          if ((bitField & 33554432) !== 0) {
            value = target._rejectionHandler0;
            handler7 = didFulfill;
          } else if ((bitField & 16777216) !== 0) {
            value = target._fulfillmentHandler0;
            handler7 = didReject;
            target._unsetRejectionIsUnhandled();
          } else {
            settler = target._settlePromiseLateCancellationObserver;
            value = new CancellationError("late cancellation observer");
            target._attachExtraTrace(value);
            handler7 = didReject;
          }
          async.invoke(settler, target, {
            handler: util.contextBind(context, handler7),
            promise,
            receiver: receiver2,
            value
          });
        } else {
          target._addCallbacks(
            didFulfill,
            didReject,
            promise,
            receiver2,
            context
          );
        }
        return promise;
      };
      Promise2.prototype._length = function() {
        return this._bitField & 65535;
      };
      Promise2.prototype._isFateSealed = function() {
        return (this._bitField & 117506048) !== 0;
      };
      Promise2.prototype._isFollowing = function() {
        return (this._bitField & 67108864) === 67108864;
      };
      Promise2.prototype._setLength = function(len) {
        this._bitField = this._bitField & -65536 | len & 65535;
      };
      Promise2.prototype._setFulfilled = function() {
        this._bitField = this._bitField | 33554432;
        this._fireEvent("promiseFulfilled", this);
      };
      Promise2.prototype._setRejected = function() {
        this._bitField = this._bitField | 16777216;
        this._fireEvent("promiseRejected", this);
      };
      Promise2.prototype._setFollowing = function() {
        this._bitField = this._bitField | 67108864;
        this._fireEvent("promiseResolved", this);
      };
      Promise2.prototype._setIsFinal = function() {
        this._bitField = this._bitField | 4194304;
      };
      Promise2.prototype._isFinal = function() {
        return (this._bitField & 4194304) > 0;
      };
      Promise2.prototype._unsetCancelled = function() {
        this._bitField = this._bitField & ~65536;
      };
      Promise2.prototype._setCancelled = function() {
        this._bitField = this._bitField | 65536;
        this._fireEvent("promiseCancelled", this);
      };
      Promise2.prototype._setWillBeCancelled = function() {
        this._bitField = this._bitField | 8388608;
      };
      Promise2.prototype._setAsyncGuaranteed = function() {
        if (async.hasCustomScheduler()) return;
        var bitField = this._bitField;
        this._bitField = bitField | (bitField & 536870912) >> 2 ^ 134217728;
      };
      Promise2.prototype._setNoAsyncGuarantee = function() {
        this._bitField = (this._bitField | 536870912) & ~134217728;
      };
      Promise2.prototype._receiverAt = function(index) {
        var ret2 = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
        if (ret2 === UNDEFINED_BINDING) {
          return void 0;
        } else if (ret2 === void 0 && this._isBound()) {
          return this._boundValue();
        }
        return ret2;
      };
      Promise2.prototype._promiseAt = function(index) {
        return this[index * 4 - 4 + 2];
      };
      Promise2.prototype._fulfillmentHandlerAt = function(index) {
        return this[index * 4 - 4 + 0];
      };
      Promise2.prototype._rejectionHandlerAt = function(index) {
        return this[index * 4 - 4 + 1];
      };
      Promise2.prototype._boundValue = function() {
      };
      Promise2.prototype._migrateCallback0 = function(follower) {
        var bitField = follower._bitField;
        var fulfill = follower._fulfillmentHandler0;
        var reject = follower._rejectionHandler0;
        var promise = follower._promise0;
        var receiver2 = follower._receiverAt(0);
        if (receiver2 === void 0) receiver2 = UNDEFINED_BINDING;
        this._addCallbacks(fulfill, reject, promise, receiver2, null);
      };
      Promise2.prototype._migrateCallbackAt = function(follower, index) {
        var fulfill = follower._fulfillmentHandlerAt(index);
        var reject = follower._rejectionHandlerAt(index);
        var promise = follower._promiseAt(index);
        var receiver2 = follower._receiverAt(index);
        if (receiver2 === void 0) receiver2 = UNDEFINED_BINDING;
        this._addCallbacks(fulfill, reject, promise, receiver2, null);
      };
      Promise2.prototype._addCallbacks = function(fulfill, reject, promise, receiver2, context) {
        var index = this._length();
        if (index >= 65535 - 4) {
          index = 0;
          this._setLength(0);
        }
        if (index === 0) {
          this._promise0 = promise;
          this._receiver0 = receiver2;
          if (typeof fulfill === "function") {
            this._fulfillmentHandler0 = util.contextBind(context, fulfill);
          }
          if (typeof reject === "function") {
            this._rejectionHandler0 = util.contextBind(context, reject);
          }
        } else {
          var base = index * 4 - 4;
          this[base + 2] = promise;
          this[base + 3] = receiver2;
          if (typeof fulfill === "function") {
            this[base + 0] = util.contextBind(context, fulfill);
          }
          if (typeof reject === "function") {
            this[base + 1] = util.contextBind(context, reject);
          }
        }
        this._setLength(index + 1);
        return index;
      };
      Promise2.prototype._proxy = function(proxyable, arg) {
        this._addCallbacks(void 0, void 0, arg, proxyable, null);
      };
      Promise2.prototype._resolveCallback = function(value, shouldBind) {
        if ((this._bitField & 117506048) !== 0) return;
        if (value === this)
          return this._rejectCallback(makeSelfResolutionError(), false);
        var maybePromise = tryConvertToPromise(value, this);
        if (!(maybePromise instanceof Promise2)) return this._fulfill(value);
        if (shouldBind) this._propagateFrom(maybePromise, 2);
        var promise = maybePromise._target();
        if (promise === this) {
          this._reject(makeSelfResolutionError());
          return;
        }
        var bitField = promise._bitField;
        if ((bitField & 50397184) === 0) {
          var len = this._length();
          if (len > 0) promise._migrateCallback0(this);
          for (var i = 1; i < len; ++i) {
            promise._migrateCallbackAt(this, i);
          }
          this._setFollowing();
          this._setLength(0);
          this._setFollowee(maybePromise);
        } else if ((bitField & 33554432) !== 0) {
          this._fulfill(promise._value());
        } else if ((bitField & 16777216) !== 0) {
          this._reject(promise._reason());
        } else {
          var reason = new CancellationError("late cancellation observer");
          promise._attachExtraTrace(reason);
          this._reject(reason);
        }
      };
      Promise2.prototype._rejectCallback = function(reason, synchronous, ignoreNonErrorWarnings) {
        var trace = util.ensureErrorObject(reason);
        var hasStack = trace === reason;
        if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
          var message = "a promise was rejected with a non-error: " + util.classString(reason);
          this._warn(message, true);
        }
        this._attachExtraTrace(trace, synchronous ? hasStack : false);
        this._reject(reason);
      };
      Promise2.prototype._resolveFromExecutor = function(executor) {
        if (executor === INTERNAL) return;
        var promise = this;
        this._captureStackTrace();
        this._pushContext();
        var synchronous = true;
        var r = this._execute(executor, function(value) {
          promise._resolveCallback(value);
        }, function(reason) {
          promise._rejectCallback(reason, synchronous);
        });
        synchronous = false;
        this._popContext();
        if (r !== void 0) {
          promise._rejectCallback(r, true);
        }
      };
      Promise2.prototype._settlePromiseFromHandler = function(handler7, receiver2, value, promise) {
        var bitField = promise._bitField;
        if ((bitField & 65536) !== 0) return;
        promise._pushContext();
        var x;
        if (receiver2 === APPLY) {
          if (!value || typeof value.length !== "number") {
            x = errorObj2;
            x.e = new TypeError2("cannot .spread() a non-array: " + util.classString(value));
          } else {
            x = tryCatch2(handler7).apply(this._boundValue(), value);
          }
        } else {
          x = tryCatch2(handler7).call(receiver2, value);
        }
        var promiseCreated = promise._popContext();
        bitField = promise._bitField;
        if ((bitField & 65536) !== 0) return;
        if (x === NEXT_FILTER) {
          promise._reject(value);
        } else if (x === errorObj2) {
          promise._rejectCallback(x.e, false);
        } else {
          debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
          promise._resolveCallback(x);
        }
      };
      Promise2.prototype._target = function() {
        var ret2 = this;
        while (ret2._isFollowing()) ret2 = ret2._followee();
        return ret2;
      };
      Promise2.prototype._followee = function() {
        return this._rejectionHandler0;
      };
      Promise2.prototype._setFollowee = function(promise) {
        this._rejectionHandler0 = promise;
      };
      Promise2.prototype._settlePromise = function(promise, handler7, receiver2, value) {
        var isPromise = promise instanceof Promise2;
        var bitField = this._bitField;
        var asyncGuaranteed = (bitField & 134217728) !== 0;
        if ((bitField & 65536) !== 0) {
          if (isPromise) promise._invokeInternalOnCancel();
          if (receiver2 instanceof PassThroughHandlerContext && receiver2.isFinallyHandler()) {
            receiver2.cancelPromise = promise;
            if (tryCatch2(handler7).call(receiver2, value) === errorObj2) {
              promise._reject(errorObj2.e);
            }
          } else if (handler7 === reflectHandler2) {
            promise._fulfill(reflectHandler2.call(receiver2));
          } else if (receiver2 instanceof Proxyable) {
            receiver2._promiseCancelled(promise);
          } else if (isPromise || promise instanceof PromiseArray) {
            promise._cancel();
          } else {
            receiver2.cancel();
          }
        } else if (typeof handler7 === "function") {
          if (!isPromise) {
            handler7.call(receiver2, value, promise);
          } else {
            if (asyncGuaranteed) promise._setAsyncGuaranteed();
            this._settlePromiseFromHandler(handler7, receiver2, value, promise);
          }
        } else if (receiver2 instanceof Proxyable) {
          if (!receiver2._isResolved()) {
            if ((bitField & 33554432) !== 0) {
              receiver2._promiseFulfilled(value, promise);
            } else {
              receiver2._promiseRejected(value, promise);
            }
          }
        } else if (isPromise) {
          if (asyncGuaranteed) promise._setAsyncGuaranteed();
          if ((bitField & 33554432) !== 0) {
            promise._fulfill(value);
          } else {
            promise._reject(value);
          }
        }
      };
      Promise2.prototype._settlePromiseLateCancellationObserver = function(ctx) {
        var handler7 = ctx.handler;
        var promise = ctx.promise;
        var receiver2 = ctx.receiver;
        var value = ctx.value;
        if (typeof handler7 === "function") {
          if (!(promise instanceof Promise2)) {
            handler7.call(receiver2, value, promise);
          } else {
            this._settlePromiseFromHandler(handler7, receiver2, value, promise);
          }
        } else if (promise instanceof Promise2) {
          promise._reject(value);
        }
      };
      Promise2.prototype._settlePromiseCtx = function(ctx) {
        this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
      };
      Promise2.prototype._settlePromise0 = function(handler7, value, bitField) {
        var promise = this._promise0;
        var receiver2 = this._receiverAt(0);
        this._promise0 = void 0;
        this._receiver0 = void 0;
        this._settlePromise(promise, handler7, receiver2, value);
      };
      Promise2.prototype._clearCallbackDataAtIndex = function(index) {
        var base = index * 4 - 4;
        this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = void 0;
      };
      Promise2.prototype._fulfill = function(value) {
        var bitField = this._bitField;
        if ((bitField & 117506048) >>> 16) return;
        if (value === this) {
          var err = makeSelfResolutionError();
          this._attachExtraTrace(err);
          return this._reject(err);
        }
        this._setFulfilled();
        this._rejectionHandler0 = value;
        if ((bitField & 65535) > 0) {
          if ((bitField & 134217728) !== 0) {
            this._settlePromises();
          } else {
            async.settlePromises(this);
          }
          this._dereferenceTrace();
        }
      };
      Promise2.prototype._reject = function(reason) {
        var bitField = this._bitField;
        if ((bitField & 117506048) >>> 16) return;
        this._setRejected();
        this._fulfillmentHandler0 = reason;
        if (this._isFinal()) {
          return async.fatalError(reason, util.isNode);
        }
        if ((bitField & 65535) > 0) {
          async.settlePromises(this);
        } else {
          this._ensurePossibleRejectionHandled();
        }
      };
      Promise2.prototype._fulfillPromises = function(len, value) {
        for (var i = 1; i < len; i++) {
          var handler7 = this._fulfillmentHandlerAt(i);
          var promise = this._promiseAt(i);
          var receiver2 = this._receiverAt(i);
          this._clearCallbackDataAtIndex(i);
          this._settlePromise(promise, handler7, receiver2, value);
        }
      };
      Promise2.prototype._rejectPromises = function(len, reason) {
        for (var i = 1; i < len; i++) {
          var handler7 = this._rejectionHandlerAt(i);
          var promise = this._promiseAt(i);
          var receiver2 = this._receiverAt(i);
          this._clearCallbackDataAtIndex(i);
          this._settlePromise(promise, handler7, receiver2, reason);
        }
      };
      Promise2.prototype._settlePromises = function() {
        var bitField = this._bitField;
        var len = bitField & 65535;
        if (len > 0) {
          if ((bitField & 16842752) !== 0) {
            var reason = this._fulfillmentHandler0;
            this._settlePromise0(this._rejectionHandler0, reason, bitField);
            this._rejectPromises(len, reason);
          } else {
            var value = this._rejectionHandler0;
            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
            this._fulfillPromises(len, value);
          }
          this._setLength(0);
        }
        this._clearCancellationData();
      };
      Promise2.prototype._settledValue = function() {
        var bitField = this._bitField;
        if ((bitField & 33554432) !== 0) {
          return this._rejectionHandler0;
        } else if ((bitField & 16777216) !== 0) {
          return this._fulfillmentHandler0;
        }
      };
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        es52.defineProperty(Promise2.prototype, Symbol.toStringTag, {
          get: function() {
            return "Object";
          }
        });
      }
      function deferResolve(v) {
        this.promise._resolveCallback(v);
      }
      function deferReject(v) {
        this.promise._rejectCallback(v, false);
      }
      Promise2.defer = Promise2.pending = function() {
        debug.deprecated("Promise.defer", "new Promise");
        var promise = new Promise2(INTERNAL);
        return {
          promise,
          resolve: deferResolve,
          reject: deferReject
        };
      };
      util.notEnumerableProp(
        Promise2,
        "_makeSelfResolutionError",
        makeSelfResolutionError
      );
      require_method()(
        Promise2,
        INTERNAL,
        tryConvertToPromise,
        apiRejection,
        debug
      );
      require_bind()(Promise2, INTERNAL, tryConvertToPromise, debug);
      require_cancel()(Promise2, PromiseArray, apiRejection, debug);
      require_direct_resolve()(Promise2);
      require_synchronous_inspection()(Promise2);
      require_join()(
        Promise2,
        PromiseArray,
        tryConvertToPromise,
        INTERNAL,
        async
      );
      Promise2.Promise = Promise2;
      Promise2.version = "3.7.2";
      require_call_get()(Promise2);
      require_generators()(Promise2, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
      require_map()(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
      require_nodeify()(Promise2);
      require_promisify()(Promise2, INTERNAL);
      require_props()(Promise2, PromiseArray, tryConvertToPromise, apiRejection);
      require_race()(Promise2, INTERNAL, tryConvertToPromise, apiRejection);
      require_reduce()(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
      require_settle()(Promise2, PromiseArray, debug);
      require_some()(Promise2, PromiseArray, apiRejection);
      require_timers()(Promise2, INTERNAL, debug);
      require_using()(Promise2, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
      require_any()(Promise2);
      require_each()(Promise2, INTERNAL);
      require_filter()(Promise2, INTERNAL);
      util.toFastProperties(Promise2);
      util.toFastProperties(Promise2.prototype);
      function fillTypes(value) {
        var p = new Promise2(INTERNAL);
        p._fulfillmentHandler0 = value;
        p._rejectionHandler0 = value;
        p._promise0 = value;
        p._receiver0 = value;
      }
      fillTypes({ a: 1 });
      fillTypes({ b: 2 });
      fillTypes({ c: 3 });
      fillTypes(1);
      fillTypes(function() {
      });
      fillTypes(void 0);
      fillTypes(false);
      fillTypes(new Promise2(INTERNAL));
      debug.setBounds(Async.firstLineError, util.lastLineError);
      return Promise2;
    };
  }
});

// node_modules/bluebird/js/release/bluebird.js
var require_bluebird = __commonJS({
  "node_modules/bluebird/js/release/bluebird.js"(exports2, module2) {
    "use strict";
    var old;
    if (typeof Promise !== "undefined") old = Promise;
    function noConflict() {
      try {
        if (Promise === bluebird) Promise = old;
      } catch (e) {
      }
      return bluebird;
    }
    var bluebird = require_promise()();
    bluebird.noConflict = noConflict;
    module2.exports = bluebird;
  }
});

// node_modules/unzipper/lib/Open/directory.js
var require_directory = __commonJS({
  "node_modules/unzipper/lib/Open/directory.js"(exports2, module2) {
    "use strict";
    var PullStream = require_PullStream();
    var unzip = require_unzip();
    var BufferStream = require_BufferStream();
    var parseExtraField = require_parseExtraField();
    var path2 = require("path");
    var fs2 = require_lib();
    var parseDateTime = require_parseDateTime();
    var parseBuffer = require_parseBuffer();
    var Bluebird = require_bluebird();
    var signature = Buffer.alloc(4);
    signature.writeUInt32LE(101010256, 0);
    function getCrxHeader(source) {
      const sourceStream = source.stream(0).pipe(PullStream());
      return sourceStream.pull(4).then(function(data) {
        const signature2 = data.readUInt32LE(0);
        if (signature2 === 875721283) {
          let crxHeader;
          return sourceStream.pull(12).then(function(data2) {
            crxHeader = parseBuffer.parse(data2, [
              ["version", 4],
              ["pubKeyLength", 4],
              ["signatureLength", 4]
            ]);
          }).then(function() {
            return sourceStream.pull(crxHeader.pubKeyLength + crxHeader.signatureLength);
          }).then(function(data2) {
            crxHeader.publicKey = data2.slice(0, crxHeader.pubKeyLength);
            crxHeader.signature = data2.slice(crxHeader.pubKeyLength);
            crxHeader.size = 16 + crxHeader.pubKeyLength + crxHeader.signatureLength;
            return crxHeader;
          });
        }
      });
    }
    function getZip64CentralDirectory(source, zip64CDL) {
      const d64loc = parseBuffer.parse(zip64CDL, [
        ["signature", 4],
        ["diskNumber", 4],
        ["offsetToStartOfCentralDirectory", 8],
        ["numberOfDisks", 4]
      ]);
      if (d64loc.signature != 117853008) {
        throw new Error("invalid zip64 end of central dir locator signature (0x07064b50): 0x" + d64loc.signature.toString(16));
      }
      const dir64 = PullStream();
      source.stream(d64loc.offsetToStartOfCentralDirectory).pipe(dir64);
      return dir64.pull(56);
    }
    function parseZip64DirRecord(dir64record) {
      const vars = parseBuffer.parse(dir64record, [
        ["signature", 4],
        ["sizeOfCentralDirectory", 8],
        ["version", 2],
        ["versionsNeededToExtract", 2],
        ["diskNumber", 4],
        ["diskStart", 4],
        ["numberOfRecordsOnDisk", 8],
        ["numberOfRecords", 8],
        ["sizeOfCentralDirectory", 8],
        ["offsetToStartOfCentralDirectory", 8]
      ]);
      if (vars.signature != 101075792) {
        throw new Error("invalid zip64 end of central dir locator signature (0x06064b50): 0x0" + vars.signature.toString(16));
      }
      return vars;
    }
    module2.exports = function centralDirectory(source, options) {
      const endDir = PullStream();
      const records = PullStream();
      const tailSize = options && options.tailSize || 80;
      let sourceSize, crxHeader, startOffset, vars;
      if (options && options.crx)
        crxHeader = getCrxHeader(source);
      return source.size().then(function(size) {
        sourceSize = size;
        source.stream(Math.max(0, size - tailSize)).on("error", function(error) {
          endDir.emit("error", error);
        }).pipe(endDir);
        return endDir.pull(signature);
      }).then(function() {
        return Bluebird.props({ directory: endDir.pull(22), crxHeader });
      }).then(function(d) {
        const data = d.directory;
        startOffset = d.crxHeader && d.crxHeader.size || 0;
        vars = parseBuffer.parse(data, [
          ["signature", 4],
          ["diskNumber", 2],
          ["diskStart", 2],
          ["numberOfRecordsOnDisk", 2],
          ["numberOfRecords", 2],
          ["sizeOfCentralDirectory", 4],
          ["offsetToStartOfCentralDirectory", 4],
          ["commentLength", 2]
        ]);
        if (vars.diskNumber == 65535 || vars.numberOfRecords == 65535 || vars.offsetToStartOfCentralDirectory == 4294967295) {
          const zip64CDLSize = 20;
          const zip64CDLOffset = sourceSize - (tailSize - endDir.match + zip64CDLSize);
          const zip64CDLStream = PullStream();
          source.stream(zip64CDLOffset).pipe(zip64CDLStream);
          return zip64CDLStream.pull(zip64CDLSize).then(function(d2) {
            return getZip64CentralDirectory(source, d2);
          }).then(function(dir64record) {
            vars = parseZip64DirRecord(dir64record);
          });
        } else {
          vars.offsetToStartOfCentralDirectory += startOffset;
        }
      }).then(function() {
        if (vars.commentLength) return endDir.pull(vars.commentLength).then(function(comment) {
          vars.comment = comment.toString("utf8");
        });
      }).then(function() {
        source.stream(vars.offsetToStartOfCentralDirectory).pipe(records);
        vars.extract = function(opts) {
          if (!opts || !opts.path) throw new Error("PATH_MISSING");
          opts.path = path2.resolve(path2.normalize(opts.path));
          return vars.files.then(function(files) {
            return Bluebird.map(files, async function(entry) {
              const extractPath = path2.join(opts.path, entry.path);
              if (extractPath.indexOf(opts.path) != 0) {
                return;
              }
              if (entry.type == "Directory") {
                await fs2.ensureDir(extractPath);
                return;
              }
              await fs2.ensureDir(path2.dirname(extractPath));
              const writer = opts.getWriter ? opts.getWriter({ path: extractPath }) : fs2.createWriteStream(extractPath);
              return new Promise(function(resolve, reject) {
                entry.stream(opts.password).on("error", reject).pipe(writer).on("close", resolve).on("error", reject);
              });
            }, { concurrency: opts.concurrency > 1 ? opts.concurrency : 1 });
          });
        };
        vars.files = Bluebird.mapSeries(Array(vars.numberOfRecords), function() {
          return records.pull(46).then(function(data) {
            const vars2 = parseBuffer.parse(data, [
              ["signature", 4],
              ["versionMadeBy", 2],
              ["versionsNeededToExtract", 2],
              ["flags", 2],
              ["compressionMethod", 2],
              ["lastModifiedTime", 2],
              ["lastModifiedDate", 2],
              ["crc32", 4],
              ["compressedSize", 4],
              ["uncompressedSize", 4],
              ["fileNameLength", 2],
              ["extraFieldLength", 2],
              ["fileCommentLength", 2],
              ["diskNumber", 2],
              ["internalFileAttributes", 2],
              ["externalFileAttributes", 4],
              ["offsetToLocalFileHeader", 4]
            ]);
            vars2.offsetToLocalFileHeader += startOffset;
            vars2.lastModifiedDateTime = parseDateTime(vars2.lastModifiedDate, vars2.lastModifiedTime);
            return records.pull(vars2.fileNameLength).then(function(fileNameBuffer) {
              vars2.pathBuffer = fileNameBuffer;
              vars2.path = fileNameBuffer.toString("utf8");
              vars2.isUnicode = (vars2.flags & 2048) != 0;
              return records.pull(vars2.extraFieldLength);
            }).then(function(extraField) {
              vars2.extra = parseExtraField(extraField, vars2);
              return records.pull(vars2.fileCommentLength);
            }).then(function(comment) {
              vars2.comment = comment;
              vars2.type = vars2.uncompressedSize === 0 && /[/\\]$/.test(vars2.path) ? "Directory" : "File";
              const padding = options && options.padding || 1e3;
              vars2.stream = function(_password) {
                const totalSize = 30 + padding + (vars2.extraFieldLength || 0) + (vars2.fileNameLength || 0) + vars2.compressedSize;
                return unzip(source, vars2.offsetToLocalFileHeader, _password, vars2, totalSize);
              };
              vars2.buffer = function(_password) {
                return BufferStream(vars2.stream(_password));
              };
              return vars2;
            });
          });
        });
        return Bluebird.props(vars);
      });
    };
  }
});

// node_modules/unzipper/lib/Open/index.js
var require_Open = __commonJS({
  "node_modules/unzipper/lib/Open/index.js"(exports2, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    var directory = require_directory();
    var Stream = require("stream");
    module2.exports = {
      buffer: function(buffer, options) {
        const source = {
          stream: function(offset, length) {
            const stream = Stream.PassThrough();
            const end = length ? offset + length : void 0;
            stream.end(buffer.slice(offset, end));
            return stream;
          },
          size: function() {
            return Promise.resolve(buffer.length);
          }
        };
        return directory(source, options);
      },
      file: function(filename, options) {
        const source = {
          stream: function(start, length) {
            const end = length ? start + length : void 0;
            return fs2.createReadStream(filename, { start, end });
          },
          size: function() {
            return new Promise(function(resolve, reject) {
              fs2.stat(filename, function(err, d) {
                if (err)
                  reject(err);
                else
                  resolve(d.size);
              });
            });
          }
        };
        return directory(source, options);
      },
      url: function(request, params, options) {
        if (typeof params === "string")
          params = { url: params };
        if (!params.url)
          throw "URL missing";
        params.headers = params.headers || {};
        const source = {
          stream: function(offset, length) {
            const options2 = Object.create(params);
            const end = length ? offset + length : "";
            options2.headers = Object.create(params.headers);
            options2.headers.range = "bytes=" + offset + "-" + end;
            return request(options2);
          },
          size: function() {
            return new Promise(function(resolve, reject) {
              const req = request(params);
              req.on("response", function(d) {
                req.abort();
                if (!d.headers["content-length"])
                  reject(new Error("Missing content length header"));
                else
                  resolve(d.headers["content-length"]);
              }).on("error", reject);
            });
          }
        };
        return directory(source, options);
      },
      s3: function(client, params, options) {
        const source = {
          size: function() {
            return new Promise(function(resolve, reject) {
              client.headObject(params, function(err, d) {
                if (err)
                  reject(err);
                else
                  resolve(d.ContentLength);
              });
            });
          },
          stream: function(offset, length) {
            const d = {};
            for (const key in params)
              d[key] = params[key];
            const end = length ? offset + length : "";
            d.Range = "bytes=" + offset + "-" + end;
            return client.getObject(d).createReadStream();
          }
        };
        return directory(source, options);
      },
      s3_v3: function(client, params, options) {
        const { GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
        const source = {
          size: async () => {
            const head = await client.send(
              new HeadObjectCommand({
                Bucket: params.Bucket,
                Key: params.Key
              })
            );
            if (!head.ContentLength) {
              return 0;
            }
            return head.ContentLength;
          },
          stream: (offset, length) => {
            const stream = Stream.PassThrough();
            const end = length ? offset + length : "";
            client.send(
              new GetObjectCommand({
                Bucket: params.Bucket,
                Key: params.Key,
                Range: `bytes=${offset}-${end}`
              })
            ).then((response) => {
              response.Body.pipe(stream);
            }).catch((error) => {
              stream.emit("error", error);
            });
            return stream;
          }
        };
        return directory(source, options);
      },
      custom: function(source, options) {
        return directory(source, options);
      }
    };
  }
});

// node_modules/unzipper/unzip.js
var require_unzip2 = __commonJS({
  "node_modules/unzipper/unzip.js"(exports2) {
    "use strict";
    exports2.Parse = require_parse();
    exports2.ParseOne = require_parseOne();
    exports2.Extract = require_extract();
    exports2.Open = require_Open();
  }
});

// node_modules/aws4fetch/dist/aws4fetch.cjs.js
var require_aws4fetch_cjs = __commonJS({
  "node_modules/aws4fetch/dist/aws4fetch.cjs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var encoder = new TextEncoder();
    var HOST_SERVICES = {
      appstream2: "appstream",
      cloudhsmv2: "cloudhsm",
      email: "ses",
      marketplace: "aws-marketplace",
      mobile: "AWSMobileHubService",
      pinpoint: "mobiletargeting",
      queue: "sqs",
      "git-codecommit": "codecommit",
      "mturk-requester-sandbox": "mturk-requester",
      "personalize-runtime": "personalize"
    };
    var UNSIGNABLE_HEADERS = /* @__PURE__ */ new Set([
      "authorization",
      "content-type",
      "content-length",
      "user-agent",
      "presigned-expires",
      "expect",
      "x-amzn-trace-id",
      "range",
      "connection"
    ]);
    var AwsClient = class {
      constructor({ accessKeyId, secretAccessKey, sessionToken, service, region, cache, retries, initRetryMs }) {
        if (accessKeyId == null) throw new TypeError("accessKeyId is a required option");
        if (secretAccessKey == null) throw new TypeError("secretAccessKey is a required option");
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
        this.sessionToken = sessionToken;
        this.service = service;
        this.region = region;
        this.cache = cache || /* @__PURE__ */ new Map();
        this.retries = retries != null ? retries : 10;
        this.initRetryMs = initRetryMs || 50;
      }
      async sign(input, init) {
        if (input instanceof Request) {
          const { method, url, headers, body } = input;
          init = Object.assign({ method, url, headers }, init);
          if (init.body == null && headers.has("Content-Type")) {
            init.body = body != null && headers.has("X-Amz-Content-Sha256") ? body : await input.clone().arrayBuffer();
          }
          input = url;
        }
        const signer = new AwsV4Signer(Object.assign({ url: input.toString() }, init, this, init && init.aws));
        const signed = Object.assign({}, init, await signer.sign());
        delete signed.aws;
        try {
          return new Request(signed.url.toString(), signed);
        } catch (e) {
          if (e instanceof TypeError) {
            return new Request(signed.url.toString(), Object.assign({ duplex: "half" }, signed));
          }
          throw e;
        }
      }
      async fetch(input, init) {
        for (let i = 0; i <= this.retries; i++) {
          const fetched = fetch(await this.sign(input, init));
          if (i === this.retries) {
            return fetched;
          }
          const res = await fetched;
          if (res.status < 500 && res.status !== 429) {
            return res;
          }
          await new Promise((resolve) => setTimeout(resolve, Math.random() * this.initRetryMs * Math.pow(2, i)));
        }
        throw new Error("An unknown error occurred, ensure retries is not negative");
      }
    };
    var AwsV4Signer = class {
      constructor({ method, url, headers, body, accessKeyId, secretAccessKey, sessionToken, service, region, cache, datetime, signQuery, appendSessionToken, allHeaders, singleEncode }) {
        if (url == null) throw new TypeError("url is a required option");
        if (accessKeyId == null) throw new TypeError("accessKeyId is a required option");
        if (secretAccessKey == null) throw new TypeError("secretAccessKey is a required option");
        this.method = method || (body ? "POST" : "GET");
        this.url = new URL(url);
        this.headers = new Headers(headers || {});
        this.body = body;
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
        this.sessionToken = sessionToken;
        let guessedService, guessedRegion;
        if (!service || !region) {
          [guessedService, guessedRegion] = guessServiceRegion(this.url, this.headers);
        }
        this.service = service || guessedService || "";
        this.region = region || guessedRegion || "us-east-1";
        this.cache = cache || /* @__PURE__ */ new Map();
        this.datetime = datetime || (/* @__PURE__ */ new Date()).toISOString().replace(/[:-]|\.\d{3}/g, "");
        this.signQuery = signQuery;
        this.appendSessionToken = appendSessionToken || this.service === "iotdevicegateway";
        this.headers.delete("Host");
        if (this.service === "s3" && !this.signQuery && !this.headers.has("X-Amz-Content-Sha256")) {
          this.headers.set("X-Amz-Content-Sha256", "UNSIGNED-PAYLOAD");
        }
        const params = this.signQuery ? this.url.searchParams : this.headers;
        params.set("X-Amz-Date", this.datetime);
        if (this.sessionToken && !this.appendSessionToken) {
          params.set("X-Amz-Security-Token", this.sessionToken);
        }
        this.signableHeaders = ["host", ...this.headers.keys()].filter((header) => allHeaders || !UNSIGNABLE_HEADERS.has(header)).sort();
        this.signedHeaders = this.signableHeaders.join(";");
        this.canonicalHeaders = this.signableHeaders.map((header) => header + ":" + (header === "host" ? this.url.host : (this.headers.get(header) || "").replace(/\s+/g, " "))).join("\n");
        this.credentialString = [this.datetime.slice(0, 8), this.region, this.service, "aws4_request"].join("/");
        if (this.signQuery) {
          if (this.service === "s3" && !params.has("X-Amz-Expires")) {
            params.set("X-Amz-Expires", "86400");
          }
          params.set("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
          params.set("X-Amz-Credential", this.accessKeyId + "/" + this.credentialString);
          params.set("X-Amz-SignedHeaders", this.signedHeaders);
        }
        if (this.service === "s3") {
          try {
            this.encodedPath = decodeURIComponent(this.url.pathname.replace(/\+/g, " "));
          } catch (e) {
            this.encodedPath = this.url.pathname;
          }
        } else {
          this.encodedPath = this.url.pathname.replace(/\/+/g, "/");
        }
        if (!singleEncode) {
          this.encodedPath = encodeURIComponent(this.encodedPath).replace(/%2F/g, "/");
        }
        this.encodedPath = encodeRfc3986(this.encodedPath);
        const seenKeys = /* @__PURE__ */ new Set();
        this.encodedSearch = [...this.url.searchParams].filter(([k]) => {
          if (!k) return false;
          if (this.service === "s3") {
            if (seenKeys.has(k)) return false;
            seenKeys.add(k);
          }
          return true;
        }).map((pair) => pair.map((p) => encodeRfc3986(encodeURIComponent(p)))).sort(([k1, v1], [k2, v2]) => k1 < k2 ? -1 : k1 > k2 ? 1 : v1 < v2 ? -1 : v1 > v2 ? 1 : 0).map((pair) => pair.join("=")).join("&");
      }
      async sign() {
        if (this.signQuery) {
          this.url.searchParams.set("X-Amz-Signature", await this.signature());
          if (this.sessionToken && this.appendSessionToken) {
            this.url.searchParams.set("X-Amz-Security-Token", this.sessionToken);
          }
        } else {
          this.headers.set("Authorization", await this.authHeader());
        }
        return {
          method: this.method,
          url: this.url,
          headers: this.headers,
          body: this.body
        };
      }
      async authHeader() {
        return [
          "AWS4-HMAC-SHA256 Credential=" + this.accessKeyId + "/" + this.credentialString,
          "SignedHeaders=" + this.signedHeaders,
          "Signature=" + await this.signature()
        ].join(", ");
      }
      async signature() {
        const date = this.datetime.slice(0, 8);
        const cacheKey = [this.secretAccessKey, date, this.region, this.service].join();
        let kCredentials = this.cache.get(cacheKey);
        if (!kCredentials) {
          const kDate = await hmac("AWS4" + this.secretAccessKey, date);
          const kRegion = await hmac(kDate, this.region);
          const kService = await hmac(kRegion, this.service);
          kCredentials = await hmac(kService, "aws4_request");
          this.cache.set(cacheKey, kCredentials);
        }
        return buf2hex(await hmac(kCredentials, await this.stringToSign()));
      }
      async stringToSign() {
        return [
          "AWS4-HMAC-SHA256",
          this.datetime,
          this.credentialString,
          buf2hex(await hash(await this.canonicalString()))
        ].join("\n");
      }
      async canonicalString() {
        return [
          this.method.toUpperCase(),
          this.encodedPath,
          this.encodedSearch,
          this.canonicalHeaders + "\n",
          this.signedHeaders,
          await this.hexBodyHash()
        ].join("\n");
      }
      async hexBodyHash() {
        let hashHeader = this.headers.get("X-Amz-Content-Sha256") || (this.service === "s3" && this.signQuery ? "UNSIGNED-PAYLOAD" : null);
        if (hashHeader == null) {
          if (this.body && typeof this.body !== "string" && !("byteLength" in this.body)) {
            throw new Error("body must be a string, ArrayBuffer or ArrayBufferView, unless you include the X-Amz-Content-Sha256 header");
          }
          hashHeader = buf2hex(await hash(this.body || ""));
        }
        return hashHeader;
      }
    };
    async function hmac(key, string) {
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        typeof key === "string" ? encoder.encode(key) : key,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
      );
      return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(string));
    }
    async function hash(content) {
      return crypto.subtle.digest("SHA-256", typeof content === "string" ? encoder.encode(content) : content);
    }
    var HEX_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    function buf2hex(arrayBuffer) {
      const buffer = new Uint8Array(arrayBuffer);
      let out = "";
      for (let idx = 0; idx < buffer.length; idx++) {
        const n = buffer[idx];
        out += HEX_CHARS[n >>> 4 & 15];
        out += HEX_CHARS[n & 15];
      }
      return out;
    }
    function encodeRfc3986(urlEncodedStr) {
      return urlEncodedStr.replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
    }
    function guessServiceRegion(url, headers) {
      const { hostname, pathname } = url;
      if (hostname.endsWith(".on.aws")) {
        const match2 = hostname.match(/^[^.]{1,63}\.lambda-url\.([^.]{1,63})\.on\.aws$/);
        return match2 != null ? ["lambda", match2[1] || ""] : ["", ""];
      }
      if (hostname.endsWith(".r2.cloudflarestorage.com")) {
        return ["s3", "auto"];
      }
      if (hostname.endsWith(".backblazeb2.com")) {
        const match2 = hostname.match(/^(?:[^.]{1,63}\.)?s3\.([^.]{1,63})\.backblazeb2\.com$/);
        return match2 != null ? ["s3", match2[1] || ""] : ["", ""];
      }
      const match = hostname.replace("dualstack.", "").match(/([^.]{1,63})\.(?:([^.]{0,63})\.)?amazonaws\.com(?:\.cn)?$/);
      let service = match && match[1] || "";
      let region = match && match[2];
      if (region === "us-gov") {
        region = "us-gov-west-1";
      } else if (region === "s3" || region === "s3-accelerate") {
        region = "us-east-1";
        service = "s3";
      } else if (service === "iot") {
        if (hostname.startsWith("iot.")) {
          service = "execute-api";
        } else if (hostname.startsWith("data.jobs.iot.")) {
          service = "iot-jobs-data";
        } else {
          service = pathname === "/mqtt" ? "iotdevicegateway" : "iotdata";
        }
      } else if (service === "autoscaling") {
        const targetPrefix = (headers.get("X-Amz-Target") || "").split(".")[0];
        if (targetPrefix === "AnyScaleFrontendService") {
          service = "application-autoscaling";
        } else if (targetPrefix === "AnyScaleScalingPlannerFrontendService") {
          service = "autoscaling-plans";
        }
      } else if (region == null && service.startsWith("s3-")) {
        region = service.slice(3).replace(/^fips-|^external-1/, "");
        service = "s3";
      } else if (service.endsWith("-fips")) {
        service = service.slice(0, -5);
      } else if (region && /-\d$/.test(service) && !/-\d$/.test(region)) {
        [service, region] = [region, service];
      }
      return [HOST_SERVICES[service] || service, region || ""];
    }
    exports2.AwsClient = AwsClient;
    exports2.AwsV4Signer = AwsV4Signer;
  }
});

// node_modules/@cdklabs/cdk-atmosphere-client/lib/client.js
var require_client = __commonJS({
  "node_modules/@cdklabs/cdk-atmosphere-client/lib/client.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AtmosphereClient = exports2.ServiceError = void 0;
    var credential_providers_1 = require("@aws-sdk/credential-providers");
    var aws4fetch_1 = require_aws4fetch_cjs();
    var ServiceError2 = class extends Error {
      constructor(statusCode, message, statusText) {
        super(`${statusCode} ${statusText ? `(${statusText})` : ""}: ${message}`);
        this.statusCode = statusCode;
      }
    };
    exports2.ServiceError = ServiceError2;
    var AtmosphereClient2 = class {
      constructor(endpoint) {
        this.endpoint = endpoint;
        if (global.crypto == null) {
          global.crypto = require("crypto");
        }
      }
      /**
       * Waits until an environment could be allocated by the service.
       *
       * @returns allocation information.
       * @throws if an environment could not be acquired within the specified timeout.
       */
      async acquire(options) {
        var _a;
        const timeoutSeconds = (_a = options.timeoutSeconds) !== null && _a !== void 0 ? _a : 600;
        const startTime = Date.now();
        const timeoutMs = timeoutSeconds * 1e3;
        let retryDelay = 1e3;
        const maxRetryDelay = 6e4;
        this.log(`Acquire | environment from pool '${options.pool}' (requester: '${options.requester}')`);
        while (true) {
          try {
            const acquired = await this.request("POST", "/allocations", {
              pool: options.pool,
              requester: options.requester
            });
            this.log(`Acquire | Successfully acquired environment from pool ${options.pool} (requester: ${options.requester})`);
            return acquired;
          } catch (error) {
            if (error.statusCode === 423) {
              const elapsed = Date.now() - startTime;
              if (elapsed >= timeoutMs) {
                throw error;
              }
              this.log(`Acquire | Retrying due to: ${error.message}`);
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              retryDelay = Math.min(retryDelay * 2, maxRetryDelay);
              continue;
            }
            throw error;
          }
        }
      }
      /**
       * Release an environment based on the allocation id. After releasing an environment,
       * its provided credentials are deactivated.
       */
      async release(allocationId, outcome) {
        this.log(`Release | Allocation '${allocationId}' (outcome: '${outcome}')`);
        const released = await this.request("DELETE", `/allocations/${allocationId}`, { outcome });
        this.log(`Release | Successfully released allocation '${allocationId}' (outcome: '${outcome}')`);
        return released;
      }
      async aws() {
        if (!this._aws) {
          const provider = (0, credential_providers_1.fromNodeProviderChain)();
          const creds = await provider();
          this._aws = new aws4fetch_1.AwsClient({
            accessKeyId: creds.accessKeyId,
            secretAccessKey: creds.secretAccessKey,
            sessionToken: creds.sessionToken,
            service: "execute-api"
          });
        }
        return this._aws;
      }
      async request(method, path2, body) {
        var _a;
        const aws = await this.aws();
        const response = await aws.fetch(`${this.endpoint}${path2}`, {
          method,
          body: JSON.stringify(body)
        });
        const responseBody = await response.json();
        if (response.status === 200) {
          return responseBody;
        }
        throw new ServiceError2(response.status, (_a = responseBody.message) !== null && _a !== void 0 ? _a : "Unknown error", response.statusText);
      }
      log(message) {
        console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`);
      }
    };
    exports2.AtmosphereClient = AtmosphereClient2;
  }
});

// node_modules/@cdklabs/cdk-atmosphere-client/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/@cdklabs/cdk-atmosphere-client/lib/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_client(), exports2);
  }
});

// test/integ/cleanup/assert.lambda.ts
var assert_lambda_exports = {};
__export(assert_lambda_exports, {
  handler: () => handler6
});
module.exports = __toCommonJS(assert_lambda_exports);
var assert2 = __toESM(require("assert"));
var import_client_s33 = require("@aws-sdk/client-s3");

// src/cleanup/cleanup.client.ts
var import_client_ecs = require("@aws-sdk/client-ecs");

// src/envars.ts
var ENV_PREFIX = "CDK_ATMOSPHERE_";
var ENDPOINT_URL_ENV = `${ENV_PREFIX}ENDPOINT_URL`;
var ALLOCATIONS_TABLE_NAME_ENV = `${ENV_PREFIX}ALLOCATIONS_TABLE_NAME`;
var ENVIRONMENTS_TABLE_NAME_ENV = `${ENV_PREFIX}ENVIRONMENTS_TABLE_NAME`;
var CONFIGURATION_BUCKET_ENV = `${ENV_PREFIX}CONFIGURATION_FILE_BUCKET`;
var CONFIGURATION_KEY_ENV = `${ENV_PREFIX}CONFIGURATION_FILE_KEY`;
var ALLOCATION_TIMEOUT_DLQ_ARN_ENV = `${ENV_PREFIX}ALLOCATION_TIMEOUT_DLQ_ARN`;
var CLEANUP_TIMEOUT_DLQ_ARN_ENV = `${ENV_PREFIX}CLEANUP_TIMEOUT_DLQ_ARN`;
var SCHEDULER_ROLE_ARN_ENV = `${ENV_PREFIX}SCHEDULER_ROLE_ARN`;
var CLEANUP_TIMEOUT_FUNCTION_ARN_ENV = `${ENV_PREFIX}CLEANUP_TIMEOUT_FUNCTION_ARN`;
var ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV = `${ENV_PREFIX}ALLOCATION_TIMEOUT_FUNCTION_ARN`;
var REST_API_ID_ENV = `${ENV_PREFIX}REST_API_ID`;
var ALLOCATIONS_RESOURCE_ID_ENV = `${ENV_PREFIX}ALLOCATIONS_RESOURCE_ID`;
var ALLOCATION_RESOURCE_ID_ENV = `${ENV_PREFIX}ALLOCATION_RESOURCE_ID`;
var DEALLOCATE_FUNCTION_NAME_ENV = `${ENV_PREFIX}DEALLOCATE_FUNCTION_NAME`;
var CLEANUP_CLUSTER_ARN_ENV = `${ENV_PREFIX}CLEANUP_CLUSTER_ARN`;
var CLEANUP_TASK_DEFINITION_ARN_ENV = `${ENV_PREFIX}CLEANUP_TASK_DEFINITION_ARN`;
var CLEANUP_TASK_SUBNET_ID_ENV = `${ENV_PREFIX}CLEANUP_TASK_SUBNET_ID`;
var CLEANUP_TASK_SECURITY_GROUP_ID_ENV = `${ENV_PREFIX}CLEANUP_TASK_SECURITY_GROUP_ID`;
var CLEANUP_TASK_CONTAINER_NAME_ENV = `${ENV_PREFIX}CLEANUP_TASK_CONTAINER_NAME`;
var CLEANUP_TASK_ALLOCATION_ID = `${ENV_PREFIX}RUNTIME_CLEANUP_TASK_ALLOCATION_ID`;
var CLEANUP_TASK_TIMEOUT_SECONDS = `${ENV_PREFIX}RUNTIME_CLEANUP_TASK_TIMEOUT_SECONDS`;
var Envars = class _Envars {
  static required(name) {
    const value = _Envars.optional(name);
    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
  }
  static optional(name) {
    return process.env[name];
  }
};

// src/cleanup/cleanup.client.ts
var CleanupClient = class {
  constructor(props) {
    this.props = props;
    this.ecs = new import_client_ecs.ECS();
  }
  async start(opts) {
    const response = await this.ecs.runTask({
      cluster: this.props.clusterArn,
      taskDefinition: this.props.taskDefinitionArn,
      launchType: "FARGATE",
      // for troubleshooting. this allows task filtering
      // on the aws console.
      startedBy: opts.allocation.id,
      group: `aws://${opts.allocation.account}/${opts.allocation.region}`,
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: [this.props.subnetId],
          securityGroups: [this.props.securityGroupId],
          assignPublicIp: "ENABLED"
        }
      },
      overrides: {
        containerOverrides: [
          {
            name: this.props.containerName,
            environment: [
              { name: CLEANUP_TASK_ALLOCATION_ID, value: opts.allocation.id },
              { name: CLEANUP_TASK_TIMEOUT_SECONDS, value: `${opts.timeoutSeconds}` }
            ]
          }
        ]
      }
    });
    return response.tasks[0].taskArn;
  }
};

// src/config/configuration.client.ts
var s3 = __toESM(require("@aws-sdk/client-s3"));
var EnvironmentNotFoundError = class extends Error {
  constructor(account, region) {
    super(`Environment aws://${account}/${region} not found`);
    this.account = account;
    this.region = region;
  }
};
var ConfigurationClient = class {
  constructor(s3Location) {
    this.s3Location = s3Location;
    this.s3Client = new s3.S3();
  }
  /**
   * Retrieve environments belonging to a specific pool.
   */
  async listEnvironments(opts = {}) {
    return (await this.data).environments.filter((e) => opts.pool ? e.pool === opts.pool : true);
  }
  /**
   * Retrieve a single environment based on account + region.
   */
  async getEnvironment(account, region) {
    const envs = (await this.data).environments.filter((e) => e.account === account && e.region === region);
    if (envs.length === 0) {
      throw new EnvironmentNotFoundError(account, region);
    }
    if (envs.length > 1) {
      throw new Error(`Multiple environments found for aws://${account}/${region}`);
    }
    return envs[0];
  }
  // lazy async getter
  get data() {
    return (async () => {
      if (this._data) {
        return this._data;
      }
      this._data = await this.download();
      return this._data;
    })();
  }
  async download() {
    const response = await this.s3Client.getObject({
      Bucket: this.s3Location.bucket,
      Key: this.s3Location.key
    });
    if (!response.Body) {
      throw new Error(`Configuration file (s3://${this.s3Location.bucket}/${this.s3Location.key}) is empty`);
    }
    return JSON.parse(await response.Body.transformToString("utf-8"));
  }
};

// src/scheduler/scheduler.client.ts
var import_client_scheduler = require("@aws-sdk/client-scheduler");
var SchedulerClient = class _SchedulerClient {
  constructor(props) {
    this.props = props;
    this.scheduler = new import_client_scheduler.Scheduler();
  }
  static {
    this.TIMEOUT_EVENT_PREFIX = "atmosphere.timeout";
  }
  async scheduleAllocationTimeout(opts) {
    const prefix = `${_SchedulerClient.TIMEOUT_EVENT_PREFIX}.aloc_`;
    await this.scheduleLambdaInvoke({
      name: `${prefix}${opts.allocationId}`,
      description: `Enforces timeout for allocation ${opts.allocationId}`,
      functionArn: opts.functionArn,
      at: opts.timeoutDate,
      payload: { allocationId: opts.allocationId },
      dlqArn: Envars.required(ALLOCATION_TIMEOUT_DLQ_ARN_ENV)
    });
  }
  async scheduleCleanupTimeout(opts) {
    const prefix = `${_SchedulerClient.TIMEOUT_EVENT_PREFIX}.clean_`;
    await this.scheduleLambdaInvoke({
      name: `${prefix}${opts.allocationId}`,
      description: `Enforces cleanup for allocation ${opts.allocationId}`,
      functionArn: opts.functionArn,
      at: opts.timeoutDate,
      payload: { allocationId: opts.allocationId, account: opts.account, region: opts.region },
      dlqArn: Envars.required(CLEANUP_TIMEOUT_DLQ_ARN_ENV)
    });
  }
  scheduleExpression(date) {
    return `at(${date.toISOString().slice(0, 19)})`;
  }
  async scheduleLambdaInvoke(opts) {
    if (opts.name.length >= 64) {
      throw new Error(`Scheduler name '${opts.name}' is too long. Must be less than 64 characters.`);
    }
    await this.scheduler.createSchedule({
      Name: opts.name,
      Description: opts.description,
      FlexibleTimeWindow: { Mode: "OFF" },
      ScheduleExpression: this.scheduleExpression(opts.at),
      ScheduleExpressionTimezone: "UTC",
      Target: {
        DeadLetterConfig: {
          Arn: opts.dlqArn
        },
        Arn: opts.functionArn,
        RoleArn: this.props.roleArn,
        Input: JSON.stringify(opts.payload)
      },
      ActionAfterCompletion: "DELETE"
    });
  }
};

// src/storage/allocations.client.ts
var ddb = __toESM(require("@aws-sdk/client-dynamodb"));

// src/storage/dynamo-item.ts
function optionalValue(name, attributes) {
  const attribute = attributes[name];
  if (attribute) {
    return attribute.S;
  }
  return void 0;
}
function requiredValue(name, attributes) {
  const v = optionalValue(name, attributes);
  if (!v) {
    throw new Error(`Attribute '${name}' not found`);
  }
  return v;
}

// src/storage/allocations.client.ts
var AllocationAlreadyEndedError = class extends Error {
  constructor(id) {
    super(`Allocation ${id} is already ended`);
  }
};
var InvalidInputError = class extends Error {
  constructor(message) {
    super(`Invalid input: ${message}`);
  }
};
var AllocationNotFoundError = class extends Error {
  constructor(id) {
    super(`Allocation ${id} not found`);
  }
};
var AllocationsClient = class {
  constructor(tableName) {
    this.tableName = tableName;
    this.ddbClient = new ddb.DynamoDB({});
  }
  /**
   * Retrieve an allocation by id.
   */
  async get(id) {
    const response = await this.ddbClient.getItem({
      TableName: this.tableName,
      Key: {
        id: { S: id }
      }
    });
    if (!response.Item) {
      throw new AllocationNotFoundError(id);
    }
    return {
      account: requiredValue("account", response.Item),
      region: requiredValue("region", response.Item),
      pool: requiredValue("pool", response.Item),
      start: requiredValue("start", response.Item),
      requester: requiredValue("requester", response.Item),
      id: requiredValue("id", response.Item),
      // if an allocation is queried before it ended, these attributes
      // will be missing.
      end: optionalValue("end", response.Item),
      outcome: optionalValue("outcome", response.Item)
    };
  }
  /**
   * Start an allocation for a specific environment. Returns the allocation id.
   */
  async start(opts) {
    if (Buffer.byteLength(opts.requester) > 1024) {
      throw new InvalidInputError("requester must be less than 1024 bytes");
    }
    const nowSeconds = Math.floor(Date.now() / 1e3);
    const sixMonthsSeconds = 26 * 7 * 24 * 60 * 60;
    await this.ddbClient.putItem({
      TableName: this.tableName,
      Item: {
        id: { S: opts.id },
        account: { S: opts.account },
        region: { S: opts.region },
        pool: { S: opts.pool },
        start: { S: (/* @__PURE__ */ new Date()).toISOString() },
        requester: { S: opts.requester },
        ttl: { N: `${nowSeconds + sixMonthsSeconds}` }
      }
    });
  }
  /**
   * End the allocation. Throws if the allocation has already ended.
   */
  async end(opts) {
    if (Buffer.byteLength(opts.outcome) > 100) {
      throw new InvalidInputError("outcome must be less than 100 bytes");
    }
    try {
      const response = await this.ddbClient.updateItem({
        TableName: this.tableName,
        Key: {
          id: { S: opts.id }
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          "#end": "end",
          "#outcome": "outcome"
        },
        ExpressionAttributeValues: {
          ":end": { S: (/* @__PURE__ */ new Date()).toISOString() },
          ":outcome": { S: opts.outcome }
        },
        UpdateExpression: "SET #end = :end, #outcome = :outcome",
        // ensures update.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
        ConditionExpression: "attribute_not_exists(#end) AND attribute_not_exists(#outcome)",
        ReturnValues: "ALL_NEW"
      });
      if (!response.Attributes) {
        throw new Error("Unable to retrieve item attributes");
      }
      return {
        account: requiredValue("account", response.Attributes),
        region: requiredValue("region", response.Attributes),
        pool: requiredValue("pool", response.Attributes),
        start: requiredValue("start", response.Attributes),
        end: requiredValue("end", response.Attributes),
        requester: requiredValue("requester", response.Attributes),
        id: requiredValue("id", response.Attributes),
        outcome: requiredValue("outcome", response.Attributes)
      };
    } catch (e) {
      if (e instanceof ddb.ConditionalCheckFailedException) {
        throw new AllocationAlreadyEndedError(opts.id);
      }
      throw e;
    }
  }
};

// src/storage/environments.client.ts
var ddb2 = __toESM(require("@aws-sdk/client-dynamodb"));
var EnvironmentsError = class extends Error {
  constructor(account, region, message) {
    super(`Environment aws://${account}/${region}: ${message}`);
  }
};
var EnvironmentAlreadyAcquiredError = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already acquired");
  }
};
var EnvironmentAlreadyReleasedError = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already released");
  }
};
var EnvironmentAlreadyInUseError = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already in-use");
  }
};
var EnvironmentAlreadyInStatusError = class extends EnvironmentsError {
  constructor(account, region, status) {
    super(account, region, `already ${status}`);
  }
};
var EnvironmentAlreadyDirtyError = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already dirty");
  }
};
var EnvironmentAlreadyCleaningError = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already cleaning");
  }
};
var EnvironmentAlreadyReallocated = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already reallocated");
  }
};
var EnvironmentNotFound = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "not found");
  }
};
var EnvironmentsClient = class {
  constructor(tableName) {
    this.tableName = tableName;
    this.ddbClient = new ddb2.DynamoDB({});
  }
  /**
   * Fetch a specific environment by account and region.
   * Will throw if it doesn't exists.
   */
  async get(account, region) {
    const response = await this.ddbClient.getItem({
      TableName: this.tableName,
      Key: {
        account: { S: account },
        region: { S: region }
      }
    });
    if (!response.Item) {
      throw new EnvironmentNotFound(account, region);
    }
    return {
      account: requiredValue("account", response.Item),
      region: requiredValue("region", response.Item),
      status: requiredValue("status", response.Item),
      allocation: requiredValue("allocation", response.Item)
    };
  }
  /**
   * Acquire an environment by inserting a new item into the table.
   * If the environment is already acquired, this will fail.
   */
  async acquire(allocationId, account, region) {
    try {
      await this.ddbClient.putItem({
        TableName: this.tableName,
        Item: {
          account: { S: account },
          region: { S: region },
          status: { S: "in-use" },
          allocation: { S: allocationId }
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          "#region": "region",
          "#account": "account"
        },
        // ensures insertion.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
        ConditionExpression: "attribute_not_exists(#account) AND attribute_not_exists(#region)"
      });
    } catch (e) {
      if (e instanceof ddb2.ConditionalCheckFailedException) {
        throw new EnvironmentAlreadyAcquiredError(account, region);
      }
      throw e;
    }
  }
  /**
   * Release an environment by deleting an item from the table.
   * If the environment is already released, this will fail.
   */
  async release(allocationId, account, region) {
    try {
      await this.ddbClient.deleteItem({
        TableName: this.tableName,
        Key: {
          account: { S: account },
          region: { S: region }
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          "#region": "region",
          "#account": "account",
          "#allocation": "allocation",
          "#status": "status"
        },
        ExpressionAttributeValues: {
          ":allocation_value": { S: allocationId },
          // we shouldn't be releasing an environment if its still 'in-use'.
          // it should be marked as either 'cleaning' or 'dirty' beforehand.
          ":unexpected_status_value": { S: "in-use" }
        },
        // ensures deletion.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
        ConditionExpression: "attribute_exists(#account) AND attribute_exists(#region) AND #allocation = :allocation_value AND #status <> :unexpected_status_value",
        ReturnValuesOnConditionCheckFailure: "ALL_OLD"
      });
    } catch (e) {
      if (e instanceof ddb2.ConditionalCheckFailedException) {
        if (!e.Item) {
          throw new EnvironmentAlreadyReleasedError(account, region);
        }
        const old_allocation = e.Item.allocation?.S;
        if (old_allocation && old_allocation !== allocationId) {
          throw new EnvironmentAlreadyReallocated(account, region);
        }
        const old_status = e.Item.status?.S;
        if (old_status === "in-use") {
          throw new EnvironmentAlreadyInUseError(account, region);
        }
      }
      throw e;
    }
  }
  /**
   * Mark the environment status as 'cleaning'.
   * If the environment is already in a 'cleaning' status, this will fail.
   */
  async cleaning(allocationId, account, region) {
    try {
      await this.setStatus(allocationId, account, region, "cleaning");
    } catch (e) {
      if (e instanceof EnvironmentAlreadyInStatusError) {
        throw new EnvironmentAlreadyCleaningError(account, region);
      }
      throw e;
    }
  }
  /**
   * Mark the environment status as 'dirty'.
   * If the environment is already in a 'dirty' status, this will fail.
   */
  async dirty(allocationId, account, region) {
    try {
      await this.setStatus(allocationId, account, region, "dirty");
    } catch (e) {
      if (e instanceof EnvironmentAlreadyInStatusError) {
        throw new EnvironmentAlreadyDirtyError(account, region);
      }
      throw e;
    }
  }
  async setStatus(allocationId, account, region, status) {
    try {
      await this.ddbClient.updateItem({
        TableName: this.tableName,
        Key: {
          account: { S: account },
          region: { S: region }
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          "#status": "status",
          "#allocation": "allocation"
        },
        ExpressionAttributeValues: {
          ":status_value": { S: status },
          ":allocation_value": { S: allocationId }
        },
        UpdateExpression: "SET #status = :status_value",
        // ensures update.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.ConditionalUpdate
        ConditionExpression: "#allocation = :allocation_value AND #status <> :status_value",
        ReturnValuesOnConditionCheckFailure: "ALL_OLD"
      });
    } catch (e) {
      if (e instanceof ddb2.ConditionalCheckFailedException) {
        if (!e.Item) {
          throw new EnvironmentAlreadyReleasedError(account, region);
        }
        const old_allocation = e.Item.allocation?.S;
        const old_status = e.Item.status?.S;
        if (old_allocation && old_allocation !== allocationId) {
          throw new EnvironmentAlreadyReallocated(account, region);
        }
        if (old_status && old_status === status) {
          throw new EnvironmentAlreadyInStatusError(account, region, old_status);
        }
      }
      throw e;
    }
  }
};

// src/clients.ts
var RuntimeClients = class _RuntimeClients {
  static getOrCreate() {
    if (!this._instance) {
      this._instance = new _RuntimeClients();
    }
    return this._instance;
  }
  get configuration() {
    if (!this._configuration) {
      const bucket = Envars.required(CONFIGURATION_BUCKET_ENV);
      const key = Envars.required(CONFIGURATION_KEY_ENV);
      this._configuration = new ConfigurationClient({ bucket, key });
    }
    return this._configuration;
  }
  get environments() {
    if (!this._environments) {
      const tableName = Envars.required(ENVIRONMENTS_TABLE_NAME_ENV);
      this._environments = new EnvironmentsClient(tableName);
    }
    return this._environments;
  }
  get allocations() {
    if (!this._allocations) {
      const tableName = Envars.required(ALLOCATIONS_TABLE_NAME_ENV);
      this._allocations = new AllocationsClient(tableName);
    }
    return this._allocations;
  }
  get scheduler() {
    if (!this._scheduler) {
      const roleArn = Envars.required(SCHEDULER_ROLE_ARN_ENV);
      this._scheduler = new SchedulerClient({ roleArn });
    }
    return this._scheduler;
  }
  get cleanup() {
    if (!this._cleanup) {
      const clusterArn = Envars.required(CLEANUP_CLUSTER_ARN_ENV);
      const taskDefinitionArn = Envars.required(CLEANUP_TASK_DEFINITION_ARN_ENV);
      const subnetId = Envars.required(CLEANUP_TASK_SUBNET_ID_ENV);
      const securityGroupId = Envars.required(CLEANUP_TASK_SECURITY_GROUP_ID_ENV);
      const containerName = Envars.required(CLEANUP_TASK_CONTAINER_NAME_ENV);
      this._cleanup = new CleanupClient({ clusterArn, taskDefinitionArn, subnetId, securityGroupId, containerName });
    }
    return this._cleanup;
  }
};

// test/integ/atmosphere.runner.ts
var assert = __toESM(require("assert"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var import_client_cloudformation4 = require("@aws-sdk/client-cloudformation");
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_client_s32 = require("@aws-sdk/client-s3");
var import_client_scheduler2 = require("@aws-sdk/client-scheduler");
var unzipper = __toESM(require_unzip2());

// test/with.ts
async function env2(envVars, fn) {
  const originalEnv = { ...process.env };
  try {
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });
    return await fn();
  } finally {
    process.env = originalEnv;
  }
}

// test/integ/atmosphere.runtime.ts
var import_client_ecs2 = require("@aws-sdk/client-ecs");
var import_client_lambda2 = require("@aws-sdk/client-lambda");
var import_cdk_atmosphere_client = __toESM(require_lib2());

// src/allocate/allocate.lambda.ts
var crypto2 = __toESM(require("crypto"));

// src/logging.ts
var Logger = class {
  constructor(props) {
    this.prefix = `[${props.component}] [pool:${props.pool}] [aloc:${props.allocationId}]`;
  }
  info(message) {
    console.log(`${this.prefix} ${message}`);
  }
  error(error, message = "") {
    console.error(`${this.prefix} ${message}`, error);
  }
};

// src/allocate/allocate.lambda.ts
var ALLOCATION_DURATION_SECONDS = 60 * 60;
var ProxyError = class extends Error {
  constructor(statusCode, message) {
    super(`${statusCode}: ${message}`);
    this.statusCode = statusCode;
    this.message = message;
  }
};
var clients = RuntimeClients.getOrCreate();
async function handler(event) {
  console.log("Event:", JSON.stringify(event, null, 2));
  const allocationId = crypto2.randomUUID();
  let request;
  try {
    request = parseRequestBody(event.body);
  } catch (e) {
    return failure(e);
  }
  const log = new Logger({ allocationId, pool: request.pool, component: "allocate" });
  return safeDoHandler(allocationId, request, log);
}
async function safeDoHandler(allocationId, request, log) {
  try {
    return await doHandler(allocationId, request, log);
  } catch (e) {
    log.error(e);
    return failure(e);
  }
}
async function doHandler(allocationId, request, log) {
  const timeoutDate = new Date(Date.now() + 1e3 * ALLOCATION_DURATION_SECONDS);
  log.info(`Acquiring environment from pool '${request.pool}'`);
  const environment = await acquireEnvironment(allocationId, request.pool);
  log.info(`Starting allocation of 'aws://${environment.account}/${environment.region}'`);
  await startAllocation(allocationId, environment, request.requester);
  log.info("Allocation started successfully");
  const response = { id: allocationId, environment };
  log.info(`Scheduling allocation timeout to ${timeoutDate}`);
  await clients.scheduler.scheduleAllocationTimeout({
    allocationId,
    timeoutDate,
    functionArn: Envars.required(ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV)
  });
  log.info("Done");
  return success(response);
}
function parseRequestBody(body) {
  if (!body) {
    throw new ProxyError(400, "Request body not found");
  }
  const parsed = JSON.parse(body);
  if (!parsed.pool) {
    throw new ProxyError(400, "'pool' must be provided in the request body");
  }
  if (!parsed.requester) {
    throw new ProxyError(400, "'requester' must be provided in the request body");
  }
  return parsed;
}
async function acquireEnvironment(allocaionId, pool) {
  const candidates = await clients.configuration.listEnvironments({ pool });
  console.log(`Found ${candidates.length} environments in pool '${pool}'`);
  for (const canditate of candidates) {
    try {
      console.log(`Acquiring environment 'aws://${canditate.account}/${canditate.region}'...`);
      await clients.environments.acquire(allocaionId, canditate.account, canditate.region);
      return canditate;
    } catch (e) {
      if (e instanceof EnvironmentAlreadyAcquiredError) {
        console.log(`Environment 'aws://${canditate.account}/${canditate.region}' already acquired. Trying the next one.`);
        continue;
      }
      throw e;
    }
  }
  throw new ProxyError(423, `No environments available in pool '${pool}'`);
}
async function startAllocation(id, environment, requester) {
  try {
    await clients.allocations.start({
      id,
      account: environment.account,
      region: environment.region,
      pool: environment.pool,
      requester
    });
  } catch (e) {
    if (e instanceof InvalidInputError) {
      throw new ProxyError(400, e.message);
    }
    throw e;
  }
}
function success(body) {
  return { statusCode: 200, body: JSON.stringify(body) };
}
function failure(e) {
  const statusCode = e instanceof ProxyError ? e.statusCode : 500;
  return { statusCode, body: JSON.stringify({ message: e.message }) };
}

// src/cleanup/cleaner.ts
var import_client_cloudformation3 = require("@aws-sdk/client-cloudformation");
var import_credential_providers = require("@aws-sdk/credential-providers");

// src/cleanup/cleaner.buckets.ts
var import_client_cloudformation = require("@aws-sdk/client-cloudformation");
var import_client_s3 = require("@aws-sdk/client-s3");
var BucketsCleaner = class {
  constructor(credentials, region, stack, log) {
    this.stack = stack;
    this.log = log;
    this.cfn = new import_client_cloudformation.CloudFormation({ credentials, region });
    this.s3 = new import_client_s3.S3({ credentials, region });
  }
  async clean(opts) {
    const buckets = await this.listBuckets();
    const emptyBuckets = buckets.map((b) => this.emptyBucket(b, opts.timeoutDate));
    await Promise.all(emptyBuckets);
    const deleteBuckets = buckets.map((b) => this.deleteBucket(b, opts.timeoutDate));
    await Promise.all(deleteBuckets);
  }
  async listBuckets() {
    this.log.info(`Collecting buckets in stack ${this.stack.StackName}`);
    const resources = await this.cfn.describeStackResources({ StackName: this.stack.StackName });
    return (resources.StackResources ?? []).filter((r) => r.ResourceType === "AWS::S3::Bucket").map((r) => r.PhysicalResourceId);
  }
  async emptyBucket(bucketName, timeoutDate) {
    try {
      let isTruncated = true;
      let keyMarker = void 0;
      let versionIdMarker = void 0;
      const checkTimeout = () => {
        if (Date.now() > timeoutDate.getTime()) {
          throw new Error(`Operation timed out. Timeout date: ${timeoutDate.toISOString()}`);
        }
      };
      this.log.info(`Starting to clean bucket: ${bucketName}`);
      while (isTruncated) {
        checkTimeout();
        const response = await this.s3.listObjectVersions({
          Bucket: bucketName,
          KeyMarker: keyMarker,
          VersionIdMarker: versionIdMarker
        });
        const versions = response.Versions ?? [];
        const deleteMarkers = response.DeleteMarkers ?? [];
        const objectsToDelete = [
          ...versions.map((version) => ({
            Key: version.Key,
            VersionId: version.VersionId
          })),
          ...deleteMarkers.map((marker) => ({
            Key: marker.Key,
            VersionId: marker.VersionId
          }))
        ];
        if (objectsToDelete.length === 0) {
          this.log.info("Bucket is already empty.");
          break;
        }
        if (objectsToDelete.length > 0) {
          await this.s3.send(new import_client_s3.DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
              Objects: objectsToDelete,
              Quiet: true
            }
          }));
          this.log.info(`Deleted ${objectsToDelete.length} objects.`);
        }
        isTruncated = response.IsTruncated ?? false;
        keyMarker = response.NextKeyMarker;
        versionIdMarker = response.NextVersionIdMarker;
      }
      this.log.info(`Bucket ${bucketName} has been emptied.`);
    } catch (e) {
      if (e instanceof import_client_s3.NoSuchBucket) {
        this.log.info(`Bucket ${bucketName} does not exist. Skipping.`);
        return;
      }
      throw e;
    }
  }
  async deleteBucket(bucketName, timeoutDate) {
    this.log.info(`Deleting bucket: ${bucketName}`);
    try {
      await this.s3.deleteBucket({ Bucket: bucketName });
    } catch (e) {
      if (e instanceof import_client_s3.NoSuchBucket) {
        this.log.info(`Bucket ${bucketName} does not exist. Skipping.`);
        return;
      }
      throw e;
    }
    const maxWaitSeconds = (timeoutDate.getTime() - Date.now()) / 1e3;
    this.log.info(`Bucket ${bucketName} deleting. Waiting ${maxWaitSeconds} seconds for completion`);
    await (0, import_client_s3.waitUntilBucketNotExists)(
      { client: this.s3, maxWaitTime: maxWaitSeconds, minDelay: 5, maxDelay: 5 },
      { Bucket: bucketName }
    );
  }
};

// src/cleanup/cleaner.repos.ts
var import_client_cloudformation2 = require("@aws-sdk/client-cloudformation");
var import_client_ecr = require("@aws-sdk/client-ecr");
var ReposCleaner = class {
  constructor(credentials, region, stack, log) {
    this.stack = stack;
    this.log = log;
    this.cfn = new import_client_cloudformation2.CloudFormation({ credentials, region });
    this.ecr = new import_client_ecr.ECR({ credentials, region });
  }
  async clean() {
    const repos = await this.listRepos();
    for (const repo of repos) {
      await this.deleteRepo(repo);
    }
  }
  async listRepos() {
    this.log.info(`Collecting ECR repositories in stack ${this.stack.StackName}`);
    return ((await this.cfn.describeStackResources({ StackName: this.stack.StackName })).StackResources ?? []).filter((r) => r.ResourceType === "AWS::ECR::Repository").map((r) => r.PhysicalResourceId);
  }
  async deleteRepo(repositoryName) {
    this.log.info(`Deleting repository: ${repositoryName}`);
    try {
      await this.ecr.deleteRepository({ repositoryName, force: true });
    } catch (e) {
      if (e instanceof import_client_ecr.RepositoryNotFoundException) {
        this.log.info(`Repository ${repositoryName} does not exist. Skipping.`);
        return;
      }
      throw e;
    }
  }
};

// src/cleanup/cleaner.ts
var CleanerError = class extends Error {
  constructor(failedStacks) {
    super("Some stacks failed to delete");
    this.failedStacks = failedStacks;
  }
};
var Cleaner = class {
  constructor(environment, log) {
    this.environment = environment;
    this.log = log;
    this.credentials = (0, import_credential_providers.fromTemporaryCredentials)({
      params: {
        RoleArn: this.environment.adminRoleArn,
        RoleSessionName: `atmosphere.cleanup.${this.environment.account}.${this.environment.region}`
      }
    });
    this.cfn = new import_client_cloudformation3.CloudFormation({ credentials: this.credentials, region: this.environment.region });
  }
  async clean(timeoutSeconds) {
    const timeoutDate = new Date(Date.now() + 1e3 * timeoutSeconds);
    const stacks = await this.listStacks();
    const promises = stacks.map(async (s) => this.deleteStack(s, timeoutDate));
    const results = await Promise.all(promises);
    const failed = results.filter((r) => r.error);
    if (failed.length > 0) {
      throw new CleanerError(failed);
    }
  }
  async listStacks() {
    const stacksPaginator = (0, import_client_cloudformation3.paginateDescribeStacks)({ client: this.cfn, pageSize: 10 }, {});
    const stacks = [];
    for await (const page of stacksPaginator) {
      stacks.push(...page.Stacks ?? []);
    }
    return stacks;
  }
  async deleteStack(stack, timeoutDate) {
    try {
      const bucketsCleaner = new BucketsCleaner(this.credentials, this.environment.region, stack, this.log);
      this.log.info(`Cleaning buckets in stack ${stack.StackName}`);
      await bucketsCleaner.clean({ timeoutDate });
      const reposCleaner = new ReposCleaner(this.credentials, this.environment.region, stack, this.log);
      this.log.info(`Cleaning repositories in stack ${stack.StackName}`);
      await reposCleaner.clean();
      if (stack.ParentId) {
        return { name: stack.StackName };
      }
      if (stack.StackStatus !== "DELETE_IN_PROGRESS") {
        this.log.info(`Disabling termination protection of stack ${stack.StackName}`);
        await this.cfn.send(new import_client_cloudformation3.UpdateTerminationProtectionCommand({
          StackName: stack.StackName,
          EnableTerminationProtection: false
        }));
        this.log.info(`Initiating stack deletion: ${stack.StackName} [Current Status: ${stack.StackStatus}]`);
        await this.cfn.send(new import_client_cloudformation3.DeleteStackCommand({ StackName: stack.StackName, RoleARN: this.environment.adminRoleArn }));
      }
      const maxWaitSeconds = (timeoutDate.getTime() - Date.now()) / 1e3;
      this.log.info(`Stack ${stack.StackName} deleting. Waiting ${maxWaitSeconds} seconds for completion`);
      await (0, import_client_cloudformation3.waitUntilStackDeleteComplete)(
        { client: this.cfn, maxWaitTime: maxWaitSeconds, minDelay: 5, maxDelay: 5 },
        { StackName: stack.StackName }
      );
      this.log.info(`Stack ${stack.StackName} deleted.`);
      return { name: stack.StackName };
    } catch (e) {
      return { name: stack.StackName, error: e };
    }
  }
};

// src/cleanup/cleanup.task.ts
var clients2 = RuntimeClients.getOrCreate();
async function handler2(req) {
  const allocation = await clients2.allocations.get(req.allocationId);
  const log = new Logger({ allocationId: req.allocationId, pool: allocation.pool, component: "cleanup" });
  return doHandler2(allocation, req.timeoutSeconds, log);
}
async function doHandler2(allocation, timeoutSeconds, log) {
  const env3 = `aws://${allocation.account}/${allocation.region}`;
  try {
    log.info(`Fetching environment '${env3}'`);
    const environment = await clients2.configuration.getEnvironment(allocation.account, allocation.region);
    const cleaner = new Cleaner(environment, log);
    log.info(`Starting cleanup of '${env3}'`);
    await cleaner.clean(timeoutSeconds);
    log.info(`Successfully cleaned '${env3}'`);
    log.info(`Releasing environment '${env3}'`);
    await clients2.environments.release(allocation.id, environment.account, environment.region);
    log.info(`Successfully released environment '${env3}'`);
    log.info("Done!");
  } catch (e) {
    if (e instanceof EnvironmentAlreadyInUseError) {
      log.error(e, `Failed releasing environment '${env3}'`);
      throw e;
    }
    log.error(e);
    log.info(`Marking environment '${env3}' as 'dirty'`);
    await clients2.environments.dirty(allocation.id, allocation.account, allocation.region);
    log.info(`Successfully marked environment '${env3}' as 'dirty'`);
    if (e instanceof CleanerError) {
      log.info();
      log.info(">> Failed stacks errors report <<");
      for (const f of e.failedStacks) {
        log.info("");
        log.info(`----- Stack: ${f.name} -----`);
        log.info("");
        log.error(f.error);
      }
      return;
    }
    throw e;
  }
}
if (require.main !== module) {
} else {
  const allocationId = Envars.required(CLEANUP_TASK_ALLOCATION_ID);
  const timeoutSeconds = Number(Envars.required(CLEANUP_TASK_TIMEOUT_SECONDS));
  void handler2({ allocationId, timeoutSeconds });
}

// src/deallocate/deallocate.lambda.ts
var CLEANUP_TIMEOUT_SECONDS = 60 * 60;
var ProxyError2 = class extends Error {
  constructor(statusCode, message) {
    super(`${statusCode}: ${message}`);
    this.statusCode = statusCode;
    this.message = message;
  }
};
var clients3 = RuntimeClients.getOrCreate();
async function handler3(event) {
  console.log("Event:", JSON.stringify(event, null, 2));
  let allocationId, request, pool;
  try {
    [allocationId, request] = parseEvent(event);
    pool = (await clients3.allocations.get(allocationId)).pool;
  } catch (e) {
    return failure2(e);
  }
  const log = new Logger({ allocationId, pool, component: "deallocate" });
  return safeDoHandler2(allocationId, request, log);
}
async function safeDoHandler2(allocationId, request, log) {
  try {
    return await doHandler3(allocationId, request, log);
  } catch (e) {
    log.error(e);
    return failure2(e);
  }
}
async function doHandler3(allocationId, request, log) {
  try {
    const cleanupTimeoutDate = new Date(Date.now() + 1e3 * CLEANUP_TIMEOUT_SECONDS);
    log.info(`Ending allocation with outcome: ${request.outcome}`);
    const allocation = await endAllocation(allocationId, request.outcome);
    log.info(`Scheduling timeout for cleanup of environment 'aws://${allocation.account}/${allocation.region}' to ${cleanupTimeoutDate}`);
    await clients3.scheduler.scheduleCleanupTimeout({
      allocationId: allocation.id,
      account: allocation.account,
      region: allocation.region,
      timeoutDate: cleanupTimeoutDate,
      functionArn: Envars.required(CLEANUP_TIMEOUT_FUNCTION_ARN_ENV)
    });
    log.info(`Starting cleanup of 'aws://${allocation.account}/${allocation.region}'`);
    await clients3.environments.cleaning(allocationId, allocation.account, allocation.region);
    const taskInstanceArn = await clients3.cleanup.start({ allocation, timeoutSeconds: CLEANUP_TIMEOUT_SECONDS });
    log.info(`Successfully started cleanup task: ${taskInstanceArn}`);
    return success2();
  } catch (e) {
    if (e instanceof AllocationAlreadyEndedError) {
      log.info(`Returning success because: ${e.message}`);
      return success2();
    }
    throw e;
  }
}
function parseEvent(event) {
  const id = (event.pathParameters ?? {}).id;
  if (!id) {
    throw new ProxyError2(400, "Missing 'id' path parameter");
  }
  if (!event.body) {
    throw new ProxyError2(400, "Request body not found");
  }
  const parsed = JSON.parse(event.body);
  if (!parsed.outcome) {
    throw new ProxyError2(400, "'outcome' must be provided in the request body");
  }
  return [id, parsed];
}
async function endAllocation(id, outcome) {
  try {
    return await clients3.allocations.end({ id, outcome });
  } catch (e) {
    if (e instanceof InvalidInputError) {
      throw new ProxyError2(400, e.message);
    }
    throw e;
  }
}
function success2() {
  return { statusCode: 200, body: JSON.stringify({}) };
}
function failure2(e) {
  const statusCode = e instanceof ProxyError2 ? e.statusCode : 500;
  return { statusCode, body: JSON.stringify({ message: e.message }) };
}

// src/scheduler/allocation-timeout/allocation-timeout.lambda.ts
var import_client_lambda = require("@aws-sdk/client-lambda");
var clients4 = RuntimeClients.getOrCreate();
async function handler4(event) {
  console.log("Event:", JSON.stringify(event, null, 2));
  const allocation = await clients4.allocations.get(event.allocationId);
  const log = new Logger({ allocationId: event.allocationId, pool: allocation.pool, component: "allocation-timeout" });
  await doHandler4(event, log);
}
async function doHandler4(event, log) {
  try {
    const body = JSON.stringify({ outcome: "timeout" });
    const lambda = new import_client_lambda.Lambda();
    const payload = JSON.stringify({ pathParameters: { id: event.allocationId }, body });
    const target = Envars.required(DEALLOCATE_FUNCTION_NAME_ENV);
    log.info(`Invoking ${target} with payload: ${payload}`);
    const response = await lambda.invoke({ FunctionName: target, InvocationType: "RequestResponse", Payload: payload });
    const responsePayload = JSON.parse(response.Payload?.transformToString("utf-8") ?? "{}");
    if (responsePayload.statusCode !== 200) {
      throw new Error(`Unexpected response status code ${responsePayload.statusCode}: ${responsePayload.body}`);
    }
    log.info("Done");
  } catch (e) {
    log.error(e);
    throw e;
  }
}

// src/scheduler/cleanup-timeout/cleanup-timeout.lambda.ts
var clients5 = RuntimeClients.getOrCreate();
async function handler5(event) {
  console.log("Event:", JSON.stringify(event, null, 2));
  const allocationId = event.allocationId;
  const allocation = await clients5.allocations.get(event.allocationId);
  const log = new Logger({ allocationId, pool: allocation.pool, component: "cleanup-timeout" });
  await doHandler5(event, log);
}
async function doHandler5(event, log) {
  try {
    log.info(`Marking environment 'aws://${event.account}/${event.region}' as dirty`);
    await clients5.environments.dirty(event.allocationId, event.account, event.region);
    log.info("Done");
  } catch (e) {
    if (e instanceof EnvironmentAlreadyReleasedError) {
      log.info(e.message);
      return;
    }
    if (e instanceof EnvironmentAlreadyDirtyError) {
      log.info(e.message);
      return;
    }
    if (e instanceof EnvironmentAlreadyReallocated) {
      log.info(e.message);
      return;
    }
    log.error(e);
    throw e;
  }
}

// test/integ/atmosphere.runtime.ts
var CDK_ATMOSPHERE_INTEG_LOCAL_RUNTIME_ENV = "CDK_ATMOSPHERE_INTEG_LOCAL_RUNTIME";
var clients6 = RuntimeClients.getOrCreate();
var Runtime = class _Runtime {
  constructor(vars) {
    this.vars = vars;
    this.lambda = new import_client_lambda2.Lambda();
    this.ecs = new import_client_ecs2.ECS();
  }
  static isLocal() {
    const value = process.env[CDK_ATMOSPHERE_INTEG_LOCAL_RUNTIME_ENV];
    if (value === "false" || value === "0") return false;
    return true;
  }
  async allocate(body) {
    const json = JSON.stringify(body);
    const response = _Runtime.isLocal() ? await this.allocateLocal(json) : await this.allocateRemote(json);
    return response;
  }
  async deallocate(id, body) {
    const json = JSON.stringify(body);
    const response = _Runtime.isLocal() ? await this.deallocateLocal(id, json) : await this.deallocateRemote(id, json);
    return response;
  }
  async cleanupTimeout(event) {
    _Runtime.isLocal() ? await this.cleanupTimeoutLocal(event) : await this.cleanupTimeoutRemote(event);
  }
  async allocationTimeout(event) {
    _Runtime.isLocal() ? await this.allocationTimeoutLocal(event) : await this.allocationTimeoutRemote(event);
  }
  /**
   * Perform a cleanup for a specific allocation. When running locally, this will
   * invoke the cleanup task in-process, when running remotely, this will trigger the ECS task.
   */
  async cleanup(req) {
    return _Runtime.isLocal() ? this.cleanupLocal(req) : this.cleanupRemote(req);
  }
  async allocationTimeoutLocal(event) {
    const payload = JSON.stringify(event);
    this.log(`Invoking local allocation timeout handler with event: ${payload}`);
    console.log("");
    await env2(this.vars, async () => handler4(event));
    console.log("");
  }
  async allocationTimeoutRemote(event) {
    const payload = JSON.stringify(event);
    this.log(`Invoking allocation timeout lambda with event: ${payload}`);
    await this.lambda.invoke({
      Payload: payload,
      FunctionName: this.vars[ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV],
      InvocationType: "RequestResponse"
    });
  }
  async cleanupTimeoutLocal(event) {
    const payload = JSON.stringify(event);
    this.log(`Invoking local cleanup timeout handler with event: ${payload}`);
    console.log("");
    await env2(this.vars, async () => handler5(event));
    console.log("");
  }
  async cleanupTimeoutRemote(event) {
    const payload = JSON.stringify(event);
    this.log(`Invoking cleanup timeout lambda with event: ${payload}`);
    await this.lambda.invoke({
      Payload: payload,
      FunctionName: this.vars[CLEANUP_TIMEOUT_FUNCTION_ARN_ENV],
      InvocationType: "RequestResponse"
    });
  }
  async cleanupLocal(req) {
    this.log(`Invoking local cleanup task handler with body: ${JSON.stringify(req)}`);
    console.log();
    await handler2(req);
    console.log();
  }
  async cleanupRemote(req) {
    this.log(`Starting ECS cleanup task with body: ${JSON.stringify(req)}`);
    const allocation = await clients6.allocations.get(req.allocationId);
    const taskInstanceArn = await clients6.cleanup.start({
      allocation,
      timeoutSeconds: req.timeoutSeconds
    });
    this.log(`Waiting for cleanup task '${taskInstanceArn}' to stop`);
    await (0, import_client_ecs2.waitUntilTasksStopped)(
      { client: this.ecs, maxWaitTime: 300, minDelay: 1, maxDelay: 1 },
      { cluster: this.vars[CLEANUP_CLUSTER_ARN_ENV], tasks: [taskInstanceArn] }
    );
  }
  async deallocateLocal(id, jsonBody) {
    this.log(`Invoking local deallocate handler for allocation '${id}' with body: ${jsonBody}`);
    console.log();
    const response = await env2(this.vars, async () => {
      return handler3({ body: jsonBody, pathParameters: { id } });
    });
    console.log();
    return { status: response.statusCode, body: response.body };
  }
  async deallocateRemote(id, jsonBody) {
    this.log(`Sending deallocation request for allocation '${id}' with body: ${jsonBody}`);
    const client = new import_cdk_atmosphere_client.AtmosphereClient(this.vars[ENDPOINT_URL_ENV]);
    try {
      const body = await client.release(id, JSON.parse(jsonBody).outcome);
      return { status: 200, body: JSON.stringify(body) };
    } catch (e) {
      if (e instanceof import_cdk_atmosphere_client.ServiceError) {
        return { status: e.statusCode, body: JSON.stringify({ message: e.message }) };
      }
      throw e;
    }
  }
  async allocateLocal(jsonBody) {
    this.log(`Invoking local allocate handler with body: ${jsonBody}`);
    console.log();
    const response = await env2(this.vars, async () => {
      return handler({ body: jsonBody });
    });
    console.log();
    return { status: response.statusCode, body: response.body };
  }
  async allocateRemote(jsonBody) {
    this.log(`Sending allocation request with body: ${jsonBody}`);
    const client = new import_cdk_atmosphere_client.AtmosphereClient(this.vars[ENDPOINT_URL_ENV]);
    try {
      const allocation = await client.acquire({ ...JSON.parse(jsonBody), timeoutSeconds: 5 });
      return { status: 200, body: JSON.stringify(allocation) };
    } catch (e) {
      if (e instanceof import_cdk_atmosphere_client.ServiceError) {
        return { status: e.statusCode, body: JSON.stringify({ message: e.message }) };
      }
      throw e;
    }
  }
  log(message) {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`);
  }
};

// test/integ/atmosphere.runner.ts
var SUCCESS_PAYLOAD = "OK";
var CDK_ATMOSPHERE_INTEG_STACKS_BUCKET_ENV = "CDK_ATMOSPHERE_INTEG_STACKS_BUCKET";
var CDK_ATMOSPHERE_INTEG_STACKS_KEY_ENV = "CDK_ATMOSPHERE_INTEG_STACKS_KEY";
var CDK_ATMOSPHERE_INTEG_LOCAL_ASSERT_ENV = "CDK_ATMOSPHERE_INTEG_LOCAL_ASSERT";
var dynamo = new import_client_dynamodb.DynamoDB();
var cfn = new import_client_cloudformation4.CloudFormation();
var scheduler = new import_client_scheduler2.Scheduler();
var s32 = new import_client_s32.S3();
var Runner = class _Runner {
  constructor(vars, name) {
    this.vars = vars;
    this.name = name;
    this.runtime = new Runtime(this.vars);
  }
  /**
   * Run an assertion function in a fresh service state.
   */
  static async assert(testCase, assertion) {
    if (!_Runner.shouldRun(testCase)) {
      return SUCCESS_PAYLOAD;
    }
    const test = await _Runner.create(testCase);
    await test.clear();
    try {
      test.log(`\u{1F3AC} Start <> ${testCase} \u{1F3AC}`);
      await env2(test.vars, async () => assertion(test));
      test.log(`\u2705 Success <> ${testCase} \u2705`);
      return SUCCESS_PAYLOAD;
    } catch (error) {
      test.log(`\u274C !! Fail <> ${testCase} !! \u274C`);
      throw error;
    }
  }
  static isLocal() {
    const value = process.env[CDK_ATMOSPHERE_INTEG_LOCAL_ASSERT_ENV];
    if (value === "false" || value === "0") return false;
    return true;
  }
  static shouldRun(testCase) {
    const selection = process.env.CDK_ATMOSPHERE_INTEG_TEST_CASE_SELECTION;
    if (!selection) return true;
    return testCase === selection;
  }
  static async unzip(bucket, key, to) {
    const response = await s32.getObject({
      Bucket: bucket,
      Key: key
    });
    const readableStream = response.Body;
    await new Promise((resolve, reject) => {
      readableStream.pipe(unzipper.Extract({ path: to })).on("close", resolve).on("error", reject);
    });
  }
  static async create(testCase) {
    let envValue;
    if (_Runner.isLocal()) {
      const devStack = ((await cfn.describeStacks({ StackName: "atmosphere-integ-dev-assertions" })).Stacks ?? [])[0];
      assert.ok(devStack, "Missing dev stack. Deploy by running: 'yarn integ:dev'");
      envValue = (name) => {
        const value = (devStack.Outputs ?? []).find((o) => o.OutputKey === name.replace(/_/g, "0"))?.OutputValue;
        assert.ok(value, `Missing output '${name}' from dev stack`);
        return value;
      };
    } else {
      envValue = (name) => Envars.required(name);
    }
    return new _Runner({
      [ENDPOINT_URL_ENV]: envValue(ENDPOINT_URL_ENV),
      [ALLOCATIONS_TABLE_NAME_ENV]: envValue(ALLOCATIONS_TABLE_NAME_ENV),
      [ENVIRONMENTS_TABLE_NAME_ENV]: envValue(ENVIRONMENTS_TABLE_NAME_ENV),
      [CONFIGURATION_BUCKET_ENV]: envValue(CONFIGURATION_BUCKET_ENV),
      [CONFIGURATION_KEY_ENV]: envValue(CONFIGURATION_KEY_ENV),
      [ALLOCATION_TIMEOUT_DLQ_ARN_ENV]: envValue(ALLOCATION_TIMEOUT_DLQ_ARN_ENV),
      [CLEANUP_TIMEOUT_DLQ_ARN_ENV]: envValue(CLEANUP_TIMEOUT_DLQ_ARN_ENV),
      [SCHEDULER_ROLE_ARN_ENV]: envValue(SCHEDULER_ROLE_ARN_ENV),
      [CLEANUP_TIMEOUT_FUNCTION_ARN_ENV]: envValue(CLEANUP_TIMEOUT_FUNCTION_ARN_ENV),
      [ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV]: envValue(ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV),
      [REST_API_ID_ENV]: envValue(REST_API_ID_ENV),
      [ALLOCATIONS_RESOURCE_ID_ENV]: envValue(ALLOCATIONS_RESOURCE_ID_ENV),
      [ALLOCATION_RESOURCE_ID_ENV]: envValue(ALLOCATION_RESOURCE_ID_ENV),
      [DEALLOCATE_FUNCTION_NAME_ENV]: envValue(DEALLOCATE_FUNCTION_NAME_ENV),
      [CLEANUP_CLUSTER_ARN_ENV]: envValue(CLEANUP_CLUSTER_ARN_ENV),
      [CLEANUP_TASK_DEFINITION_ARN_ENV]: envValue(CLEANUP_TASK_DEFINITION_ARN_ENV),
      [CLEANUP_TASK_SUBNET_ID_ENV]: envValue(CLEANUP_TASK_SUBNET_ID_ENV),
      [CLEANUP_TASK_SECURITY_GROUP_ID_ENV]: envValue(CLEANUP_TASK_SECURITY_GROUP_ID_ENV),
      [CLEANUP_TASK_CONTAINER_NAME_ENV]: envValue(CLEANUP_TASK_CONTAINER_NAME_ENV)
    }, testCase);
  }
  async fetchAllocationTimeoutSchedule(allocationId) {
    const response = await scheduler.listSchedules({
      NamePrefix: `atmosphere.timeout.aloc_${allocationId}`
    });
    return response.Schedules?.[0];
  }
  async fetchCleanupTimeoutSchedule(allocationId) {
    const response = await scheduler.listSchedules({
      NamePrefix: `atmosphere.timeout.clean_${allocationId}`
    });
    return response.Schedules?.[0];
  }
  async fetchStack(name, region) {
    const cfnRegion = new import_client_cloudformation4.CloudFormation({ region });
    try {
      const response = await cfnRegion.describeStacks({ StackName: name });
      return response.Stacks?.[0];
    } catch (e) {
      if (e instanceof import_client_cloudformation4.CloudFormationServiceException && e.name === "ValidationError") {
        return void 0;
      }
      throw e;
    }
  }
  /**
   * Deploy a stack onto a region and return its name.
   * This will also wait for stack creation to complete.
   */
  async deployStack(opts) {
    const cfnRegion = new import_client_cloudformation4.CloudFormation({ region: opts.region });
    const templatePath = await this.resolveTemplatePath(opts.templatePath);
    const templateBody = fs.readFileSync(templatePath, { encoding: "utf-8" });
    const stackName = `cdk-atmosphere-integ-${this.name}-${path.basename(opts.templatePath).split(".")[0]}`;
    this.log(`Deploying stack '${stackName}' from path '${opts.templatePath}' to region '${opts.region}'`);
    await cfnRegion.createStack({
      StackName: stackName,
      TemplateBody: templateBody,
      EnableTerminationProtection: opts.terminationProtection ?? false,
      Capabilities: ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM", "CAPABILITY_AUTO_EXPAND"],
      OnFailure: "DO_NOTHING",
      TimeoutInMinutes: opts.timeoutMinutes ?? 10
    });
    this.log(`Waiting for stack '${stackName}' to be created in region '${opts.region}'`);
    await (0, import_client_cloudformation4.waitUntilStackCreateComplete)(
      { client: cfnRegion, maxWaitTime: 300, minDelay: 5, maxDelay: 5 },
      { StackName: stackName }
    );
    const resources = await cfnRegion.describeStackResources({ StackName: stackName });
    return [stackName, resources.StackResources ?? []];
  }
  async destroyStack(opts) {
    const cfnRegion = new import_client_cloudformation4.CloudFormation({ region: opts.region });
    const stack = ((await cfnRegion.describeStacks({ StackName: opts.stackName })).Stacks ?? [])[0];
    if (stack.StackStatus !== "DELETE_IN_PROGRESS") {
      const resources = await cfnRegion.describeStackResources({
        StackName: opts.stackName
      });
      const retainResources = stack.StackStatus === "DELETE_FAILED" ? (resources.StackResources ?? []).filter((r) => r.ResourceType === "AWS::CloudFormation::CustomResource" || r.ResourceStatus?.startsWith("Custom::")).map((r) => r.LogicalResourceId) : void 0;
      this.log(`Destroying stack '${opts.stackName}' in region '${opts.region}'`);
      await cfnRegion.deleteStack({
        StackName: opts.stackName,
        RetainResources: retainResources
      });
    }
    this.log(`Waiting for stack '${opts.stackName}' to be deleted in region '${opts.region}'`);
    await (0, import_client_cloudformation4.waitUntilStackDeleteComplete)(
      { client: cfnRegion, maxWaitTime: 600, minDelay: 5, maxDelay: 5 },
      { StackName: opts.stackName }
    );
  }
  async clear() {
    this.log("Clearing state");
    const environments = (await dynamo.scan({ TableName: this.vars[ENVIRONMENTS_TABLE_NAME_ENV] })).Items ?? [];
    for (const environment of environments) {
      this.log(`  \xBB deleting environment aws://${environment.account.S}/${environment.region.S}`);
      await dynamo.deleteItem({
        TableName: this.vars[ENVIRONMENTS_TABLE_NAME_ENV],
        Key: {
          account: { S: environment.account.S },
          region: { S: environment.region.S }
        }
      });
    }
    const allocations = (await dynamo.scan({ TableName: this.vars[ALLOCATIONS_TABLE_NAME_ENV] })).Items ?? [];
    for (const allocation of allocations) {
      this.log(`  \xBB deleting allocation ${allocation.id.S}`);
      await dynamo.deleteItem({
        TableName: this.vars[ALLOCATIONS_TABLE_NAME_ENV],
        Key: {
          id: { S: allocation.id.S }
        }
      });
    }
    const schedules = (await scheduler.listSchedules({})).Schedules ?? [];
    for (const schedule of schedules) {
      this.log(`  \xBB deleting schedule ${schedule.Name}`);
      await scheduler.deleteSchedule({ Name: schedule.Name });
    }
  }
  async resolveTemplatePath(templatePath) {
    const stacksBucket = process.env[CDK_ATMOSPHERE_INTEG_STACKS_BUCKET_ENV];
    const stacksKey = process.env[CDK_ATMOSPHERE_INTEG_STACKS_KEY_ENV];
    if (stacksBucket && stacksKey) {
      const to = "/tmp/integ-stacks";
      await _Runner.unzip(stacksBucket, stacksKey, to);
      return path.join(to, path.basename(templatePath));
    }
    return path.join(__dirname, templatePath);
  }
  log(message) {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`);
  }
};

// test/integ/cleanup/assert.lambda.ts
var clients7 = RuntimeClients.getOrCreate();
async function handler6(_) {
  await Runner.assert("deletes-stack-and-releases-environment", async (session) => {
    const response = await session.runtime.allocate({ pool: "release", requester: "test" });
    const body = JSON.parse(response.body);
    const account = body.environment.account;
    const region = body.environment.region;
    const [stackName] = await session.deployStack({ templatePath: "cleanup/stacks/simple.yaml", region });
    await clients7.environments.cleaning(body.id, account, region);
    await session.runtime.cleanup({ allocationId: body.id, timeoutSeconds: 30 });
    try {
      await clients7.environments.get(account, region);
      assert2.fail("expected environment to be deleted");
    } catch (err) {
      assert2.strictEqual(err.constructor.name, "EnvironmentNotFound");
    }
    const stack = await session.fetchStack(stackName, region);
    assert2.ok(!stack);
  });
  await Runner.assert("empties-and-deletes-buckets", async (session) => {
    const response = await session.runtime.allocate({ pool: "release", requester: "test" });
    const body = JSON.parse(response.body);
    const account = body.environment.account;
    const region = body.environment.region;
    const [stackName, resources] = await session.deployStack({ templatePath: "cleanup/stacks/versioned-bucket.yaml", region });
    const bucketName = resources.filter((r) => r.ResourceType === "AWS::S3::Bucket").map((r) => r.PhysicalResourceId)[0];
    const s33 = new import_client_s33.S3({ region });
    await s33.putObject({ Bucket: bucketName, Key: "one.txt", Body: "one" });
    await s33.putObject({ Bucket: bucketName, Key: "two.txt", Body: "two" });
    await s33.deleteObject({ Bucket: bucketName, Key: "two.txt" });
    await clients7.environments.cleaning(body.id, account, region);
    await session.runtime.cleanup({ allocationId: body.id, timeoutSeconds: 120 });
    const stack = await session.fetchStack(stackName, region);
    assert2.ok(!stack);
    try {
      await s33.headBucket({ Bucket: bucketName });
    } catch (err) {
      assert2.strictEqual(err.name, "NotFound");
    }
  });
  await Runner.assert("disables-termination-protection", async (session) => {
    const response = await session.runtime.allocate({ pool: "release", requester: "test" });
    const body = JSON.parse(response.body);
    const account = body.environment.account;
    const region = body.environment.region;
    const [stackName] = await session.deployStack({ templatePath: "cleanup/stacks/simple.yaml", region, terminationProtection: true });
    await clients7.environments.cleaning(body.id, account, region);
    await session.runtime.cleanup({ allocationId: body.id, timeoutSeconds: 30 });
    const stack = await session.fetchStack(stackName, region);
    assert2.ok(!stack);
  });
  await Runner.assert("can-release-a-dirty-environment", async (session) => {
    const response = await session.runtime.allocate({ pool: "release", requester: "test" });
    const body = JSON.parse(response.body);
    const account = body.environment.account;
    const region = body.environment.region;
    await clients7.allocations.end({ id: body.id, outcome: "success" });
    await clients7.environments.dirty(body.id, account, region);
    await session.runtime.cleanup({ allocationId: body.id, timeoutSeconds: 30 });
    try {
      await clients7.environments.get(account, region);
      assert2.fail("expected environment to be released");
    } catch (err) {
      assert2.strictEqual(err.constructor.name, "EnvironmentNotFound");
    }
  });
  await Runner.assert("marks-environment-dirty-if-fail", async (session) => {
    const response = await session.runtime.allocate({ pool: "release", requester: "test" });
    const body = JSON.parse(response.body);
    const account = body.environment.account;
    const region = body.environment.region;
    const [stackName] = await session.deployStack({ templatePath: "cleanup/stacks/cannot-delete.yaml", region });
    await clients7.environments.cleaning(body.id, account, region);
    await session.runtime.cleanup({ allocationId: body.id, timeoutSeconds: 30 });
    const environment = await clients7.environments.get(account, region);
    assert2.strictEqual(environment.status, "dirty");
    await session.destroyStack({ stackName, region });
  });
  return SUCCESS_PAYLOAD;
}
if (Runner.isLocal()) {
  void handler6({});
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
/*! Bundled license information:

aws4fetch/dist/aws4fetch.cjs.js:
  (**
   * @license MIT <https://opensource.org/licenses/MIT>
   * @copyright Michael Hart 2024
   *)
*/
