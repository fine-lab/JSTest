let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let shippedDetails1 = new Array();
    let shippedDetails2 = new Array();
    let shippedDetails3 = new Array();
    let shippedDetails4 = new Array();
    // 主表
    let shippedData = request.Shipped;
    // 子表1
    let Shipped_details_one = request.Shipped.Shipped_details_one;
    for (var i = 0; i < Shipped_details_one.length; i++) {
      let details1 = {
        OPH_PRTY_CODE: Shipped_details_one[i].OPH_PRTY_CODE,
        OPH_PRTY_SFX: Shipped_details_one[i].OPH_PRTY_SFX,
        PH_TERR_CODE: Shipped_details_one[i].PH_TERR_CODE,
        OPH_MANG_TERR: Shipped_details_one[i].OPH_MANG_TERR,
        PH_SALE_GRP: Shipped_details_one[i].PH_SALE_GRP,
        PH_MARK_FOR: Shipped_details_one[i].PH_MARK_FOR,
        OPH_ORD_DATE: Shipped_details_one[i].OPH_ORD_DATE,
        OPH_START_SHIP_DATE: Shipped_details_one[i].OPH_START_SHIP_DATE,
        PH_STOP_SHIP_DATE: Shipped_details_one[i].PH_STOP_SHIP_DATE,
        PH_SCHED_DLVRY_DATE: Shipped_details_one[i].PH_SCHED_DLVRY_DATE,
        SHIP_DATE: Shipped_details_one[i].SHIP_DATE,
        PH_TERMS_DESC: Shipped_details_one[i].PH_TERMS_DESC,
        OPH_SHIP_W_CTRL_NBR: Shipped_details_one[i].OPH_SHIP_W_CTRL_NBR,
        OPH_SHPMT_NBR: Shipped_details_one[i].OPH_SHPMT_NBR,
        OPH_TOTAL_WT: Shipped_details_one[i].OPH_TOTAL_WT,
        OPH_TOTAL_NBR_OF_CARTON: Shipped_details_one[i].OPH_TOTAL_NBR_OF_CARTON,
        OPH_TOTAL_NBR_OF_PLT: Shipped_details_one[i].OPH_TOTAL_NBR_OF_PLT,
        PH_EST_VOL: Shipped_details_one[i].PH_EST_VOL,
        PH_TOTAL_DLRS_UNDISC: Shipped_details_one[i].PH_TOTAL_DLRS_UNDISC,
        PH_TOTAL_DLRS_DISC: Shipped_details_one[i].PH_TOTAL_DLRS_DISC,
        PH_BOL: Shipped_details_one[i].PH_BOL,
        OPH_PROD_VALUE: Shipped_details_one[i].OPH_PROD_VALUE,
        OPH_SHPNG_CHRG: Shipped_details_one[i].OPH_SHPNG_CHRG,
        PH_PACK_SLIP_TYPE: Shipped_details_one[i].PH_PACK_SLIP_TYPE,
        OPH_SPL_INSTR_CODE_1: Shipped_details_one[i].OPH_SPL_INSTR_CODE_1,
        OPH_SPL_INSTR_CODE_2: Shipped_details_one[i].OPH_SPL_INSTR_CODE_2,
        OPH_SPL_INSTR_CODE_3: Shipped_details_one[i].OPH_SPL_INSTR_CODE_3,
        OPH_SPL_INSTR_CODE_4: Shipped_details_one[i].OPH_SPL_INSTR_CODE_4,
        OPH_SPL_INSTR_CODE_5: Shipped_details_one[i].OPH_SPL_INSTR_CODE_5,
        OPH_SPL_INSTR_CODE_6: Shipped_details_one[i].OPH_SPL_INSTR_CODE_6,
        OPH_SPL_INSTR_CODE_7: Shipped_details_one[i].OPH_SPL_INSTR_CODE_7,
        OPH_SPL_INSTR_CODE_8: Shipped_details_one[i].OPH_SPL_INSTR_CODE_8,
        OPH_SPL_INSTR_CODE_9: Shipped_details_one[i].OPH_SPL_INSTR_CODE_9,
        OPH_SPL_INSTR_CODE_10: Shipped_details_one[i].OPH_SPL_INSTR_CODE_10,
        OPH_PLAN_SHPMT_NBR: Shipped_details_one[i].OPH_PLAN_SHPMT_NBR,
        OPH_PLAN_LOAD_NBR: Shipped_details_one[i].OPH_PLAN_LOAD_NBR,
        OPH_FREIGHT_TERMS: Shipped_details_one[i].OPH_FREIGHT_TERMS,
        PH_INCO_TERMS: Shipped_details_one[i].PH_INCO_TERMS,
        SC_CODE_DESC: Shipped_details_one[i].SC_CODE_DESC,
        PH_BILL_ACCT_NBR: Shipped_details_one[i].PH_BILL_ACCT_NBR
      };
      shippedDetails1.push(details1);
    }
    // 子表2
    let Shipped_details_two = request.Shipped.Shipped_details_two;
    for (var i = 0; i < Shipped_details_two.length; i++) {
      let details2 = {
        PH_FTSR_NBR: Shipped_details_two[i].PH_FTSR_NBR,
        PH_CUST_BROKER_ACCT_NBR: Shipped_details_two[i].PH_CUST_BROKER_ACCT_NBR,
        OPH_PLAN_BOL: Shipped_details_two[i].OPH_PLAN_BOL,
        OPH_PLAN_MASTER_BOL: Shipped_details_two[i].OPH_PLAN_MASTER_BOL,
        PH_INTL_GOODS_DESC: Shipped_details_two[i].PH_INTL_GOODS_DESC,
        PH_DUTY_AND_TAX: Shipped_details_two[i].PH_DUTY_AND_TAX,
        PH_PORT_OF_LOADING: Shipped_details_two[i].PH_PORT_OF_LOADING,
        PH_PORT_OF_DISCHARGE: Shipped_details_two[i].PH_PORT_OF_DISCHARGE,
        PH_PLAN_ID: Shipped_details_two[i].PH_PLAN_ID,
        PH_IS_HAZMAT_FLAG: Shipped_details_two[i].PH_IS_HAZMAT_FLAG,
        PH_TMS_PROC: Shipped_details_two[i].PH_TMS_PROC,
        PH_TMS_PO_FLAG: Shipped_details_two[i].PH_TMS_PO_FLAG,
        PH_LANG_ID: Shipped_details_two[i].PH_LANG_ID,
        PH_BUSN_UNIT_CODE: Shipped_details_two[i].PH_BUSN_UNIT_CODE,
        PH_FRT_CLASS: Shipped_details_two[i].PH_FRT_CLASS,
        PH_SHPR_ID: Shipped_details_two[i].PH_SHPR_ID,
        PH_DEST_AIRPORT: Shipped_details_two[i].PH_DEST_AIRPORT,
        PH_DEPART_AIRPORT: Shipped_details_two[i].PH_DEPART_AIRPORT,
        PH_CURR_CODE: Shipped_details_two[i].PH_CURR_CODE,
        PH_COMMODITY_CODE: Shipped_details_two[i].PH_COMMODITY_CODE,
        PH_UN_NBR: Shipped_details_two[i].PH_UN_NBR,
        PH_TMS_ORD_TYPE: Shipped_details_two[i].PH_TMS_ORD_TYPE,
        PH_PROD_SCHED_REF_NBR: Shipped_details_two[i].PH_PROD_SCHED_REF_NBR,
        PH_PLANNING_ORGN: Shipped_details_two[i].PH_PLANNING_ORGN,
        PH_PLANNING_DEST: Shipped_details_two[i].PH_PLANNING_DEST,
        PH_PRTY_TYPE: Shipped_details_two[i].PH_PRTY_TYPE,
        OPH_GLOBAL_LOCN_NBR: Shipped_details_two[i].OPH_GLOBAL_LOCN_NBR,
        PD_PKT_SEQ_NBR: Shipped_details_two[i].PD_PKT_SEQ_NBR,
        SKU: Shipped_details_two[i].SKU,
        IM_SKU_DESC: Shipped_details_two[i].IM_SKU_DESC,
        PD_INVN_TYPE: Shipped_details_two[i].PD_INVN_TYPE,
        PD_PROD_STAT: Shipped_details_two[i].PD_PROD_STAT,
        PD_BATCH_NBR: Shipped_details_two[i].PD_BATCH_NBR,
        PD_SKU_ATTR_1: Shipped_details_two[i].PD_SKU_ATTR_1,
        PD_SKU_ATTR_2: Shipped_details_two[i].PD_SKU_ATTR_2,
        PD_SKU_ATTR_3: Shipped_details_two[i].PD_SKU_ATTR_3,
        PD_SKU_ATTR_4: Shipped_details_two[i].PD_SKU_ATTR_4,
        PD_SKU_ATTR_5: Shipped_details_two[i].PD_SKU_ATTR_5,
        PD_CNTRY_OF_ORGN: Shipped_details_two[i].PD_CNTRY_OF_ORGN,
        PD_ORIG_ORD_LINE_NBR: Shipped_details_two[i].PD_ORIG_ORD_LINE_NBR
      };
      shippedDetails2.push(details2);
    }
    // 子表3
    let Shipped_details_three = request.Shipped.Shipped_details_three;
    for (var i = 0; i < Shipped_details_three.length; i++) {
      let details3 = {
        PD_ORIG_PKT_LINE_NBR: Shipped_details_three[i].PD_ORIG_PKT_LINE_NBR,
        PD_ORIG_ORD_QTY: Shipped_details_three[i].PD_ORIG_ORD_QTY,
        PD_ORIG_PKT_QTY: Shipped_details_three[i].PD_ORIG_PKT_QTY,
        OPD_SHPD_QTY: Shipped_details_three[i].OPD_SHPD_QTY,
        PD_PKT_QTY: Shipped_details_three[i].PD_PKT_QTY,
        PD_BACK_ORD_QTY: Shipped_details_three[i].PD_BACK_ORD_QTY,
        PD_CANCEL_QTY: Shipped_details_three[i].PD_CANCEL_QTY,
        IM_STD_PACK_QTY: Shipped_details_three[i].IM_STD_PACK_QTY,
        IM_STD_CASE_QTY: Shipped_details_three[i].IM_STD_CASE_QTY,
        OPD_UNIT_WT: Shipped_details_three[i].OPD_UNIT_WT,
        OPD_UNIT_VOL: Shipped_details_three[i].OPD_UNIT_VOL,
        PD_PO_NBR: Shipped_details_three[i].PD_PO_NBR,
        PD_CUST_SKU: Shipped_details_three[i].PD_CUST_SKU,
        PD_ASSORT_NBR: Shipped_details_three[i].PD_ASSORT_NBR,
        PD_PRICE: Shipped_details_three[i].PD_PRICE,
        PD_RETAIL_PRICE: Shipped_details_three[i].PD_RETAIL_PRICE,
        PD_CUSTOM_TAG: Shipped_details_three[i].PD_CUSTOM_TAG,
        PD_SHELF_DAYS: Shipped_details_three[i].PD_SHELF_DAYS,
        PD_SPL_INSTR_CODE_1: Shipped_details_three[i].PD_SPL_INSTR_CODE_1,
        PD_SPL_INSTR_CODE_2: Shipped_details_three[i].PD_SPL_INSTR_CODE_2,
        PD_SPL_INSTR_CODE_3: Shipped_details_three[i].PD_SPL_INSTR_CODE_3,
        PD_SPL_INSTR_CODE_4: Shipped_details_three[i].PD_SPL_INSTR_CODE_4,
        PD_SPL_INSTR_CODE_5: Shipped_details_three[i].PD_SPL_INSTR_CODE_5,
        PD_TMS_PO_SEQ: Shipped_details_three[i].PD_TMS_PO_SEQ,
        PD_REF_FIELD_1: Shipped_details_three[i].PD_REF_FIELD_1,
        PD_REF_FIELD_2: Shipped_details_three[i].PD_REF_FIELD_2,
        PD_REF_FIELD_3: Shipped_details_three[i].PD_REF_FIELD_3,
        PD_CURR_CODE: Shipped_details_three[i].PD_CURR_CODE,
        PD_TMS_PO_PKT: Shipped_details_three[i].PD_TMS_PO_PKT,
        PD_UN_NBR: Shipped_details_three[i].PD_UN_NBR,
        PD_COMMODITY_CODE: Shipped_details_three[i].PD_COMMODITY_CODE,
        PD_PROD_SCHED_REF_NBR: Shipped_details_three[i].PD_PROD_SCHED_REF_NBR,
        PD_IS_HAZMAT_FLAG: Shipped_details_three[i].PD_IS_HAZMAT_FLAG,
        PD_EXP_INFO_CODE: Shipped_details_three[i].PD_EXP_INFO_CODE,
        PD_CUST_PO_LINE_NBR: Shipped_details_three[i].PD_CUST_PO_LINE_NBR,
        OCH_CARTON_NBR: Shipped_details_three[i].OCH_CARTON_NBR,
        OCH_TRKG_NBR: Shipped_details_three[i].OCH_TRKG_NBR,
        OCH_CARTON_TYPE: Shipped_details_three[i].OCH_CARTON_TYPE,
        OCH_CARTON_SIZE: Shipped_details_three[i].OCH_CARTON_SIZE,
        OCH_EST_WT: Shipped_details_three[i].OCH_EST_WT
      };
      shippedDetails3.push(details3);
    }
    // 子表4
    let Shipped_details_four = request.Shipped.Shipped_details_four;
    for (var i = 0; i < Shipped_details_four.length; i++) {
      let details4 = {
        OCH_ACTL_WT: Shipped_details_four[i].OCH_ACTL_WT,
        OCH_TOTAL_QTY: Shipped_details_four[i].OCH_TOTAL_QTY,
        OCH_FRT_CHRG: Shipped_details_four[i].OCH_FRT_CHRG,
        OCH_CARTON_NBR_X_OF_Y: Shipped_details_four[i].OCH_CARTON_NBR_X_OF_Y,
        OCH_PLT_ID: Shipped_details_four[i].OCH_PLT_ID,
        OCH_SHPMT_NBR: Shipped_details_four[i].OCH_SHPMT_NBR,
        OCH_BOL: Shipped_details_four[i].OCH_BOL,
        OCH_TRLR_NBR: Shipped_details_four[i].OCH_TRLR_NBR,
        OCD_CARTON_SEQ_NBR: Shipped_details_four[i].OCD_CARTON_SEQ_NBR,
        OCD_PKT_SEQ_NBR: Shipped_details_four[i].OCD_PKT_SEQ_NBR,
        OCD_INVN_TYPE: Shipped_details_four[i].OCD_INVN_TYPE,
        OCD_CUST_SKU: Shipped_details_four[i].OCD_CUST_SKU,
        OCD_PROD_STAT: Shipped_details_four[i].OCD_PROD_STAT,
        OCD_BATCH_NBR: Shipped_details_four[i].OCD_BATCH_NBR,
        XPIRE_DATE: Shipped_details_four[i].XPIRE_DATE,
        OCD_SKU_ATTR_1: Shipped_details_four[i].OCD_SKU_ATTR_1,
        OCD_SKU_ATTR_2: Shipped_details_four[i].OCD_SKU_ATTR_2,
        OCD_SKU_ATTR_3: Shipped_details_four[i].OCD_SKU_ATTR_3,
        OCD_SKU_ATTR_4: Shipped_details_four[i].OCD_SKU_ATTR_4,
        OCD_SKU_ATTR_5: Shipped_details_four[i].OCD_SKU_ATTR_5,
        OCD_CNTRY_OF_ORGN: Shipped_details_four[i].OCD_CNTRY_OF_ORGN,
        OCD_UNITS_PAKD: Shipped_details_four[i].OCD_UNITS_PAKD,
        OCD_BUNDLES_PAKD: Shipped_details_four[i].OCD_BUNDLES_PAKD,
        OCD_ASSORT_NBR: Shipped_details_four[i].OCD_ASSORT_NBR,
        OCD_VENDOR_ID: Shipped_details_four[i].OCD_VENDOR_ID,
        OCD_VENDOR_ITEM_NBR: Shipped_details_four[i].OCD_VENDOR_ITEM_NBR,
        OCD_CONS_PRTY_DATE: Shipped_details_four[i].OCD_CONS_PRTY_DATE
      };
      shippedDetails4.push(details4);
    }
    var requestBody = {
      EXTRACTDATE: shippedData.EXTRACTDATE,
      CUSTOMER_ID: shippedData.CUSTOMER_ID,
      OPH_CREATE_DATE_TIME: shippedData.OPH_CREATE_DATE_TIME,
      PKT_STATUS: shippedData.PKT_STATUS,
      OPH_PKT_CTRL_NBR: shippedData.OPH_PKT_CTRL_NBR,
      OPH_PKT_NBR: shippedData.OPH_PKT_NBR,
      OPH_PKT_SFX: shippedData.OPH_PKT_SFX,
      OPH_ORD_NBR: shippedData.OPH_ORD_NBR,
      OPH_ORD_SFX: shippedData.OPH_ORD_SFX,
      OPH_ORD_TYPE: shippedData.OPH_ORD_TYPE,
      PH_SHIPTO: shippedData.PH_SHIPTO,
      PH_SHIPTO_NAME: shippedData.PH_SHIPTO_NAME,
      PH_SHIPTO_CONTACT: shippedData.PH_SHIPTO_CONTACT,
      PH_SHIPTO_ADDR_1: shippedData.PH_SHIPTO_ADDR_1,
      PH_SHIPTO_ADDR_2: shippedData.PH_SHIPTO_ADDR_2,
      PH_SHIPTO_ADDR_3: shippedData.PH_SHIPTO_ADDR_3,
      PH_SHIPTO_CITY: shippedData.PH_SHIPTO_CITY,
      PH_SHIPTO_STATE: shippedData.PH_SHIPTO_STATE,
      PH_SHIPTO_ZIP: shippedData.PH_SHIPTO_ZIP,
      PH_SHIPTO_CNTRY: shippedData.PH_SHIPTO_CNTRY,
      PH_SOLDTO: shippedData.PH_SOLDTO,
      PH_SOLDTO_NAME: shippedData.PH_SOLDTO_NAME,
      PH_SOLDTO_ADDR_1: shippedData.PH_SOLDTO_ADDR_1,
      PH_SOLDTO_ADDR_2: shippedData.PH_SOLDTO_ADDR_2,
      PH_SOLDTO_ADDR_3: shippedData.PH_SOLDTO_ADDR_3,
      PH_SOLDTO_CITY: shippedData.PH_SOLDTO_CITY,
      PH_SOLDTO_STATE: shippedData.PH_SOLDTO_STATE,
      PH_SOLDTO_ZIP: shippedData.PH_SOLDTO_ZIP,
      PH_SOLDTO_CNTRY: shippedData.PH_SOLDTO_CNTRY,
      PH_TEL_NBR: shippedData.PH_TEL_NBR,
      OPH_DC_CTR_NBR: shippedData.OPH_DC_CTR_NBR,
      PH_ACCT_RCVBL_CODE: shippedData.PH_ACCT_RCVBL_CODE,
      OPH_CUST_PO_NBR: shippedData.OPH_CUST_PO_NBR,
      OPH_CUST_DEPT: shippedData.OPH_CUST_DEPT,
      OPH_PRO_NBR: shippedData.OPH_PRO_NBR,
      OPH_STORE_NBR: shippedData.OPH_STORE_NBR,
      OPH_MERCH_CODE: shippedData.OPH_MERCH_CODE,
      OPH_VENDOR_NBR: shippedData.OPH_VENDOR_NBR,
      OPH_ORIG_SHIP_VIA: shippedData.OPH_ORIG_SHIP_VIA,
      OPH_SHIP_VIA: shippedData.OPH_SHIP_VIA,
      Shipped_details_oneList: shippedDetails1,
      Shipped_details_twoList: shippedDetails2,
      Shipped_details_threeList: shippedDetails3,
      Shipped_details_fourList: shippedDetails4
    };
    var res = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.Shipped", requestBody, "ec1e3d5f");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });