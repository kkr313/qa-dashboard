export const AutomationService = {
    async getAutomationResult() {
      // const response = await fetch('http://localhost:3000/api/automationReport');
      const response = await fetch('https://qadash.netlify.app/api/automationReport');
      const data = await response.json();
      return data;
      }
}
