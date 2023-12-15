let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let userId = request.userId;
    let deptId = request.deptId;
    var res = {};
    var childRes = {};
    let tpObj = new Array();
    let lpObj = new Array();
    let pdObj = new Array();
    let tpObjResSQL = new Array();
    let lpObjResSQL = new Array();
    let pdObjResSQL = new Array();
    let wltCode = "";
    //物料id与物料分类map
    let wlMap = getMap();
    let wlIdArrs = new Array();
    let wlIds = "";
    let jkSqlRes = {};
    let bxSqlRes = {};
    let tfAmount = "";
    let queryRes11 = {};
    let bxSql22Res = {};
    //借款金额
    let nloanmnyVal = "";
    //当前报销人所以得报销金额
    let totalAmount = "";
    let othOrderSQLRes = {};
    if (userId && deptId) {
      try {
        //查询出期初个人借款单  znbzbx.loanbill.LoanBillVO  期初标记：beginningFlag； 借款金额 nloanmny  费用承担部门：vfinacedeptid  查询条件：审核完成
        let jkSQL = "select sum(nloanmny)  from znbzbx.loanbill.LoanBillVO where  status=1 and pk_handlepsn='" + userId + "' ";
        jkSqlRes = ObjectStore.queryByYonQL(jkSQL, "znbzbx");
        if (jkSqlRes != null && jkSqlRes != undefined && jkSqlRes.length > 0) {
          nloanmnyVal = jkSqlRes[0].nloanmny;
        }
        //查询出个人报销单中所有的合计数值   查询条件：审核完成   1617153120929841157   1601407710697882022
        let bxSql =
          "select sum(nexpensemny) from znbzbx.commonexpensebill.CommonExpenseBillVO where status=1 and  pk_handlepsn='" + userId + "'  and bustype='1617153120929841157' order by pubts desc ";
        bxSqlRes = ObjectStore.queryByYonQL(bxSql, "znbzbx");
        if (bxSqlRes != null && bxSqlRes != undefined && bxSqlRes.length > 0) {
          totalAmount = bxSqlRes[0].nexpensemny;
        }
        //计算出期末剩余金额
        tfAmount = Number(nloanmnyVal) - Number(totalAmount);
        //查询物料档案数据   手机 Ipad  电脑  三大分类的数据项
        let querySQL =
          "select id,code,name,manageClass,transType,wlflTab.id,wlflTab.name,wlflTab.code  from  pc.product.Product  left join pc.cls.ManagementClass wlflTab on manageClass=wlflTab.id where wlflTab.code in ('LP','PD','TP') ";
        res = ObjectStore.queryByYonQL(querySQL, "productcenter");
        //拿到集合中三大类物料主键
        if (res != null && res != undefined) {
          let wlIdsVal = "";
          for (let i = 0; i < res.length; i++) {
            let arrObj = res[i];
            //获取主键ID
            wlIdArrs.push(arrObj.id);
            wlMap.put(arrObj.id, arrObj);
            wlIdsVal += "'" + arrObj.id + "',";
          }
          wlIds = substring(wlIdsVal, 0, wlIdsVal.length - 1);
        }
        //根据报销人与费用承担部门查询其他出库单     1619904167750402082    移除部门查询条件：and department='"+deptId+"'   and department='"+deptId+"'
        let othOrderSQL =
          " select auditTime,vouchdate,id,othOutRecordDefineCharacter,sonTab.product,sonTab.productn  from st.othoutrecord.OthOutRecord  left join st.othoutrecord.OthOutRecords sonTab  on   sonTab.mainid =id   where operator='" +
          userId +
          "'  and  sonTab.product in (" +
          wlIds +
          ") order by vouchdate desc  ";
        othOrderSQLRes = ObjectStore.queryByYonQL(othOrderSQL, "ustock");
        childRes = othOrderSQLRes;
        //解析查询出的其他出库结果
        if (othOrderSQLRes != null && othOrderSQLRes != undefined && othOrderSQLRes.length > 0) {
          for (let i = 0; i < othOrderSQLRes.length; i++) {
            if (othOrderSQLRes[i] != null && othOrderSQLRes[i] != undefined) {
              let othOrderSQLResObj = othOrderSQLRes[i];
              //领用时间对象
              //物料主键
              let productId = othOrderSQLResObj.sonTab_product;
              //验证其物料类别
              let wlTypObj = wlMap.get(productId);
              if (wlTypObj != null && wlTypObj != undefined) {
                var wlCode = wlTypObj.wlflTab_code;
                //是否是手机 TP
                if (wlCode == "TP") {
                  tpObj.push(wlTypObj);
                  tpObjResSQL.push(othOrderSQLResObj);
                }
                //是否是笔记本电脑   LP
                if (wlCode == "LP") {
                  lpObj.push(wlTypObj);
                  lpObjResSQL.push(othOrderSQLResObj);
                }
                //是否是IPD    PD
                if (wlCode == "PD") {
                  pdObj.push(wlTypObj);
                  pdObjResSQL.push(othOrderSQLResObj);
                }
              }
            }
          }
        }
      } catch (e) {
        throw new Error(e);
      }
    }
    return {
      othOrderSQLRes: othOrderSQLRes,
      tfAmount: tfAmount,
      wlRes11: res,
      tpObj: tpObj,
      lpObj: lpObj,
      pdObj: pdObj,
      tpObjResSQL: tpObjResSQL,
      lpObjResSQL: lpObjResSQL,
      pdObjResSQL: pdObjResSQL,
      childRes: childRes,
      userId: userId,
      deptId: deptId
    };
  }
}
exports({ entryPoint: MyAPIHandler });
function getMap() {
  // 初始化map_,给map_对象增加方法，使map_像Map
  var map_ = new Object();
  map_.put = function (key, value) {
    map_[key + "_"] = value;
  };
  map_.get = function (key) {
    return map_[key + "_"];
  };
  map_.remove = function (key) {
    delete map_[key + "_"];
  };
  map_.keyset = function () {
    var ret = "";
    for (var p in map_) {
      if (typeof p == "string" && p.substring(p.length - 1) == "_") {
        ret += ",";
        ret += p.substring(0, p.length - 1);
      }
    }
    if (ret == "") {
      return ret.split(",");
    } else {
      return ret.substring(1).split(",");
    }
  };
  return map_;
}