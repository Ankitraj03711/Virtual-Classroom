import React, { useState } from "react";
import { Document, Page } from "react-pdf";

function PdfView({ pdf }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <div
          key={i}
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: "25px",
            textAlign: "center",
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <Page
            pageNumber={i}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
            Page {i} of {numPages}
          </p>
        </div>
      );
    }
    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        padding: "20px",
      }}
    >
      <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {renderPages()}
        </div>
      </Document>
    </div>
  );
}

export default PdfView;
