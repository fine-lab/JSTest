let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request, params) {
    let paramsObj = JSON.parse(params);
    let key = paramsObj.key; //根据key获取tXT
    let emunURI = paramsObj.emunURI;
    let emunObj = {};
    if (includes(emunURI, "Emun_XunPanLeiXing")) {
      emunObj = {
        1: "自我开发",
        2: "优化",
        3: "竞价",
        5: "阿里巴巴(含RFQ)",
        6: "电商社媒",
        7: "地推陌拜",
        8: "海外本地化推广(广告牌、海外本地电商)",
        9: "展会",
        10: "转介绍",
        11: "中国制造",
        12: "环球慧思",
        13: "其他",
        14: "老客户",
        15: "优化在线",
        16: "竞价在线"
      };
    } else if (includes(emunURI, "EmailSuffix")) {
      //邮箱后缀，用于检测是否企业邮箱
      let emailSuffix =
        "sohu.com,126.com,sina.com,sina.cn,gmail.com,yahoo.com,mail.ru,hotmail.com,yandex.ru,outlook.com,icloud.com,bk.ru,aol.com,yahoo.co.uk,live.com,inbox.ru,list.ru,yahoo.fr,ymail.com,hotmail.co.uk,rambler.ru,yahoo.co.in,rediffmail.com,mail.com,ukr.net,yahoo.es,msn.com,me.com,yahoo.com.ph,yahoo.com.mx,bigpond.com,qq.com,yahoo.co.id,hotmail.es,hotmail.fr,comcast.net,gmai.com,rocketmail.com,ya.ru,yahoo.ca,yahoo.in,yahoo.com.au,gamil.com,gmail.con,Googlemail.com,webmail.co.za,live.co.uk,yandex.com,gmail.ru,btinternet.com,sbcglobal.net,outlook.es,naver.com,live.com.mx,gmil.com,att.net,mweb.co.za,yahoo.com.ar,gmail.co,163.com,live.com.au,tut.by,libero.it,inbox.lv,bellsouth.net,telkomsa.net,abv.bg,xtra.co.nz,protonmail.com,email.com";
      return emailSuffix;
    }
    if (key == null || key == undefined || key == "") {
      //根据txt获取key
      let txt = paramsObj.txt; //根据txt获取key
      for (var ikey in emunObj) {
        if (emunObj[ikey] == txt) {
          return ikey;
        }
      }
      return 13;
    } else {
      //根据key获取tXT
      return emunObj[key];
    }
  }
}
exports({ entryPoint: MyAPIHandler });