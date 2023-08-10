
import React, { useEffect, useState } from 'react';
import { fetchCollectionData } from '../../demo/service/MongoConnect';

const KtDoc = () => {
    const [collectionData, setCollectionData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          const data = await fetchCollectionData();
          setCollectionData(data);
          console.table(data)
        };
    
        fetchData();
      }, []);
    
      return (
        <div>
          {/* Render your collection data */}
          {collectionData.map((item) => (
            <div key={item._id}>{item.name}</div>
          ))}
        </div>
      );
    };

export default KtDoc;
