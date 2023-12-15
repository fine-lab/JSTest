let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var AppCode = "ST";
    //生产入库查询
    let storeprorecordDetailUrl = "https://www.example.com/" + "?id=" + param.data[0].id;
    let storeprorecordDetail = JSON.parse(openLinker("GET", storeprorecordDetailUrl, AppCode, null));
    let logArr = new Array();
    let data = storeprorecordDetail.data;
    logArr.push("delete start");
    //获取生产制造单的Id
    var materialoutSourceidId = data.srcBill;
    //回写 生产制造单下推状态
    if (true) {
      //回写生产制造单Url
      let putInNumberUrl = "https://www.example.com/";
      let backNumberBody = {
        Id: data.srcBill,
        status_code: "3"
      };
      let backNumberResponse = openLinker("POST", putInNumberUrl, AppCode, JSON.stringify(backNumberBody));
    }
    logArr.push(`materialoutSourceidId----${materialoutSourceidId}`);
    if (materialoutSourceidId == "") {
      let result = "单据Id为空,未查询到对应的材料出库单";
      return {
        result
      };
    }
    //材料出库列表查询Url
    var materialoutListUrl = "https://www.example.com/";
    //材料出库单保存Url
    var materialoutSaveUrl = "https://www.example.com/";
    //材料出库单删除Url
    var materialoutDeleteUrl = "https://www.example.com/";
    //材料出库列表查询Body
    var materialoutListBody = {
      pageIndex: 1,
      pageSize: 10,
      simpleVOs: [
        {
          field: "srcBill",
          op: "eq",
          value1: materialoutSourceidId
        },
        {
          field: "headItem.define1",
          op: "eq",
          value1: data.memo == "生产入库" ? "1" : "3"
        }
      ]
    };
    logArr.push(`materialoutListBody----${JSON.stringify(materialoutListBody)}`);
    //材料出库列表查询结果
    var materialoutList = openLinker("POST", materialoutListUrl, AppCode, JSON.stringify(materialoutListBody));
    var materialoutListJson = JSON.parse(materialoutList);
    logArr.push(`materialoutListJson----${materialoutListJson.code}`);
    logArr.push(`materialoutListJson.data.recordList----${materialoutListJson.data.recordList.length}`);
    let materialoutIds = new Array();
    let materialoutIdFilter = new Array();
    if (materialoutListJson.data.recordList.length > 0) {
      for (let i = 0; i < materialoutListJson.data.recordList.length; i++) {
        if (materialoutIdFilter.indexOf(materialoutListJson.data.recordList[i].id) > -1) {
          continue;
        } else {
          materialoutIdFilter.push(materialoutListJson.data.recordList[i].id);
          //集合id
          let materialoutId = {
            id: materialoutListJson.data.recordList[i].id
          };
          materialoutIds.push(materialoutId);
        }
      }
    }
    logArr.push(`materialoutIds----${JSON.stringify(materialoutIds)}`);
    logArr.push(`materialoutIdFilter----${JSON.stringify(materialoutIdFilter)}`);
    logArr.push(`materialoutListJson.data.recordCount----${materialoutListJson.data.recordCount}`);
    //材料出库列表更新-全部
    var materialoutListRecordList = new Array();
    let iSaveRows = 0;
    if (materialoutListJson.data.recordList.length > 0) {
      //获取需要更新的材料出库列表
      materialoutListRecordList = materialoutListJson.data.recordList;
      //开始遍历
      for (let j = 0; j < materialoutListRecordList.length; j++) {
        //材料出库更新
        var materialoutSaveBody = {
          org: materialoutListRecordList[j].org,
          vouchdate: materialoutListRecordList[j].vouchdate,
          factoryOrg: materialoutListRecordList[j].factoryOrg,
          warehouse: materialoutListRecordList[j].warehouse,
          bustype: "2322624486642944",
          id: materialoutListRecordList[j].id,
          pubts: materialoutListRecordList[j].pubts,
          department: materialoutListRecordList[j].department,
          _status: "Update",
          materOuts: ""
        };
        //材料出库子表
        var materOutsList = new Array();
        //材料出库子表详情
        var materOuts;
        for (var i = 0; materialoutListRecordList.length > i; i++) {
          materOuts = {
            product: materialoutListRecordList[i].product,
            unit: materialoutListRecordList[i].unit,
            stockUnitId: materialoutListRecordList[i].stockUnitId,
            invExchRate: materialoutListRecordList[i].invExchRate,
            subQty: materialoutListRecordList[i].qty,
            id: materialoutListRecordList[i].materOuts.id,
            pubts: materialoutListRecordList[i].pubts,
            _status: "Update"
          };
          materOutsList.push(materOuts);
        }
        materialoutSaveBody.materOuts = materOutsList;
        //材料出库保存结果
        var saveBody = {
          data: materialoutSaveBody
        };
        var materialoutSaveApiResponse = JSON.parse(openLinker("POST", materialoutSaveUrl, AppCode, JSON.stringify(saveBody)));
        if (j == 0) {
          logArr.push(`执行行数----${j}`);
          logArr.push(`materialoutListRecordList[j].warehouse----${materialoutListRecordList[j].warehouse}`);
          logArr.push(`saveBody----${JSON.stringify(saveBody)}`);
          logArr.push(`materialoutSaveUrl----${materialoutSaveUrl}`);
          logArr.push(`materialoutSaveApiResponse----${JSON.stringify(materialoutSaveApiResponse)}`);
        }
        iSaveRows++;
      }
    }
    var materialoutDeleteApiResponse;
    //如果数量一致
    if (iSaveRows == materialoutListRecordList.length) {
      //材料出库列表查询Body
      var materialoutParam = {
        data: materialoutIds
      };
      //材料出库删除结果
      materialoutDeleteApiResponse = JSON.parse(openLinker("POST", materialoutDeleteUrl, AppCode, JSON.stringify(materialoutParam)));
    }
    if (materialoutDeleteApiResponse.data.failCount > 0) {
      if (materialoutDeleteApiResponse.data.messages[0].message != null) {
        throw new Error(`材料出库删除操作报错: ${materialoutDeleteApiResponse.data.messages[0].message}`);
      }
    }
    return { materialoutDeleteApiResponse };
  }
}
exports({
  entryPoint: MyTrigger
});