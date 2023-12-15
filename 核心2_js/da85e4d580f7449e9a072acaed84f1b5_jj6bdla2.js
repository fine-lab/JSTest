let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var processInstId = request.processInstId;
    var indexid = request.businessKey.indexOf("_");
    var businessKey = request.businessKey.substring(indexid + 1);
    var object = { id: businessKey };
    //实体查询
    var res = ObjectStore.selectById("GT18952AT11.GT18952AT11.HBZZSQ", object);
    //获取省市信息
    var areaObj = { id: area };
    var areaRes = ObjectStore.selectById("GT18952AT11.GT18952AT11.China_Province_City", areaObj);
    var province = "";
    var city = "";
    var region = "";
    //区
    if (areaRes.level == 3) {
      region = areaRes.code;
      city = areaRes.parentcode;
      var object3 = { id: areaRes.parent };
      var cityRes = ObjectStore.selectById("GT18952AT11.GT18952AT11.China_Province_City", object3);
      province = cityRes.parentcode;
    } else if (areaRes.level == 2) {
      //市
      city = areaRes.code;
      province = areaRes.parentcode;
    } else if (areaRes.level == 1) {
      //省
      province = areaRes.code;
    }
    //授权信息
    var authItem = [];
    //授权伙伴等级
    var djs = res.shouquanhuobandengji;
    if (djs !== null && djs !== "") {
      var dj = djs.split(",");
      for (var i = 0; i < dj.size(); i++) {
        authItem.push({ authItemId: dj[i], authTypeId: "005" });
      }
    }
    //授权伙伴类型
    var lxs = res.shouquanhuobanleixing;
    if (lxs !== null && lxs !== "") {
      var lx = lxs.split(",");
      for (var lxi = 0; lxi < lx.size(); lxi++) {
        authItem.push({ authItemId: lx[lxi], authTypeId: "008" });
      }
    }
    //授权产品线
    var cpxs = res.shouquanchanpinxian;
    if (cpxs !== null && cpxs !== "") {
      var cpx = cpxs.split(",");
      for (var cpxi = 0; cpxi < cpx.size(); cpxi++) {
        authItem.push({ authItemId: cpx[cpxi], authTypeId: "PRL" });
      }
    }
    //授权领域
    var lys = res.shouquanchanpinxian;
    if (lys !== null && lys !== "") {
      var ly = lys.split(",");
      for (var lyi = 0; lyi < ly.size(); lyi++) {
        authItem.push({ authItemId: ly[lyi], authTypeId: "FID" });
      }
    }
    //授权行业
    var hys = res.shouquanchanpinxian;
    if (hys !== null && hys !== "") {
      var hy = hys.split(",");
      for (var hyi = 0; hyi < hy.size(); hyi++) {
        authItem.push({ authItemId: hy[hyi], authTypeId: "IDT" });
      }
    }
    //授权地域范围
    var dyfws = res.shouquanchanpinxian;
    if (dyfws !== null && dyfws !== "") {
      var dyfw = dyfws.split(",");
      for (var dyfwi = 0; dyfwi < dyfw.size(); dyfwi++) {
        authItem.push({ authItemId: dyfw[dyfwi], authTypeId: "ARE" });
      }
    }
    var shouquanrenid = res.shouquanrenid;
    let token_url = "https://www.example.com/" + shouquanrenid;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let tokenResponse = postman("get", token_url, null, null);
    var d;
    var tr = JSON.parse(tokenResponse);
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let header = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      var body = {
        address: res.xiangxidizhi,
        busiInfo: res.hexinyewu,
        cityId: city,
        provinceId: province,
        contactEmail: res.sqryx,
        contactPerson: res.sqrxm,
        contactPhone: res.sqrsj,
        pkCorp: res.shouquanzuzhicode,
        corpName: res.shouquanzuzhi,
        createUser: res.shouquanren,
        manager: res.farendaibiao,
        name: res.dwmc,
        remark: res.beizhu,
        partnerType: "03",
        partnerTypeName: "03",
        status: "string", //???????????????
        prmPartnerCertDTOList: [
          {
            certLevel: res.shouquanhuobandengji,
            certOrg: res.shouquanzuzhi,
            certUserId: res.shouquanrenid,
            certUserName: res.shouquanren,
            startDate: res.zizhikaishiriqi,
            endDate: res.zizhijiezhiriqi,
            productLineId: res.shouquanchanpinxian,
            dr: 0,
            authListDTO: {
              authItem: authItem
            }
          }
        ]
      };
      let query_url = "https://www.example.com/";
      let detail = postman("post", query_url, JSON.stringify(header), JSON.stringify(body));
      d = JSON.parse(detail);
    }
    return d;
  }
}
exports({ entryPoint: MyAPIHandler });