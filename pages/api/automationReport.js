export default async (req, res) => {
  try {
    const apiResponse = await fetch(
      "https://qa-ratecqrs-automation.freightify.io/automationReport"
    );
    const data = await apiResponse.json();

    // Set appropriate headers to allow CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Accept", "application/json");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
