export const ResultService = {
  async getAutomationResult() {
      const response = await fetch('https://cqrs.freightbro.in/automationReport');
      const data = await response.json();
      return data;
    },

  // async getSmapleResult() {
  //   var requestOptions = {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "apikey": "45af32de-8044-40a5-98da-d286579b1c6b",
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Methods": "GET",
  //     },
  //     redirect: "follow",
  //   };

  //   await fetch("https://cqrs.freightbro.in/automationReport", requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log("error", error));
  //   return data;
  // },
};
