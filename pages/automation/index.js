/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { LayoutContext } from "../../layout/context/layoutcontext";
import { AutomationService } from "../../demo/service/AutomationService";
import { FilterMatchMode, FilterOperator } from 'primereact/api';

function calculateTotal(data, key) {
  return data
    .map((report) => report[key])
    .reduce((total, value) => total + value, 0);
}

const Automation = () => {
  const [reportData, setReportData] = useState([]);
  const [options, setOptions] = useState({});
  const [data, setChartData] = useState({});
  const reversedReportData = [...reportData].reverse();
  const [dropdownValue, setDropdownValue] = useState('');
  const [filters, setFilters] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [allExpanded, setAllExpanded] = useState(false);
  const [globalFilterValue, setglobalFilterValue] = useState('');
  const { layoutConfig } = useContext(LayoutContext);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setglobalFilterValue(value);
  };

  const initfilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setglobalFilterValue("");
  };

  useEffect(() => {
    AutomationService.getAutomationResult()
      .then((data) => {
        setReportData(data);
        const reversedReportData = [...data].reverse();
        const initialDropdownValue = reversedReportData.length > 0 ? reversedReportData[0].testName : "";
        setDropdownValue(initialDropdownValue)

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
        const surfaceBorder =documentStyle.getPropertyValue("--surface-border");

        const latestExecutionData = data.slice(-1);
        const pieData = {
          labels: ["Passed", "Failed", "Pending", "Skipped"],
          datasets: [
            {
              data: [
                latestExecutionData[0].passes,
                latestExecutionData[0].failures,
                latestExecutionData[0].pending,
                latestExecutionData[0].skipped,
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

        const lastFiveExecutionData = data.slice(-5).reverse();
        const barData = {
          labels: lastFiveExecutionData.map((report) => report.testName),
          datasets: [
            {
              label: "Pass",
              backgroundColor: documentStyle.getPropertyValue("--green-500"),
              borderColor: documentStyle.getPropertyValue("--green-400"),
              data: lastFiveExecutionData.map((report) => report.passes),
            },
            {
              label: "Fail",
              backgroundColor: documentStyle.getPropertyValue("--red-500"),
              borderColor: documentStyle.getPropertyValue("--red-400"),
              data: lastFiveExecutionData.map((report) => report.failures),
            },
            {
              label: "Pending",
              backgroundColor: documentStyle.getPropertyValue("--orange-500"),
              borderColor: documentStyle.getPropertyValue("--orange-400"),
              data: lastFiveExecutionData.map((report) => report.pending),
            },
            {
              label: "Skip",
              backgroundColor: documentStyle.getPropertyValue("--gray-500"),
              borderColor: documentStyle.getPropertyValue("--gray-400"),
              data: lastFiveExecutionData.map((report) => report.skipped),
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

        setChartData({
          pieData,
          barData,
        });

        setOptions({
          pieOptions,
          barOptions,
        });
      })
      .catch((error) => console.error(error));

    initfilters();
  }, [layoutConfig]);
  
  const latestResult = reportData.slice(-1);
  const totalExecution = reportData.length;
  const totalSuites = calculateTotal(reportData, "suites");
  const totalTests = calculateTotal(reportData, "tests");
  const totalPasses = calculateTotal(reportData, "passes");
  const totalPending = calculateTotal(reportData, "pending");
  const totalFailures = calculateTotal(reportData, "failures");
  const totalSkipped = calculateTotal(reportData, "skipped");

  const masterData = [
    {
      title: "Total Executions",
      value: totalExecution,
      icon: "pi-clone",
    },
    {
      title: "Total Suits Run",
      value: totalSuites,
      icon: "pi-table",
    },
    {
      title: "Total Test Cases",
      value: totalTests,
      icon: "pi-align-left",
    },
    {
      title: "Passed",
      value: totalPasses,
      icon: "pi-check-circle",
    },
    {
      title: "Failed",
      value: totalFailures,
      icon: "pi-times-circle",
    },
    {
      title: "Pending",
      value: totalPending,
      icon: "pi-ban",
    },
    {
      title: "Skipped",
      value: totalSkipped,
      icon: "pi-minus-circle",
    },
  ];

  const statusOrderBodyTemplate = (rowData) => {
    const statusClassName =
      rowData.state === "passed"
        ? "delivered"
        : rowData.state === "failed"
        ? "cancelled"
        : rowData.state === "pending"
        ? "pending"
        : rowData.state === "skipped"
        ? "returned"
        : "";

    return (
      <div className="test-row">
        <span className={`order-badge order-${statusClassName}`}>
          {rowData.state}
        </span>
      </div>
    );
  };
  
  const statusRow = (rowData) => {
      const { passes, pending, failures, skipped } = rowData;
      const total = (passes + pending + failures + skipped)

      return (
        <div className="progress-bar">
          <div className="progress-bar-text">
            <span style={{color:'green', fontWeight: 'bold'}}>{passes} Passed</span> / <span style={{color:'red', fontWeight: 'bold'}}>{failures} Failed</span> / <span style={{color:'orange', fontWeight: 'bold'}}>{pending} Pending</span> / <span style={{color:'gray', fontWeight: 'bold'}}>{skipped} Skipped</span>
          </div>
        </div>
      );
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="orders-subtable">
      {data.results.map((testCase, index) => (
        <div key={index} className="test-case">
          <h5 style={{marginTop : '1.5rem', marginBottom : '.5rem'}}>
          Results of <b>'{testCase.file.split('/').pop()}'</b>
          </h5>
          <DataTable value={testCase.tests} responsiveLayout="scroll">
            <Column field="title" header="Title" sortable></Column>
            <Column field="fullTitle" header="Full Title" sortable></Column>
            <Column field="state" header="Status" body={statusOrderBodyTemplate} sortable></Column>
            <Column field="duration" header="Duration(ms)" sortable></Column>
          </DataTable>
        </div>
      ))}
    </div>
    );
  };

  const toggleAll = () => {
    if (allExpanded) collapseAll();
    else expandAll();
  };

  const expandAll = () => {
    let _expandedRows = {};
    reportData.forEach((p) => (_expandedRows[`${p._id}`] = true));
    setExpandedRows(_expandedRows);
    setAllExpanded(true);
  };

  const collapseAll = () => {
    setExpandedRows(null);
    setAllExpanded(false);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          icon={allExpanded ? "pi pi-minus" : "pi pi-plus"}
          label={allExpanded ? "Collapse All" : "Expand All"}
          onClick={toggleAll}
          className="w-11rem"
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const headerSection = renderHeader();
 
  return (
    <div className="surface-ground px-4 py-5 md:px-6 lg:px-8">
      <div className="grid card">
        <div className="col-12 md:col-6 lg:col-4">
          <div className="surface-card shadow-2 p-3 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block mb-3 mt-1 mb-0 text-600 text-xl">
                  {masterData[0].title}
                </span>
                <div className="text-3xl text-900 font-bold">
                  {masterData[0].value}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: "3rem", height: "3rem" }}
              >
                <i
                  className={`pi ${masterData[0].icon} text-blue-500 text-xl`}
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-4">
          <div className="surface-card shadow-2 p-3 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block mb-3 mt-1 mb-0 text-600 text-xl">
                  {masterData[1].title}
                </span>
                <div className="text-3xl text-900 font-bold">
                  {masterData[1].value}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i
                  className={`pi ${masterData[1].icon} text-blue-500 text-xl`}
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-4">
          <div className="surface-card shadow-2 p-3 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block mb-3 mt-1 mb-0 text-600 text-xl">
                  {masterData[2].title}
                </span>
                <div className="text-3xl text-900 font-bold">
                  {masterData[2].value}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i
                  className={`pi ${masterData[2].icon} text-blue-500 text-xl`}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-card shadow-2 p-3 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">
                  {masterData[3].title}
                </span>
                <div className="text-900 font-medium text-xl">
                  {masterData[3].value}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-green-600 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i
                  className={`pi ${masterData[3].icon} text-indigo-900 text-xl`}
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-card shadow-2 p-3 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">
                  {masterData[4].title}
                </span>
                <div className="text-900 font-medium text-xl">
                  {masterData[4].value}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-red-600 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i
                  className={`pi ${masterData[4].icon} text-indigo-900 text-xl`}
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-card shadow-2 p-3 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">
                  {masterData[5].title}
                </span>
                <div className="text-900 font-medium text-xl">
                  {masterData[5].value}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-orange-300 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i
                  className={`pi ${masterData[5].icon} text-indigo-900 text-xl`}
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-card shadow-2 p-3 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">
                  {masterData[6].title}
                </span>
                <div className="text-900 font-medium text-xl">
                  {masterData[6].value}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-gray-600 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i
                  className={`pi ${masterData[6].icon} text-indigo-900 text-xl`}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="p-divider p-component p-divider-horizontal p-divider-solid p-divider-center"
        role="separator"
      >
        <div className="p-divider-content"></div>
      </div>

      <div className="grid p-fluid">
        <div className="col-12 xl:col-6">
          <div
            className="card flex flex-column align-items-center"
            style={{ height: "100%" }}
          >
            <h5 className="text-left w-full">
              Recent Execution Results -{" "}
              <strong>
                "
                {latestResult.length > 0
                  ? latestResult[0].testName
                  : "Loading..."}
                "
              </strong>{" "}
              | Total TC -{" "}
              <strong>
                {latestResult.length > 0 ? latestResult[0].tests : "Loading..."}
              </strong>
            </h5>
            <Chart
              type="doughnut"
              data={data.pieData}
              options={options.pieOptions}
            ></Chart>
          </div>
        </div>

        <div className="col-12 xl:col-6">
          <div className="card" style={{ height: "100%" }}>
            <h5 style={{ marginBottom: "8%" }}>Last 5 Execution Result</h5>
            <Chart
              style={{ height: "100%" }}
              type="bar"
              data={data.barData}
              options={options.barOptions}
            ></Chart>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div
            className="flex justify-content-between"
            style={{ marginBottom: "10px" }}
          >
            <h5>Detailed View</h5>
            <Dropdown
              value={dropdownValue}
              onChange={(e) => setDropdownValue(e.value)}
              options={reversedReportData.map((result) => ({
                label: result.testName,
                value: result.testName,
              }))}
              optionLabel="value"
              placeholder="Select Test Name"
              style={{ width: "30%" }}
            />
          </div>
          {dropdownValue && ( // Display DataTable only if a test name is selected
            <DataTable
              value={reportData.filter(
                (result) => result.testName === dropdownValue
              )}
              paginator
              className="p-datatable-gridlines"
              showGridlines
              rows={5}
              dataKey="_id" // Change to the appropriate data key for your report data
              filters={filters}
              filterDisplay="menu"
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              responsiveLayout="scroll"
              rowExpansionTemplate={rowExpansionTemplate}
              header={headerSection}
            >
              <Column expander style={{ width: "3em" }} />
              <Column field="testName" header="Name" />
              <Column field="suites" header="Suites" />
              <Column field="tests" header="Tests" />
              <Column header="Results" body={statusRow} />
            </DataTable>
          )}
        </div>
      </div>
    </div>
  );
};

export default Automation;
