let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let APPCODE = "GT3734AT5"; //应用AppCode-固定值
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let logToDBUrl = DOMAIN + "/" + tid + "/selfApiClass/glSelfApi/logToDB"; //发布的写日志接口
    let staffUrl = DOMAIN + "/yonbip/hrcloud/HRCloud/getStaffDetail"; //查询人员
    let paramObj = JSON.parse(param);
    let businessId = paramObj.businessId;
    let sqlStr = "select *,(select * from QYcpxxList) as QYcpxxList from GT3734AT5.GT3734AT5.QYSQD where id = '" + businessId + "'";
    let queryRes = ObjectStore.queryByYonQL(sqlStr);
    let dataDetail = queryRes[0];
    let schemeBillNo = dataDetail.schemeBillNo; //方案单据编码
    let schemeBillId = dataDetail.schemeBillId; //方案单据ID
    let code = dataDetail.code;
    let shiyebu = dataDetail.shiyebu; //事业部ID
    let orgres = extrequire("GT3734AT5.ServiceFunc.getBaseDocDetail").execute(null, JSON.stringify({ orgId: shiyebu, docType: "org" }));
    let shiyebu_name = orgres.data.name.zh_CN;
    let billno = "c783f00c"; //AIMXI建机事业部
    let billuri = "GT3734AT5.GT3734AT5.AIMIXXPFASQ";
    if (includes(shiyebu_name, "环保")) {
      billno = "69939af7"; //
      billuri = "GT3734AT5.GT3734AT5.BTXPFASQ";
    } else if (includes(shiyebu_name, "游乐")) {
      billno = "b8a7fc44"; //
      billuri = "GT3734AT5.GT3734AT5.YLXPFASQ";
    }
    if (dataDetail.verifystate == 2) {
      //审核态
      ObjectStore.updateById(billuri, { id: schemeBillId, signBillId: businessId, signBillNo: code }, billno);
      //签约申请审批之后--发送通知消息给采购人员
      let sfzscd = dataDetail.sfzscd;
      if (sfzscd == undefined || sfzscd == null || !sfzscd) {
        //非正式成单
        return { rst: true };
      }
      let userList = [];
      var uspaceReceiver = [];
      let QYcpxxList = dataDetail.QYcpxxList;
      if (QYcpxxList == undefined || QYcpxxList == null || QYcpxxList.length == 0) {
        return { rst: true };
      }
      for (var k in QYcpxxList) {
        let qycpxxObj = QYcpxxList[k];
        let caigourenyuan = qycpxxObj.caigourenyuan;
        if (caigourenyuan != undefined && caigourenyuan != null && caigourenyuan != "") {
          let isExists = false;
          for (var j in userList) {
            if (userList[j] == caigourenyuan) {
              isExists = true;
              break;
            }
          }
          if (!isExists) {
            userList.push(caigourenyuan);
          }
        }
      }
      for (var j in userList) {
        let extendcgry = userList[j];
        let corpContactRes = openLinker("POST", staffUrl, APPCODE, JSON.stringify({ id: extendcgry }));
        let corpContactObjs = JSON.parse(corpContactRes);
        if (corpContactObjs.code != 200) {
          continue;
        }
        let userId = corpContactObjs.data.userId;
        uspaceReceiver.push(userId);
      }
      var title = "签约申请单[" + code + "]已审批通过";
      var content = "签约申请单[" + code + "]审批通过,通知采购员，详细信息请查看该单据!";
      let billUrl = "https://www.example.com/" + businessId + "?domainKey=developplatform";
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: tid,
        uspaceReceiver: uspaceReceiver,
        receiver: uspaceReceiver,
        channels: ["uspace"],
        subject: title,
        content: content,
        createToDoExt: { webUrl: billUrl, url: billUrl, mUrl: billUrl },
        messageType: "createToDo" //消息类型，支持notice(通知)和createToDo(待办)和prewarn(预警)
      };
      var result = sendMessage(messageInfo);
    } else {
      ObjectStore.updateById(billuri, { id: schemeBillId, signBillId: "", signBillNo: "" }, billno);
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });