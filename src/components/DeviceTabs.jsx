import React from 'react';
import './DeviceTabs.css';

const DeviceTabs = () => {
  return (
    <div className="device-tabs-container">
      <div className="device-tabs">
        <button className="device-tab active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v12H4V4zm0 14h16v2H4v-2z"></path></svg>
          Windows
        </button>
        <button className="device-tab">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"></path></svg>
          Phone
        </button>
        <button className="device-tab">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 1.99-.9 1.99-2V6c0-1.1-.89-2-1.99-2zm-2 14H5V6h14v12z"></path></svg>
          Tablet
        </button>
        <button className="device-tab">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"></path></svg>
          TV
        </button>
      </div>
    </div>
  );
};

export default DeviceTabs;
