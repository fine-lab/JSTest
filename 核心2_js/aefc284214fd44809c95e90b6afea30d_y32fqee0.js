let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let selectDataIDs = request.selectData;
    let ids = new Array();
    for (let m = 0; m < selectDataIDs.length; m++) {
      ids.push(selectDataIDs[m].id);
    }
    let errormessage = "";
    let datas = getSelectdatas(ids);
    throw new Error(JSON.stringify(datas));
    if (datas.length > 0) {
      let clientCodes = new Array();
      let selectdatamap = new Map();
      let selectbodydatamap = new Map();
      for (let i = 0; i < datas.length; i++) {
        let mainid = datas[i].id;
        let ReviewStatus = datas[i].ReviewStatus;
        if (ReviewStatus == 1 || ReviewStatus == 2) continue;
        let code = datas[i].DeliveryorderNo;
        let clientCode = datas[i].ClientCode; //委托方
        clientCodes.push(clientCode);
        selectdatamap.set(code, datas[i]);
        let IssueDetailsLists = datas[i].IssueDetailsList;
        selectbodydatamap.set(code, IssueDetailsLists);
      }
      let successHeadmap = new Map();
      errormessage = checkHeaddata(selectdatamap, clientCodes, successHeadmap);
    } else {
      errormessage = "请选择至少一行数据！";
    }
    function checkBody(selectbodydatamap) {
      let bodynodata = new Array();
      for (let key of selectbodydatamap.keys()) {
        let IssueDetailsLists = selectbodydatamap.get(key);
        if (undefined == IssueDetailsLists || IssueDetailsLists.length == 0) {
          bodynodata.push(key);
        } else {
          for (let n = 0; n < IssueDetailsLists.length; n++) {}
        }
      }
    }
    function getSelectdatas(ids) {
      //查询内容
      var object = {
        ids: ids,
        compositions: [
          {
            name: "IssueDetailsList"
          }
        ]
      };
      //实体查询
      return ObjectStore.selectBatchIds("AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo", object);
    }
    function getclientCodeMap(clientCodes) {
      //查询内容
      var object = {
        ids: clientCodes,
        compositions: [
          {
            name: "entrustmentContractList"
          }
        ]
      };
      let clientCodeMap = new Map();
      //实体查询
      var res = ObjectStore.selectBatchIds("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", object);
      if (res.leng > 0) {
        for (let i = 0; i < res.length; i++) {
          let id = res[i].id;
          clientCodeMap.set(id, res);
        }
      }
      return clientCodeMap;
    }
    function checkHeaddata(selectdatamap, clientCodes, successHeadmap) {
      let errmessage = "";
      let clientCodeMap = getclientCodeMap(clientCodes);
      let nomath = new Array();
      let noenable = new Array();
      let datacheck = new Array();
      let wzyxqn = new Array(); //委托方合同未在有效期内!
      for (let key of selectdatamap.keys()) {
        let clientCode = selectdatamap.get(key).clientCode;
        if (!clientCodeMap.hasOwnProperty(clientCode)) {
          nomath.push(key);
        } else {
          let enable = clientCodeMap.get(clientCode).enable;
          if (enable != 1) {
            noenable.push(key);
          } else {
            let expiryDate = clientCodeMap.get(clientCode).expiryDate; //获取委托方的许可证
            let nowDate = getNowFormatDate();
            // 对比许可证时间与当前时间做对比
            let date1 = new Date(expiryDate);
            let date2 = new Date(nowDate);
            if (date1 < date2) {
              datacheck.push(key);
            } else {
              let entrustmentContractList = clientCodeMap.get(clientCode).entrustmentContractList;
              let clientArr = new Array();
              for (let k = 0; k < entrustmentContractList.length; k++) {
                var clientInfoDetails = entrustmentContractList[i];
                // 委托方子表委托合同有效期(停止委托时间)
                var endDate = clientInfoDetails.endDate;
                // 当前时间与停止委托时间对比
                var clientInfoDate = new Date(endDate);
                if (clientInfoDate > date2) {
                  clientArr.push(clientInfoDetails);
                }
              }
              // 判断clientArr长度
              if (clientArr.length == 0) {
                wzyxqn.push(key);
              } else {
                successHeadmap.push(key, selectdatamap.get(key));
              }
            }
          }
        }
      }
      if (nomath.length > 0) {
        errmessage = errmessage + "[" + nomath.toString() + "]委托方未存在基本档案中!\r\n";
      }
      if (noenable.length > 0) {
        errmessage = errmessage + "[" + noenable.toString() + "]委托方未启用!\r\n";
      }
      if (datacheck.length > 0) {
        errmessage = errmessage + "[" + datacheck.toString() + "] 委托方经营许可证未在有效期内!\r\n";
      }
      if (wzyxqn.length > 0) {
        errmessage = errmessage + "[" + wzyxqn.toString() + "]委托方合同未在有效期内!\r\n";
      }
      return errmessage;
    }
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
    return { errormessage };
  }
}
exports({ entryPoint: MyAPIHandler });