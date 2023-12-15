let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let lackList = [];
    let errorList = [];
    let selectedRows = request.selectedRows;
    selectedRows.forEach((selectedRow) => {
      let return_flg = false;
      let update_warehousing_subset_detailList = [];
      let id = selectedRow.id;
      let warehousingAcceptanceSheet = selectedRow.warehousingAcceptanceSheet;
      let AdvanceArrivalNoticeNo = selectedRow.AdvanceArrivalNoticeNo;
      let warehousing_subset_detailList = getDetailByMasterID(id);
      let product_lisList = getProductByAsnNo(warehousingAcceptanceSheet);
      //校验本次循环入库单明细是否有缺失
      product_lisList.forEach((product_lis) => {
        let filterList = warehousing_subset_detailList.filter(
          (warehousing_subset_detail) =>
            warehousing_subset_detail.product_code == product_lis.product_code &&
            warehousing_subset_detail.batch_number == product_lis.batch_number &&
            warehousing_subset_detail.date_manufacture == product_lis.date_manufacture &&
            warehousing_subset_detail.term_validity == product_lis.term_validity
        );
        if (filterList.length == 0) {
          return_flg = true;
          return;
        }
      });
      if (return_flg) {
        lackList.push(AdvanceArrivalNoticeNo);
        return;
      } else {
        warehousing_subset_detailList.forEach((warehousing_subset_detail) => {
          let memo = "";
          let filterList = product_lisList.filter(
            (product_lis) =>
              warehousing_subset_detail.product_code == product_lis.product_code &&
              warehousing_subset_detail.batch_number == product_lis.batch_number &&
              warehousing_subset_detail.date_manufacture == product_lis.date_manufacture &&
              warehousing_subset_detail.term_validity == product_lis.term_validity
          );
          if (filterList.length == 0) {
            memo = "产品在入库单中不存在";
          } else {
            if (warehousing_subset_detail.quantity != filterList[0].quantity) {
              memo = "入库数量与入库单不一致";
            }
          }
          let ids = warehousing_subset_detail.id.split(",");
          ids.forEach((id) => {
            update_warehousing_subset_detailList.push({ id: id, memo: memo, _status: "Update" });
          });
        });
        let index = update_warehousing_subset_detailList.findIndex((update_warehousing_subset_detail) => {
          return update_warehousing_subset_detail.memo != "";
        });
        let warehousing_subset_master = { id: id, warehousing_subset_detailList: update_warehousing_subset_detailList, _status: "Update" };
        if (index !== -1) {
          errorList.push(AdvanceArrivalNoticeNo);
        } else {
          warehousing_subset_master.check_status = "2";
          warehousing_subset_master.check_person = request.check_person;
          warehousing_subset_master.check_time = request.check_time;
        }
        ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.warehousing_subset_master", warehousing_subset_master, "warehousing_subset");
      }
    });
    if (lackList.length > 0 || errorList.length > 0) {
      let msg = "";
      if (lackList.length > 0) {
        msg += "产品入库验收数据子集内产品明细缺失（入库单号：" + lackList.join("，") + "）";
      }
      if (errorList.length > 0) {
        if (msg != "") {
          msg += "\n";
        }
        msg += "产品入库验收数据子集错误（入库单号：" + errorList.join("，") + "），错误内容请参照产品明细内备注栏";
      }
      return { msg: "校验失败：" + msg, type: "error" };
    } else {
      return { msg: "校验通过", type: "success" };
    }
  }
}
function nothing_convert(value, type) {
  if (value) return value;
  if (type == "string") return "";
  if (type == "number") return 0;
}
//根据入库单号获取入库单产品明细
function getProductByAsnNo(inputParam) {
  //初始化返回参数
  let outputParam = [];
  //查询数据
  let product_lisList = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis", { WarehousingAcceptanceSheet_id: inputParam });
  //整合数据
  product_lisList.forEach((product_lis) => {
    let product_code = nothing_convert(product_lis.product_code, "string"); //产品ID
    let batch_number = nothing_convert(product_lis.batch_number, "string");
    let date_manufacture = nothing_convert(product_lis.date_manufacture, "string");
    let term_validity = nothing_convert(product_lis.term_validity, "string");
    let quantity = nothing_convert(product_lis.quantity, "number");
    //根据条件查询下标
    let index = outputParam.findIndex((item) => {
      return item.product_code == product_code && item.batch_number == batch_number && item.date_manufacture == date_manufacture && item.term_validity == term_validity;
    });
    //已存在
    if (index !== -1) {
      outputParam[index].quantity += quantity;
    } else {
      outputParam.push({
        product_code: product_code,
        batch_number: batch_number,
        date_manufacture: date_manufacture,
        term_validity: term_validity,
        quantity: quantity
      });
    }
  });
  //返回结果
  return outputParam;
}
//根据主表ID获取明细
function getDetailByMasterID(inputParam) {
  //初始化返回参数
  let outputParam = [];
  //查询数据
  let warehousing_subset_detailList = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.warehousing_subset_detail", { warehousing_subset_master_id: inputParam });
  //整合数据
  warehousing_subset_detailList.forEach((warehousing_subset_detail) => {
    let id = nothing_convert(warehousing_subset_detail.id, "string");
    let product_code = nothing_convert(warehousing_subset_detail.product_code, "string"); //产品ID
    let batch_number = nothing_convert(warehousing_subset_detail.batch_number, "string");
    let date_manufacture = nothing_convert(warehousing_subset_detail.date_manufacture, "string");
    let term_validity = nothing_convert(warehousing_subset_detail.term_validity, "string");
    let quantity = nothing_convert(warehousing_subset_detail.quantity, "number");
    //根据条件查询下标
    let index = outputParam.findIndex((item) => {
      return item.product_code == product_code && item.batch_number == batch_number && item.date_manufacture == date_manufacture && item.term_validity == term_validity;
    });
    //已存在
    if (index !== -1) {
      outputParam[index].id += "," + id;
      outputParam[index].quantity += quantity;
    } else {
      outputParam.push({
        id: id,
        product_code: product_code,
        batch_number: batch_number,
        date_manufacture: date_manufacture,
        term_validity: term_validity,
        quantity: quantity
      });
    }
  });
  //返回结果
  return outputParam;
}
exports({ entryPoint: MyAPIHandler });