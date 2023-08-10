export const AutomationService = {
    async getAutomationResult() {
        const response = await fetch('https://cqrs.freightbro.in/automationReport');
        const data = await response.json();
        return data;
      }
}