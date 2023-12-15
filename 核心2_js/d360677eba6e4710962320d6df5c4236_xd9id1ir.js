let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let ckRespJSON = {};
    let gzddObj = {};
    let childSQLRes = [];
    let apiRespAdd01;
    let updateORespJson;
    let baseAPIUrl = "https://www.example.com/";
    let queryByYonSQL = "select bustype,expensebillDcs,status,id,vhandledeptid,pk_handlepsn from  znbzbx.commonexpensebill.CommonExpenseBillVO where id='" + param.data[0].id + "' ";
    let queryResBill = ObjectStore.queryByYonQL(queryByYonSQL);
    if (queryResBill != null && queryResBill != undefined && queryResBill.length > 0) {
      let fullBillsData = queryResBill[0];
      //获取交易类型
      let bustypeVal = fullBillsData.bustype;
      //单据 tech fund标记
      let techFundMakr = "";
      try {
        //通过调用api获取到报销单交易列表数据
        let jyParam = { codes: ["znbzbx_expensebill"] };
        let jyUrl = baseAPIUrl + "/yonbip/digitalModel/transtype/queryByBillTypeCodes";
        let jyResp = openLinker("POST", jyUrl, "RBSM", JSON.stringify(jyParam));
        if (jyResp != null && jyResp != undefined) {
          //转成JSON对象
          let jyResJson = JSON.parse(jyResp);
          //获取元素值
          if (jyResJson.data != null && jyResJson.data != undefined && jyResJson.data.length > 0) {
            let dataArray = jyResJson.data[0].data;
            for (let kk = 0; kk < dataArray.length; kk++) {
              let dataObj = dataArray[kk];
              //验证当前的交易类型是否属于单据 tech fund
              if (dataObj.name != null && dataObj.name != undefined) {
                let bustypeName = dataObj.name.zh_CN;
                if (bustypeName == "TECH FUND") {
                  techFundMakr = "1";
                  break;
                }
              }
            }
          }
        }
      } catch (e) {
        throw new Error("查询交易类型名称失败: " + e);
      }
      if (techFundMakr == "1") {
        //获取单据状态
        let orderStatus = fullBillsData.status;
        //获取主键
        let pId = fullBillsData.id;
        //获取部门ID
        let deptId = fullBillsData.vhandledeptid;
        //获取工作地点
        let workObj = fullBillsData.expensebillDcs;
        //报销人
        let bxUser = fullBillsData.pk_handlepsn;
        //获取具体工作地点主键
        let ck_name = "";
        try {
          //通过yonSQL 查询出工作地点 根据报销单主键  select id, expensebillDcs  from znbzbx.commonexpensebill.CommonExpenseBillVO   where id='"+pId+"'
          let queryByYonQL = "select id, expensebillDcs  from znbzbx.commonexpensebill.CommonExpenseBillVO   where id='" + pId + "' ";
          let queryRes = ObjectStore.queryByYonQL(queryByYonQL);
          if (queryRes != null && queryRes != undefined && queryRes.length > 0) {
            let addrObj = queryRes[0];
            //获取到当前单据上的工作地点主键
            let addrName = addrObj.expensebillDcs.attrext23_name;
            if (addrName == "北京" || addrName == "beijing" || addrName == "BeiJing" || addrName == "BEIJING" || addrName == "Beijing") {
              ck_name = "北京仓库";
            }
            if (addrName == "成都" || addrName == "chengdu" || addrName == "ChengDu" || addrName == "CHENGDU" || addrName == "Chengdu") {
              ck_name = "成都仓库";
            }
          }
        } catch (e) {
          throw new Error("获取具体工作地点失败: " + e);
        }
        let addOtherOrderArr = new Array();
        try {
          let childSQL = "select expensebillBDcs from znbzbx.commonexpensebill.CommonExpenseBillBVO where pk_expensebill='" + pId + "' ";
          childSQLRes = ObjectStore.queryByYonQL(childSQL);
          let sigleObj = {};
          if (childSQLRes != null && childSQLRes != undefined) {
            //处理子表集合 过滤二手物品状态为否的 若状态为 是 则不需要生成其他入库单
            for (var i = 0; i < childSQLRes.length; i++) {
              let childObj = childSQLRes[i].expensebillBDcs; //childSQLRes[i];//childSQLRes[i].expensebillBDcs;
              let spIs = childObj.attrext14; //childObj.define5;//childObj.W4;
              if (spIs == "否") {
                addOtherOrderArr.push(childObj);
              }
            }
          }
        } catch (e) {
          throw new Error("过滤二手物品状态为否的失败: " + e);
        }
        let charsArray = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z"
        ];
        let resVal = "";
        for (let i = 0; i < 20; i++) {
          let id = Math.ceil(Math.random() * 35);
          resVal += charsArray[id];
        }
        let kjVal = "3054460848083200";
        let kcOrg = "3054460848083200"; //默认值组织名称【维瑞联行车联网科技(北京)有限公司】
        let ckVal = "";
        try {
          let ckBody = { pageSize: 1, pageIndex: 1, simple: { name: ck_name } };
          let ckUrl = baseAPIUrl + "/yonbip/digitalModel/warehouse/list";
          let ckResp = openLinker("POST", ckUrl, "RBSM", JSON.stringify(ckBody));
          let chRespJSON = {};
          if (ckResp != null && ckResp != undefined) {
            chRespJSON = JSON.parse(ckResp);
            if (chRespJSON.data.recordList != null && chRespJSON.data.recordList.length > 0) {
              ckVal = chRespJSON.data.recordList[0].id; //仓库Id
            }
          }
        } catch (e) {
          throw new Error("查询仓库失败: " + e);
        }
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        let othInRecordsArr = new Array();
        try {
          if (addOtherOrderArr != null && addOtherOrderArr.length > 0) {
            for (var j = 0; j < addOtherOrderArr.length; j++) {
              let wlSingleObj = addOtherOrderArr[j];
              let wlId = wlSingleObj.attrext13; //物料Id
              //物料数量
              //通过物料Id 查询数据
              let wlVal = ""; // 物品id 或code
              let wlUnit = ""; //物料单位
              let free1 = ""; // 物流规格
              let wlBody = {
                data: "id,code,name,unit,modelDescription",
                condition: { simpleVOs: [{ conditions: [{ op: "like", field: "id", value1: wlId }] }] },
                page: { pageIndex: 1, pageSize: 10 }
              };
              let wlUrl = baseAPIUrl + "/yonbip/digitalModel/product/queryByPage";
              let wlResp = openLinker("POST", wlUrl, "RBSM", JSON.stringify(wlBody));
              let wlRespJSON = {};
              if (wlResp != null && wlResp != undefined) {
                wlRespJSON = JSON.parse(wlResp);
                if (wlRespJSON.data.recordList != null && wlRespJSON.data.recordList.length > 0) {
                  if (wlRespJSON.data.recordList[0].modelDescription != null && wlRespJSON.data.recordList[0].modelDescription != undefined) {
                    free1 = wlRespJSON.data.recordList[0].modelDescription; //SKU规格说明,支持多语
                  }
                  wlUnit = wlRespJSON.data.recordList[0].unit; //主计量单位ID
                  wlVal = wlRespJSON.data.recordList[0].id; //主键
                }
              }
              let addBody = {
                data: {
                  resubmitCheckKey: resVal + "" + j,
                  org: kcOrg,
                  department: deptId,
                  accountOrg: kcOrg,
                  vouchdate: currentdate,
                  operator: bxUser,
                  bustype: "A08001",
                  warehouse: ckVal,
                  headItem: { define1: "新购设备" },
                  _status: "Insert",
                  othInRecords: [{ product: wlVal, unit: wlUnit, subQty: 1, contactsQuantity: 1, invExchRate: 1, stockUnitId: wlUnit, free1: free1, unitExchangeType: 1, _status: "Insert" }],
                  othInRecordsSNs: []
                }
              };
              othInRecordsArr.push(addBody);
            }
          }
          //循环迭代其他入库单插入数据集
          let count = 0;
          let othAddRecordsArr = new Array();
          if (othInRecordsArr != null && othInRecordsArr != undefined && othInRecordsArr.length > 0) {
            let addUrl = baseAPIUrl + "/yonbip/scm/othinrecord/single/save";
            for (var k = 0; k < othInRecordsArr.length; k++) {
              let addJson = othInRecordsArr[k];
              let apiRespAddRes = openLinker("POST", addUrl, "RBSM", JSON.stringify(addJson));
            }
          }
        } catch (e) {
          throw new Error("构建其他入库单失败: " + e);
        }
      }
      return { version: "auidAfterEvent01" };
    }
  }
}
exports({ entryPoint: MyTrigger });