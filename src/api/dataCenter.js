import { http } from "@/utils/request";



export function getChangeRecordPage(datas) {
  return http.request({
    method: "post",
    url: "/changeRecord/getChangeRecordPage",
    data: datas
  });
}
export function getAllPlatformRate(datas) {
  return http.request({
    method: "post",
    url: "/settingCenter/getAllPlatformRate",
    data: datas
  });
}



export function getOrderDetail(datas) {
  return http.request({
    method: "post",
    url: "/bet/order/detail",
    data: datas
  });
}
export function getRuleNameList(datas) {
  return http.request({
    method: "post",
    url: "/bet/order/game/ruleNameList",
    data: datas
  });
}

export function getRegisterList(datas) {
  return http.request({
    method: "post",
    url: "/bet/order/page",
    data: datas
  });
}
export function getShoeResultDetail(datas) {
  return http.request({
    method: "post",
    url: "/bet/order/shoeResult",
    data: datas
  });
}
export function getBetOrderStatisticsDetail(datas) {
  return http.request({
    method: "post",
    url: "/bet/order/betOrderStatistics",
    data: datas
  });
}


