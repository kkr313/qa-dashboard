import React, { useState, useEffect, useRef } from 'react';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


import { Button } from 'primereact/button';

import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { ToggleButton } from 'primereact/togglebutton';
import { Rating } from 'primereact/rating';
import { CustomerService } from '../../../demo/service/CustomerService';
import { ProductService } from '../../../demo/service/ProductService';
import {ResultService} from '../../../demo/service/ResultService';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

const TableDemo = () => {
    const [customers1, setCustomers1] = useState(null);
    const [customers2, setCustomers2] = useState([]);
    const [customers3, setCustomers3] = useState([]);
    const [filters, setFilters] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    // const [dropdownValue, setDropdownValue] = useState(null);
    const [products, setProducts] = useState([]);
    const [result, setResult] = useState([]);
    const [globalFilterValue, setglobalFilterValue] = useState('');
    const [expandedRows, setExpandedRows] = useState(null);
    const [allExpanded, setAllExpanded] = useState(false);

    const [dataResult, setDataResult] = useState([]);
    const [dropdownValue, setDropdownValue] = useState('');


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setglobalFilterValue(value);
    };

    useEffect(() => {
        setLoading2(true);

        CustomerService.getCustomersLarge().then((data) => {
            setCustomers1(getCustomers(data));
            setLoading1(false);
        });
        CustomerService.getCustomersLarge().then((data) => {
            setCustomers2(getCustomers(data));
            setLoading2(false);
        });
        CustomerService.getCustomersMedium().then((data) => setCustomers3(data));
        ProductService.getProductsWithOrdersSmall().then((data) => setProducts(data));
        
        // ResultService.getSmapleResult().then((data) => {
        //     console.log(data)
        //     setResult(data)
        // });

        // ResultService.getSmapleData().then((dataResult) => {
        //     setDataResult(dataResult);
        //     console.log(dataResult[0].testName)
        // });

        if (dataResult.length > 0) {
            setDropdownValue(dataResult[0].testName);
          }

        initfilters();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

   

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    

    const initfilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        });
        setglobalFilterValue('');
    };

   

   
   

   

    const statusOrderBodyTemplate = (rowData) => {
        return <span className={`order-badge order-${rowData.state.toLowerCase()}`}>{rowData.state}</span>;
    };


    const imageBodyTemplate = (rowData) => {
    const { passes, pending, failures, skipped } = rowData;
    const total = passes + pending + failures + skipped;
    const passPercent = Math.round((passes / total) * 100);
    const pendingPercent = Math.round((pending / total) * 100);
    const failPercent = Math.round((failures / total) * 100);
    const skipPercent = Math.round((skipped / total) * 100);

  return (
            <div className="progress-bar">
            <div
                className="progress-bar-fill progress-bar-success"
                style={{ width: `${passPercent}%` }}
                title="Passed"
            ></div>
            <div
                className="progress-bar-fill progress-bar-warning"
                style={{ width: `${pendingPercent}%` }}
                title="Pending"
            ></div>
            <div
                className="progress-bar-fill progress-bar-danger"
                style={{ width: `${failPercent}%` }}
                title="Failed"
            ></div>
            <div
                className="progress-bar-fill progress-bar-danger"
                style={{ width: `${skipPercent}%` }}
                title="Failed"
            ></div>
            <div className="progress-bar-text">
                {passes} Passed / {failures} Failed / {pending} Pending / {skipped} Skipped
            </div>
            </div>
        );
    };

  
    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Results of <b>{data.fileName.split("/").pop()}</b></h5>
                <DataTable value={data.results} responsiveLayout="scroll">
                    <Column field="title" header="Title" sortable></Column>
                    <Column field="fullTitle" header="Full Title" sortable></Column>
                    {/* <Column field="amount" header="Amount" sortable></Column> */}
                    <Column field="state" header="Status" body={statusOrderBodyTemplate} sortable></Column>
                    {/* <Column headerStyle={{ width: '4rem' }}></Column> */}
                </DataTable>
            </div>
        );
    };

    
    const toggleAll = () => {
        if (allExpanded) collapseAll();
        else expandAll();
    };

    const expandAll = () => {
        let _expandedRows = {};
        result.forEach((p) => (_expandedRows[`${p.id}`] = true));

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
               <Button icon={allExpanded ? 'pi pi-minus' : 'pi pi-plus'} label={allExpanded ? 'Collapse All' : 'Expand All'} onClick={toggleAll} className="w-11rem" />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const headerSection = renderHeader();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="flex justify-content-between"  style={{ marginBottom: '10px'}}>
                    <h5>Detailed View</h5>
                    <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dataResult} optionLabel="testName" placeholder="Select Data" style={{ width: '20%'}} />
                    </div>
                    <DataTable 
                        value={result} 
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={5}
                        dataKey="id"
                        filters={filters}
                        filterDisplay="menu"
                        loading={loading1}
                        expandedRows={expandedRows} 
                        onRowToggle={(e) => setExpandedRows(e.data)} 
                        responsiveLayout="scroll" 
                        rowExpansionTemplate={rowExpansionTemplate} 
                        header={headerSection}
                  
                    >
                        <Column expander style={{ width: '3em' }} />
                        <Column field="fileName" header="Name"/>
                        <Column field="suites" header="Suites"/>
                        <Column field="tests" header="Tests"/>
                        <Column header="Results" body={imageBodyTemplate} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default TableDemo;
