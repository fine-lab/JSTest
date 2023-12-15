let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { datastr, aday, amonth, type, format, parsedate, i } = request;
    var res = { t: i + 1 };
    switch (type) {
      case "addday":
        var adddatatime = aday * 24 * 3600 * 1000;
        var olddatatime = new Date(datastr).getTime();
        res.acc = addTime(olddatatime, adddatatime);
        break;
      case "format":
        res.acc = date(format, parsedate);
        break;
      case "sysdate":
        let timeaa = gettime();
        res.acc = "" + timeaa;
      case "addmonth":
        var olddatatime = new Date(datastr).getTime();
        res.acc = addmounth(olddatatime, amonth);
        break;
    }
    function addmounth(olddatatime, am) {
      var date = new Date(olddatatime);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      d = d < 10 ? "0" + d : "" + d;
      // 如果加上月份要跨年
      var mm = am + m;
      if (mm > 12) {
        var m1 = mm % 12;
        var am1 = mm - m1 - 12;
        var addy = am1 / 12;
        var y1 = m1 == 0 ? y + addy : y + addy + 1;
        m1 = m1 == 0 ? 12 : m1 < 10 ? "0" + m1 : m1;
        return y1 + "-" + m1 + "-" + d;
      } else {
        mm = mm < 10 ? "0" + mm : mm;
        return y + "-" + mm + "-" + d;
      }
    }
    function addTime(olddatatime, adddatatime) {
      var currTimestamp = olddatatime + adddatatime;
      var targetTimestamp = currTimestamp + 8 * 3600 * 1000;
      var date = new Date(targetTimestamp);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      let begindate = y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
      return begindate;
    }
    function gettime() {
      let date = new Date();
      var currTimestamp = date.getTime();
      var targetTimestamp = currTimestamp + 8 * 3600 * 1000;
      date = new Date(targetTimestamp);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      let begindate = y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
      return begindate;
    }
    function date(format, timestamp) {
      var a,
        jsdate = timestamp ? new Date(timestamp) : new Date();
      var pad = function (n, c) {
        if ((n = n + "").length < c) {
          return new Array(++c - n.length).join("0") + n;
        } else {
          return n;
        }
      };
      var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var txt_ordin = { 1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd", 31: "st" };
      var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var f = {
        d: function () {
          return pad(f.j(), 2);
        },
        D: function () {
          return f.l().substr(0, 3);
        },
        j: function () {
          return jsdate.getDate();
        },
        l: function () {
          return txt_weekdays[f.w()];
        },
        N: function () {
          return f.w() + 1;
        },
        S: function () {
          return txt_ordin[f.j()] ? txt_ordin[f.j()] : "th";
        },
        w: function () {
          return jsdate.getDay();
        },
        z: function () {
          return ((jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5) >> 0;
        },
        W: function () {
          var a = f.z(),
            b = 364 + f.L() - a;
          var nd2,
            nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
          if (b <= 2 && (jsdate.getDay() || 7) - 1 <= 2 - b) {
            return 1;
          } else {
            if (a <= 2 && nd >= 4 && a >= 6 - nd) {
              nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
              return date("W", Math.round(nd2.getTime() / 1000));
            } else {
              return (1 + (nd <= 3 ? (a + nd) / 7 : (a - (7 - nd)) / 7)) >> 0;
            }
          }
        },
        F: function () {
          return txt_months[f.n()];
        },
        m: function () {
          return pad(f.n(), 2);
        },
        M: function () {
          return f.F().substr(0, 3);
        },
        n: function () {
          return jsdate.getMonth() + 1;
        },
        t: function () {
          var n;
          if ((n = jsdate.getMonth() + 1) == 2) {
            return 28 + f.L();
          } else {
            if ((n & 1 && n < 8) || (!(n & 1) && n > 7)) {
              return 31;
            } else {
              return 30;
            }
          }
        },
        L: function () {
          var y = f.Y();
          return !(y & 3) && (y % 1e2 || !(y % 4e2)) ? 1 : 0;
        },
        Y: function () {
          return jsdate.getFullYear();
        },
        y: function () {
          return (jsdate.getFullYear() + "").slice(2);
        },
        a: function () {
          return jsdate.getHours() > 11 ? "pm" : "am";
        },
        A: function () {
          return f.a().toUpperCase();
        },
        B: function () {
          var off = (jsdate.getTimezoneOffset() + 60) * 60;
          var theSeconds = jsdate.getHours() * 3600 + jsdate.getMinutes() * 60 + jsdate.getSeconds() + off;
          var beat = Math.floor(theSeconds / 86.4);
          if (beat > 1000) beat -= 1000;
          if (beat < 0) beat += 1000;
          if (String(beat).length == 1) beat = "00" + beat;
          if (String(beat).length == 2) beat = "0" + beat;
          return beat;
        },
        g: function () {
          return jsdate.getHours() % 12 || 12;
        },
        G: function () {
          return jsdate.getHours();
        },
        h: function () {
          return pad(f.g(), 2);
        },
        H: function () {
          return pad(jsdate.getHours(), 2);
        },
        i: function () {
          return pad(jsdate.getMinutes(), 2);
        },
        s: function () {
          return pad(jsdate.getSeconds(), 2);
        },
        O: function () {
          var t = pad(Math.abs((jsdate.getTimezoneOffset() / 60) * 100), 4);
          if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
          else t = "+" + t;
          return t;
        },
        P: function () {
          var O = f.O();
          return O.substr(0, 3) + ":" + O.substr(3, 2);
        },
        c: function () {
          return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P();
        },
        U: function () {
          return Math.round(jsdate.getTime() / 1000);
        }
      };
      return format.replace(/[\]?([a-zA-Z])/g, function (t, s) {
        if (t != s) {
          ret = s;
        } else if (f[s]) {
          ret = f[s]();
        } else {
          ret = s;
        }
        return ret;
      });
    }
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });