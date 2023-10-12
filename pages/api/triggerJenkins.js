// pages/api/jenkins.js
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const jenkinsToken = encodeURIComponent("fb_e2e_qa_!@#$");
      const jenkinsUrl = `https://jenkins.freightbro.in/job/fb_e2e_automation/buildWithParameters?token=${jenkinsToken}`;

      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Basic a2FscGFuYS5zQGZyZWlnaHRpZnkuY29tOjExOTY2YjBjOGFkYWUzM2FhYWViZDEyN2M1M2M2NzczZDc="
      );
      myHeaders.append("Content-Type", "application/json");

      const requestBody = {
        BRANCH: req.body.BRANCH,
        TAGS: req.body.TAGS,
        REPORT: req.body.REPORT,
      };

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(requestBody),
        redirect: "follow",
      };

      const response = await fetch(jenkinsUrl, requestOptions);
      const data = await response.text();

      res.status(response.status).json({ data });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
