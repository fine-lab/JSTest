let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var activityId = request.id; //活动id
    var activityType = request.type; //活动类型
    var agentId = request.agentId; //客户id
    var orderDetails = request.orderDetails; //商品列表
    //查询【商品促销】菜单配比,赋值Map
    var queryDiscountSql = "select product,discount from AT168A435A08100007.AT168A435A08100007.discount where dr=0 ";
    var discountRes = ObjectStore.queryByYonQL(queryDiscountSql, "developplatform");
    var discountMap = new Map();
    for (var z = 0; z < discountRes.length; z++) {
      let discountValue = Math.floor(discountRes[z].discount * 100) / 100;
      discountMap.set(discountRes[z].product, discountValue);
    }
    var recordList = new Array();
    if ("1" == activityType) {
      //查询id对应信息
      var queryPriceDisSql =
        "select promotion,id,istop,notop_quantity,top_quantity,isKanLevel,accumulate_date from AT168A435A08100007.AT168A435A08100007.price_discounts where dr=0 and id='" + activityId + "'";
      var priceDisRes = ObjectStore.queryByYonQL(queryPriceDisSql, "developplatform");
      if (priceDisRes.length == 0) {
        throw new Error("依据活动id未查询到对应【促销活动S+A】菜单数据,请检查");
      }
      //查询活动A级商品
      //查询特定商品
      var queryAssignSql = "select goods_name from AT168A435A08100007.AT168A435A08100007.activity_assign where dr=0 and price_discounts_id='" + activityId + "'";
      var assignRes = ObjectStore.queryByYonQL(queryAssignSql, "developplatform");
      var allAssign = 0;
      //查询A+S级商品
      var querySpecificSql = "select goods_name from AT168A435A08100007.AT168A435A08100007.activity_specific where dr=0 and price_discounts_id='" + activityId + "'";
      var specificRes = ObjectStore.queryByYonQL(querySpecificSql, "developplatform");
      var allSpecific = 0;
      //立减
      var queryReduceSql = "select * from AT168A435A08100007.AT168A435A08100007.immediately_reduce where dr=0 and price_discounts_id='" + activityId + "' order by material,index_ratio_s,index_ratio";
      var reduceRes = ObjectStore.queryByYonQL(queryReduceSql, "developplatform");
      //满减
      var queryFullSql = "select * from AT168A435A08100007.AT168A435A08100007.full_reduce where dr=0 and price_discounts_id='" + activityId + "' order by product,index_ratio_s,index_ratio ";
      var fullRes = ObjectStore.queryByYonQL(queryFullSql, "developplatform");
      //满赠
      var querySendSql = "select * from AT168A435A08100007.AT168A435A08100007.full_send where dr=0 and price_discounts_id='" + activityId + "' order by material,index_ratio_s,index_ratio ";
      var sendRes = ObjectStore.queryByYonQL(querySendSql, "developplatform");
      //三个子表的的物料主键
      var allPruId = "";
      //立减
      if (reduceRes.length > 0) {
        for (var a1 = 0; a1 < reduceRes.length; a1++) {
          allPruId = allPruId + "," + reduceRes[a1].material;
        }
      }
      //满减
      if (fullRes.length > 0) {
        for (var a2 = 0; a2 < fullRes.length; a2++) {
          allPruId = allPruId + "," + fullRes[a2].product;
        }
      }
      //满赠
      if (sendRes.length > 0) {
        for (var a3 = 0; a3 < sendRes.length; a3++) {
          allPruId = allPruId + "," + sendRes[a3].material;
        }
      }
      //请求参数物料转换后总数量
      var allconQty = 0;
      //请求参数物料参与优惠的转换后总数量
      var yhQty = 0;
      //对商品数量进行汇总
      var allAssignNum = 0;
      var specificResNum = 0;
      var allAssignList = new Array();
      for (var i = 0; i < orderDetails.length; i++) {
        let orderId = orderDetails[i].pruId;
        let orderQty = orderDetails[i].qty;
        //计算转换后数量
        let idDiscount = discountMap.get(orderId) == null ? 1 : discountMap.get(orderId);
        let conQty = orderQty * idDiscount; //数量*转换率
        allconQty = allconQty + conQty;
        //判断是否优惠
        if (allPruId.indexOf(orderId) != -1) {
          yhQty = yhQty + conQty;
        }
        //活动特定商品数
        for (var j = 0; j < assignRes.length; j++) {
          if (orderId == assignRes[j].goods_name) {
            allAssign = allAssign + conQty;
            break;
          }
        }
        //活动S+A级商品汇总
        for (var k = 0; k < specificRes.length; k++) {
          if (orderId == specificRes[k].goods_name) {
            allSpecific = allSpecific + conQty;
            break;
          }
        }
      }
      if (yhQty == 0) {
        return {};
      }
      //是否TOP控制
      var istopValue = priceDisRes[0].istop == null ? "false" : priceDisRes[0].istop;
      if ("true" == istopValue) {
        var queryIsTop = "select id from AT168A435A08100007.AT168A435A08100007.topMerchant where dr=0 and merchant='" + agentId + "'";
        var isTopRes = ObjectStore.queryByYonQL(queryIsTop, "developplatform");
        if (isTopRes.length == 0) {
          //非Top客户
          //非TOP客户-最低数量
          var notop_quantityValue = priceDisRes[0].notop_quantity == null ? 0 : priceDisRes[0].notop_quantity;
          if (allconQty < notop_quantityValue) {
            return {};
          }
        } else {
          var top_quantityValue = priceDisRes[0].top_quantity == null ? 0 : priceDisRes[0].top_quantity;
          if (allconQty < top_quantityValue) {
            return {};
          }
        }
      }
      //促销方式
      var promotionValue = priceDisRes[0].promotion;
      //计算（S+A）/总数量比例
      let ratio = allAssign == 0 ? 0 : allSpecific / allAssign;
      var ratioValue = Math.floor(ratio * 10000) / 100;
      for (var a = 0; a < orderDetails.length; a++) {
        let orderId = orderDetails[a].pruId;
        let orderQty = orderDetails[a].qty;
        //立减
        if (promotionValue.indexOf("1") != -1) {
          for (var b = 0; b < reduceRes.length; b++) {
            if (orderId == reduceRes[b].material && ratioValue < reduceRes[b].index_ratio && ratioValue >= reduceRes[b].index_ratio_s) {
              let idDiscount = discountMap.get(orderId) == null ? 1 : discountMap.get(orderId);
              let preMoney = idDiscount * reduceRes[b].reduce_money;
              let recordObje = {
                materialId: orderId,
                preMoney: preMoney
              };
              recordList.push(recordObje);
            }
          }
        }
        //满减
        //满赠
        if (promotionValue.indexOf("3") != -1) {
          //特定商品汇总
          for (var d = 0; d < sendRes.length; d++) {
            if (orderId == sendRes[d].material && ratioValue < sendRes[d].index_ratio && ratioValue >= sendRes[d].index_ratio_s) {
              let idDiscount = discountMap.get(orderId) == null ? 1 : discountMap.get(orderId);
              let conQty = orderQty;
              let multiple = parseInt(conQty / sendRes[d].condition_quantity);
              if (multiple > 0) {
                let bdActObje = {
                  materialId: orderId,
                  preQty: sendRes[d].give_quantity * multiple
                };
                recordList.push(bdActObje);
              }
            }
          }
        }
      }
      //坎级满减/满减
      var isKanLevel = priceDisRes[0].isKanLevel == null ? "0" : priceDisRes[0].isKanLevel;
      var mjResList = new Array();
      if (promotionValue.indexOf("2") != -1) {
        for (var c = 0; c < fullRes.length; c++) {
          if (ratioValue < fullRes[c].index_ratio && ratioValue >= fullRes[c].index_ratio_s) {
            var newOrderDetails = new Array();
            var fullActivitySkuListSql = "select product,discount from AT168A435A08100007.AT168A435A08100007.full_activity_sku_v4_sa where dr=0 and full_reduce_id='" + fullRes[c].id + "'";
            var fullActivitySkuList = ObjectStore.queryByYonQL(fullActivitySkuListSql, "developplatform");
            if (isKanLevel == 1) {
              if (!priceDisRes[0].accumulate_date) {
                throw new Error("对应坎级活动未维护累计统计开始时间");
              }
              let productId = "";
              for (var n = 0; n < orderDetails.length; n++) {
                productId = productId + orderDetails[n].pruId + ",";
              }
              for (var m = 0; m < fullActivitySkuList.length; m++) {
                productId = productId + fullActivitySkuList[m].product + ",";
              }
              productId = substring(productId, 0, productId.length - 1);
              let totalleiji = getTotal(productId, agentId, priceDisRes[0].accumulate_date);
              let total = new Array();
              totalleiji.forEach((item) => {
                total.push(item);
              });
              orderDetails.forEach((item) => {
                total.push(item);
              });
              const aMap = new Map();
              const arr = [];
              total.forEach((e) => {
                const pruId = e.pruId;
                const k = pruId;
                aMap.set(k, (aMap.get(k) || 0) + Number(e.qty));
              });
              aMap.forEach((val, key) => {
                const item = {};
                item.pruId = key;
                item.qty = val;
                newOrderDetails.push(item);
              });
            } else {
              newOrderDetails = orderDetails;
            }
            var resList = new Array(); //每个满减活动返回集合
            var resQty = 0; //每个满减活动所属物料数量之和
            for (var a = 0; a < newOrderDetails.length; a++) {
              //循环请求物料
              let orderId = newOrderDetails[a].pruId;
              let orderQty = newOrderDetails[a].qty;
              for (var j = 0; j < fullActivitySkuList.length; j++) {
                //循环满减活动商品列表
                if (orderId == fullActivitySkuList[j].product) {
                  let idDiscount = discountMap.get(orderId) == null ? 1 : discountMap.get(orderId);
                  let preMoney = idDiscount * fullActivitySkuList[j].discount;
                  let recordObje = {
                    materialId: orderId,
                    preMoney: preMoney
                  };
                  resList.push(recordObje);
                  resQty = resQty + orderQty;
                }
              }
            }
            //计算每个满减活动下所有对应请求物料之和 与满减活动条件值
            if (resQty >= fullRes[c].condition_quantity && resQty < fullRes[c].condition_quantity_end) {
              mjResList.push.apply(mjResList, resList);
            }
          }
        }
        const aMap = new Map();
        const arr = [];
        //满减取最优惠活动
        mjResList.forEach((e) => {
          const k = e.materialId;
          aMap.set(k, (aMap.get(k) || 0) <= e.preMoney ? e.preMoney : aMap.get(k) || 0);
        });
        aMap.forEach((val, key) => {
          const item = {};
          item.materialId = key;
          item.preMoney = val;
          arr.push(item);
        });
        recordList.push.apply(recordList, arr);
      }
      return { recordList };
    } else if ("2" == activityType) {
      var queryPriceActSql = "select * from AT168A435A08100007.AT168A435A08100007.promotion_activity where dr=0 and id='" + activityId + "'";
      var priceActRes = ObjectStore.queryByYonQL(queryPriceActSql, "developplatform");
      if (priceActRes.length == 0) {
        throw new Error("依据活动id未查询到对应【促销活动S/A】菜单数据,请检查");
      }
      //加入计算百搭活动
      var isBd = priceActRes[0].isBd;
      if (isBd == "1") {
        //是百搭活动
        var bdListSql = "select * from AT168A435A08100007.AT168A435A08100007.bd_full_send where dr=0 and promotion_activity_id='" + activityId + "'";
        var bdActRes = ObjectStore.queryByYonQL(bdListSql, "developplatform");
        if (bdActRes.length > 0) {
          for (var a = 0; a < orderDetails.length; a++) {
            let orderId = orderDetails[a].pruId;
            let orderQty = orderDetails[a].qty;
            bdActRes.forEach((item) => {
              if (item.material == orderId) {
                let multiple = parseInt(orderQty / item.condition_quantity);
                if (multiple > 0) {
                  let bdActObje = {
                    materialId: orderId,
                    preQty: item.give_quantity * multiple
                  };
                  recordList.push(bdActObje);
                }
              }
            });
          }
        }
      }
      //活动类型
      var activityTypeValue = priceActRes[0].activity_type;
      //所有的优惠物料id
      var allPruId = "";
      //请求参数物料参与优惠的转换后总数量
      var yhQty = 0;
      if (includes(activityTypeValue, "1")) {
        //改动1
        var queryAllSmatchSql = "select * from AT168A435A08100007.AT168A435A08100007.matching_activity_v4 where dr=0 and promotion_activity_id='" + activityId + "'";
        var allsmatchRes = ObjectStore.queryByYonQL(queryAllSmatchSql, "developplatform");
        for (var s1 = 0; s1 < allsmatchRes.length; s1++) {
          var queryallAmatchSkuSql = "select * from AT168A435A08100007.AT168A435A08100007.matching_activity_skys_v4 where dr=0 and matching_activity_v4_id='" + allsmatchRes[s1].id + "'";
          var allamatchSkuRes = ObjectStore.queryByYonQL(queryallAmatchSkuSql, "developplatform");
          for (var s2 = 0; s2 < allamatchSkuRes.length; s2++) {
            allPruId = allPruId + "," + allamatchSkuRes[s2].product;
          }
        }
      } else if (includes(activityTypeValue, "2")) {
        //改动2
        var queryAllSetmealSql = "select * from AT168A435A08100007.AT168A435A08100007.setmeal_activity_v4 where dr=0 and promotion_activity_id='" + activityId + "'";
        var allsetmealRes = ObjectStore.queryByYonQL(queryAllSetmealSql, "developplatform");
        for (var s1 = 0; s1 < allsetmealRes.length; s1++) {
          var queryAllGoodsSql = "select * from 	AT168A435A08100007.AT168A435A08100007.setmeal_goods_list where dr=0 and setmeal_activity_v4_id='" + allsetmealRes[s1].id + "'";
          var allgoodslRes = ObjectStore.queryByYonQL(queryAllGoodsSql, "developplatform");
          for (var s2 = 0; s2 < allgoodslRes.length; s2++) {
            allPruId = allPruId + "," + allgoodslRes[s2].product;
          }
        }
      }
      //转换后请求总数量
      var allQty = 0;
      //请求的所有物料id
      var allQuertpruId = "";
      //对商品数量进行汇总
      for (var i = 0; i < orderDetails.length; i++) {
        let orderId = orderDetails[i].pruId;
        allQuertpruId = allQuertpruId + "," + orderId;
        //转换率
        let idDiscount = discountMap.get(orderId) == null ? 1 : discountMap.get(orderId);
        let conQty = orderDetails[i].qty * idDiscount; //数量*转换率
        allQty = allQty + conQty;
        //判断是否优惠
        if (allPruId.indexOf(orderId) != -1) {
          yhQty = yhQty + conQty;
        }
      }
      //是否TOP控制
      var istopValue = priceActRes[0].istop == null ? "false" : priceActRes[0].istop;
      if ("true" == istopValue) {
        var queryIsTop = "select id from AT168A435A08100007.AT168A435A08100007.topMerchant where dr=0 and merchant='" + agentId + "'";
        var isTopRes = ObjectStore.queryByYonQL(queryIsTop, "developplatform");
        if (isTopRes.length == 0) {
          //非Top客户
          //非TOP客户-最低数量
          var notop_quantityValue = priceActRes[0].notop_quantity == null ? 0 : priceActRes[0].notop_quantity;
          if (allQty < notop_quantityValue) {
            return {};
          }
        } else {
          var top_quantityValue = priceActRes[0].top_quantity == null ? 0 : priceActRes[0].top_quantity;
          if (allQty < top_quantityValue) {
            return {};
          }
        }
      }
      //套餐活动-最低数量
      var minsetmeal_quantity = priceActRes[0].minsetmeal_quantity == null ? 0 : priceActRes[0].minsetmeal_quantity;
      //配比活动-最低数量
      var minmatching_quantity = priceActRes[0].minmatching_quantity == null ? 0 : priceActRes[0].minmatching_quantity;
      if (includes(activityTypeValue, "3")) {
        //满减活动,不考虑物料转换情况  改动3
        //查询满减活动
        var queryFullSql = "select * from AT168A435A08100007.AT168A435A08100007.full_activity_v4 where dr=0 and promotion_activity_id='" + activityId + "'  order by  start_value,end_value ";
        var fullRes = ObjectStore.queryByYonQL(queryFullSql, "developplatform");
        for (var k = 0; k < fullRes.length; k++) {
          //判断是否为坎级活动
          var newOrderDetails = new Array();
          var querySkuFullSql = "select * from 	AT168A435A08100007.AT168A435A08100007.full_activity_sku_v4 where dr=0 and full_activity_v4_id='" + fullRes[k].id + "' order by  product ";
          var skuFullRes = ObjectStore.queryByYonQL(querySkuFullSql, "developplatform");
          if ("1" == priceActRes[0].isKanLevel) {
            if (!priceActRes[0].accumulate_date) {
              throw new Error("对应坎级活动未维护累计统计开始时间");
            }
            let productId = "";
            for (var n = 0; n < orderDetails.length; n++) {
              productId = productId + orderDetails[n].pruId + ",";
            }
            for (var m = 0; m < skuFullRes.length; m++) {
              productId = productId + skuFullRes[m].product + ",";
            }
            productId = substring(productId, 0, productId.length - 1);
            let totalleiji = getTotal(productId, agentId, priceActRes[0].accumulate_date);
            let total = new Array();
            totalleiji.forEach((item) => {
              total.push(item);
            });
            orderDetails.forEach((item) => {
              total.push(item);
            });
            const aMap = new Map();
            const arr = [];
            total.forEach((e) => {
              const pruId = e.pruId;
              const k = pruId;
              aMap.set(k, (aMap.get(k) || 0) + Number(e.qty));
            });
            aMap.forEach((val, key) => {
              const item = {};
              item.pruId = key;
              item.qty = val;
              newOrderDetails.push(item);
            });
          } else {
            newOrderDetails = orderDetails;
          }
          var resList = new Array(); //每个满减活动返回集合
          var resQty = 0; //每个满减活动所属物料数量之和
          for (var a = 0; a < newOrderDetails.length; a++) {
            //循环请求物料
            let orderId = newOrderDetails[a].pruId;
            let orderQty = newOrderDetails[a].qty;
            for (var j = 0; j < skuFullRes.length; j++) {
              //循环满减活动商品列表
              if (orderId == skuFullRes[j].product) {
                let idDiscount = discountMap.get(orderId) == null ? 1 : discountMap.get(orderId);
                let preMoney = idDiscount * skuFullRes[j].discount;
                let recordObje = {
                  materialId: orderId,
                  preMoney: preMoney
                };
                resList.push(recordObje);
                resQty = resQty + orderQty;
              }
            }
          }
          //计算每个满减活动下所有对应请求物料之和 与满减活动条件值
          if (resQty >= fullRes[k].start_value && resQty < fullRes[k].end_value) {
            recordList.push.apply(recordList, resList);
          }
        }
      }
      if (includes(activityTypeValue, "2")) {
        //套餐活动  改动4
        //查询套餐活动
        var querySetmealSql = "select id,radio from AT168A435A08100007.AT168A435A08100007.setmeal_activity_v4 where dr=0 and promotion_activity_id='" + activityId + "' order by spu_name,radio ";
        var setmealRes = ObjectStore.queryByYonQL(querySetmealSql, "developplatform");
        if (setmealRes.length > 0) {
          //比对转换后总数量与表头“套餐活动-最低数量”
          if (allQty >= minsetmeal_quantity) {
            //查询套餐商品优惠列表
            for (var k = 0; k < setmealRes.length; k++) {
              //循环套餐活动
              var resList = new Array(); //每个套餐活动返回集合
              var resQty = 0; //每个套餐活动所属物料数量之和
              var queryGoodsSql = "select *  from AT168A435A08100007.AT168A435A08100007.setmeal_goods_list where dr=0 and setmeal_activity_v4_id='" + setmealRes[k].id + "'  order by  product ";
              var goodslRes = ObjectStore.queryByYonQL(queryGoodsSql, "developplatform");
              var alldiscount = 0;
              for (var b = 0; b < orderDetails.length; b++) {
                //循环请求物料
                let orderId = orderDetails[b].pruId;
                let orderQty = orderDetails[b].qty;
                for (var n = 0; n < goodslRes.length; n++) {
                  //循环套餐商品优惠列表
                  alldiscount = alldiscount + goodslRes[n].discount;
                  if (orderId == goodslRes[n].product) {
                    let idDiscount = discountMap.get(orderId) == null ? 1 : discountMap.get(orderId);
                    let preMoney = idDiscount * goodslRes[n].discount;
                    let recordObje = {
                      materialId: orderId,
                      preMoney: preMoney
                    };
                    resList.push(recordObje);
                    resQty = resQty + orderQty * idDiscount;
                  }
                }
              }
              if (resQty == 0) {
                return {};
              }
              //计算每个套餐活动下所有对应请求物料之和 与请求总数量比例
              let radioValue = Math.floor((resQty / yhQty) * 10000) / 100;
              if (alldiscount == 0) {
                //优惠金额为0，则计算比例需>=页面比例
                if (radioValue >= setmealRes[k].radio) {
                  recordList.push.apply(recordList, resList);
                }
              } else {
                //优惠金额不为0，则计算比例需<=页面比例
                if (radioValue <= setmealRes[k].radio) {
                  recordList.push.apply(recordList, resList);
                }
              }
            }
          }
        }
      }
      if (includes(activityTypeValue, "1")) {
        //配比活动  //改动6
        //比对转换后总数量与表头“配比活动-最低数量”
        if (allQty >= minmatching_quantity) {
          //查询配比活动商品列表
          var querySoraSql = "select * from AT168A435A08100007.AT168A435A08100007.matching_SorA_goods where dr=0 and promotion_activity_id='" + activityId + "' order by grade,product ";
          var soraRes = ObjectStore.queryByYonQL(querySoraSql, "developplatform");
          var sallQty = 0;
          var aallQty = 0;
          for (var i = 0; i < soraRes.length; i++) {
            //循环配比活动商品
            let soraId = soraRes[i].product; //物料id
            let soragrade = soraRes[i].grade; //等级 1:S;2:A
            for (var k = 0; k < orderDetails.length; k++) {
              //循环请求物料List
              let orderId = orderDetails[k].pruId;
              if (soraId == orderId) {
                let idDiscount = discountMap.get(orderId) == null ? 1 : discountMap.get(orderId);
                let conQty = orderDetails[k].qty * idDiscount; //数量*转换率
                if ("1" == soragrade) {
                  sallQty = sallQty + conQty;
                } else if ("2" == soragrade) {
                  aallQty = aallQty + conQty;
                }
              }
            }
          }
          var sratio = yhQty == 0 ? 0 : Math.floor((sallQty / yhQty) * 10000) / 100;
          var aratio = yhQty == 0 ? 0 : Math.floor((aallQty / yhQty) * 10000) / 100;
          //是否执行A比例优惠
          var isBuildA = true;
          //依据S级比例查询【配比活动】子表
          if (sallQty > 0) {
            var querySmatchSql =
              "select * from AT168A435A08100007.AT168A435A08100007.matching_activity_v4 where dr=0 and promotion_activity_id='" +
              activityId +
              "' and grade='1' and radio_start<=" +
              sratio +
              " and radio_end>" +
              sratio +
              " order by radio_start,radio_end ";
            var smatchRes = ObjectStore.queryByYonQL(querySmatchSql, "developplatform");
            if (smatchRes.length > 0) {
              isBuildA = false;
            }
            for (var c = 0; c < smatchRes.length; c++) {
              //查询S级对应【配比活动优惠商品】
              var querySmatchSkuSql =
                "select * from AT168A435A08100007.AT168A435A08100007.matching_activity_skys_v4 where dr=0 and matching_activity_v4_id='" + smatchRes[c].id + "'  order by product ";
              var smatchSkuRes = ObjectStore.queryByYonQL(querySmatchSkuSql, "developplatform");
              if (smatchSkuRes.length == 0) {
                continue;
              }
              for (var d = 0; d < smatchSkuRes.length; d++) {
                let skuId = smatchSkuRes[d].product;
                if (allQuertpruId.indexOf(skuId) > -1) {
                  let idDiscount = discountMap.get(skuId) == null ? 1 : discountMap.get(skuId);
                  let preMoney = idDiscount * smatchSkuRes[d].discount;
                  let recordObje = {
                    materialId: skuId,
                    preMoney: preMoney
                  };
                  recordList.push(recordObje);
                }
              }
            }
          }
          //依据A级比例查询【配比活动】子表
          if (isBuildA) {
            if (aallQty > 0) {
              var queryAmatchSql =
                "select * from AT168A435A08100007.AT168A435A08100007.matching_activity_v4 where dr=0 and promotion_activity_id='" +
                activityId +
                "' and grade='2' and radio_start<=" +
                aratio +
                " and radio_end>" +
                aratio +
                " order by radio_start,radio_end ";
              var amatchRes = ObjectStore.queryByYonQL(queryAmatchSql, "developplatform");
              for (var d = 0; d < amatchRes.length; d++) {
                //查询S级对应【配比活动优惠商品】
                var queryAmatchSkuSql =
                  "select * from AT168A435A08100007.AT168A435A08100007.matching_activity_skys_v4 where dr=0 and matching_activity_v4_id='" + amatchRes[d].id + "'  order by product ";
                var amatchSkuRes = ObjectStore.queryByYonQL(queryAmatchSkuSql, "developplatform");
                if (amatchSkuRes.length == 0) {
                  continue;
                }
                for (var d = 0; d < amatchSkuRes.length; d++) {
                  let skuId = amatchSkuRes[d].product;
                  if (allQuertpruId.indexOf(skuId) > -1) {
                    let idDiscount = discountMap.get(skuId) == null ? 1 : discountMap.get(skuId);
                    let preMoney = idDiscount * amatchSkuRes[d].discount;
                    let recordObje = {
                      materialId: skuId,
                      preMoney: preMoney
                    };
                    recordList.push(recordObje);
                  }
                }
              }
            }
          }
        }
      } else {
        throw new Error("活动类型传入有误，请检查");
      }
    } else {
      throw new Error("活动类型传入有误，请检查");
    }
    return { recordList };
    //获取历史销量
    function getTotal(productId, agentId, vouchdate) {
      let ysql =
        "select productId pruId,SUM(priceQty) qty from voucher.order.OrderDetail where iDeleted=0 and productId in (" +
        productId +
        ") and orderId in (select id from voucher.order.Order where iDeleted=0 and verifystate=2 and agentId='" +
        agentId +
        "' and vouchdate >= '" +
        vouchdate +
        "') group by productId ";
      let totres = ObjectStore.queryByYonQL(ysql, "udinghuo");
      return totres;
    }
  }
}
exports({ entryPoint: MyAPIHandler });