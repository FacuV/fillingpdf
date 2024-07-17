"use client"
import { useState, useEffect } from 'react';
import { PDFCheckBox, PDFDocument, PDFTextField } from 'pdf-lib';
import { saveAs } from 'file-saver';
import InputField from './InputField';
import PdfViewer from './PdfViewer';

const FillPdfForm = () => {
  const [formData, setFormData] = useState({});
  const [fieldIds, setFieldIds] = useState([]);
  const [updatedPdfUrl, setUpdatedPdfUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getFieldIds = async () => {
    const localFile = '/form122c2.pdf';
    const response = await fetch(localFile);
    if (!response.ok) throw new Error(`Error fetching PDF: ${response.statusText}`);

    const existingPdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    const ids = fields.map(field => field.getName());
    setFieldIds(ids);
  };

  const fillPdf = async (data) => {
    const localFile = '/form122c2.pdf';
    const response = await fetch(localFile);
    if (!response.ok) throw new Error(`Error fetching PDF: ${response.statusText}`);
  
    const existingPdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
  
    fieldIds.forEach(id => {
      const field = form.getField(id);
      
      if (field) {
        if (field instanceof PDFTextField) {
          field.setText(data[id] || '');
        } else if (field instanceof PDFCheckBox) {
          const isChecked = data[id] === 'true';
          field.check(isChecked);
        }
      }
    });
  
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setUpdatedPdfUrl(pdfUrl);
  };

  useEffect(() => {
    getFieldIds();
  }, []);

  useEffect(() => {
    if (fieldIds.length > 0) {
      fillPdf(formData);
    }
  }, [formData, fieldIds]);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full mx-10">
      <div className="w-full md:w-1/2 p-4 bg-gray-400 shadow-md rounded-lg overflow-y-auto">
        {fieldIds.map(id => (
          <InputField
            key={id}
            id={id}
            value={formData[id] || ''}
            handleChange={handleChange}
          />
        ))}
        <button
          onClick={() => saveAs(updatedPdfUrl, 'form_filled.pdf')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Descargar PDF
        </button>
      </div>
      <div className="w-full md:w-1/2 p-4 bg-gray-400 shadow-md rounded-lg">
        {updatedPdfUrl && <PdfViewer pdfUrl={updatedPdfUrl} />}
      </div>
    </div>
  );
};

export default FillPdfForm;
