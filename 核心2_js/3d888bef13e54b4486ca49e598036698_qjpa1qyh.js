let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取token
    var token = "";
    let func1 = extrequire("GT46349AT1.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    var data = request.data;
    var hmd_contenttype = "application/json;charset=UTF-8";
    var billcode = data.code;
    let verifystate = data.verifystate;
    if ("000960" !== billcode) {
      if (verifystate == "2") {
      } else {
        throw new Error("只有审批态单据可以生成销售合同");
      }
    }
    let header = {
      "Content-Type": hmd_contenttype
    };
    //查询合同是否存在  存在则不能再次生成
    var oldctid = data.xiaoshouhetongid;
    if (oldctid !== undefined) {
      var ctcheck = {
        pageIndex: "1",
        pageSize: "10",
        isSum: "false",
        simpleVOs: [
          {
            value1: oldctid,
            op: "like",
            field: "id"
          }
        ]
      };
      let ctcheckpon = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(ctcheck));
      var ctcheckponjson = JSON.parse(ctcheckpon);
      var ctcheckcode = ctcheckponjson.code;
      if (ctcheckcode !== "200") {
        throw new Error("查询合同错误" + ctcheckponjson.message + JSON.stringify(ctcheck));
      } else {
        var ctcount = ctcheckponjson.data.recordCount;
        if (ctcount !== 0) {
          throw new Error("错误,已生成合同");
        }
      }
    }
    if (1 === 1) {
      //判断boom主键是否存在  存在则删除后重新生成  否则直接生成
      var boompk = data.peijianzhujian;
      if (boompk !== undefined && boompk !== null) {
        let headerqxsh = {
          "Content-Type": hmd_contenttype
        };
        let bodyqxsh = {
          data: [
            {
              id: boompk
            }
          ]
        };
        //先取消审核
        let qxsh = postman("post", "https://www.example.com/" + token, JSON.stringify(headerqxsh), JSON.stringify(bodyqxsh));
        var qxshjson = JSON.parse(qxsh);
        var qxshcode = qxshjson.code;
        if (qxshcode !== "200") {
          throw new Error("错误" + qxshjson.message + JSON.stringify(bodyqxsh));
        } else {
          //再删除
          let sc = postman("post", "https://www.example.com/" + token, JSON.stringify(headerqxsh), JSON.stringify(bodyqxsh));
          var scjson = JSON.parse(sc);
          var sccode = scjson.code;
          if (sccode !== "200") {
            throw new Error("错误" + scjson.message + JSON.stringify(bodyqxsh));
          }
        }
      }
      let bvolist = data.salebaojaibList;
      let orgid = data.xiaoshouzuzhi;
      if (bvolist !== null && bvolist !== undefined) {
        var map = new Object();
        //表体根据bom名称分组
        for (let i = 0; i < bvolist.length; i++) {
          var maplist = new Array();
          var bvo = bvolist[i];
          if (map[bvo.bommingchen] !== undefined) {
            map[bvo.bommingchen].push(bvo);
          } else {
            maplist.push(bvo);
            map[bvo.bommingchen] = maplist;
          }
        }
        let headerboom = {
          "Content-Type": hmd_contenttype
        };
        for (let key in map) {
          // 根据bom名称生成主物料
          var material = key;
          var blist = map[key];
          var materialnew = blist[0].bomzhujian;
          //生成物料清单
          var bodyheadboom = {
            data: {
              orgId: orgid,
              bomType: 1,
              productId: materialnew,
              scrap: 0,
              useType: "0",
              versionCode: "1.00",
              effectiveDate: "2021-09-01 00:00:00",
              expiryDate: "2099-12-31 23:59:59",
              _status: "Insert"
            }
          };
          var jsonbs1 = [];
          for (let j = 0; j < blist.length; j++) {
            var bvo2 = blist[j];
            var jsonb1 = {
              productId: bvo2.peijian,
              scrap: 0,
              numeratorQuantity: bvo2.shuliang,
              denominatorQuantity: 1,
              supplyType: "0",
              effectiveDate: "2021-09-01 00:00:00",
              expiryDate: "2099-12-31 23:59:59",
              isVirtual: 0,
              usageType: 1,
              lossType: 0,
              truncUp: 0,
              wholeFlag: 0,
              alternateType: "0",
              _status: "Insert"
            };
            jsonbs1.push(jsonb1);
          }
          bodyheadboom.data.bomComponent = jsonbs1;
          var jsonjson1 = JSON.stringify(bodyheadboom);
          let apiResponseboom = postman("post", "https://www.example.com/" + token, JSON.stringify(headerboom), JSON.stringify(bodyheadboom));
          var apiResponsejsonboom = JSON.parse(apiResponseboom);
          var queryCodeboom = apiResponsejsonboom.code;
          if (queryCodeboom !== "200") {
            throw new Error("错误" + apiResponsejsonboom.message + JSON.stringify(bodyheadboom));
          } else {
            var boomdata = apiResponsejsonboom.data.infos[0].data;
            var idid = boomdata.id;
            if (idid !== undefined) {
              var bodyheadboom1 = {
                data: {
                  id: idid
                }
              };
              var jsonjsonboom1 = JSON.stringify(bodyheadboom1);
              let apiResponseboom1 = postman("post", "https://www.example.com/" + token, JSON.stringify(headerboom), JSON.stringify(bodyheadboom1));
              var apiResponse1jsonboom1 = JSON.parse(apiResponseboom1);
              var queryCodeboom1 = apiResponse1jsonboom1.code;
              if (queryCodeboom1 !== "200") {
                throw new Error("错误" + idid + apiResponse1jsonboom1.message + JSON.stringify(bodyheadboom1));
              } else {
                if (1 === 1) {
                  var billid1 = data.id;
                  var object1 = { id: billid1, peijianzhujian: idid + "" };
                  var retobj1 = ObjectStore.updateById("GT46349AT1.GT46349AT1.salebaojai", object1);
                }
              }
            }
          }
        }
      }
    }
    let bvolist = data.saledataList;
    let orgid = data.xiaoshouzuzhi;
    let StaffNew = data.StaffNew;
    var pointnumber = 2;
    var lirunlv1 = data.lirunlv;
    var lirunlv = MoneyFormatReturnBd(lirunlv1, pointnumber);
    let saleDepartmentId = data.startdept;
    let salesmanId = data.StaffNew;
    let zongchengbenjine = data.zongchengbenjine;
    zongchengbenjine = MoneyFormatReturnBd(zongchengbenjine, pointnumber);
    let code = data.code;
    var memo = data.memo;
    if (memo === undefined) {
      memo = "";
    }
    let creatorId = data.creator;
    let ctname = data.xiaoshouhetongmingchen;
    let ctcode = data.ziduan9;
    let kaipiaokehu = data.kehudizhi;
    var myDate = new Date();
    let vouchdate = dateFtt("yyyy-MM-dd hh:mm:ss", myDate);
    let kehu = data.kehu;
    let kehudianhua = 12345678977;
    let kehudizhi = "默认";
    let kehulianxiren = data.kehulianxiren;
    let jihuashengxiaoriqi = data.jihuashengxiaoriqi;
    let deliAddr = data.dizhi;
    let agreement = data.shoukuanxieyi;
    let disanfangbill = data.disanfangbill;
    let zuizhongyonghuleixing = data.zuizhongyonghuleixing;
    let zuizhongyonghu = data.zuizhongyonghu;
    let zuizhongyonghulianxiren = data.zuizhongyonghulianxiren;
    let caozuoxitong = data.caozuoxitong;
    let raid = data.raid;
    let disanfangdingdandanju = data.disanfangdingdandanju;
    let zuizhongyonghudianhua = data.zuizhongyonghudianhua;
    let A005 = data.A005;
    let salesentdata = data.salesentdata;
    let A002 = data.A002;
    let isdisanfang = data.isdisanfang;
    let ruanjian = data.ruanjian;
    let cunchuraid = data.cunchuraid;
    if (data.vouchdate !== undefined && data.vouchdate !== null) {
      vouchdate = data.vouchdate;
    }
    var tiaokuan = "";
    var zhibaotiaokuan = data.zhibaotiaokuan;
    var peijianzhibaotiaokuan = data.peijianzhibaotiaokuan;
    if (zhibaotiaokuan !== undefined) {
      if ("1" === zhibaotiaokuan) {
        tiaokuan = "三年5×12×NBD标准维保服务";
      } else if ("2" === zhibaotiaokuan) {
        tiaokuan = "四年5×12×NBD标准维保服务";
      } else if ("3" === zhibaotiaokuan) {
        tiaokuan = "五年5×12×NBD标准维保服务";
      } else if ("4" === zhibaotiaokuan) {
        tiaokuan = "三年7×24×4H 升级维保服务";
      } else if ("5" === zhibaotiaokuan) {
        tiaokuan = "四年7×24×4H 升级维保服务";
      } else if ("6" === zhibaotiaokuan) {
        tiaokuan = "五年7×24×4H 升级维保服务";
      }
    } else if (peijianzhibaotiaokuan !== undefined) {
      if ("1" === peijianzhibaotiaokuan) {
        tiaokuan = "一年保修";
      } else if ("2" === peijianzhibaotiaokuan) {
        tiaokuan = "三年保修";
      } else if ("3" === peijianzhibaotiaokuan) {
        tiaokuan = "五年保修";
      } else if ("4" === peijianzhibaotiaokuan) {
        tiaokuan = "按照厂家质保";
      }
    }
    var bodyhead = {
      data: {
        salesOrgId: orgid,
        transactionTypeId: "yourIdHere",
        contractCtrlType: 1,
        name: ctname,
        code: "yuzhi",
        contractStatus: 0,
        signStatus: 0,
        status: 0,
        vouchdate: vouchdate,
        agentId: kehu,
        invoiceAgentId: kaipiaokehu,
        bussinessTelephone: kehudianhua,
        bussinessAddress: kehudizhi,
        currency: "2390446438699520",
        natCurrency: "2390446438699520",
        exchangeRateType: "2390446197052672",
        exchRate: 1,
        planEffectiveDate: jihuashengxiaoriqi,
        isWfControlled: false,
        verifystate: 0,
        returncount: 0,
        totalPriceTax: 20,
        payMoneyOrigTaxfree: 19.05,
        totalTax: 0.95,
        totalOriReceipts: 0,
        creatorId: creatorId,
        saleDepartmentId: saleDepartmentId,
        salesmanId: salesmanId,
        "frees!define8": code, //报价单单号
        "frees!define2": lirunlv, //利润率
        "frees!define4": zongchengbenjine, //成本金额
        memo: memo,
        "frees!define9": tiaokuan,
        deliAddr: deliAddr,
        agreement: agreement,
        "frees!define1": salesentdata,
        "frees!define10": kehudianhua,
        "frees!define11": kehulianxiren,
        "frees!define12": ruanjian,
        "frees!define13": caozuoxitong,
        "frees!define14": A005,
        "frees!define15": raid,
        "frees!define16": A002,
        "frees!define17": zuizhongyonghu,
        "frees!define18": zuizhongyonghulianxiren,
        "frees!define19": zuizhongyonghudianhua,
        "frees!define20": zuizhongyonghuleixing,
        "frees!define21": disanfangdingdandanju,
        "frees!define22": disanfangbill,
        "frees!define23": isdisanfang,
        "frees!define24": cunchuraid,
        _status: "Insert"
      }
    };
    var jsonbs = [];
    for (let j = 0; j < bvolist.length; j++) {
      var bvo1 = bvolist[j];
      var jsonb = {
        _status: "Insert",
        productId: bvo1.wuliao,
        skuId: bvo1.bizFlowName,
        masterUnitId: bvo1.source_billtype,
        saleunitId: bvo1.source_billtype,
        cqtUnitId: bvo1.source_billtype,
        cqtUnitExchangeType: 0,
        invPriceExchRate: 1,
        saleUnitExchangeType: 0,
        invExchRate: 1,
        taxcCodeId: bvo1.taxccodeid,
        taxRate: bvo1.taxRate,
        stockOrgId: orgid,
        finOrgId: orgid,
        oriUnitPrice: bvo1.oriUnitPrice,
        oriTaxUnitPrice: bvo1.oriTaxUnitPrice,
        oriMoney: bvo1.oriMoney,
        oriSum: bvo1.oriSum,
        oriTax: bvo1.oriTax,
        natUnitPrice: bvo1.oriUnitPrice,
        natTaxUnitPrice: bvo1.oriTaxUnitPrice,
        natMoney: bvo1.oriMoney,
        natTax: bvo1.oriTax,
        natSum: bvo1.oriSum,
        qty: bvo1.qty,
        subQty: bvo1.qty,
        priceQty: bvo1.qty,
        "frees!define1": bvo1.kaipiaomingchen,
        idKey: null
      };
      jsonbs.push(jsonb);
    }
    bodyhead.data.childs = jsonbs;
    var jsonjson = JSON.stringify(bodyhead);
    let apiResponse1ct = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(bodyhead));
    var apiResponse1jsonct = JSON.parse(apiResponse1ct);
    var queryCode1ct = apiResponse1jsonct.code;
    if (queryCode1ct !== "200") {
      throw new Error("保存合同错误" + apiResponse1jsonct.message + JSON.stringify(bodyhead));
    } else {
      var billid = data.id;
      var xiaoshouhetongid = apiResponse1jsonct.data.id + "";
      var ctcode1 = apiResponse1jsonct.data.code;
      var object = { id: billid, xiaoshouhetongbianma: ctcode1, xiaoshouhetongid: xiaoshouhetongid };
      var retobj = ObjectStore.updateById("GT46349AT1.GT46349AT1.salebaojai", object);
    }
    function dateFtt(fmt, date) {
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": "00", //小时
        "m+": "00", //分
        "s+": "00", //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return fmt;
    }
    return { billid: billid, xiaoshouhetongid: xiaoshouhetongid, retobj: retobj };
  }
}
exports({ entryPoint: MyAPIHandler });