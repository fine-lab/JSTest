let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var htbm;
    var data = request.data;
    var apps = request.apps;
    let status = data._status;
    let shifulishidanju = data.shifulishidanju;
    if (shifulishidanju === "1") {
      htbm = data.hetongbianma;
    }
    if (shifulishidanju === "2" || shifulishidanju === null || shifulishidanju === undefined) {
      htbm = request.bianma;
    }
    var htcode = data.hetongbianma;
    var docid = data.id;
    var jjlx = data.jijialeixing_name; //计价类型
    var htmc = data.hetongmingcheng; //合同名称
    var htlb = data.hetongleibie_name; //合同类别
    var htlx = data.hetongleixing_name; //合同类型
    var dfdw = data.duifangdanwei_xiangduifangmingcheng; //对方单位
    var htje = data.hetongjine; //合同金额
    var jbr = data.jingbanren_name; //经办人
    var jbrbm = data.jingbanbumen_name; //经办人部门
    var qdrq = new Date(); //签订日期
    var htdddzpc = "www.baidu.com"; //合同单点地址PC
    var htdddzyd = "www.baidu.com"; //合同单点地址移动
    var ysfk = new Big(0);
    var jdk = new Big(0);
    var wk = new Big(0);
    var qt = new Big(0);
    var fksm;
    var fkjhres = ObjectStore.queryByYonQL("select fukuanjihua,jihuajine,fukuanshuoming from AT163DA72808680006.AT163DA72808680006.TDYY_HT_FKJH where TDYY_HT_LR_id = '" + docid + "' ");
    //付款计划：预付款/预收款1   进度款2    尾款3   其他4
    if (fkjhres !== null && fkjhres.length > 0) {
      for (var i = 0; i < fkjhres.length; i++) {
        if (fkjhres[i].fukuanjihua === "1") {
          var ysfk1 = GetBigDecimal(fkjhres[i].jihuajine);
          ysfk = ysfk.plus(ysfk1);
        }
        if (fkjhres[i].fukuanjihua === "2") {
          var jdk1 = GetBigDecimal(fkjhres[i].jihuajine);
          jdk = jdk.plus(jdk1);
        }
        if (fkjhres[i].fukuanjihua === "3") {
          var wk1 = GetBigDecimal(fkjhres[i].jihuajine);
          wk = wk.plus(wk1);
        }
        if (fkjhres[i].fukuanjihua === "4") {
          var qt1 = GetBigDecimal(fkjhres[i].jihuajine);
          qt = qt.plus(qt1);
          fksm = fkjhres[i].fukuanshuoming;
        }
      }
    }
    var body;
    if (apps === "0") {
      body = {
        body: {
          id: docid,
          apps: "0",
          pk_defdoclist: "1001A1100000000D6EL7",
          pk_group: "0001A110000000000CEI",
          pk_org: "0001A110000000000CEI",
          code: htbm,
          name: htmc,
          def1: htlb,
          def2: htlx,
          def3: dfdw,
          def4: htje,
          def5: "预付款/预收款",
          def6: ysfk,
          def7: "进度款",
          def8: jdk,
          def9: "尾款",
          def10: wk,
          def11: "Y",
          def12: jjlx,
          def13: "其他",
          def14: qt,
          def15: fksm,
          def16: jbr,
          def17: jbrbm,
          def18: qdrq,
          def19: htdddzpc,
          def20: htdddzyd,
          shortname: [],
          mnecode: [],
          pid: [],
          memo: []
        }
      };
    } else {
      body = {
        body: {
          id: docid,
          apps: apps
        }
      };
    }
    let header = {
      "Content-Type": "text/plain;charset=UTF-8"
    };
    let query = {
      account: "01",
      groupcode: "Tedaich",
      operator: "1001A1100000000EB6TL"
    };
    let allheader = {
      "Content-Type": "application/json;charset=UTF-8",
      apicode: "1df7b13e69684919ae96b0b9b1099411",
      appkey: "yourkeyHere"
    };
    let func = extrequire("AT163DA72808680006.backDesignerFunction.huoqutoken");
    let res = func.execute();
    var token = res.token;
    var allbody = {
      header: allheader,
      query: query,
      body: body,
      gatewayId: "yourIdHere",
      method: "post",
      url: "http://172.20.10.206:90/service/BIPQueryServlet",
      tenantId: "yourIdHere"
    };
    try {
      var url = "https://www.example.com/" + token + "";
      let apiResponse = postman("post", url, JSON.stringify(allheader), JSON.stringify(allbody));
      if (includes(apiResponse, "请求成功！")) {
        return {};
      } else {
        throw new Error(apiResponse);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });