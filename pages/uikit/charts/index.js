import { Chart } from "primereact/chart";
import React, { useContext, useEffect, useState } from "react";
import { LayoutContext } from "../../../layout/context/layoutcontext";
import dataResults from "../../../public/demo/data/xyz.json";

const latestResult = dataResults[0];

const ChartDemo = () => {
  const [options, setOptions] = useState({});
  const [data, setChartData] = useState({});
  const { layoutConfig } = useContext(LayoutContext);

  useEffect(() => {
    const testNames = [];
    const passes = [];
    const failures = [];
    const pending = [];
    const skipped = [];

    for (let i = 0; i < 5; i++) {
      const item = dataResults[i];
      testNames.push(item.testName);
      passes.push(item.passes);
      failures.push(item.failures);
      pending.push(item.pending);
      skipped.push(item.skipped);
    }
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const barData = {
      labels: testNames,
      datasets: [
        {
          label: "Pass",
          backgroundColor: documentStyle.getPropertyValue("--green-500"),
          borderColor: documentStyle.getPropertyValue("--green-400"),
          data: passes,
        },
        {
          label: "Fail",
          backgroundColor: documentStyle.getPropertyValue("--red-500"),
          borderColor: documentStyle.getPropertyValue("--red-400"),
          data: failures,
        },
        {
          label: "Pending",
          backgroundColor: documentStyle.getPropertyValue("--orange-500"),
          borderColor: documentStyle.getPropertyValue("--orange-400"),
          data: pending,
        },
        {
          label: "Skip",
          backgroundColor: documentStyle.getPropertyValue("--gray-500"),
          borderColor: documentStyle.getPropertyValue("--gray-400"),
          data: skipped,
        },
      ],
    };

    const barOptions = {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: true,
            drawBorder: true,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    const pieData = {
      labels: ["Passed", "Failed", "Pending", "Skipped"],
      datasets: [
        {
          data: [
            latestResult.passes,
            latestResult.failures,
            latestResult.pending,
            latestResult.skipped,
          ],
          backgroundColor: [
            documentStyle.getPropertyValue("--green-500"),
            documentStyle.getPropertyValue("--red-500"),
            documentStyle.getPropertyValue("--orange-500"),
            documentStyle.getPropertyValue("--gray-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--red-400"),
            documentStyle.getPropertyValue("--orange-400"),
            documentStyle.getPropertyValue("--gray-400"),
          ],
        },
      ],
    };

    const pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };

    const lineData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue("--primary-500"),
          borderColor: documentStyle.getPropertyValue("--primary-500"),
          tension: 0.4,
        },
        {
          label: "Second Dataset",
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue("--primary-200"),
          borderColor: documentStyle.getPropertyValue("--primary-200"),
          tension: 0.4,
        },
      ],
    };

    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    const polarData = {
      datasets: [
        {
          data: [11, 16, 7, 3],
          backgroundColor: [
            documentStyle.getPropertyValue("--indigo-500"),
            documentStyle.getPropertyValue("--purple-500"),
            documentStyle.getPropertyValue("--teal-500"),
            documentStyle.getPropertyValue("--orange-500"),
          ],
          label: "My dataset",
        },
      ],
      labels: ["Indigo", "Purple", "Teal", "Orange"],
    };

    const polarOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    const radarData = {
      labels: [
        "Eating",
        "Drinking",
        "Sleeping",
        "Designing",
        "Coding",
        "Cycling",
        "Running",
      ],
      datasets: [
        {
          label: "My First dataset",
          borderColor: documentStyle.getPropertyValue("--indigo-400"),
          pointBackgroundColor: documentStyle.getPropertyValue("--indigo-400"),
          pointBorderColor: documentStyle.getPropertyValue("--indigo-400"),
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor: documentStyle.getPropertyValue("--indigo-400"),
          data: [65, 59, 90, 81, 56, 55, 40],
        },
        {
          label: "My Second dataset",
          borderColor: documentStyle.getPropertyValue("--purple-400"),
          pointBackgroundColor: documentStyle.getPropertyValue("--purple-400"),
          pointBorderColor: documentStyle.getPropertyValue("--purple-400"),
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor: documentStyle.getPropertyValue("--purple-400"),
          data: [28, 48, 40, 19, 96, 27, 100],
        },
      ],
    };

    const radarOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: textColorSecondary,
          },
        },
      },
    };

    setOptions({
      barOptions,
      pieOptions,
      lineOptions,
      polarOptions,
      radarOptions,
    });
    setChartData({
      barData,
      pieData,
      lineData,
      polarData,
      radarData,
    });
  }, [layoutConfig]);

  return (
    <div className="grid p-fluid">
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Linear Chart</h5>
          <Chart
            type="line"
            data={data.lineData}
            options={options.lineOptions}
          ></Chart>
        </div>
      </div>
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Bar Chart</h5>
          <Chart
            type="bar"
            data={data.barData}
            options={options.barOptions}
          ></Chart>
        </div>
      </div>
      <div className="col-12 xl:col-6">
        <div className="card flex flex-column align-items-center">
          <h5 className="text-left w-full">Pie Chart</h5>
          <Chart
            type="pie"
            data={data.pieData}
            options={options.pieOptions}
          ></Chart>
        </div>
      </div>
      <div className="col-12 xl:col-6">
        <div className="card flex flex-column align-items-center">
          <h5 className="text-left w-full">
            Recent Execution Results - {latestResult.testName} | Total TC -{" "}
            {latestResult.tests}
          </h5>
          <Chart
            type="doughnut"
            data={data.pieData}
            options={options.pieOptions}
          ></Chart>
        </div>
      </div>
      <div className="col-12 xl:col-6">
        <div className="card flex flex-column align-items-center">
          <h5 className="text-left w-full">Polar Area Chart</h5>
          <Chart
            type="polarArea"
            data={data.polarData}
            options={options.polarOptions}
          ></Chart>
        </div>
      </div>
      <div className="col-12 xl:col-6">
        <div className="card flex flex-column align-items-center">
          <h5 className="text-left w-full">Radar Chart</h5>
          <Chart
            type="radar"
            data={data.radarData}
            options={options.radarOptions}
          ></Chart>
        </div>
      </div>
    </div>
  );
};

export default ChartDemo;
