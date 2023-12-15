let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: ""
    };
    let sql;
    try {
      let code = request.code;
      let startDate = request.startDate;
      let endDate = request.endDate;
      let organization = request.organization;
      let store = request.store;
      console.log("查询条件开始时间" + startDate + "  结束时间" + endDate);
      sql = `select sum(detls.fMoney)  fMoney,iDepartmentid Deptid,Dept.name Deptname,Dept.code Deptcode,productClassfirstLevel.code  productClassfirstLevelcode,productClass.code productClasscode,product.productClass productClass ,detls.product product,d.code iBusinesstypecode,d.name iBusinesstypename,iBusinesstypeid,c.name iOrgName,b.code storeCode,b.name storeName ,code,vouchdate,store,iOrgid,fMoneySum fGatheringMoney  from rm.retailvouch.RetailVouchHeader left join aa.store.Store b on b.id=store  left join org.func.BaseOrg c on c.id=iOrgid  left join bd.bill.TransType d on d.id=iBusinesstypeid  inner join rm.retailvouch.RetailVouchDetail detls on detls.iRetailid=id 
             inner join pc.aa.Product product on product.id=detls.product
             inner join pc.cls.PresentationClass productClass on productClass.id=product.productClass
             inner join pc.cls.PresentationClass productClassfirstLevel on productClassfirstLevel.id=productClass.firstLevel
             left join bd.adminOrg.DeptOrgVO Dept on Dept.id=iDepartmentid
             where 1=1 `;
      sql += " and productClassfirstLevel.code='01' "; //商品分类
      sql += " AND locate('_YD',code)=0 ";
      sql += " and d.code in('01','02') "; //交易类型 正式
      //已交货
      sql += "AND  iDeliveryState=1 ";
      sql += " and fMoneySum>0 ";
      sql += " and iNegative!=2 "; //不包含退订
      if (code) {
        sql += " and code=" + code;
      }
      if (organization) {
        sql += " and iOrgid=" + organization;
      }
      if (store) {
        sql += " and store=" + store;
      } else {
        throw new Error("门店信息不能为空");
      }
      if (startDate && endDate) {
        sql += " and dDate>='" + startDate + "' and dDate<='" + endDate + " 23:59:59" + "'";
      }
      let sql1 = "select retal_num from AT18FE5D761C880009.AT18FE5D761C880009.score";
      let scoresList = ObjectStore.queryByYonQL(sql1, "developplatform");
      let scores = []; //
      scoresList.forEach((iv, ivindex) => {
        scores.push(iv.retal_num);
      });
      sql += "  and code NOT IN (" + scores + ") ";
      sql += "  GROUP BY code ";
      let dt = ObjectStore.queryByYonQL(sql, "retail");
      rsp.dataInfo = dt;
    } catch (ex) {
      console.log("查询错误" + ex.toString() + "sql=" + sql);
      rsp.code = 500;
      rsp.msg = ex.message;
    }
    return rsp;
  }
}
exports({ entryPoint: MyAPIHandler });