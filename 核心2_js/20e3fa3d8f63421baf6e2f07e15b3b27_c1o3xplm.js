let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let time = new Date(getCurrentTime(new Date()));
    let currentTime = dateFtt("yyyy-MM-dd hh:mm:ss", time);
    let productId = request.id; //物料ID
    let useType = request.useType; //用途
    let suncomponentmap = new Map(); //子件-数量集合
    let queryData = {}; //返回表体数据、表头金额合计
    let arrays = new Array(); //表体数据组装
    let totalMoney = 0; //金额合计
    let querybomComponents = new Array(); //子件查询结果
    let mergeOrnot = true; //子件是否合并
    let level = 1;
    let planProtertyList = new Array();
    let planMap = new Map();
    //查询最外层母件
    queryBomFartherById(productId, useType, querybomComponents);
    queryBomComponents(productId, useType, querybomComponents, level);
    if (querybomComponents.length > 0) {
      let bomComponents = querybomComponents;
      if (!mergeOrnot) {
        bomComponents = mergeDataByproductid(querybomComponents);
      }
      //批量获取计划属性
      getPlanProterty(querybomComponents, planMap);
      //将所有的
      for (let j = 0; j < bomComponents.length; j++) {
        let materils = queryProduct(bomComponents[j].productId);
        let productclass = queryProductClass(materils[0].manageClass);
        let planDefaultAttribute = planMap.get(bomComponents[j].productId);
        let unitPrice = getPriceByProductIDAndPlanAttribute(bomComponents[j].productId, planDefaultAttribute);
        let MaxmumCost = getMaximumCostPrice(bomComponents[j].productId);
        let MinimumCost = getMinimumCostprice(bomComponents[j].productId);
        let numeratorQuantity = bomComponents[j].numeratorQuantity / bomComponents[j].denominatorQuantity;
        let Assistantnum = queryProductIsHaveAssistant(bomComponents[j].productId);
        let list = {
          BOMLeval: bomComponents[j].BOMLeval,
          subPartCode: bomComponents[j].productId, // 物料id
          subPartCode_code: materils[0].code, // code
          subPartName: materils[0].name,
          model: materils[0].model, // 型号
          scheduleDefaultProperties: planDefaultAttribute,
          subPartCode_manageClass_name: productclass[0].name,
          materialSpecification: materils[0].modelDescription, // 物料规格
          description: materils[0].modelDescription, // 物料说明
          numberSubParts: numeratorQuantity, // 子件数量
          unitPrice: unitPrice, // 单价
          hejijine: unitPrice * numeratorQuantity, //金额
          zuidachengbenjia: MaxmumCost, // 最大成本价
          zuixiaochengbenjia: MinimumCost, //最小成本价
          versionNumber: bomComponents[j].versionCode
        };
        totalMoney = totalMoney + unitPrice * numeratorQuantity;
        arrays.push(list);
        if (Assistantnum > 0) {
          let tempproductid = "youridHere";
          let tempmaterils = queryProduct(tempproductid);
          let tempproductclass = queryProductClass(tempmaterils[0].manageClass);
          let tempDefaultProper = 3;
          let tempunitPrice = getPriceByProductIDAndPlanAttribute(tempproductid, tempDefaultProper);
          let copy_list = JSON.parse(JSON.stringify(list));
          let tempnumberSubParts = Assistantnum * numeratorQuantity * -1;
          let tempMaxmumCost = getMaximumCostPrice(tempproductid);
          let tempMinimumCost = getMinimumCostprice(tempproductid);
          totalMoney = totalMoney + tempunitPrice * tempnumberSubParts;
          copy_list.numberSubParts = tempnumberSubParts;
          copy_list.BOMLeval = list.BOMLeval + 1;
          (copy_list.subPartCode = tempproductid), // 物料id
            (copy_list.subPartCode_code = tempmaterils[0].code), // code
            (copy_list.subPartName = tempmaterils[0].name),
            (copy_list.model = tempmaterils[0].model), // 型号
            (copy_list.scheduleDefaultProperties = tempDefaultProper),
            (copy_list.subPartCode_manageClass_name = tempproductclass[0].name),
            (copy_list.materialSpecification = tempmaterils[0].modelDescription), // 物料规格
            (copy_list.description = tempmaterils[0].modelDescription), // 物料说明
            (copy_list.unitPrice = tempunitPrice), // 单价
            (copy_list.hejijine = tempunitPrice * tempnumberSubParts), //金额
            (copy_list.zuidachengbenjia = tempMaxmumCost), //最大成本价
            (copy_list.zuixiaochengbenjia = tempMinimumCost); //最小成本价
          arrays.push(copy_list);
        }
      }
      queryData.arrays = arrays;
      queryData.totalMoney = totalMoney;
    }
    //按物料合并数量
    function mergeDataByproductid(bomComponents) {
      let newbomComponents = new Array();
      let componentsmap = new Map();
      for (let k = 0; k < bomComponents.length; k++) {
        let productId = bomComponents[k].productId;
        if (componentsmap.get(productId) != null) {
          let temqty = componentsmap.get(productId).numeratorQuantity;
          let proqty = bomComponents[k].numeratorQuantity;
          componentsmap.get(productId).numeratorQuantity = temqty + proqty;
        } else {
          componentsmap.set(productId, bomComponents[k]);
        }
      }
      if (componentsmap.size > 0) {
        for (let key of componentsmap.keys()) {
          newbomComponents.push(componentsmap.get(key));
        }
      }
      return newbomComponents;
    }
    //递归母件下子件
    function queryBomComponents(productId, useType, subbomRes, level) {
      let bom = queryBomById(productId, useType);
      let queryRes = bom.subList;
      if (queryRes.length > 0) {
        for (let i = 0; i < queryRes.length; i++) {
          let subProductID = queryRes[i].productId;
          queryRes[i].versionCode = bom.versionCode == undefined ? "1.0" : bom.versionCode;
          if (hasChildes(subProductID, useType)) {
            queryRes[i].BOMLeval = level;
            subbomRes.push(queryRes[i]);
            queryBomComponents(subProductID, useType, subbomRes, level + 1);
          } else {
            queryRes[i].BOMLeval = level;
            subbomRes.push(queryRes[i]);
          }
        }
      }
    }
    //递归母件下子件
    function queryBomFartherComponents(productId, useType, subbomRes, level) {
      let bom = queryBomById(productId, useType);
      let queryRes = bom.subList;
      if (queryRes.length > 0) {
        for (let i = 0; i < queryRes.length; i++) {
          queryRes[i].BOMLeval = 0;
          queryRes[i].versionCode = bom.versionCode == undefined ? "1.0" : bom.versionCode;
          subbomRes.push(queryRes[i]);
        }
      }
    }
    //查询最外层母件
    function queryBomFartherById(productId, useType, querybomComponents) {
      let result = new Object();
      let queryversiocode = "select * from ed.bom.Bom where useTypeId='" + useType + "' and  productId='" + productId + "' order by versionCode desc";
      let versionres = ObjectStore.queryByYonQL(queryversiocode, "engineeringdata");
      let conditionsql = "";
      if (versionres.length > 0) {
        result.versionCode = versionres[0].versionCode;
      } else {
        result.versionCode = "1.0";
      }
      let bomComponent = {
        BOMLeval: 0,
        productId: productId,
        numeratorQuantity: 1,
        denominatorQuantity: 1,
        versionCode: result.versionCode
      };
      querybomComponents.push(bomComponent);
      return querybomComponents;
    }
    //查询母件下子件
    function queryBomById(productId, useType) {
      let result = new Object();
      let queryversiocode =
        "select * from ed.bom.Bom where useTypeId='" +
        useType +
        "' and expiryDate>='" +
        currentTime +
        "' and effectiveDate<='" +
        currentTime +
        "'  and  productId='" +
        productId +
        "' order by versionCode desc";
      let versionres = ObjectStore.queryByYonQL(queryversiocode, "engineeringdata");
      let conditionsql = "";
      if (versionres.length > 0) {
        conditionsql = " and versionCode='" + versionres[0].versionCode + "'";
        result.versionCode = versionres[0].versionCode;
      } else {
        result.versionCode = "1.0";
      }
      let querySubSql =
        "select * from ed.bom.BomComponent where bomId in (select id from ed.bom.Bom where  useTypeId='" +
        useType +
        "' and expiryDate>='" +
        currentTime +
        "' and effectiveDate<='" +
        currentTime +
        "'  and  productId='" +
        productId +
        "' " +
        conditionsql +
        ")";
      let subList = ObjectStore.queryByYonQL(querySubSql, "engineeringdata");
      if (subList.length == 0) {
        if (useType == "1575206606306541584") {
          querySubSql =
            "select * from ed.bom.BomComponent where bomId in (select id from ed.bom.Bom where  useTypeId=1575206606306541585 and expiryDate>='" +
            currentTime +
            "' and effectiveDate<='" +
            currentTime +
            "' and productId='" +
            productId +
            "' " +
            conditionsql +
            ")";
        } else if (useType == "1575206606306541585") {
          querySubSql =
            "select * from ed.bom.BomComponent where bomId in (select id from ed.bom.Bom where  useTypeId=1575206606306541584 and expiryDate>='" +
            currentTime +
            "' and effectiveDate<='" +
            currentTime +
            "' and productId='" +
            productId +
            "' " +
            conditionsql +
            ")";
        }
        subList = ObjectStore.queryByYonQL(querySubSql, "engineeringdata");
      }
      result.subList = subList;
      return result;
    }
    //查询产品其他属性字段值
    function queryProduct(productId) {
      let material = "select * from pc.product.Product where id = '" + productId + "'";
      return ObjectStore.queryByYonQL(material, "productcenter");
    }
    //查询产品分类
    function queryProductClass(productClassID) {
      let material = "select * from pc.cls.ManagementClass where id = '" + productClassID + "'";
      return ObjectStore.queryByYonQL(material, "productcenter");
    }
    //查询产品计划属性
    function queryProductPlanProterty(productId) {
      let productSunSql = "select planDefaultAttribute from pc.product.ProductDetail where productId = '" + productId + "'";
      return ObjectStore.queryByYonQL(productSunSql, "productcenter");
    }
    //查询产品是否有副产品数量
    function queryProductIsHaveAssistant(productId) {
      let sql = "select * from 		pc.product.ProductFreeDefine	where  id='" + productId + "'";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      var define3 = 0;
      if (res.length > 0) {
        define3 = res[0].define3;
      }
      return define3;
    }
    //母件是否有子件
    function hasChildes(productId, useType) {
      return queryBomById(productId, useType).subList.length > 0;
    }
    //查询物料单价
    function getPriceByProductIDAndPlanAttribute(productID, planDefaultAttribute) {
      let querysql = "";
      let queryRest = new Array();
      let taxprice = 0;
      if (planDefaultAttribute == "1") {
        //采购
        //单价：oriUnitPrice ,无税单价字段:oriUnitPrice
        querysql = "select npriceNoTaxOrigin taxprice  from aa.pricecenter.BiPriceEntity where enable=1 and vmaterialId='" + productID + "'  order by taxprice desc limit 1";
        queryRest = ObjectStore.queryByYonQL(querysql, "cpu-bi-service");
      } else {
        //自制、委外
        //自制
        querysql = "select npriceNoTaxOrigin taxprice  from aa.pricecenter.BiPriceEntity where enable=1 and vbusinessType=2 and vmaterialId='" + productID + "'  order by taxprice desc limit 1";
        queryRest = ObjectStore.queryByYonQL(querysql, "cpu-bi-service");
        //自制
        if (queryRest.length == 0) {
          querysql = "select npriceNoTaxOrigin taxprice  from aa.pricecenter.BiPriceEntity where enable=1 and vbusinessType=0 and vmaterialId='" + productID + "'  order by taxprice desc limit 1";
          queryRest = ObjectStore.queryByYonQL(querysql, "cpu-bi-service");
        }
      }
      if (queryRest.length > 0) {
        taxprice = queryRest[0].taxprice;
      }
      return Math.round(taxprice * 1000) / 1000;
    }
    //查询物料单价
    function getPriceByProductID(productID) {
      let taxprice = 0; //
      let querysql = "select npriceNoTaxOrigin taxprice  from aa.pricecenter.BiPriceEntity where enable=1 and vmaterialId='" + productID + "'  order by dbilldate desc";
      let queryRest = ObjectStore.queryByYonQL(querysql, "cpu-bi-service");
      if (queryRest.length > 0) {
        taxprice = queryRest[0].taxprice;
      }
      return Math.round(taxprice * 1000) / 1000;
    }
    //查询最大成本价
    function getMaximumCostPrice(productID) {
      let taxprice = 0; //
      let querysql = "select npriceNoTaxOrigin taxprice  from aa.pricecenter.BiPriceEntity where enable=1 and vmaterialId='" + productID + "'  order by taxprice desc limit 1";
      let queryRest = ObjectStore.queryByYonQL(querysql, "cpu-bi-service");
      if (queryRest.length > 0) {
        taxprice = queryRest[0].taxprice;
      }
      return Math.round(taxprice * 1000) / 1000;
    }
    //查询最小成本价
    function getMinimumCostprice(productID) {
      let taxprice = 0; //
      let querysql = "select npriceNoTaxOrigin taxprice  from aa.pricecenter.BiPriceEntity where enable=1 and vmaterialId='" + productID + "'  order by taxprice asc limit 1";
      let queryRest = ObjectStore.queryByYonQL(querysql, "cpu-bi-service");
      if (queryRest.length > 0) {
        taxprice = queryRest[0].taxprice;
      }
      return Math.round(taxprice * 1000) / 1000;
    }
    //查询最小成本价
    function getPlanProterty(querybomComponents, planMap) {
      let productId = "";
      for (var i = 0; i < querybomComponents.length; i++) {
        productId = productId + querybomComponents[i].productId + ",";
      }
      productId = substring(productId, 0, productId.length - 1);
      let productSunSql = "select productId,planDefaultAttribute from pc.product.ProductDetail where productId in (" + productId + ")";
      let planDefaultList = ObjectStore.queryByYonQL(productSunSql, "productcenter");
      planDefaultList.forEach((e) => {
        planMap.set(e.productId, e.planDefaultAttribute);
      });
    }
    function dateFtt(fmt, date) {
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return fmt;
    }
    function getCurrentTime(production_validity) {
      // 有效期转为时间戳
      var beginDate = new Date(production_validity).getTime();
      var timezone = 8; //目标时区时间，东八区
      // 本地时间和格林威治的时间差，单位为分钟
      var offset_GMT = new Date().getTimezoneOffset();
      // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var nowDate = new Date().getTime();
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      // 当前日期时间戳
      var endDate = new Date(date).getTime();
      return endDate;
    }
    return { queryData };
  }
}
exports({ entryPoint: MyAPIHandler });