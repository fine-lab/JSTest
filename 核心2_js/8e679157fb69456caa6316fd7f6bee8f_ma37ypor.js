let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
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
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    let appContext = JSON.parse(AppContext());
    let usrName = appContext.currentUser.name;
    let businessIdArr = processStartMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let AUTOCREATEBILL = true;
    let LogToDB = true;
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    let sqlStr =
      "select d.Sales,d.tongBuZhuangTai,d.shiBaiYuanYin,b.guoJiaMingCheng,c.productName,* " + //,b.guoJiaMingCheng,b.guoJiaBianMa,b.haiGuanBianMa,b.guoJiaMingCheng_Eng,b.jianCheng2,b.jianCheng3,b.dianHuaQuHao,b.shiQu ";
      " from GT3734AT5.GT3734AT5.XunPanXSBill left join GT3734AT5.GT3734AT5.GuoJiaDangAnXinXi b on guojia = b.id " +
      " left join GT3734AT5.GT3734AT5.ProductCatagory c on xuQiuChanPin=c.id " +
      " left join GT3734AT5.GT3734AT5.GongSi d on custId=d.id " +
      " where id = '" +
      businessId +
      "'";
    let queryRes = ObjectStore.queryByYonQL(sqlStr);
    let dataDetail = queryRes[0];
    let doubleClue = false; //重复询盘
    if (dataDetail.verifystate == 2) {
      //审核态
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logModule: 9, description: "线索询盘-审批流程完成:" + businessId, reqt: JSON.stringify(processStateChangeMessage), resp: JSON.stringify(queryRes) })
      );
      {
        //判断是否重复询盘(已经生成档案)，①重复询盘--不再重新生成潜客档案，而是更新富通中客户信息；②新询盘则生成档案信息
        //重复询盘的条件：①邮箱 ②电话 ③邮箱后缀--判断企业邮箱 ④客户名称(联系人)
        let emailSuffixs = extrequire("GT3734AT5.APIFunc.getEmunTxtApi").execute(null, JSON.stringify({ key: 1, emunURI: "EmailSuffix" }));
      }
      //检测有关联商机就直接返回
      if (dataDetail.ShangJiBianMa != null && dataDetail.ShangJiBianMa != "") {
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
          null,
          JSON.stringify({ LogToDB: LogToDB, logModule: 9, description: "线索询盘[" + dataDetail.code + "]审批完成:单据异常--已关联商机[" + dataDetail.ShangJiBianMa + "]", reqt: "", resp: "" })
        );
        return;
      }
      let youXiangJiaoYan = dataDetail.youXiangJiaoYan;
      if (includes(youXiangJiaoYan, "有重复数据")) {
        //重复询盘时更新客户信息&生成新的商机--begin
        let ShangJiBianMa = dataDetail.custCode + "-1";
        let queryShangJiCodeRes = ObjectStore.queryByYonQL("select ShangJiBianMa from GT3734AT5.GT3734AT5.ShangJiXinXi where GongSi_id='" + dataDetail.custId + "' order by ShangJiBianMa desc");
        if (queryShangJiCodeRes.length > 0) {
          let dataObj = queryShangJiCodeRes[0];
          let shangJiBianMaLast = dataObj.ShangJiBianMa;
          let shangJiBianMaArry = shangJiBianMaLast.split("-");
          let idx = shangJiBianMaArry[1].startsWith("0") ? shangJiBianMaArry[1].substring(1) : shangJiBianMaArry[1];
          let newIdx = parseInt(idx) + 1;
          ShangJiBianMa = shangJiBianMaArry[0] + "-" + (newIdx > 9 ? newIdx : "0" + newIdx);
        }
        let biObj = {
          id: dataDetail.custId,
          ShangJiXinXiList: [
            {
              hasDefaultInit: true,
              _status: "Insert",
              code: dataDetail.custCode,
              GongSi_id: dataDetail.custId,
              ShangJiBianMa: ShangJiBianMa,
              ShangJiMingCheng: dataDetail.titleName,
              XiangMuShuoMing: dataDetail.xuQiuXiangQing,
              XunPanXXCode: dataDetail.code, //询盘线索编码
              XunPanXXId: businessId,
              ShangJiJieDuan: "1" //1建立联系2方案报价3客户认可4议价谈判5PI合同6订单交付7售后服务
            }
          ]
        };
        let biRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", biObj, "3199a3d6");
        let shangJiObjList = biRes.ShangJiXinXiList;
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
        let SalesId = dataDetail.d_Sales;
        let yeWuYuanId = dataDetail.yeWuYuan;
        if (SalesId != yeWuYuanId) {
          //业务员变更--是不是需要更新潜在客户的业务员--其他信息要不要更新？--TODO
          ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", { id: dataDetail.custId, Sales: yeWuYuanId }, "3199a3d6");
        }
        if (!dataDetail.d_tongBuZhuangTai) {
          extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
            null,
            JSON.stringify({ LogToDB: LogToDB, logModule: 9, description: "对应的潜在客户尚未同步到富通，需要先同步[" + dataDetail.custCode + "]", reqt: "", resp: "" })
          ); //调用领域内函数写日志
          return;
        }
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
        let saleres = extrequire("GT3734AT5.ServiceFunc.getBaseDocDetail").execute(null, JSON.stringify({ userId: yeWuYuanId, docType: "staff" }));
        let saler_name = saleres.data.name; //业务员名字
        let apiRes = extrequire("GT3734AT5.APIFunc.getEmunTxtApi").execute(null, JSON.stringify({ key: dataDetail.xunPanLeiXing, emunURI: "developplatform.developplatform.Emun_XunPanLeiXing" }));
        let xunPanLeiXing_name = apiRes == null ? "" : apiRes;
        let bodyParam = {
          accessToken: accessToken,
          id: dataDetail.d_shiBaiYuanYin, //id-必填--传递成功时shiBaiYuanYin存储富通客户ID
          code: dataDetail.custCode,
          name: dataDetail.keHuMingCheng,
          operatorName: "龚海涛", //操作员名称-业务员--saler_name
          isPublic: 1, //是否公海 0 公海,1 私海,-1回收箱
          description: dataDetail.xuQiuXiangQing, //备注
          region: dataDetail.b_guoJiaMingCheng, //国家地区--按照富通中的为标准维护到国家档案中
          source: xunPanLeiXing_name, //客户来源--询盘类型
          contactRequestList: [
            {
              email: [dataDetail.keHuYouXiang],
              mobile: "",
              telephone: dataDetail.keHuDianHua,
              name: dataDetail.keHuMingCheng,
              accessToken: accessToken
            }
          ], //客户联系人信息
          mainProduct: [dataDetail.c_productName] //主营产品
        };
        let apiResponse = postman("post", updCustUrl, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify(bodyParam));
        let rstObj = JSON.parse(apiResponse);
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
          null,
          JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "调用富通接口推送更新客户信息", reqt: JSON.stringify(bodyParam), resp: apiResponse })
        ); //调用领域内函数写日志
        let logTime = getNowDate();
        let commLogRes = ObjectStore.updateById(
          "GT3734AT5.GT3734AT5.GongSi",
          {
            id: dataDetail.custId,
            tongBuShiiJan: logTime,
            CommToFTLogList: [
              { hasDefaultInit: true, commTime: logTime, GongSi_id: dataDetail.custId, commDirection: "0", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }
            ]
          },
          "3199a3d6"
        );
        return;
      } //重复询盘时更新客户信息&生成新的商机--end
      let saler_id = dataDetail.yeWuYuan;
      if (saler_id == null || saler_id == "") {
        let updres = ObjectStore.updateById("GT3734AT5.GT3734AT5.XunPanXSBill", { id: businessId, tongBuZhuangTai: false, tongBuShiiJan: getNowDate(), shiBaiYuanYin: "业务员没有分派!" }, "66c03e66");
        return;
      }
      let baZhang = dataDetail.baZhang;
      //检测业务员分派记录
      sqlStr = "select zhiPaiYeWuYuan from GT3734AT5.GT3734AT5.yeWuYuanBianGEntry where XunPanXianSuo_id='" + businessId + "' order by bianGengRiQi DESC";
      let res0 = ObjectStore.queryByYonQL(sqlStr);
      if (res0.length == 0 || !includes(res0[0].zhiPaiYeWuYuan, saler_id)) {
        let newTime = getNowDate();
        let ywyObj = {
          id: businessId,
          xianSuoZhTai: "1",
          zhuangTaiBGengEntryList: [
            { hasDefaultInit: true, _status: "Insert", bianGengRiQi: newTime, bianGengZhT: "1", caozuoren: saler_id, XunPanXianSuo_id: businessId, beizhu: "业务员确认接收询盘线索" }
          ],
          yeWuYuanBianGEntryList: [
            { hasDefaultInit: true, _status: "Insert", bianGengRiQi: newTime, zhiPaiYeWuYuan: saler_id, caozuoren: baZhang, XunPanXianSuo_id: businessId, beizhu: "业务员确认接收询盘线索" }
          ]
        };
        let ywyres = ObjectStore.updateById("GT3734AT5.GT3734AT5.XunPanXSBill", ywyObj, "66c03e66");
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
          null,
          JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "业务员更新", reqt: JSON.stringify(ywyObj), resp: JSON.stringify(ywyres) })
        ); //调用领域内函数写日志
      }
      //检测并插入新派业务员
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
      let orgres = extrequire("GT3734AT5.ServiceFunc.getBaseDocDetail").execute(null, JSON.stringify({ orgId: org_id, docType: "org" }));
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "获取组织名称" + org_id, reqt: "", resp: JSON.stringify(orgres) })
      ); //调用领域内函数写日志
      let org_name = orgres.data.name.zh_CN;
      let customerType = "环保新询盘客户"; //游乐新线索：背景信息暂不确定 //建机新询盘客户
      if (includes(org_name, "建机")) {
        customerType = "建机新询盘客户";
      } else if (includes(org_name, "游乐")) {
        customerType = "游乐新线索：背景信息暂不确定";
      }
      let saleres = extrequire("GT3734AT5.ServiceFunc.getBaseDocDetail").execute(null, JSON.stringify({ userId: saler_id, docType: "staff" }));
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "获取员工名称" + saler_id, reqt: "", resp: JSON.stringify(saleres) })
      ); //调用领域内函数写日志
      let saler_name = saleres.data.name; //业务员名字
      let description = dataDetail.xuQiuXiangQing;
      let country_id = dataDetail.guojia;
      let country_name = dataDetail.b_guoJiaMingCheng;
      let xunPanLeiXing = dataDetail.xunPanLeiXing;
      let apiRes = extrequire("GT3734AT5.APIFunc.getEmunTxtApi").execute(null, JSON.stringify({ key: xunPanLeiXing, emunURI: "developplatform.developplatform.Emun_XunPanLeiXing" }));
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "查询枚举" + xunPanLeiXing, reqt: "", resp: apiRes }));
      let xunPanLeiXing_name = apiRes == null ? "" : apiRes;
      let cust_email = dataDetail.keHuYouXiang;
      let cust_tel = dataDetail.keHuDianHua;
      let cust_company = dataDetail.keHuGongSi;
      let productName = dataDetail.c_productName;
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
      let custRes = ObjectStore.insert("GT3734AT5.GT3734AT5.GongSi", custObj, "3199a3d6");
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
            ShangJiBianMa: ShangJiBianMa,
            ShangJiMingCheng: dataDetail.titleName,
            XiangMuShuoMing: dataDetail.xuQiuXiangQing,
            XunPanXXCode: clue_code,
            XunPanXXId: businessId,
            ShangJiJieDuan: "1" //1建立联系2方案报价3客户认可4议价谈判5PI合同6订单交付7售后服务
          }
        ]
      };
      let biRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", biObj, "3199a3d6");
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "新增商机", reqt: JSON.stringify(biObj), resp: JSON.stringify(biRes) })
      ); //调用领域内函数写日志
      ObjectStore.updateById(
        "GT3734AT5.GT3734AT5.XunPanXSBill",
        { id: businessId, xianSuoZhTai: "1", custCode: custRes.code, custId: custRes.id, ShangJiBianMa: ShangJiBianMa, ShangJiId: biRes.ShangJiXinXiList[0].id },
        "66c03e66"
      ); //反写询盘单--关联潜在客户&商机
      //生成新的潜在客户&商机 end
      let bodyParam = {
        accessToken: accessToken,
        code: cust_code,
        name: cust_name,
        shortName: "",
        type: customerType, //客户类型--暂时固定值
        operatorName: "龚海涛", //操作员名称-业务员
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
            mobile: "",
            telephone: cust_tel,
            name: cust_name,
            accessToken: accessToken
          }
        ], //客户联系人信息
        mainProduct: [productName], //主营产品
        classification: "", //客户分类--无
        businessType: "", //业务类型--无
        flowStep: "建立联系", //跟进阶段--默认：销售线索
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
      if (rstObj != null && (rstObj.code == 2 || !rstObj.success)) {
        //失败
        shiBaiYuanYin = rstObj.errMsg;
        tongBuZhuangTai = false;
      } else {
        //成功
        shiBaiYuanYin = rstObj.data;
      }
      let logTime = getNowDate();
      let commLogObj = {
        id: custRes.id,
        tongBuZhuangTai: tongBuZhuangTai,
        tongBuShiiJan: logTime,
        shiBaiYuanYin: shiBaiYuanYin,
        CommToFTLogList: [{ hasDefaultInit: true, commTime: logTime, GongSi_id: custRes.id, commDirection: "1", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }]
      };
      let commLogRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", commLogObj, "3199a3d6");
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "更新同步状态", reqt: JSON.stringify(commLogObj), resp: JSON.stringify(commLogRes) })
      ); //调用领域内函数写日志
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    let businessIdArr = activityEndMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
  }
}
exports({ entryPoint: WorkflowAPIHandler });