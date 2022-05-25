import { http } from "@/utils/request";


export function getAdminManagePage(datas) {
  return http.request({
    method: "post",
    url: "/manage/getAdminManagePage",
    data: datas
  });
}

export function addAndEditAdmin(datas) {
  return http.request({
    method: "post",
    url: "/manage/addAndEditAdmin",
    data: datas
  });
}

export function getAllRoles(datas) {
  return http.request({
    method: "post",
    url: "/manage/getAllRoles",
    data: datas
  });
}

export function resetGoogleKey(datas) {
  return http.request({
    method: "post",
    url: "/manage/resetGoogleKey",
    data: datas
  });
}

export function setWhiteIps(datas) {
  return http.request({
    method: "post",
    url: "/manage/setWhiteIps",
    data: datas
  });
}

export function updateStatus(datas) {
  return http.request({
    method: "post",
    url: "/manage/controlStatus",
    data: datas
  });
}







