export default {
    /**wallet connect project id */
    projectId: process.env.REACT_APP_PROJECT_ID || "",
    wwwDomain: process.env.REACT_APP_WWW || "",
    appDomain: process.env.REACT_APP_NAME || "",
    /** 判断是否为正式服 */
    isOnline: process.env.REACT_APP_ONLINE === "true",
}