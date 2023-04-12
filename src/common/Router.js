import { siteRoot } from "../infrastructure/SAL.js";

export function setUrlParam(param, newval) {
  const search = window.location.search;
  //var urlParams = new URLSearchParams(queryString);

  const regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
  const query = search.replace(regex, "$1").replace(/&$/, "");

  const urlParams =
    (query.length > 2 ? query + "&" : "?") +
    (newval ? param + "=" + newval : "");

  window.history.pushState({}, "", urlParams.toString());
}

export function getUrlParam(param) {
  const results = new RegExp("[?&]" + param + "=([^&#]*)").exec(
    window.location.href
  );
  if (results == null) {
    return null;
  } else {
    return decodeURI(results[1]) || 0;
  }
}

export const appRoot = siteRoot;
