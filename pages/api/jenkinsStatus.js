export default async (req, res) => {
  try {
    const apiUrl =
      "https://jenkins.freightbro.in/job/fb_e2e_automation/lastBuild/api/json#$";

    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Basic a2FscGFuYS5zQGZyZWlnaHRpZnkuY29tOjExOTY2YjBjOGFkYWUzM2FhYWViZDEyN2M1M2M2NzczZDc="
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      throw new Error("Jenkins API request failed");
    }

    const data = await response.json();

    // Set appropriate headers to allow CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
