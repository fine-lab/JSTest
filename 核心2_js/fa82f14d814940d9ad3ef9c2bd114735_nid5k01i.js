let AbstractTrigger = require("AbstractTrigger");
function test(obj) {
  let success = true;
  let res = Object.values(obj).reduce((obj, f) => {
    let flag = false;
    try {
      flag = f();
    } catch (e) {
      if ("object" == typeof e) {
        flag = e.message;
      } else {
        flag = e;
      }
    }
    if (success) {
      let type = typeof flag;
      if ("boolean" == type) {
        if (false === flag) {
          success = false;
        }
      } else if ("string" == type) {
        success = false;
      } else if ("object" == type) {
        if (undefined !== flag.success) {
          success = flag.success;
        } else if (!flag.flag) {
          success = false;
        }
      }
    }
    obj[f.name] = flag;
    return obj;
  }, {});
  return { success, res };
}
function rt(fn, args, testfn) {
  let res = fn(...args);
  let type = typeof res;
  if ("function" !== typeof testfn) {
    testfn = (expect) => expect === res;
  }
  let flag = testfn(res);
  return {
    flag,
    res,
    type
  };
}
function check(res, testfn) {
  let type = typeof res;
  if ("function" !== typeof testfn) {
    testfn = (expect) => expect === res;
  }
  let flag = testfn(res);
  return {
    flag,
    res,
    type
  };
}
let exampleTest = {
  Base62Encode: function () {
    let data = "testdata";
    let res = Base62Encode(data);
    return check(res, "9zZdHi4emI5");
  },
  Base62Decode: function () {
    let data = "9zZdHi4emI5";
    let res = Base62Decode(data);
    return check(res, "testdata");
  },
  Base64Encode: function () {
    let data = "password";
    let res = Base64Encode(data);
    return check(res, "cGFzc3dvcmQ=");
  },
  Base64Decode: function () {
    let data = "cGFzc3dvcmQ=";
    let res = Base64Decode(data);
    return check(res, "password");
  },
  HEXEncode: function () {
    let data = "password";
    let res = HEXEncode(data);
    return check(res, "70617373776f7264");
  },
  HEXDecode: function () {
    let data = "70617373776f7264";
    let res = HEXDecode(data);
    return check(res, "password");
  },
  JwtCreate: function () {
    let res = JwtCreate("12345", "wangbo", "测试");
    let type = typeof res;
    let obj = JSON.parse(JwtDecode(res));
    let tree = obj.payload.tree;
    let sub = tree.sub["_value"];
    let userName = tree.userName._value;
    let userId = tree.userId._value;
    let flag = "测试" === sub && "12345" === userId && "wangbo" === userName;
    return { flag, res, type, obj };
  },
  JwtDecode: function () {
    let data =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiLmtYvor5UiLCJ1c2VyTmFtZSI6IndhbmdibyIsImV4cCI6MTU1NjE3NjYwNiwidXNlcklkIjoiMTIzNDUiLCJpYXQiOjE1NTYxNzY2MDF9.FNVh-NbFHgScsbbuwLvQL-sOqLuaAoI8jxMvudq81J8";
    let res = JwtDecode(data);
    let type = typeof res;
    let obj = JSON.parse(res);
    let tree = obj.payload.tree;
    let sub = tree.sub["_value"];
    let userName = tree.userName._value;
    let userId = tree.userId._value;
    let flag = "测试" === sub && "12345" === userId && "wangbo" === userName;
    return { flag, res, type, obj };
  },
  MD5Encode: function () {
    let data = "password";
    let res = MD5Encode(data);
    return check(res, "5f4dcc3b5aa765d61d8327deb882cf99");
  },
  MurmurHash: function () {
    let data = "password";
    let res = MurmurHash(data);
    return check(res, "3534895689425942242");
  },
  MurmurHash2: function () {
    let data = "password";
    let res = MurmurHash(data, 123456);
    return check(res, -1764774460);
  },
  MurmurHash3: function () {
    let data = "password";
    let res = MurmurHash(data, 1, 1, 123456);
    return check(res, -596429692);
  },
  MurmurHash64A: function () {
    let data = "password";
    let res = MurmurHash64A(data, 123456);
    return check(res, "-6876255535019544327");
  },
  MurmurHash64A2: function () {
    let data = "password";
    let res = MurmurHash64A(data, 1, 1, 123456);
    return check(res, "-1483431536894836382");
  },
  SHA1Encode: function () {
    let data = "password";
    let res = SHA1Encode(data);
    return check(res, "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8");
  },
  SHA256Encode: function () {
    let data = "password";
    let res = SHA256Encode(data);
    return check(res, "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
  },
  HmacSHA256: function () {
    let data = "password";
    let key = "123";
    let res = HmacSHA256(data, key);
    return check(res, "5b432a96fcc4be540d7bd2fb1e164954963992af45fc9bf572d7f1233d67fce7");
  },
  AmountPointNum: function () {
    let data = 1.234;
    let res = AmountPointNum(data);
    return check(res, 3);
  },
  GetBigDecimal: function () {
    let data = 1;
    let res = GetBigDecimal(data);
    return check(res, "1");
  },
  MoneyFormatReturnBd: function () {
    let data = 12.38;
    let res = MoneyFormatReturnBd(data, 1);
    return check(res, "12.4");
  },
  absolute: function () {
    let x = new Big(-0.8);
    let y = x.abs();
    return check(y, "0.8");
  },
  addition: function () {
    let x = new Big(0.3);
    let y = x.plus(0.1);
    return check(y, "0.4");
  },
  subtraction: function () {
    let x = new Big(0.3);
    let y = x.minus(0.1);
    return check(y, "0.2");
  },
  multiply: function () {
    let x = new Big(0.6);
    let y = x.times(4);
    return check(y, "2.4");
  },
  division: function () {
    let x = new Big(6);
    let y = new Big(3);
    let z = x.div(y);
    return check(z, "2");
  },
  AppContext: function () {
    let res = AppContext();
    let type = typeof res;
    let obj = JSON.parse(res);
    let { id, name, tenantId } = obj.currentUser;
    let flag = "398776b4-6535-4a93-a338-962bf5ba08e0" === id && "13811340858" === name && "lwefa6nj" === tenantId;
    return { flag, res, type, obj };
  },
  listOrgAndDeptByUserIds: function () {
    var sysId = "yourIdHere"; //系统id
    var tenantId = "yourIdHere"; //租户id
    var userids = ["398776b4-6535-4a93-a338-962bf5ba08e0"]; //租户id
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    return { result };
  },
  replace: function () {
    var str = "Hello, world!";
    var res = replace(str, "world", "yonyou");
    return check(res, "Hello, yonyou!");
  },
  split: function () {
    var str = "today-is-Tuesday";
    var limit = 1;
    var res = replace(str, "-", limit);
    return check(res, '["today", "is", "Tuesday"]');
  },
  join: function () {
    var strs = ["A", "B", "C"];
    var res = join(strs, "*");
    return check(res, "A*B*C");
  },
  includes: function () {
    var str = "Hello world, welcome to Yonbuilder。";
    var res = includes(str, "world");
    return check(res, "true");
  },
  trim: function () {
    var str = " yon builder ";
    var res = trim(str);
    return check(res, "yon builder");
  },
  substring: function () {
    var str = "Hello world!";
    var res = substring(str, 1, 3);
    return check(res, "el");
  },
  capitalize: function () {
    var str = "hello world!";
    var res = capitalize(str);
    return check(res, "Hello world!");
  },
  capitalizeEveryWord: function () {
    var str = "hello world!";
    var res = capitalizeEveryWord(str);
    return check(res, "Hello World!");
  },
  prefixInteger: function () {
    var number = 123;
    var digits = 5;
    var res = prefixInteger(number, digits);
    return check(res, "00123");
  },
  validateEmail: function () {
    var str = "https://www.example.com/";
    var res = validateEmail(str);
    return check(res, "true");
  },
  uuid: function () {
    var res = uuid();
    return res;
  },
  S4: function () {
    var res = S4();
    return res;
  },
  UrlEncode: function () {
    var res = UrlEncode("https://www.baidu.com/s?ie=UTF-8&wd=用友");
    return res;
  },
  UrlDecode: function () {
    var res = UrlDecode("https%3A%2F%2Fwww.baidu.com%2Fs%3Fie%3DUTF-8%26wd%3D%E7%94%A8%E5%8F%8B");
    return res;
  },
  json2string: function () {
    var student = new Object();
    student.name = "zhangsan";
    student.sex = "famle";
    student.address = "chaoyang";
    var res = JSON.stringify(student);
    return res;
  },
  string2json: function () {
    var student = '{"name":"zhangsan","sex":"famle","address":"chaoyang"}';
    var res = jsonParse(student);
    return res;
  }
};
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return test(exampleTest);
  }
}
exports({ entryPoint: MyTrigger });