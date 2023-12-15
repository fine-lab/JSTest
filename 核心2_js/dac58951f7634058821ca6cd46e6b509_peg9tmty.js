let AbstractAPIHandler = require("AbstractAPIHandler");
let change = false;
let asn_no = "";
let reality_detailList = [];
function nothing_convert(value, type) {
  if (value) return value;
  if (type == "string") return "";
  if (type == "number") return 0;
  if (type == "object") return {};
  if (type == "list") return [];
}
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取单号
    asn_no = nothing_convert(request.asn_no, "string");
    //获取预计产品
    let plan_detail_list = get_plan_detail_list();
    //获取实际信息
    let real_info_list = get_real_info_list();
    //获取实际产品
    let real_detail_list_temp = get_real_detail_list();
    let real_detail_list = [];
    //删除数据
    real_detail_list_temp.forEach((real_detail) => {
      let asn_di = nothing_convert(real_detail.asn_di, "string");
      if (asn_di != "") {
        let asn_batch_number = nothing_convert(real_detail.asn_batch_number, "string");
        let asn_date_manufacture = nothing_convert(real_detail.asn_date_manufacture, "string");
        let asn_term_validity = nothing_convert(real_detail.asn_term_validity, "string");
        let plan_detail_list_filter = plan_detail_list.filter(
          (plan_detail) =>
            plan_detail.asn_di == asn_di &&
            plan_detail.asn_batch_number == asn_batch_number &&
            plan_detail.asn_date_manufacture == asn_date_manufacture &&
            plan_detail.asn_term_validity == asn_term_validity
        );
        if (plan_detail_list_filter.length == 0) {
          let DI = nothing_convert(real_detail.DI, "string");
          if (DI == "") {
            reality_detailList.push({
              id: real_detail.id,
              _status: "Delete"
            });
          } else {
            real_detail.asn_di = "";
            real_detail.asn_batch_number = "";
            real_detail.asn_date_manufacture = "";
            real_detail.asn_term_validity = "";
            real_detail.asn_number = null;
            real_detail.is_match = real_detail.const_status == "1" ? real_detail.is_match : "0";
            real_detail.match_description = real_detail.const_status == "1" ? real_detail.match_description : "入库单无此产品";
            real_detail_list.push(real_detail);
            reality_detailList.push({
              id: real_detail.id,
              asn_di: real_detail.asn_di,
              asn_batch_number: real_detail.asn_batch_number,
              asn_date_manufacture: real_detail.asn_date_manufacture,
              asn_term_validity: real_detail.asn_term_validity,
              asn_number: real_detail.asn_number,
              is_match: real_detail.is_match,
              match_description: real_detail.match_description,
              _status: "Update"
            });
          }
          change = true;
        } else {
          real_detail_list.push(real_detail);
        }
      } else {
        real_detail_list.push(real_detail);
      }
    });
    plan_detail_list.forEach((plan_detail) => {
      //获取必要信息
      let asn_di = plan_detail.asn_di;
      let asn_batch_number = plan_detail.asn_batch_number;
      let asn_date_manufacture = plan_detail.asn_date_manufacture;
      let asn_term_validity = plan_detail.asn_term_validity;
      let asn_number = plan_detail.asn_number;
      //获取实际明细中预计与入库单一致的数据
      let real_plan_deteil = real_detail_list.filter((real_detail) => real_detail.asn_di == asn_di && real_detail.asn_batch_number == asn_batch_number);
      //实际明细中没有预计与入库单一致的数据
      if (real_plan_deteil.length == 0) {
        //获取实际明细中实际与入库单一致的数据
        let real_real_deteil = real_detail_list.filter((real_detail) => real_detail.DI == asn_di && real_detail.batch_number == asn_batch_number);
        //实际明细中没有实际与入库单一致的数据
        if (real_real_deteil.length == 0) {
          //新增无实际入库数据
          reality_detailList.push({
            asn_no: asn_no,
            asn_di: asn_di,
            asn_batch_number: asn_batch_number,
            asn_date_manufacture: asn_date_manufacture,
            asn_term_validity: asn_term_validity,
            asn_number: asn_number,
            const_status: "0",
            is_match: "0",
            match_description: "无实际入库信息",
            _status: "Insert"
          });
        } else {
          //实际明细中有实际与入库单一致的数据
          //获取实际必要信息
          let id = real_real_deteil[0].id;
          let production_date = real_real_deteil[0].production_date;
          let expiration_date = real_real_deteil[0].expiration_date;
          let quantity = real_real_deteil[0].quantity;
          let const_status = real_real_deteil[0].const_status;
          let is_match = real_real_deteil[0].is_match;
          let match_description = real_real_deteil[0].match_description;
          //设置判断结果
          if (const_status == "0") {
            if ((asn_date_manufacture == "" || production_date == "" || asn_date_manufacture == production_date) && asn_term_validity == expiration_date && asn_number == quantity) {
              is_match = "1";
              match_description = "";
            } else {
              is_match = "0";
              match_description = "信息不一致";
            }
          }
          reality_detailList.push({
            id: id,
            asn_di: asn_di,
            asn_batch_number: asn_batch_number,
            asn_date_manufacture: asn_date_manufacture,
            asn_term_validity: asn_term_validity,
            asn_number: asn_number,
            is_match: is_match,
            match_description: match_description,
            _status: "Update"
          });
        }
        change = true;
      } else {
        //实际明细中有预计与入库单一致的数据
        //获取预计必要信息
        let asn_date_manufacture_old = real_plan_deteil[0].asn_date_manufacture;
        let asn_term_validity_old = real_plan_deteil[0].asn_term_validity;
        let asn_number_old = real_plan_deteil[0].asn_number;
        let const_status = real_plan_deteil[0].const_status;
        //判断是否变化
        if (asn_date_manufacture_old != asn_date_manufacture || asn_term_validity_old != asn_term_validity || asn_number_old != asn_number) {
          //获取实际必要信息
          let id = real_plan_deteil[0].id;
          let DI = real_plan_deteil[0].DI;
          let batch_number = real_plan_deteil[0].batch_number;
          let production_date = real_plan_deteil[0].production_date;
          let expiration_date = real_plan_deteil[0].expiration_date;
          let quantity = real_plan_deteil[0].quantity;
          let is_match = real_plan_deteil[0].is_match;
          let match_description = real_plan_deteil[0].match_description;
          //设置判断结果
          if (const_status == "0") {
            if (DI == "" && batch_number == "" && production_date == "" && expiration_date == "" && quantity == 0) {
              is_match = "0";
              match_description = "无实际入库信息";
            } else {
              if ((asn_date_manufacture == "" || production_date == "" || asn_date_manufacture == production_date) && asn_term_validity == expiration_date && asn_number == quantity) {
                is_match = "1";
                match_description = "";
              } else {
                is_match = "0";
                match_description = "信息不一致";
              }
            }
          }
          reality_detailList.push({
            id: id,
            asn_date_manufacture: asn_date_manufacture,
            asn_term_validity: asn_term_validity,
            asn_number: asn_number,
            is_match: is_match,
            match_description: match_description,
            _status: "Update"
          });
          change = true;
        }
      }
    });
    if (change) {
      ObjectStore.updateById(
        "AT161E5DFA09D00001.AT161E5DFA09D00001.reality_warehousing_information",
        {
          id: real_info_list[0].id,
          is_match: "0",
          reality_warehousing_detailList: reality_detailList,
          _status: "Update"
        },
        "ybc46f4bf8"
      );
      let reality_warehousing_detailList = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.reality_warehousing_detail", { asn_no: asn_no });
      let reality_warehousing = reality_warehousing_detailList.filter((reality_warehousing_detail) => reality_warehousing_detail.is_match == "0");
      if (reality_warehousing.length == 0) {
        ObjectStore.updateById(
          "AT161E5DFA09D00001.AT161E5DFA09D00001.reality_warehousing_information",
          {
            id: real_info_list[0].id,
            is_match: "1",
            _status: "Update"
          },
          "ybc46f4bf8"
        );
      }
    }
    return { change: change };
  }
}
function get_plan_detail_list() {
  let product_lis = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis", { AdvanceArrivalNoticeNo: asn_no });
  if (product_lis.length == 0) {
    throw new Error("预到货单号不存在，请检查数据");
  }
  let plan_detail_list = [];
  product_lis.forEach((item) => {
    let asn_di = nothing_convert(item.di, "string");
    if (asn_di != "") {
      let asn_batch_number = nothing_convert(item.batch_number, "string");
      let asn_date_manufacture = nothing_convert(item.date_manufacture, "string");
      let asn_term_validity = nothing_convert(item.term_validity, "string");
      let asn_number = nothing_convert(item.quantity, "number");
      let index = plan_detail_list.findIndex((plan_detail) => {
        return (
          plan_detail.asn_di == asn_di &&
          plan_detail.asn_batch_number == asn_batch_number &&
          plan_detail.asn_date_manufacture == asn_date_manufacture &&
          plan_detail.asn_term_validity == asn_term_validity
        );
      });
      if (index !== -1) {
        plan_detail_list[index].asn_number += asn_number;
      } else {
        plan_detail_list.push({
          asn_di: asn_di,
          asn_batch_number: asn_batch_number,
          asn_date_manufacture: asn_date_manufacture,
          asn_term_validity: asn_term_validity,
          asn_number: asn_number
        });
      }
    }
  });
  if (plan_detail_list.length == 0) {
    throw new Error("预到货单下有效产品为空，请检查数据");
  }
  return plan_detail_list;
}
function get_real_info_list() {
  let real_info_list = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.reality_warehousing_information", { asn_no: asn_no });
  if (real_info_list.length == 0) {
    throw new Error("实际入库信息不存在,请检查数据");
  }
  return real_info_list;
}
function get_real_detail_list() {
  let real_detail_list = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.reality_warehousing_detail", { asn_no: asn_no });
  if (real_detail_list.length == 0) {
    throw new Error("实际入库信息不存在,请检查数据");
  }
  real_detail_list.forEach((real_detail) => {
    real_detail.asn_di = nothing_convert(real_detail.asn_di, "string");
    real_detail.asn_batch_number = nothing_convert(real_detail.asn_batch_number, "string");
    real_detail.asn_date_manufacture = nothing_convert(real_detail.asn_date_manufacture, "string");
    real_detail.asn_term_validity = nothing_convert(real_detail.asn_term_validity, "string");
    real_detail.asn_number = nothing_convert(real_detail.asn_number, "number");
    real_detail.DI = nothing_convert(real_detail.DI, "string");
    real_detail.batch_number = nothing_convert(real_detail.batch_number, "string");
    real_detail.production_date = nothing_convert(real_detail.production_date, "string");
    real_detail.expiration_date = nothing_convert(real_detail.expiration_date, "string");
    real_detail.quantity = nothing_convert(real_detail.quantity, "number");
  });
  return real_detail_list;
}
exports({ entryPoint: MyAPIHandler });