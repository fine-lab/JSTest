let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let detailsList1 = new Array();
    let detailsList2 = new Array();
    let detailsList3 = new Array();
    // 主表数据
    let OrderData = request.Order;
    // 子表1
    var OrderDetailsOne = request.Order.Order_details_one;
    for (var i = 0; i < OrderDetailsOne.length; i++) {
      let details1 = {
        PH_PRTY_CODE: OrderDetailsOne[i].PH_PRTY_CODE,
        PH_PRTY_SFX: OrderDetailsOne[i].PH_PRTY_SFX,
        PH_TERR_CODE: OrderDetailsOne[i].PH_TERR_CODE,
        PH_MANG_TERR: OrderDetailsOne[i].PH_MANG_TERR,
        PH_SALE_GRP: OrderDetailsOne[i].PH_SALE_GRP,
        PH_MARK_FOR: OrderDetailsOne[i].PH_MARK_FOR,
        PH_ORD_DATE: OrderDetailsOne[i].PH_ORD_DATE,
        PH_START_SHIP_DATE: OrderDetailsOne[i].PH_START_SHIP_DATE,
        PH_STOP_SHIP_DATE: OrderDetailsOne[i].PH_STOP_SHIP_DATE,
        PH_SCHED_DLVRY_DATE: OrderDetailsOne[i].PH_SCHED_DLVRY_DATE,
        PH_TERMS_DESC: OrderDetailsOne[i].PH_TERMS_DESC,
        PH_SHIP_W_CTRL_NBR: OrderDetailsOne[i].PH_SHIP_W_CTRL_NBR,
        PH_SHPMT_NBR: OrderDetailsOne[i].PH_SHPMT_NBR,
        PH_EST_WT: OrderDetailsOne[i].PH_EST_WT,
        PH_EST_VOL: OrderDetailsOne[i].PH_EST_VOL,
        PH_TOTAL_DLRS_UNDISC: OrderDetailsOne[i].PH_TOTAL_DLRS_UNDISC,
        PH_TOTAL_DLRS_DISC: OrderDetailsOne[i].PH_TOTAL_DLRS_DISC,
        PH_BOL: OrderDetailsOne[i].PH_BOL,
        PH_PROD_VALUE: OrderDetailsOne[i].PH_PROD_VALUE,
        PH_PACK_SLIP_TYPE: OrderDetailsOne[i].PH_PACK_SLIP_TYPE,
        PH_SPL_INSTR_CODE_1: OrderDetailsOne[i].PH_SPL_INSTR_CODE_1,
        PH_SPL_INSTR_CODE_2: OrderDetailsOne[i].PH_SPL_INSTR_CODE_2,
        PH_SPL_INSTR_CODE_3: OrderDetailsOne[i].PH_SPL_INSTR_CODE_3,
        PH_SPL_INSTR_CODE_4: OrderDetailsOne[i].PH_SPL_INSTR_CODE_4,
        PH_SPL_INSTR_CODE_5: OrderDetailsOne[i].PH_SPL_INSTR_CODE_5,
        PH_SPL_INSTR_CODE_6: OrderDetailsOne[i].PH_SPL_INSTR_CODE_6,
        PH_SPL_INSTR_CODE_7: OrderDetailsOne[i].PH_SPL_INSTR_CODE_7,
        PH_SPL_INSTR_CODE_8: OrderDetailsOne[i].PH_SPL_INSTR_CODE_8,
        PH_SPL_INSTR_CODE_9: OrderDetailsOne[i].PH_SPL_INSTR_CODE_9,
        PH_SPL_INSTR_CODE_10: OrderDetailsOne[i].PH_SPL_INSTR_CODE_10,
        PH_PLAN_SHPMT_NBR: OrderDetailsOne[i].PH_PLAN_SHPMT_NBR,
        PH_PLAN_LOAD_NBR: OrderDetailsOne[i].PH_PLAN_LOAD_NBR,
        PH_FREIGHT_TERMS: OrderDetailsOne[i].PH_FREIGHT_TERMS,
        PH_INCO_TERMS: OrderDetailsOne[i].PH_INCO_TERMS,
        CODE_DESC: OrderDetailsOne[i].CODE_DESC,
        PH_BILL_ACCT_NBR: OrderDetailsOne[i].PH_BILL_ACCT_NBR,
        PH_FTSR_NBR: OrderDetailsOne[i].PH_FTSR_NBR,
        PH_CUST_BROKER_ACCT_NBR: OrderDetailsOne[i].PH_CUST_BROKER_ACCT_NBR,
        PH_PLAN_BOL: OrderDetailsOne[i].PH_PLAN_BOL,
        PH_PLAN_MASTER_BOL: OrderDetailsOne[i].PH_PLAN_MASTER_BOL,
        PH_INTL_GOODS_DESC: OrderDetailsOne[i].PH_INTL_GOODS_DESC
      };
      detailsList1.push(details1);
    }
    // 子表2
    var OrderDetailsTwo = request.Order.Order_details_two;
    for (var i = 0; i < OrderDetailsTwo.length; i++) {
      let details2 = {
        PH_DUTY_AND_TAX: OrderDetailsTwo[i].PH_DUTY_AND_TAX,
        PH_PORT_OF_LOADING: OrderDetailsTwo[i].PH_PORT_OF_LOADING,
        PH_PORT_OF_DISCHARGE: OrderDetailsTwo[i].PH_PORT_OF_DISCHARGE,
        PH_PLAN_ID: OrderDetailsTwo[i].PH_PLAN_ID,
        PH_IS_HAZMAT_FLAG: OrderDetailsTwo[i].PH_IS_HAZMAT_FLAG,
        PH_TMS_PROC: OrderDetailsTwo[i].PH_TMS_PROC,
        PH_TMS_PO_FLAG: OrderDetailsTwo[i].PH_TMS_PO_FLAG,
        PH_LANG_ID: OrderDetailsTwo[i].PH_LANG_ID,
        PH_BUSN_UNIT_CODE: OrderDetailsTwo[i].PH_BUSN_UNIT_CODE,
        PH_FRT_CLASS: OrderDetailsTwo[i].PH_FRT_CLASS,
        PH_SHPR_ID: OrderDetailsTwo[i].PH_SHPR_ID,
        PH_DEST_AIRPORT: OrderDetailsTwo[i].PH_DEST_AIRPORT,
        PH_DEPART_AIRPORT: OrderDetailsTwo[i].PH_DEPART_AIRPORT,
        PH_CURR_CODE: OrderDetailsTwo[i].PH_CURR_CODE,
        PH_COMMODITY_CODE: OrderDetailsTwo[i].PH_COMMODITY_CODE,
        PH_UN_NBR: OrderDetailsTwo[i].PH_UN_NBR,
        PH_TMS_ORD_TYPE: OrderDetailsTwo[i].PH_TMS_ORD_TYPE,
        PH_PROD_SCHED_REF_NBR: OrderDetailsTwo[i].PH_PROD_SCHED_REF_NBR,
        PH_PLANNING_ORGN: OrderDetailsTwo[i].PH_PLANNING_ORGN,
        PH_PLANNING_DEST: OrderDetailsTwo[i].PH_PLANNING_DEST,
        PH_PRTY_TYPE: OrderDetailsTwo[i].PH_PRTY_TYPE,
        PH_GLOBAL_LOCN_NBR: OrderDetailsTwo[i].PH_GLOBAL_LOCN_NBR,
        PD_PKT_SEQ_NBR: OrderDetailsTwo[i].PD_PKT_SEQ_NBR,
        SKU: OrderDetailsTwo[i].SKU,
        IM_SKU_DESC: OrderDetailsTwo[i].IM_SKU_DESC,
        PD_INVN_TYPE: OrderDetailsTwo[i].PD_INVN_TYPE,
        PD_PROD_STAT: OrderDetailsTwo[i].PD_PROD_STAT,
        PD_BATCH_NBR: OrderDetailsTwo[i].PD_BATCH_NBR,
        PD_SKU_ATTR_1: OrderDetailsTwo[i].PD_SKU_ATTR_1,
        PD_SKU_ATTR_2: OrderDetailsTwo[i].PD_SKU_ATTR_2,
        PD_SKU_ATTR_3: OrderDetailsTwo[i].PD_SKU_ATTR_3,
        PD_SKU_ATTR_4: OrderDetailsTwo[i].PD_SKU_ATTR_4,
        PD_SKU_ATTR_5: OrderDetailsTwo[i].PD_SKU_ATTR_5,
        PD_CNTRY_OF_ORGN: OrderDetailsTwo[i].PD_CNTRY_OF_ORGN,
        PD_ORIG_ORD_LINE_NBR: OrderDetailsTwo[i].PD_ORIG_ORD_LINE_NBR,
        PD_ORIG_PKT_LINE_NBR: OrderDetailsTwo[i].PD_ORIG_PKT_LINE_NBR,
        PD_ORIG_ORD_QTY: OrderDetailsTwo[i].PD_ORIG_ORD_QTY,
        PD_ORIG_PKT_QTY: OrderDetailsTwo[i].PD_ORIG_PKT_QTY,
        PD_PKT_QTY: OrderDetailsTwo[i].PD_PKT_QTY,
        PD_BACK_ORD_QTY: OrderDetailsTwo[i].PD_BACK_ORD_QTY
      };
      detailsList2.push(details2);
    }
    // 子表3
    var OrderDetailsThree = request.Order.Order_details_three;
    for (var i = 0; i < OrderDetailsThree.length; i++) {
      let details3 = {
        PD_CANCEL_QTY: OrderDetailsThree[i].PD_CANCEL_QTY,
        IM_STD_PACK_QTY: OrderDetailsThree[i].IM_STD_PACK_QTY,
        IM_STD_CASE_QTY: OrderDetailsThree[i].IM_STD_CASE_QTY,
        PD_PO_NBR: OrderDetailsThree[i].PD_PO_NBR,
        PD_CUST_SKU: OrderDetailsThree[i].PD_CUST_SKU,
        PD_ASSORT_NBR: OrderDetailsThree[i].PD_ASSORT_NBR,
        PD_PRICE: OrderDetailsThree[i].PD_PRICE,
        PD_RETAIL_PRICE: OrderDetailsThree[i].PD_RETAIL_PRICE,
        PD_CUSTOM_TAG: OrderDetailsThree[i].PD_CUSTOM_TAG,
        PD_SHELF_DAYS: OrderDetailsThree[i].PD_SHELF_DAYS,
        PD_SPL_INSTR_CODE_1: OrderDetailsThree[i].PD_SPL_INSTR_CODE_1,
        PD_SPL_INSTR_CODE_2: OrderDetailsThree[i].PD_SPL_INSTR_CODE_2,
        PD_SPL_INSTR_CODE_3: OrderDetailsThree[i].PD_SPL_INSTR_CODE_3,
        PD_SPL_INSTR_CODE_4: OrderDetailsThree[i].PD_SPL_INSTR_CODE_4,
        PD_SPL_INSTR_CODE_5: OrderDetailsThree[i].PD_SPL_INSTR_CODE_5,
        PD_TMS_PO_SEQ: OrderDetailsThree[i].PD_TMS_PO_SEQ,
        PD_REF_FIELD_1: OrderDetailsThree[i].PD_REF_FIELD_1,
        PD_REF_FIELD_2: OrderDetailsThree[i].PD_REF_FIELD_2,
        PD_REF_FIELD_3: OrderDetailsThree[i].PD_REF_FIELD_3,
        PD_CURR_CODE: OrderDetailsThree[i].PD_CURR_CODE,
        PD_TMS_PO_PKT: OrderDetailsThree[i].PD_TMS_PO_PKT,
        PD_UN_NBR: OrderDetailsThree[i].PD_UN_NBR,
        PD_COMMODITY_CODE: OrderDetailsThree[i].PD_COMMODITY_CODE,
        PD_PROD_SCHED_REF_NBR: OrderDetailsThree[i].PD_PROD_SCHED_REF_NBR,
        PD_IS_HAZMAT_FLAG: OrderDetailsThree[i].PD_IS_HAZMAT_FLAG,
        PD_EXP_INFO_CODE: OrderDetailsThree[i].PD_EXP_INFO_CODE,
        PD_CUST_PO_LINE_NBR: OrderDetailsThree[i].PD_CUST_PO_LINE_NBR
      };
      detailsList3.push(details3);
    }
    var requestBody = {
      EXTRACTDATE: OrderData.EXTRACTDATE,
      CUSTOMER_ID: OrderData.CUSTOMER_ID,
      PH_CREATE_DATE_TIME: OrderData.PH_CREATE_DATE_TIME,
      PKT_STATUS: OrderData.PKT_STATUS,
      PH_PKT_CTRL_NBR: OrderData.PH_PKT_CTRL_NBR,
      PH_PKT_NBR: OrderData.PH_PKT_NBR,
      PH_PKT_SFX: OrderData.PH_PKT_SFX,
      PH_ORD_NBR: OrderData.PH_ORD_NBR,
      PH_ORD_SFX: OrderData.PH_ORD_SFX,
      PH_ORD_TYPE: OrderData.PH_ORD_TYPE,
      PH_SHIPTO: OrderData.PH_SHIPTO,
      PH_SHIPTO_NAME: OrderData.PH_SHIPTO_NAME,
      PH_SHIPTO_CONTACT: OrderData.PH_SHIPTO_CONTACT,
      PH_SHIPTO_ADDR_1: OrderData.PH_SHIPTO_ADDR_1,
      PH_SHIPTO_ADDR_2: OrderData.PH_SHIPTO_ADDR_2,
      PH_SHIPTO_ADDR_3: OrderData.PH_SHIPTO_ADDR_3,
      PH_SHIPTO_CITY: OrderData.PH_SHIPTO_CITY,
      PH_SHIPTO_STATE: OrderData.PH_SHIPTO_STATE,
      PH_SHIPTO_ZIP: OrderData.PH_SHIPTO_ZIP,
      PH_SHIPTO_CNTRY: OrderData.PH_SHIPTO_CNTRY,
      PH_SOLDTO: OrderData.PH_SOLDTO,
      PH_SOLDTO_NAME: OrderData.PH_SOLDTO_NAME,
      PH_SOLDTO_ADDR_1: OrderData.PH_SOLDTO_ADDR_1,
      PH_SOLDTO_ADDR_2: OrderData.PH_SOLDTO_ADDR_2,
      PH_SOLDTO_ADDR_3: OrderData.PH_SOLDTO_ADDR_3,
      PH_SOLDTO_CITY: OrderData.PH_SOLDTO_CITY,
      PH_SOLDTO_STATE: OrderData.PH_SOLDTO_STATE,
      PH_SOLDTO_ZIP: OrderData.PH_SOLDTO_ZIP,
      PH_SOLDTO_CNTRY: OrderData.PH_SOLDTO_CNTRY,
      PH_TEL_NBR: OrderData.PH_TEL_NBR,
      PH_DC_CTR_NBR: OrderData.PH_DC_CTR_NBR,
      PH_ACCT_RCVBL_CODE: OrderData.PH_ACCT_RCVBL_CODE,
      PH_CUST_PO_NBR: OrderData.PH_CUST_PO_NBR,
      PH_CUST_DEPT: OrderData.PH_CUST_DEPT,
      PH_PRO_NBR: OrderData.PH_PRO_NBR,
      PH_STORE_NBR: OrderData.PH_STORE_NBR,
      PH_MERCH_CODE: OrderData.PH_MERCH_CODE,
      PH_VENDOR_NBR: OrderData.PH_VENDOR_NBR,
      PH_ORIG_SHIP_VIA: OrderData.PH_ORIG_SHIP_VIA,
      PH_SHIP_VIA: OrderData.PH_SHIP_VIA,
      Orders_details_oneList: detailsList1,
      Orders_details_twoList: detailsList2,
      Orders_details_threeList: detailsList3
    };
    var res = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.Orders", requestBody, "47dd952b");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });