// 订单页面参照取数逻辑  wangsyf
let AbstractAPIHandler = require("AbstractAPIHandler");
const ENV_KEY = "yourKEYHere";
const ENY_SEC = "ba2a2bded3a84844baa71fe5a3e59e00";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let api = new RefRangeAPI();
    return api.getMapping();
  }
}
class RefRangeAPI {
  getMapping() {
    let { psnOrgAndDept, user } = this.getPsnBasic();
    let psnBiz = this.getPsnLocal(psnOrgAndDept.id);
    // 获取代理商档案。
    let cmmssnMerchantList = this.getCmmssnMerchantList(psnBiz.id);
    let cmmssnMerchantIDList = cmmssnMerchantList.map(function (v) {
      return v.id;
    });
    // 代理商客户品种映射
    var simpleHeaderList;
    debugger;
    if (psnBiz.biz_man_tag == 1) {
      simpleHeaderList = this.getCMByBiz(psnBiz.id);
    } else {
      simpleHeaderList = this.getCMByByOutPerson(cmmssnMerchantIDList);
    }
    // 通过代理商客户品种id信息获取整体映射。
    let mapping = this.getValidAgentCustomerMaterialBasic(simpleHeaderList, cmmssnMerchantList);
    let { flatMap = {}, treeMap = {} } = mapping;
    return {
      psnBiz,
      user,
      flatMap,
      flatMapDesc: "id2Vo映射包含组织、代理商、业务员、客户。不含物料",
      treeMap,
      treeMapDesc: "组织-代理商-业务员-[客户id集合与物料id集合]"
    };
  }
  getValidAgentCustomerMaterialBasic(relationSimpleList /*代理商客户品种表头信息集合 必填*/, cmmssnMerchantList /* 代理商档案集合，外部业务员时有值*/) {
    let flatMap = {};
    // 组织-代理商-业务员映射
    let treeMap = {};
    // 组织集合
    var org_idArray = new Set();
    // 组织与对象集合映射
    let orgObjMapping = {};
    // 组织与表头集合映射
    let orgSimpleHeadersMapping = {};
    let id2VoMapping = {};
    if (cmmssnMerchantList && cmmssnMerchantList.length > 0) {
      for (let vo of cmmssnMerchantList) {
        flatMap[vo.org_id] = {
          org_id: vo.org_id,
          org_id_code: vo.org_id_code,
          org_id_name: vo.org_id_name
        };
        flatMap[vo.id] = {
          cmmssn_merchant_id: vo.id,
          cmmssn_merchant_code: vo.code,
          cmmssn_merchant_name: vo.name,
          cmmssn_merchant_SaleArea_name: vo.SaleArea_name,
          cmmssn_merchant_SaleArea_code: vo.SaleArea_code,
          cmmssn_merchant_SaleArea_id: vo.SaleArea
        };
        if (!treeMap[vo.org_id]) {
          treeMap[vo.org_id] = {};
        }
        treeMap[vo.org_id][vo.id] = {};
      }
    }
    if (relationSimpleList && relationSimpleList.length > 0) {
      let queryProp = {
        ids: relationSimpleList.map(function (v) {
          return v.id;
        }),
        compositions: [
          {
            name: "cmmssn_cust_mar_mList"
          }
        ]
      };
      //实体查询，代理商主子表内容，并去除封存内容。
      let originList = ObjectStore.selectBatchIds("GT7239AT6.GT7239AT6.cmmssn_cust_mar_h", queryProp);
      for (let vo of originList) {
        let mList = vo["cmmssn_cust_mar_mList"];
        let mArray = [];
        for (let mvo of mList) {
          if (mvo["bsealFlag"] == "N") {
            mArray.push(mvo["product"]);
          }
        }
      }
      debugger;
      for (let vo of relationSimpleList) {
        if (!flatMap[vo.org_id]) {
          flatMap[vo.org_id] = {
            org_id: vo.org_id,
            org_id_code: vo.org_id_code,
            org_id_name: vo.org_id_name
          };
        }
        flatMap[vo.operatorId] = {
          operatorId: vo.operatorId,
          operatorId_code: vo.operatorId_code,
          operatorId_name: vo.operatorId_name
        };
        flatMap[vo.cmmssn_merchant_id] = {
          cmmssn_merchant_id: vo.cmmssn_merchant_id,
          cmmssn_merchant_code: vo.cmmssn_merchant_code,
          cmmssn_merchant_name: vo.cmmssn_merchant_name,
          cmmssn_merchant_SaleArea_name: vo.cmmssn_merchant_SaleArea_name,
          cmmssn_merchant_SaleArea_code: vo.cmmssn_merchant_SaleArea_code,
          cmmssn_merchant_SaleArea_id: vo.cmmssn_merchant_SaleArea,
          cmmssn_merchant_operatorBizCode: vo.cmmssn_merchant_operatorBizCode
        };
      }
      let relationSimpleIds = relationSimpleList.map(function (v) {
        return v.id;
      });
      debugger;
      let yql3 = `select cmmssn_cust_mar_cFk, merchant.name,merchant.code 
			,merchant.address
			from GT7239AT6.GT7239AT6.cmmssn_cust_mar_c 
          where cmmssn_cust_mar_cFk.id in ('${relationSimpleIds.join("','")}') and bsealFlag='N' `;
      var customers = ObjectStore.queryByYonQL(yql3);
      var customerMap = {};
      for (let cust of customers) {
        if (!customerMap[cust.cmmssn_cust_mar_cFk]) {
          customerMap[cust.cmmssn_cust_mar_cFk] = [];
        }
        customerMap[cust.cmmssn_cust_mar_cFk].push(cust);
        flatMap[cust.merchant] = {
          merchant: cust.merchant,
          merchant_code: cust.merchant_code,
          merchant_name: cust.merchant_name,
          merchant_address: cust.merchant_address
        };
      }
      for (let obj of originList) {
        let orgId = obj.org_id;
        obj["cmmssn_cust_mar_cList"] = customerMap[obj.id];
        id2VoMapping[obj.id] = obj;
        org_idArray.add(orgId);
        if (!orgObjMapping[orgId]) {
          orgObjMapping[orgId] = [];
        }
        orgObjMapping[orgId].push(obj);
      }
      debugger;
      for (let vo of relationSimpleList) {
        if (!orgSimpleHeadersMapping[vo.org_id]) {
          orgSimpleHeadersMapping[vo.org_id] = [];
        }
        orgSimpleHeadersMapping[vo.org_id].push(vo);
        if (!treeMap[vo.org_id]) {
          treeMap[vo.org_id] = {};
        }
      }
      org_idArray.forEach(function (v) {
        let headers = orgSimpleHeadersMapping[v];
        let agent2PsnListMapping = {};
        for (let header of headers) {
          if (!agent2PsnListMapping[header.cmmssn_merchant_id]) {
            agent2PsnListMapping[header.cmmssn_merchant_id] = {};
          }
          agent2PsnListMapping[header.cmmssn_merchant_id][header.operatorId] = {
            merchants:
              id2VoMapping[header.id]["cmmssn_cust_mar_cList"].map(function (v) {
                return v.merchant + "";
              }) || [],
            products:
              id2VoMapping[header.id]["cmmssn_cust_mar_mList"].map(function (v) {
                return v.product + "";
              }) || [],
            operatorBizCode: header.cmmssn_merchant_operatorBizCode
          };
        }
        treeMap[v] = agent2PsnListMapping;
      });
    }
    return {
      org_idArray: Array.from(org_idArray),
      treeMap,
      flatMap
    };
  }
  getCmmssnMerchantList(psnId) {
    let yql = `select cmmssn_merchant_bFk.id as id
      ,cmmssn_merchant_bFk.code as code
      ,cmmssn_merchant_bFk.name as name
      ,cmmssn_merchant_bFk.SaleArea.name as SaleArea_name
      ,cmmssn_merchant_bFk.SaleArea.code as SaleArea_code
      ,cmmssn_merchant_bFk.SaleArea as SaleArea
      ,cmmssn_merchant_bFk.org_id as org_id
      ,cmmssn_merchant_bFk.org_id.code as org_id_code
      ,cmmssn_merchant_bFk.org_id.name as org_id_name
            from GT7239AT6.GT7239AT6.cmmssn_merchant_b where dr=0 and operatorId = 'yourIdHere'`;
    // 代理商id，业务员id，组织id
    let result = ObjectStore.queryByYonQL(yql);
    return result;
  }
  getCMByBiz(psnId) {
    let yql2 = `select id 
        ,operatorId,operatorId.code,operatorId.name
        ,org_id,org_id.name,org_id.code,
        cmmssn_merchant.id,cmmssn_merchant.code,cmmssn_merchant.name ,
        cmmssn_merchant.SaleArea.name as cmmssn_merchant_SaleArea_name,
        cmmssn_merchant.SaleArea.code as cmmssn_merchant.SaleArea_code,
        cmmssn_merchant.SaleArea as cmmssn_merchant_SaleArea,
        operatorBizCode as cmmssn_merchant_operatorBizCode
         from GT7239AT6.GT7239AT6.cmmssn_cust_mar_h where dr=0 and operatorId = 'yourIdHere'`;
    let relationSimpleList = ObjectStore.queryByYonQL(yql2);
    return relationSimpleList;
  }
  getCMByByOutPerson(agentIds) {
    if (!agentIds || agentIds.length == 0) {
      return [];
    }
    // 查询代理商客户品种档案表头关系
    let yql2 = `select id 
        ,operatorId,operatorId.code,operatorId.name
        ,org_id,org_id.name,org_id.code,
        cmmssn_merchant.id,cmmssn_merchant.code,cmmssn_merchant.name ,
        cmmssn_merchant.SaleArea.name as cmmssn_merchant_SaleArea_name,
        cmmssn_merchant.SaleArea.code as cmmssn_merchant.SaleArea_code,
        cmmssn_merchant.SaleArea as cmmssn_merchant_SaleArea,
        operatorBizCode as cmmssn_merchant_operatorBizCode
         from GT7239AT6.GT7239AT6.cmmssn_cust_mar_h where cmmssn_merchant in ('${agentIds.join("', '")}')`;
    let relationSimpleList = ObjectStore.queryByYonQL(yql2);
    return relationSimpleList;
  }
  getPsnBasic() {
    let ctx = JSON.parse(AppContext()).currentUser;
    let wrapperJson = listOrgAndDeptByUserIds("diwork", ctx.tenantId, [ctx.id]);
    let wrapperObj = JSON.parse(wrapperJson);
    let psnOrgAndDept = wrapperObj.data[ctx.id];
    if (!psnOrgAndDept || !psnOrgAndDept.id) {
      throw new Error("登录用户未关联员工！");
      return;
    }
    return { psnOrgAndDept, user: ctx };
  }
  getPsnLocal(psnId) {
    let yql = `select operator.biz_man_tag as biz_man_tag 
      from GT7239AT6.GT7239AT6.operatorQueryHelper where operator='${psnId}'`;
    var res = ObjectStore.queryByYonQL(yql);
    if (res.length === 0) {
      res = ObjectStore.insert("GT7239AT6.GT7239AT6.operatorQueryHelper", { operator: psnId }, "7d53ed57");
    } else {
      res = res[0];
    }
    return {
      biz_man_tag: res.biz_man_tag,
      id: res.operator
    };
  }
  getPsnInfo(psnId) {
    let psnInfoUrl = `https://api.diwork.com/yonbip/digitalModel/staff/detail?id=${psnId}`;
    let psnInfoJson = ublinker("get", psnInfoUrl, HEADER_STRING, null);
    var psnInfoObj = JSON.parse(psnInfoJson);
    if (psnInfoObj.code == 200) {
      psnInfoObj = psnInfoObj.data;
    } else if (psnInfoObj.code == 999) {
      throw new Error(psnInfoObj.message);
    } else {
      psnInfoObj = {};
    }
    var { mainJobList = [], ptJobList = [], biz_man_tag } = psnInfoObj;
    if (mainJobList.length > 0) {
      mainJobList = mainJobList
        .filter(function (v) {
          let enddate = v["enddate"];
          if (enddate) {
            return new Date(enddate) > new Date();
          }
          return true;
        })
        .map(function (v) {
          return v.org_id;
        });
    }
    if (ptJobList.length > 0) {
      ptJobList = ptJobList
        .filter(function (v) {
          let enddate = v["enddate"];
          if (enddate) {
            return new Date(enddate) > new Date();
          }
          return true;
        })
        .map(function (v) {
          return v.org_id;
        });
    }
    return {
      mainJobList,
      ptJobList,
      biz_man_tag,
      id: psnInfoObj.id
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});