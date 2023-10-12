export const AutomationService = {
  async getAutomationResult() {
    const response = await fetch("/api/automationReport");
    const data = await response.json();
    return data;
  },

  async getJenkinsStatus() {
    const response = await fetch("/api/jenkinsStatus"); // Use the local API route
    const data = await response.json();
    return data;
  },

  async triggerJenkinsRequest(Branch, tags, report) {
    const myHeaders = new Headers();

    const formdata = new FormData();
    formdata.append("BRANCH", Branch.code);
    formdata.append("TAGS", tags);
    formdata.append("REPORT", report);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    return await fetch("/api/triggerJenkins", requestOptions);
  },
};
