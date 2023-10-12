/* eslint-disable react/no-unescaped-entities */
import React, { useRef, useContext, useEffect, useState } from "react";
import { ClipLoader, BarLoader } from "react-spinners";
import { DataTable } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { LayoutContext } from "../../layout/context/layoutcontext";
import { AutomationService } from "../../demo/service/AutomationService";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dialog } from "primereact/dialog";
import styles from "./index.module.scss";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Chip } from "primereact/chip";
import { Paginator } from "primereact/paginator";

function calculateTotal(data, key) {
  return data
    .map((report) => report[key])
    .reduce((total, value) => total + value, 0);
}

const Automation = () => {
  const [reportData, setReportData] = useState([]);
  const [options, setOptions] = useState({});
  const [data, setChartData] = useState({});
  const reversedReportData = Array.isArray(reportData)
    ? [...reportData].reverse()
    : null;
  const [dropdownValue, setDropdownValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [allExpanded, setAllExpanded] = useState(false);
  const [globalFilterValue, setglobalFilterValue] = useState("");
  const { layoutConfig } = useContext(LayoutContext);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedErrorMessage, setSelectedErrorMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [Branch, setBranch] = useState(null);
  const [tags, setTags] = useState("");
  const [report, setReport] = useState("");
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [JenkinStatusData, setJenkinStatusData] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const statuses = ["passed", "failed", "pending", "skipped"];
  const branch = [
    { name: "qa", code: "qa" },
    { name: "sit", code: "sit" },
    { name: "master", code: "master" },
  ];

  const openStatusDialog = () => {
    setDialogOpen(true);
  };

  const closeStatusDialog = () => {
    setDialogOpen(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const triggerJenkins = async (event) => {
    event.preventDefault();

    if (!Branch || !tags || !report) {
      showWarn();
    } else {
      setLoading(true);

      try {
        const response = await fetch("/api/triggerJenkins", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            BRANCH: Branch.code,
            TAGS: tags,
            REPORT: report,
          }),
        });

        if (response.status === 201) {
          const result = await response.json();
          console.log(result.data);
          setBranch(null);
          setTags("");
          setReport("");
          closeDialog();
          showSuccess();
        } else {
          console.error("Failed to trigger Jenkins:", response.statusText);
          showError();
        }
      } catch (error) {
        console.error("Error:", error);
        showError();
      } finally {
        setLoading(false);
      }
    }
  };

  const showSuccess = () => {
    toast.current?.show({
      severity: "success",
      summary: "Success Message",
      detail: "Job Successfully Created",
      life: 3000,
    });
  };

  const showWarn = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Warn Message",
      detail: "Please Provide all Inputs..!",
      life: 3000,
    });
  };

  const showError = () => {
    toast.current?.show({
      severity: "error",
      summary: "Error Message",
      detail: "Something Went Wrong!",
      life: 3000,
    });
  };

  const showErrorMessageDialog = (errorMessage) => {
    setSelectedErrorMessage(errorMessage);
    setDialogVisible(true);
  };
  const statusFilterTemplate = function (options) {
    return React.createElement(Dropdown, {
      value: options.value,
      options: statuses,
      onChange: function (e) {
        return options.filterCallback(e.value, options.index);
      },
      itemTemplate: statusItemTemplate,
      placeholder: "Select a Status",
      className: "p-column-filter",
      showClear: true,
    });
  };

  const statusItemTemplate = function (option) {
    return React.createElement(
      "span",
      { className: "customer-badge status-" + option },
      option
    );
  };

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
    AutomationService.getAutomationResult().then((data) => {
      setReportData(data);
      const reversedReportData = [...data].reverse();
      const initialDropdownValue =
        reversedReportData.length > 0 ? reversedReportData[0].testName : "";
      setDropdownValue(initialDropdownValue);

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");
      const textColorSecondary = documentStyle.getPropertyValue(
        "--text-color-secondary"
      );
      const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

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
    });
    // .catch((error) => console.error(error));

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
    const total = passes + pending + failures + skipped;

    return (
      <div className="progress-bar">
        <div className="progress-bar-text">
          <span style={{ color: "green", fontWeight: "bold" }}>
            {passes} Passed
          </span>{" "}
          /{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>
            {failures} Failed
          </span>{" "}
          /{" "}
          <span style={{ color: "orange", fontWeight: "bold" }}>
            {pending} Pending
          </span>{" "}
          /{" "}
          <span style={{ color: "gray", fontWeight: "bold" }}>
            {skipped} Skipped
          </span>
        </div>
      </div>
    );
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="orders-subtable">
        <Accordion activeIndex={null}>
          {data.results.slice(first, first + rows).map((testCase, index) => (
            <AccordionTab
              key={index}
              header={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  Results of '{testCase.file.split("cypress/integration/")[1]}'
                  →
                  <span style={{ fontSize: ".7rem", marginLeft: "5px" }}>
                    <span style={{ color: "black" }}>
                      Total Tests: {testCase.tests.length}
                    </span>{" "}
                    (
                    <span>
                      <span style={{ color: "green" }}>
                        {
                          testCase.tests.filter(
                            (test) => test.state === "passed"
                          ).length
                        }{" "}
                        Passed
                      </span>{" "}
                      /{" "}
                      <span style={{ color: "red" }}>
                        {
                          testCase.tests.filter(
                            (test) => test.state === "failed"
                          ).length
                        }{" "}
                        Failed
                      </span>{" "}
                      /{" "}
                      <span style={{ color: "orange" }}>
                        {
                          testCase.tests.filter(
                            (test) => test.state === "pending"
                          ).length
                        }{" "}
                        Pending
                      </span>{" "}
                      /{" "}
                      <span style={{ color: "gray" }}>
                        {
                          testCase.tests.filter(
                            (test) => test.state === "skipped"
                          ).length
                        }{" "}
                        Skipped
                      </span>{" "}
                    </span>
                    )
                  </span>
                </div>
              }
            >
              <DataTable value={testCase.tests} responsiveLayout="scroll">
                <Column
                  field="title"
                  header="Title"
                  filter
                  style={{ minWidth: "10rem" }}
                ></Column>
                <Column field="fullTitle" header="Full Title" sortable></Column>
                <Column
                  field="state"
                  header="Status"
                  body={statusOrderBodyTemplate}
                  filterMenuStyle={{ width: "14rem" }}
                  style={{ minWidth: "12rem" }}
                  filter
                  filterElement={statusFilterTemplate}
                ></Column>
                <Column
                  field="duration"
                  header="Duration(ms)"
                  sortable
                ></Column>
                <Column
                  field="err.message"
                  header="Logs"
                  body={(rowData) =>
                    rowData.err ? (
                      <Button
                        aria-label="Show"
                        type="button"
                        className="p-button p-component"
                        onClick={() => {
                          showErrorMessageDialog(rowData.err.message); // Pass the error message to the dialog function
                        }}
                      >
                        <span className="p-button-icon p-c p-button-icon-left pi pi-external-link"></span>
                        <span className="p-button-label p-c">Show</span>
                        <span role="presentation" className="p-ink"></span>
                      </Button>
                    ) : null
                  }
                />
              </DataTable>
              <Dialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                header="Error Logs"
                modal
                style={{ width: "60vw" }}
              >
                <p>{selectedErrorMessage}</p>
              </Dialog>
            </AccordionTab>
          ))}
        </Accordion>
        <Paginator
          first={first}
          rows={rows}
          totalRecords={data.results.length}
          onPageChange={onPageChange}
        />
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
      <div>
        <div
          className="flex items-center mb-4"
          style={{ justifyContent: "space-between" }}
        >
          <div></div>
          <Toast ref={toast} />
          <div>
            <Button
              aria-label="Show"
              type="button"
              className="p-button p-component"
              onClick={openDialog}
              style={{ marginRight: "10px" }}
            >
              <span className="p-button-icon p-c p-button-icon-left pi pi-external-link"></span>
              <span className="p-button-label p-c">Trigger Jenkins Job</span>
            </Button>

            <Button
              aria-label="Show"
              type="button"
              className="p-button p-component"
              onClick={() => {
                AutomationService.getJenkinsStatus()
                  .then((data) => {
                    setJenkinStatusData(data);
                    setTimeout(() => {
                      openStatusDialog();
                    }, 500);
                  })
                  // .catch((error) => console.error(error))
                  .finally(() => {
                    setLoading(false);
                  });
              }}
            >
              <span className="p-button-icon p-c p-button-icon-left pi pi-external-link"></span>
              <span className="p-button-label p-c">Track Job Status</span>
            </Button>
          </div>
        </div>

        <Dialog
          header="Jenkins Running Job Status"
          visible={dialogOpen}
          style={{ width: "50vw" }}
          onHide={closeStatusDialog}
        >
          {JenkinStatusData.building ? (
            <>
              <p>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  {JenkinStatusData.displayName}
                </span>
                : Job is currently running. You can track its progress{" "}
                <a
                  href={JenkinStatusData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <button
                      style={{
                        padding: "4px 8px",
                        fontSize: "14px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "20px",
                      }}
                    >
                      Track
                    </button>
                    <BarLoader color="#428bca" />
                  </span>
                </a>
              </p>

              <p>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  {JenkinStatusData.previousBuild.number}
                </span>
                : Track your previous build status, You can track{" "}
                <a
                  href={JenkinStatusData.previousBuild.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    style={{
                      padding: "4px 8px",
                      fontSize: "14px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Track
                  </button>
                </a>
              </p>
            </>
          ) : (
            <p>There are no jobs currently running.</p>
          )}
        </Dialog>

        <Dialog
          header="Trigger Jenkins Jobs"
          visible={isDialogOpen}
          onHide={closeDialog}
          modal
          style={{ width: "40vw" }}
        >
          <form onSubmit={triggerJenkins} disabled={loading}>
            <div className="grid p-fluid mt-3">
              <div className="field col-12 md:col-4">
                <span className="p-float-label">
                  <Dropdown
                    id="dropdown"
                    options={branch}
                    value={Branch}
                    onChange={(e) => {
                      setBranch(e.value);
                    }}
                    optionLabel="name"
                  ></Dropdown>
                  <label htmlFor="dropdown">Select Branch</label>
                </span>
              </div>
              <div className="field col-12 md:col-4">
                <span className="p-float-label">
                  <InputText
                    type="text"
                    id="inputtext"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <label htmlFor="inputtext">Tag Name</label>
                </span>
              </div>
              <div className="field col-12 md:col-4">
                <span className="p-float-label">
                  <InputText
                    type="text"
                    id="inputtext"
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                  />
                  <label htmlFor="inputtext">Report Name</label>
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-3 pr-3">
              <Button
                className={classNames(styles["p-button"], styles["discord"])}
                aria-label="Discord"
                type="submit"
              >
                <span className="flex align-items-center px-2 bg-bluegray-800 text-white">
                  <i className="pi pi-cog"></i>
                </span>
                <span className="px-3 py-2 flex align-items-center text-white">
                  Execute
                </span>
              </Button>
              {loading && (
                <div
                  className="ml-2"
                  style={{ marginLeft: "1rem !important", marginTop: "10px" }}
                >
                  <ClipLoader color={"#000"} loading={true} size={25} />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Chip
                label={
                  <span>
                    <i
                      className="pi pi-info-circle"
                      style={{ marginRight: "5px" }}
                    ></i>
                    <span>
                      Want to see job progress? Check it on{" "}
                      <a
                        href="https://jenkins.freightbro.in/view/QA/job/fb_e2e_automation/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chip-link"
                      >
                        Jenkins
                      </a>
                    </span>
                  </span>
                }
                className="custom-chip"
              />
            </div>
          </form>
        </Dialog>
      </div>

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
                style={{ width: "3rem", height: "3rem" }}
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
                style={{ width: "3rem", height: "3rem" }}
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
              filter
              filterBy="label,value" // Specify the properties to filter by
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
              <Column
                field="testName"
                header="Test Name"
                style={{ fontWeight: "800" }}
              />
              <Column
                field="suites"
                header="Suites"
                style={{ fontWeight: "800" }}
              />
              <Column
                field="tests"
                header="Test Cases"
                style={{ fontWeight: "800" }}
              />
              <Column header="Results" body={statusRow} />
            </DataTable>
          )}
        </div>
      </div>
    </div>
  );
};

export default Automation;
