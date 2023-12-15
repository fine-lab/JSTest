let AbstractAPIHandler = require("AbstractAPIHandler");
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
const getCustSimpleName = (keHuName, companyName) => {
  let simpleName = keHuName;
  if (simpleName.length > 10) {
    let sname = simpleName.substring(0, 10);
    if (sname.split("-").length == 3) {
      simpleName = simpleName.substring(10);
      if (includes(simpleName, "(")) {
        simpleName = simpleName.split("(")[0];
      }
    }
  }
  if (simpleName.length > 50) {
    simpleName = simpleName.substring(0, 49);
  }
  return simpleName;
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let businessId = request.businessId;
    let AUTOCREATEBILL = true;
    let LogToDB = true;
    let sqlStr =
      "select *,b.guoJiaMingCheng,c.productName,xunPanRenY.name,org_id.name,yeWuYuan.name,xqcpx.name " + //,b.guoJiaMingCheng,b.guoJiaBianMa,b.haiGuanBianMa,b.guoJiaMingCheng_Eng,b.jianCheng2,b.jianCheng3,b.dianHuaQuHao,b.shiQu ";
      " from GT3734AT5.GT3734AT5.XunPanXSBill left join GT3734AT5.GT3734AT5.GuoJiaDangAnXinXi b on guojia = b.id " +
      " left join GT3734AT5.GT3734AT5.ProductCatagory c on xuQiuChanPin=c.id " +
      " where id = '" +
      businessId +
      "'";
    let queryRes = ObjectStore.queryByYonQL(sqlStr);
    let dataDetail = queryRes[0];
    let doubleClue = false; //重复询盘
    let xunPanRenY = dataDetail.xunPanRenY;
    let xunPanRenY_name = dataDetail.xunPanRenY_name;
    if (dataDetail.verifystate == 2) {
      //审核态
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logModule: 9, description: "线索询盘-重新生成:" + businessId, reqt: sqlStr, resp: JSON.stringify(queryRes) })
      );
      let org_name = dataDetail.org_id_name;
      let customerType = "环保新询盘客户"; //游乐新线索：背景信息暂不确定 //建机新询盘客户
      let billNo = "3199a3d6"; //合一潜客单据
      let gsURI = "GT3734AT5.GT3734AT5.GongSi"; //合一潜客URI
      let gsSuffix = "";
      let zuZhiLeiBie = "";
      if (includes(org_name, "建机")) {
        customerType = "建机新询盘客户";
        gsSuffix = "_JJ";
        billNo = "b979b0e9";
        zuZhiLeiBie = 1;
      } else if (includes(org_name, "游乐")) {
        customerType = "游乐新线索：背景信息暂不确定";
        gsSuffix = "_YL";
        billNo = "04a3e644";
        zuZhiLeiBie = 3;
      } else if (includes(org_name, "环保")) {
        customerType = "环保新询盘客户";
        gsSuffix = "_HB";
        billNo = "7b52cdac";
        zuZhiLeiBie = 2;
      }
      gsURI = gsURI + gsSuffix;
      if (dataDetail.ShangJiBianMa != undefined && dataDetail.ShangJiBianMa != null && dataDetail.ShangJiBianMa != "") {
        let t_custId = dataDetail.custId;
        if (t_custId == undefined || t_custId == null || t_custId == "") {
          //为空则继续添加
        } else {
          //不为空需检测是否被删除--删除则重新生成/否则返回不处理
          let resCount = ObjectStore.queryByYonQL("select count(1) as relateNum from " + gsURI + " where id='" + t_custId + "'", "developplatform");
          if (resCount[0].relateNum > 0) {
            extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
              null,
              JSON.stringify({ LogToDB: LogToDB, logModule: 9, description: "线索询盘[" + dataDetail.code + "]审批完成:单据异常--已关联商机[" + dataDetail.ShangJiBianMa + "]", reqt: "", resp: "" })
            );
            return;
          }
        }
      }
      let youXiangJiaoYan = dataDetail.youXiangJiaoYan;
      if (includes(youXiangJiaoYan, "有重复数据")) {
        //重复询盘时更新客户信息&生成新的商机--begin
        let ShangJiBianMa = dataDetail.custCode + "-1";
        let queryShangJiCodeRes = ObjectStore.queryByYonQL(
          "select ShangJiBianMa from GT3734AT5.GT3734AT5.ShangJiXinXi" + gsSuffix + " where GongSi" + gsSuffix + "_id='" + dataDetail.custId + "' order by ShangJiBianMa desc"
        );
        if (queryShangJiCodeRes.length > 0) {
          let dataObj = queryShangJiCodeRes[0];
          let shangJiBianMaLast = dataObj.ShangJiBianMa;
          let shangJiBianMaArry = shangJiBianMaLast.split("-");
          let pos = shangJiBianMaArry.length - 1;
          let idx = shangJiBianMaArry[pos].startsWith("0") ? shangJiBianMaArry[pos].substring(1) : shangJiBianMaArry[pos];
          let newIdx = parseInt(idx) + 1;
          ShangJiBianMa = shangJiBianMaLast.substring(0, shangJiBianMaLast.length - 2) + (newIdx > 9 ? newIdx : "0" + newIdx);
        }
        let biObj = {};
        if (gsSuffix == "_JJ") {
          biObj = {
            id: dataDetail.custId,
            ShangJiXinXi_JJList: [
              {
                hasDefaultInit: true,
                _status: "Insert",
                code: dataDetail.custCode,
                GongSi_JJ_id: dataDetail.custId,
                ShangJiBianMa: ShangJiBianMa,
                ShangJiMingCheng: dataDetail.titleName,
                XiangMuShuoMing: dataDetail.xuQiuXiangQing,
                XunPanXXCode: dataDetail.code, //询盘线索编码
                XunPanXXId: businessId,
                xunPanRenY: xunPanRenY,
                xuqiuchanpinxin: dataDetail.wuliaofenlei,
                xqcpsj: dataDetail.xqcpx,
                ShangJiJieDuan: "0" //0销售线索、1建立联系2方案报价3客户认可4议价谈判5PI合同6订单交付7售后服务
              }
            ]
          };
        } else if (gsSuffix == "_HB") {
          biObj = {
            id: dataDetail.custId,
            ShangJiXinXi_HBList: [
              {
                hasDefaultInit: true,
                _status: "Insert",
                code: dataDetail.custCode,
                GongSi_HB_id: dataDetail.custId,
                ShangJiBianMa: ShangJiBianMa,
                ShangJiMingCheng: dataDetail.titleName,
                XiangMuShuoMing: dataDetail.xuQiuXiangQing,
                XunPanXXCode: dataDetail.code, //询盘线索编码
                XunPanXXId: businessId,
                xunPanRenY: xunPanRenY,
                xuqiuchanpinxin: dataDetail.wuliaofenlei,
                xqcpsj: dataDetail.xqcpx,
                ShangJiJieDuan: "0" //0销售线索、1建立联系2方案报价3客户认可4议价谈判5PI合同6订单交付7售后服务
              }
            ]
          };
        } else if (gsSuffix == "_YL") {
          biObj = {
            id: dataDetail.custId,
            ShangJiXinXi_YLList: [
              {
                hasDefaultInit: true,
                _status: "Insert",
                code: dataDetail.custCode,
                GongSi_YL_id: dataDetail.custId,
                ShangJiBianMa: ShangJiBianMa,
                ShangJiMingCheng: dataDetail.titleName,
                XiangMuShuoMing: dataDetail.xuQiuXiangQing,
                XunPanXXCode: dataDetail.code, //询盘线索编码
                XunPanXXId: businessId,
                xunPanRenY: xunPanRenY,
                xuqiuchanpinxin: dataDetail.wuliaofenlei,
                xqcpsj: dataDetail.xqcpx,
                ShangJiJieDuan: "0" //0销售线索、1建立联系2方案报价3客户认可4议价谈判5PI合同6订单交付7售后服务
              }
            ]
          };
        }
        let biRes = ObjectStore.updateById(gsURI, biObj, billNo);
        let shangJiObjList = [];
        if (gsSuffix == "_JJ") {
          shangJiObjList = biRes.ShangJiXinXi_JJList;
        } else if (gsSuffix == "_HB") {
          shangJiObjList = biRes.ShangJiXinXi_HBList;
        } else if (gsSuffix == "_YL") {
          shangJiObjList = biRes.ShangJiXinXi_YLList;
        } else {
          shangJiObjList = biRes.ShangJiXinXiList;
        }
        let shangJiId = "";
        for (var i = 0; i < shangJiObjList.length; i++) {
          let shangJiObj = shangJiObjList[0];
          if (shangJiObj.ShangJiBianMa == ShangJiBianMa) {
            shangJiId = shangJiObj.id;
          }
        }
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
          null,
          JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "新增商机", reqt: JSON.stringify(biObj), resp: JSON.stringify(biRes) })
        ); //调用领域内函数写日志
        ObjectStore.updateById("GT3734AT5.GT3734AT5.XunPanXSBill", { id: businessId, xianSuoZhTai: "1", ShangJiBianMa: ShangJiBianMa, ShangJiId: shangJiId }, "66c03e66"); //反写询盘单--关联潜在客户&商机
        let yeWuYuanId = dataDetail.yeWuYuan;
        let saler_name = dataDetail.yeWuYuan_name;
        let newCustObj = ObjectStore.updateById(gsURI, { id: dataDetail.custId, Sales: yeWuYuanId }, billNo);
        if (!newCustObj.tongBuZhuangTai) {
          extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
            null,
            JSON.stringify({ LogToDB: LogToDB, logModule: 9, description: "对应的潜在客户尚未同步到富通，需要先同步[" + dataDetail.custCode + "]", reqt: "", resp: "" })
          ); //调用领域内函数写日志
          return;
        }
        let ftid = newCustObj.shiBaiYuanYin;
        let funcRes = extrequire("GT3734AT5.ServiceFunc.getAccessToken").execute(null);
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "调用接口获取AccessToken", reqt: "", resp: JSON.stringify(funcRes) })); //调用领域内函数写日志
        let accessToken = null;
        if (funcRes.rst) {
          accessToken = funcRes.accessToken;
        }
        if (accessToken == null || accessToken == "") {
          extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "AccessToken为空-无法对接富通", reqt: "", resp: "" })); //调用领域内函数写日志
          return;
        }
        let updCustUrl = "https://www.example.com/";
        let apiRes = extrequire("GT3734AT5.APIFunc.getEmunTxtApi").execute(null, JSON.stringify({ key: dataDetail.xunPanLeiXing, emunURI: "developplatform.developplatform.Emun_XunPanLeiXing" }));
        let xunPanLeiXing_name = apiRes == null ? "" : apiRes;
        let keHuName = dataDetail.keHuMingCheng;
        let companyName = dataDetail.keHuGongSi;
        let simpleName = getCustSimpleName(keHuName, companyName);
        let custemail = dataDetail.keHuYouXiang;
        if (custemail == undefined || custemail == null) {
          custemail = "";
        }
        if (keHuName.length > 100) {
          keHuName = keHuName.substring(0, 99);
        }
        let bodyParam = {
          accessToken: accessToken,
          id: ftid, //id-必填--传递成功时shiBaiYuanYin存储富通客户ID
          code: dataDetail.custCode,
          name: keHuName,
          shortName: simpleName,
          operatorName: saler_name, //"龚海涛",//操作员名称-业务员--saler_name
          isPublic: 1, //是否公海 0 公海,1 私海,-1回收箱
          description: dataDetail.xunPanNeiRong, //xuQiuXiangQing,//备注
          region: dataDetail.b_guoJiaMingCheng, //国家地区--按照富通中的为标准维护到国家档案中
          source: xunPanLeiXing_name //客户来源--询盘类型
        };
        let apiResponse = postman("post", updCustUrl, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify(bodyParam));
        let rstObj = JSON.parse(apiResponse);
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
          null,
          JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "调用富通接口推送更新客户信息", reqt: JSON.stringify(bodyParam), resp: apiResponse })
        ); //调用领域内函数写日志
        let logTime = getNowDate();
        let commObj = {
          id: dataDetail.custId,
          tongBuShiiJan: logTime,
          CommToFTLogList: [
            {
              hasDefaultInit: true,
              commTime: logTime,
              GongSi_id: dataDetail.custId,
              GongSi_JJ_id: dataDetail.custId,
              GongSi_HB_id: dataDetail.custId,
              GongSi_YL_id: dataDetail.custId,
              commDirection: "0",
              reqContent: JSON.stringify(bodyParam),
              respContent: apiResponse,
              _status: "Insert"
            }
          ]
        };
        if (gsSuffix == "_JJ") {
          commObj.CommToFTLog_JJList = commObj.CommToFTLogList;
        } else if (gsSuffix == "_HB") {
          commObj.CommToFTLog_HBList = commObj.CommToFTLogList;
        } else if (gsSuffix == "_YL") {
          commObj.CommToFTLog_YLList = commObj.CommToFTLogList;
        }
        let commLogRes = ObjectStore.updateById(gsURI, commObj, billNo);
        return { rst: true, msg: "重复询盘--重新生成潜客档案" };
      } //重复询盘时更新客户信息&生成新的商机--end
      let saler_id = dataDetail.yeWuYuan;
      if (saler_id == null || saler_id == "") {
        let updres = ObjectStore.updateById("GT3734AT5.GT3734AT5.XunPanXSBill", { id: businessId, tongBuZhuangTai: false, tongBuShiiJan: getNowDate(), shiBaiYuanYin: "业务员没有分派!" }, "66c03e66");
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 9, description: "数据异常", reqt: "业务员没有分派,无法生成潜客", resp: "" })); //调用领域内函数写日志
        return { rst: false, msg: "重新生成潜客档案-未检测到业务员，无法执行后续操作!" };
      }
      let baZhang = dataDetail.baZhang;
      let synFunc = extrequire("GT3734AT5.ServiceFunc.getAccessToken");
      let funcRes = synFunc.execute(null);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "调用接口获取AccessToken", reqt: "", resp: JSON.stringify(funcRes) })); //调用领域内函数写日志
      let accessToken = null;
      if (funcRes.rst) {
        accessToken = funcRes.accessToken;
      }
      if (accessToken == null || accessToken == "") {
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "AccessToken为空-无法对接富通", reqt: "", resp: "" })); //调用领域内函数写日志
        return;
      }
      let urlStr = "https://www.example.com/";
      let clue_code = dataDetail.code; //询盘线索编码
      let cust_code = "";
      let cust_name = dataDetail.keHuMingCheng;
      let org_id = dataDetail.org_id;
      let titleName = dataDetail.titleName;
      let saler_name = dataDetail.yeWuYuan_name;
      let description = dataDetail.xunPanNeiRong; //xuQiuXiangQing;
      let country_id = dataDetail.guojia;
      let country_name = dataDetail.b_guoJiaMingCheng;
      let xunPanLeiXing = dataDetail.xunPanLeiXing;
      let apiRes = extrequire("GT3734AT5.APIFunc.getEmunTxtApi").execute(null, JSON.stringify({ key: xunPanLeiXing, emunURI: "developplatform.developplatform.Emun_XunPanLeiXing" }));
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "查询枚举" + xunPanLeiXing, reqt: "", resp: apiRes }));
      let xunPanLeiXing_name = apiRes == null ? "" : apiRes;
      let cust_email = dataDetail.keHuYouXiang;
      if (cust_email == undefined || cust_email == null) {
        cust_email = "";
      }
      let cust_tel = dataDetail.keHuDianHua;
      let cust_company = dataDetail.keHuGongSi;
      let productName = dataDetail.xqcpx_name; //dataDetail.c_productName;2023-11-23富森要求改成第三级物料档案
      let suoShuDaZhou = dataDetail.suoShuDaZhou;
      //生成新的潜在客户&商机 begin
      let custObj = {
        org_id: org_id,
        MingChen: cust_name, //名称
        WangZhi: "", //网址
        GuoJia: country_id, //国家
        zhuyingyewu: "", //主营业务
        GongSiLeiXing: "", //公司类型
        RenShu: "", //人数
        ZhuCeZiJin: "", //注册资金
        YingYeE: "", //营业额
        HaiGuanShuJu: "", //海关数据
        YingYeZhiZhao: "", //营业执照
        FaRenXinXi: "", //法人信息
        ZhuYaoGongYingShang: "", //主要供应商
        ZhuYaoKeHu: "", //主要客户
        YouWuJinChuKouZiZhi: "", //有无进出口资质
        YouWuMingXingXiangMu: "", //有无明星项目
        ZhengFuGuanXi: "", //政府关系
        HangYeDiWei: "", //行业地位
        Email: cust_email, //邮箱
        Sales: saler_id, //业务员
        xunpanlaiyuan: xunPanLeiXing, //询盘来源
        khxxlysj: dataDetail.xunPanJieShouSJ, //询盘时间
        XunPanXXCode: clue_code,
        XunPanXXId: businessId,
        suoShuDaZhou: suoShuDaZhou,
        custType: customerType,
        flowStep: "销售线索", //生成潜客默认“建立联系”
        LianXiRenXinXiList: [
          {
            XingMing: cust_name,
            DianHua: cust_tel,
            YouXiang: cust_email,
            ZongJiaoXinYang: "", //宗教信仰
            JiaTingQingKuang: "", //家庭情况
            HunYinZhuangKuang: "", //婚姻状况
            AiHao: "", //爱好
            XingGe: "", //性格
            GouTongFengGe: "", //沟通风格
            QiTa: "", //其它
            KeyContacts: true
          }
        ]
      };
      if (gsSuffix == "_JJ") {
        custObj.LianXiRenXinXi_JJList = custObj.LianXiRenXinXiList;
      } else if (gsSuffix == "_HB") {
        custObj.LianXiRenXinXi_HBList = custObj.LianXiRenXinXiList;
      } else if (gsSuffix == "_YL") {
        custObj.LianXiRenXinXi_YLList = custObj.LianXiRenXinXiList;
      }
      let custRes = ObjectStore.insert(gsURI, custObj, billNo);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "新增商机客户", reqt: JSON.stringify(custObj), resp: JSON.stringify(custRes) })
      ); //调用领域内函数写日志
      cust_code = custRes.code; //潜在客户编码
      let ShangJiBianMa = custRes.code + "-01";
      let biObj = {
        id: custRes.id,
        ShangJiXinXiList: [
          {
            hasDefaultInit: true,
            _status: "Insert",
            code: custRes.code,
            GongSi_id: custRes.id,
            GongSi_JJ_id: custRes.id,
            GongSi_HB_id: custRes.id,
            GongSi_YL_id: custRes.id,
            ShangJiBianMa: ShangJiBianMa,
            ShangJiMingCheng: dataDetail.titleName,
            XiangMuShuoMing: dataDetail.xuQiuXiangQing,
            XunPanXXCode: clue_code,
            XunPanXXId: businessId,
            xunPanRenY: xunPanRenY,
            xuqiuchanpinxin: dataDetail.wuliaofenlei,
            xqcpsj: dataDetail.xqcpx,
            ShangJiJieDuan: "0" //0销售线索1建立联系2方案报价3客户认可4议价谈判5PI合同6订单交付7售后服务
          }
        ]
      };
      if (gsSuffix == "_JJ") {
        biObj.ShangJiXinXi_JJList = biObj.ShangJiXinXiList;
      } else if (gsSuffix == "_HB") {
        biObj.ShangJiXinXi_HBList = biObj.ShangJiXinXiList;
      } else if (gsSuffix == "_YL") {
        biObj.ShangJiXinXi_YLList = biObj.ShangJiXinXiList;
      }
      let biRes = ObjectStore.updateById(gsURI, biObj, billNo);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "新增商机", reqt: JSON.stringify(biObj), resp: JSON.stringify(biRes) })
      ); //调用领域内函数写日志
      let sjid = "";
      if (gsSuffix == "_JJ") {
        sjid = biRes.ShangJiXinXi_JJList[0].id;
      } else if (gsSuffix == "_HB") {
        sjid = biRes.ShangJiXinXi_HBList[0].id;
      } else if (gsSuffix == "_YL") {
        sjid = biRes.ShangJiXinXi_YLList[0].id;
      } else {
        sjid = biRes.ShangJiXinXiList[0].id;
      }
      ObjectStore.updateById(
        "GT3734AT5.GT3734AT5.XunPanXSBill",
        { id: businessId, xianSuoZhTai: "1", custCode: custRes.code, custId: custRes.id, ShangJiBianMa: ShangJiBianMa, ShangJiId: sjid },
        "66c03e66"
      ); //反写询盘单--关联潜在客户&商机
      //生成新的潜在客户&商机 end
      let simpleName = getCustSimpleName(cust_name, cust_company);
      if (cust_name.length > 100) {
        cust_name = cust_name.substring(0, 99);
      }
      let bodyParam = {
        accessToken: accessToken,
        code: cust_code,
        name: cust_name,
        shortName: simpleName,
        type: customerType, //客户类型--暂时固定值
        operatorName: saler_name, //操作员名称-业务员
        isPublic: 1, //是否公海 0 公海,1 私海,-1回收箱
        description: description, //备注
        region: country_name, //国家地区--按照富通中的为标准维护到国家档案中
        province: "",
        city: "", //市
        source: xunPanLeiXing_name, //客户来源--询盘类型
        webSite: "", //公司站点--客户的网站-需在富通中维护完善
        id: "", //id-可自动生成
        contactRequestList: [
          {
            email: [cust_email],
            mobile: cust_tel,
            telephone: cust_tel,
            name: simpleName,
            accessToken: accessToken
          }
        ], //客户联系人信息
        customerCustomizeList: [
          { customizeName: "合作状态", customizeValue: "未合作" },
          { customizeName: "询盘来源", customizeValue: xunPanRenY_name }
        ],
        mainProduct: [productName], //主营产品
        classification: "", //客户分类--无
        businessType: "", //业务类型--无
        flowStep: "销售线索", //跟进阶段--默认：销售线索/建立联系
        fontColor: "" //字体颜色
      };
      let apiResponse = postman("post", urlStr, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify(bodyParam));
      let rstObj = JSON.parse(apiResponse);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "调用富通接口推送客户信息", reqt: JSON.stringify(bodyParam), resp: apiResponse })
      ); //调用领域内函数写日志
      let shiBaiYuanYin = "success";
      let tongBuZhuangTai = true;
      let FTCode = cust_code;
      if (rstObj != null && (rstObj.code == 2 || !rstObj.success)) {
        //失败
        shiBaiYuanYin = rstObj.errMsg;
        tongBuZhuangTai = false;
        FTCode = "";
      } else {
        //成功
        shiBaiYuanYin = rstObj.data;
      }
      let logTime = getNowDate();
      let commLogObj = {};
      if (gsSuffix == "_JJ") {
        commLogObj = {
          id: custRes.id,
          tongBuZhuangTai: tongBuZhuangTai,
          tongBuShiiJan: logTime,
          shiBaiYuanYin: shiBaiYuanYin,
          FTCode: FTCode,
          CommToFTLog_JJList: [
            { hasDefaultInit: true, commTime: logTime, GongSi_JJ_id: custRes.id, commDirection: "1", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }
          ]
        };
      } else if (gsSuffix == "_HB") {
        commLogObj = {
          id: custRes.id,
          tongBuZhuangTai: tongBuZhuangTai,
          tongBuShiiJan: logTime,
          shiBaiYuanYin: shiBaiYuanYin,
          FTCode: FTCode,
          CommToFTLog_HBList: [
            { hasDefaultInit: true, commTime: logTime, GongSi_HB_id: custRes.id, commDirection: "1", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }
          ]
        };
      } else if (gsSuffix == "_YL") {
        commLogObj = {
          id: custRes.id,
          tongBuZhuangTai: tongBuZhuangTai,
          tongBuShiiJan: logTime,
          shiBaiYuanYin: shiBaiYuanYin,
          FTCode: FTCode,
          CommToFTLog_YLList: [
            { hasDefaultInit: true, commTime: logTime, GongSi_YL_id: custRes.id, commDirection: "1", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }
          ]
        };
      } else {
        commLogObj = {
          id: custRes.id,
          tongBuZhuangTai: tongBuZhuangTai,
          tongBuShiiJan: logTime,
          shiBaiYuanYin: shiBaiYuanYin,
          FTCode: FTCode,
          CommToFTLogList: [{ hasDefaultInit: true, commTime: logTime, GongSi_id: custRes.id, commDirection: "1", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }]
        };
      }
      let commLogRes = ObjectStore.updateById(gsURI, commLogObj, billNo);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "更新同步状态", reqt: JSON.stringify(commLogObj), resp: JSON.stringify(commLogRes) })
      ); //调用领域内函数写日志
      return { rst: true, msg: "执行成功!" };
    }
    return { rst: false, msg: "线索询盘尚未审核，无法执行该操作" };
  }
}
exports({ entryPoint: MyAPIHandler });