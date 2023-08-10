import React, { useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import ChartDemo from '../uikit/charts';


const QaTouch = () => {
    return (
        <div className="grid">
           <h1>Qa Touch</h1>
          <ChartDemo/>
        </div>
    );
};

export default QaTouch;
