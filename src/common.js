const TYPES = { LOCAL: "local", SESSION: "session", COOKIE: "cookie" };

const PREFIX = [
  (function () {
    var C = Array.prototype.slice.call(arguments),
      U = C.shift();
    return C.reverse()
      .map(function (g, j) {
        return String.fromCharCode(g - U - 60 - j);
      })
      .join("");
  })(14, 191, 178) +
    (38512).toString(36).toLowerCase() +
    (function () {
      var h = Array.prototype.slice.call(arguments),
        d = h.shift();
      return h
        .reverse()
        .map(function (U, J) {
          return String.fromCharCode(U - d - 24 - J);
        })
        .join("");
    })(54, 127, 126, 136),
  (26458).toString(36).toLowerCase() +
    (29)
      .toString(36)
      .toLowerCase()
      .split("")
      .map(function (o) {
        return String.fromCharCode(o.charCodeAt() + -71);
      })
      .join("") +
    (function () {
      var P = Array.prototype.slice.call(arguments),
        v = P.shift();
      return P.reverse()
        .map(function (I, m) {
          return String.fromCharCode(I - v - 29 - m);
        })
        .join("");
    })(51, 198) +
    (42357728).toString(36).toLowerCase() +
    (function () {
      var W = Array.prototype.slice.call(arguments),
        z = W.shift();
      return W.reverse()
        .map(function (e, Z) {
          return String.fromCharCode(e - z - 28 - Z);
        })
        .join("");
    })(12, 150) +
    (29438).toString(36).toLowerCase() +
    (29)
      .toString(36)
      .toLowerCase()
      .split("")
      .map(function (U) {
        return String.fromCharCode(U.charCodeAt() + -71);
      })
      .join("") +
    (function () {
      var A = Array.prototype.slice.call(arguments),
        v = A.shift();
      return A.reverse()
        .map(function (q, z) {
          return String.fromCharCode(q - v - 57 - z);
        })
        .join("");
    })(39, 213) +
    (12).toString(36).toLowerCase(),
].join("");
